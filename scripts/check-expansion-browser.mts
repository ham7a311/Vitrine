import assert from "node:assert/strict";
import { createServer } from "node:http";
import { createRequire } from "node:module";
import { readFileSync, mkdirSync } from "node:fs";
import path from "node:path";
import ts from "typescript";
import { chromium } from "playwright";
const require=createRequire(import.meta.url);
const project=path.resolve(import.meta.dirname,"..");
const base=process.env.VITRINE_TEST_URL??"http://127.0.0.1:3147";
const output=process.env.VITRINE_SCREENSHOT_DIR??path.join(project,".next-release","expansion-screenshots");
mkdirSync(output,{recursive:true});
const examples=[
 ["feedback/missing-glyph-404","MissingGlyph404"], ["feedback/unlit-gallery-404","UnlitGallery404"],
 ["feedback/wayfinder-404","Wayfinder404"], ["feedback/errata-404","Errata404"],
 ["feedback/quiet-return-404","QuietReturn404"], ["buttons/offset-press-button","OffsetPressButton"],
 ["faq/colour-register-faq","ColourRegisterFaq"], ["sections/partner-ribbon","PartnerRibbon"],
];
// A temporary in-memory harness exercises arbitrary consumer props without adding a production route.
const modules:Record<string,string>={};
for(const [id,packageName,file] of [
 ["react","react","react.production.js"],["react/jsx-runtime","react","react-jsx-runtime.production.js"],
 ["react-dom","react-dom","react-dom.production.js"],["react-dom/client","react-dom","react-dom-client.production.js"],
 ["scheduler","scheduler","scheduler.production.js"],
]) modules[id]=readFileSync(path.join(path.dirname(require.resolve(packageName)),"cjs",file),"utf8");
let css="";
for(const [directory,name] of examples){
 const source=readFileSync(path.join(project,"src/registry",directory,`${name}.tsx`),"utf8");
 modules[name]=ts.transpileModule(source,{compilerOptions:{jsx:ts.JsxEmit.ReactJSX,module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020}}).outputText;
 const slug=directory.split("/")[1];css+=readFileSync(path.join(project,"src/registry",directory,`${slug}.css`),"utf8");
}
const bundle=`const process={env:{NODE_ENV:'production'}};const sources=${JSON.stringify(modules)};const cache={};function require(id){if(id.endsWith('.css'))return {};if(cache[id])return cache[id].exports;const module={exports:{}};cache[id]=module;new Function('require','module','exports',sources[id])(require,module,module.exports);return module.exports;}const React=require('react');const root=require('react-dom/client').createRoot(document.getElementById('root'));window.fixture=(name,props={},count=1)=>{const C=require(name)[name];root.render(React.createElement(React.Fragment,null,...Array.from({length:count},(_,i)=>React.createElement('div',{key:name+i,style:{minHeight:name.includes('404')?'100vh':'auto'}},React.createElement(C,props)))));};window.fixtureNode=(name,props)=>{const C=require(name)[name];root.render(React.createElement(C,{...props,items:props.items.map(item=>({...item,answer:React.createElement('a',{href:'/more'},item.answer)}))}));};`;
const server=createServer((req,res)=>{
 if(req.url==="/app.js"){res.setHeader("Content-Type","text/javascript");res.end(bundle);return;}
 if(req.url==="/styles.css"){res.setHeader("Content-Type","text/css");res.end(css);return;}
 if(req.url==="/late.svg"){setTimeout(()=>{res.setHeader("Content-Type","image/svg+xml");res.end('<svg xmlns="http://www.w3.org/2000/svg" width="260" height="40"><rect width="260" height="40" fill="#bed7b9"/></svg>');},300);return;}
 if(req.url==="/broken.svg"){res.statusCode=404;res.end();return;}
 res.setHeader("Content-Type","text/html");res.end('<!doctype html><html><head><style>body{margin:0;background:#f3f1e9}#root{min-height:100vh}</style><link rel="stylesheet" href="/styles.css"></head><body><div id="root"></div><script src="/app.js"></script></body></html>');
});
await new Promise<void>(resolve=>server.listen(0,"127.0.0.1",resolve));
const address=server.address();assert(address&&typeof address!=="string");
const fixtureUrl=`http://127.0.0.1:${address.port}`;
let browser;
try{
 browser=await chromium.launch();
 const page=await browser.newPage({viewport:{width:1440,height:900}});
 const errors:string[]=[];page.on("pageerror",e=>errors.push(e.message));
 const mount=async(name:string,props:object={},count=1)=>{
  await page.goto(fixtureUrl);
  await page.evaluate(({name,props,count})=>(window as any).fixture(name,props,count),{name,props,count});
  await page.waitForFunction(()=>document.getElementById("root")!.children.length>0);
 };
 // Production previews, including mobile, reduced motion, long content and keyboard accessibility.
 for(const width of [320,390,768,1440]){
  await page.setViewportSize({width,height:900});
  for(const [directory] of examples){
   const slug=directory.split("/")[1];await page.goto(`${base}/preview/${slug}`);
   await page.waitForFunction(()=>(document.querySelector("[data-demo-boundary]")?.children.length??0)>1);
   await page.evaluate(()=>document.fonts.ready);
   assert(await page.evaluate(()=>[...document.querySelectorAll('section,button,ol')].every(el=>el.getBoundingClientRect().right<=innerWidth+1)),`${slug} exceeds viewport ${width}`);
   await page.screenshot({path:path.join(output,`${slug}-${width}.png`),fullPage:true});
  }
 }
 await page.setViewportSize({width:320,height:900});
 for(const [,name] of examples.slice(0,5)){
  await mount(name,{title:'A longer missing-page heading that needs several lines',description:'A detailed explanation of why this address may have changed and what you can do next. '.repeat(5),home:{label:'Return to the beginning of the collection',href:'#home'},destinations:[{label:'Explore the complete component collection',href:'#collection'}]});
  assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),`${name} long content overflows`);
 }
 await page.setViewportSize({width:390,height:844});
 await page.goto(`${base}/preview/wayfinder-404`);
 await page.getByRole('radio',{name:'Home',exact:true}).press('ArrowRight');
 assert.equal(await page.locator('.wf404__go').getAttribute('href'),'#demo-collection');
 const previewUrl=page.url();await page.locator('.wf404__go').press('Enter');assert.equal(page.url(),previewUrl);
 await page.goto(`${base}/preview/colour-register-faq`);
 const closed=page.locator('.crfaq__answer[aria-hidden=true]').first();assert.equal(await closed.locator('a').count(),0);
 await page.locator('.crfaq__question').first().press('End');assert(await page.locator('.crfaq__question').last().evaluate(el=>el===document.activeElement));
 await page.locator('.crfaq__question').last().press('Space');assert.equal(await page.locator('.crfaq__question').last().getAttribute('aria-expanded'),'true');
 // Prompt selection/copy and URL history for the new configurable arrangement.
 await page.goto(`${base}/components/partner-ribbon?variant=names`);
 await page.waitForFunction(()=>document.querySelector('[data-prompt]')?.textContent?.includes('Names only (names)'));
 // Variant controls intentionally replace the current URL; seed a prior shared-link entry.
 await page.evaluate(()=>history.pushState(history.state,'',location.href));
 await page.getByRole('radio',{name:'Names only',exact:true}).press('ArrowRight');
 await page.waitForFunction(()=>document.querySelector('[data-prompt]')?.textContent?.includes('Opposing rows (opposing)'));
 await page.goBack();await page.waitForFunction(()=>document.querySelector('[data-prompt]')?.textContent?.includes('Names only (names)'));
 await page.context().grantPermissions(['clipboard-read','clipboard-write']);
 await page.getByRole('button',{name:'Copy prompt',exact:true}).click();
 assert.match(await page.evaluate(()=>navigator.clipboard.readText()),/Selected variant — Names only \(names\)/);
 await page.setViewportSize({width:1440,height:900});
 await mount('PartnerRibbon',{items:[]});assert.equal(await page.locator('.pribbon').count(),0);
 const mixed=[{id:'a',name:'Alpha',imageSrc:fixtureUrl+'/late.svg',href:'/alpha'},{id:'b',name:'A much wider company name',href:'/beta'},{id:'c',name:'Broken image fallback',imageSrc:fixtureUrl+'/broken.svg'}];
 await mount('PartnerRibbon',{items:mixed.slice(0,2),rows:2});assert.equal(await page.locator('.pribbon__viewport').count(),0);assert.equal(await page.getByRole('button',{name:'Pause partner animation',exact:true}).count(),0);
 await mount('PartnerRibbon',{items:[mixed[2]]});await page.getByText('Broken image fallback',{exact:true}).waitFor();assert.equal(await page.locator('.pribbon__viewport').count(),0);
 await mount('PartnerRibbon',{items:mixed});await page.locator('.pribbon__group img').first().waitFor();
 await page.waitForFunction(()=>document.querySelector<HTMLImageElement>('.pribbon__group img')?.complete);
 assert(await page.locator('.pribbon__group').count()>=2);
 assert(await page.locator('.pribbon__group').first().getByText('Broken image fallback',{exact:true}).count()===1);
 const position=()=>page.locator('.pribbon__track').first().evaluate(el=>new DOMMatrix(getComputedStyle(el).transform).m41);
 await page.mouse.move(0,0);const first=await position();await page.waitForTimeout(160);assert.notEqual(await position(),first);
 await page.locator('.pribbon__viewport').hover();const hoverHeld=await position();await page.waitForTimeout(120);assert.equal(await position(),hoverHeld);await page.mouse.move(0,0);await page.waitForTimeout(80);assert.notEqual(await position(),hoverHeld);
 await page.getByRole('button',{name:'Pause partner animation',exact:true}).click();const held=await position();await page.waitForTimeout(120);assert.equal(await position(),held);
 await page.getByRole('button',{name:'Resume partner animation',exact:true}).click();
 await page.mouse.move(0,0);
 // Visibility lifecycle: no continued motion while offscreen or hidden.
 await page.locator('.pribbon').evaluate(el=>{(el as HTMLElement).style.marginTop='2000px';});
 await page.waitForTimeout(100);const offscreen=await position();await page.waitForTimeout(150);assert.equal(await position(),offscreen);
 await page.locator('.pribbon').evaluate(el=>{(el as HTMLElement).style.marginTop='';});
 await page.waitForTimeout(100);
 await page.evaluate(()=>{Object.defineProperty(document,'hidden',{configurable:true,value:true});document.dispatchEvent(new Event('visibilitychange'));});
 const hidden=await position();await page.waitForTimeout(150);assert.equal(await position(),hidden);
 await page.evaluate(()=>{delete (document as any).hidden;document.dispatchEvent(new Event('visibilitychange'));});
 await page.waitForTimeout(100);assert.notEqual(await position(),hidden);
 // Colour presets must keep readable text against their actual expanded surfaces.
 await mount('ColourRegisterFaq',{items:['mint','lilac','blue','peach','butter'].map(tone=>({id:tone,tone,question:tone,answer:'Readable answer'}))});
 for(const tone of ['mint','lilac','blue','peach','butter']){
  await page.getByRole('button',{name:tone,exact:true}).click();
  await page.waitForTimeout(350); // Read the completed surface, not an interpolating transparent colour.
  const contrast=await page.locator(`.crfaq--${tone}`).evaluate(el=>{
   const rgb=(value:string)=>value.match(/[\d.]+/g)!.slice(0,3).map(Number).map(v=>{v/=255;return v<=.04045?v/12.92:((v+.055)/1.055)**2.4;});
   const luminance=(value:string)=>{const [r,g,b]=rgb(value);return .2126*r+.7152*g+.0722*b;};
   const bg=luminance(getComputedStyle(el).backgroundColor),fg=luminance(getComputedStyle(el.querySelector('.crfaq__body')!).color);
   return (Math.max(bg,fg)+.05)/(Math.min(bg,fg)+.05);
  });assert(contrast>=4.5,`${tone} answer contrast ${contrast}`);
 }
 await mount('PartnerRibbon',{items:mixed});await page.mouse.move(0,0);
 // Deterministic virtual time: verify exact-pixel wrap continuity in both directions over multiple periods.
 await page.clock.install();
 for(const direction of ['left','right']){await mount('PartnerRibbon',{items:mixed,direction,speed:500});
  await page.clock.runFor(500);
  const period=await page.locator('.pribbon__group').first().evaluate(el=>el.getBoundingClientRect().width);
  const samples:number[]=[];for(let i=0;i<Math.ceil(period*3/25)+2;i++){await page.clock.runFor(50);samples.push(await position());}
  let wraps=0;
  for(let i=1;i<samples.length;i++){let movement=samples[i]-samples[i-1];if(Math.abs(movement)>period/2){wraps++;movement+=direction==='left'?-period:period;}assert(Math.abs(movement)<=35,`loop jump ${direction}: ${movement}`);assert(direction==='left'?movement<=.1:movement>=-.1);}
  assert(wraps>=2,`Not enough wraps for ${direction}`);
  await page.setViewportSize({width:320,height:900});await page.clock.runFor(100);
  assert(await page.locator('.pribbon__group').count()>=2);
  await page.setViewportSize({width:1440,height:900});
 }
 await page.clock.resume();
 await page.emulateMedia({reducedMotion:'reduce'});
 await mount('PartnerRibbon',{items:mixed,rows:2},2);
 assert.equal(await page.locator('.pribbon__viewport').count(),0);
 assert.equal(await page.locator('.pribbon__static .pribbon__mark').count(),6);
 assert.equal(await page.locator('.pribbon__surface').count(),0);
 await mount('ColourRegisterFaq',{items:[{id:'long',question:'A very long question that wraps naturally on a small screen',answer:'A long answer. '.repeat(100)}],initiallyOpenId:'long'},2);
 assert.equal(await page.locator('.crfaq__question[aria-expanded=true]').count(),2);
 assert.equal(new Set(await page.locator('.crfaq__question').evaluateAll(els=>els.map(el=>el.id))).size,2);
 await page.evaluate(()=>{(window as any).fixtureNode('ColourRegisterFaq',{items:[{id:'link',question:'Linked answer?',answer:'Read more'}]});});
 await page.locator('.crfaq__question').click();await page.getByRole('link',{name:'Read more',exact:true}).focus();assert(await page.getByRole('link',{name:'Read more',exact:true}).evaluate(el=>el===document.activeElement));
 await page.locator('.crfaq__question').click();assert.equal(await page.getByRole('link',{name:'Read more',exact:true}).count(),0);
 let activated=0;await page.exposeFunction('activated',()=>activated++);
 await mount('OffsetPressButton',{children:'Activate'});assert(await page.locator('.opb').evaluate(el=>Math.abs(el.getBoundingClientRect().width-el.querySelector('.opb__face')!.getBoundingClientRect().width)<1));await page.evaluate(()=>{const button=document.querySelector('button')!;button.addEventListener('click',()=> (window as any).activated());});
 await page.getByRole('button',{name:'Activate'}).press('Enter');await page.getByRole('button',{name:'Activate'}).press('Space');assert.equal(activated,2);
 const touchContext=await browser.newContext({viewport:{width:390,height:844},hasTouch:true,isMobile:true});
 const touch=await touchContext.newPage();touch.on('pageerror',e=>errors.push(e.message));
 await touch.goto(`${base}/preview/offset-press-button`);await touch.getByRole('button',{name:/Keep this one/}).tap();assert.equal(await touch.locator('.opb').getAttribute('aria-pressed'),'true');
 await touch.goto(`${base}/preview/colour-register-faq`);await touch.locator('.crfaq__question').first().tap();assert.equal(await touch.locator('.crfaq__question').first().getAttribute('aria-expanded'),'true');
 await touch.goto(`${base}/preview/wayfinder-404`);await touch.getByRole('radio',{name:'Workshop',exact:true}).tap();assert.equal(await touch.locator('.wf404__go').getAttribute('href'),'#demo-workshop');
 await touchContext.close();
 assert.deepEqual(errors,[]);
 console.log(`expansion browser: eight responsive previews, prompt/copy/history, keyboard and link behavior, partner lifecycle/fallbacks, bidirectional loop wraps, resize, reduced motion and independent instances passed; screenshots: ${output}`);
}finally{await browser?.close();await new Promise<void>(resolve=>server.close(()=>resolve()));}
