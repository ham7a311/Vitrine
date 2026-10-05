import assert from "node:assert/strict";
import { createServer } from "node:http";
import { createRequire } from "node:module";
import { readFileSync, existsSync } from "node:fs";
import path from "node:path";
import ts from "typescript";
import { chromium, type Page } from "playwright";
import { sourceBundle } from "../src/lib/source-bundle.ts";
const require = createRequire(import.meta.url), project = path.resolve(import.meta.dirname, "..");
const base = process.env.VITRINE_TEST_URL ?? "http://127.0.0.1:3147";
const removed = ["feature-folio", "case-study-ledger", "article-masthead", "directory-mega-nav"];
const examples = ["missing-glyph-404", "unlit-gallery-404", "wayfinder-404", "errata-404", "quiet-return-404", "colour-register-faq", "masthead-nav", "folio-card", "index-footer", "receipt-card", "cascade-button", "footnote-faq"];
const order = readFileSync(path.join(project,"src/registry/order.txt"),"utf8").split("\n").filter(line=>line&&!line.startsWith("#"));
const runtime:Record<string,string> = {};
for (const [id,pkg,file] of [["react","react","react.production.js"],["react/jsx-runtime","react","react-jsx-runtime.production.js"],["react-dom","react-dom","react-dom.production.js"],["react-dom/client","react-dom","react-dom-client.production.js"],["scheduler","scheduler","scheduler.production.js"]]) runtime[id] = readFileSync(path.join(path.dirname(require.resolve(pkg)),"cjs",file),"utf8");
const fixtures = new Map<string,{js:string;css:string}>();
for (const slug of examples) {
 const entry = order.find(entry=>entry.split("/")[1]===slug)!;
 const {meta} = await import(path.join(project,"src/registry",entry,"meta.ts"));
 const files = await sourceBundle(meta,path.join(project,"src/registry"));
 const modules = {...runtime};let css="";
 for (const file of files) {if(file.name.endsWith(".css")){css+=file.code;continue;}modules[file.name]=ts.transpileModule(file.code,{compilerOptions:{jsx:ts.JsxEmit.ReactJSX,module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020}}).outputText;}
 const js = `const process={env:{NODE_ENV:'production'}},sources=${JSON.stringify(modules)},cache={};function require(id){if(id.endsWith('.css'))return {};if(id.startsWith('./'))id=id.slice(2);if(!(id in sources))id+='.tsx';if(cache[id])return cache[id].exports;const m={exports:{}};cache[id]=m;new Function('require','module','exports',sources[id])(require,m,m.exports);return m.exports;}const React=require('react');require('react-dom/client').createRoot(document.getElementById('root')).render(React.createElement(require('usage.tsx').default));`;
 fixtures.set(slug,{js,css});
}
const server=createServer((request,response)=>{
 const [slug,asset]=(request.url??"").slice(1).split('/');const fixture=fixtures.get(slug);
 if(!fixture){response.writeHead(404);response.end();return;}
 response.setHeader("content-type",asset==='app.js'?'text/javascript; charset=utf-8':asset==='style.css'?'text/css; charset=utf-8':'text/html; charset=utf-8');
 response.end(asset==='app.js'?fixture.js:asset==='style.css'?fixture.css:`<!doctype html><html><head><meta charset="utf-8"><link rel="stylesheet" href="/${slug}/style.css"><style>body{margin:0}#root{min-height:100vh}</style></head><body><div id="root"></div><script src="/${slug}/app.js"></script></body></html>`);
});
await new Promise<void>(resolve=>server.listen(0,"127.0.0.1",resolve));const address=server.address() as {port:number};let browser;
try {
 browser=await chromium.launch();const context=await browser.newContext({viewport:{width:1440,height:900}});const page=await context.newPage();const errors:string[]=[];page.on("pageerror",error=>errors.push(error.message));
 const testLinks=async(page:Page)=>{
  await page.waitForFunction(()=>(document.querySelector('[data-demo-boundary]')?.children.length??0)>1);
  await page.waitForFunction(()=>[...document.querySelectorAll('[data-demo-boundary] a[href]')].every(anchor=>anchor.getAttribute('href')?.startsWith('#')&&!anchor.hasAttribute('target')));
  const url=page.url(),history=await page.evaluate(()=>window.history.length),pages=page.context().pages().length;
  const links=page.locator('[data-demo-boundary] a[href]');let tested=0;
  for(let index=0;index<Math.min(await links.count(),5);index++){
   const link=links.nth(index);if(!await link.isVisible())continue;
   await link.click();await link.press('Enter');
   await link.click({modifiers:['Control']});await link.click({modifiers:['Meta']});await link.click({modifiers:['Shift']});await link.click({button:'middle'});
   await page.evaluate(()=>{document.addEventListener('contextmenu',event=>{(window as any).contextPrevented=event.defaultPrevented;},{once:true});});
   await link.click({button:'right'});assert.equal(await page.evaluate(()=>(window as any).contextPrevented),true);
   assert.equal(page.url(),url);assert.equal(await page.evaluate(()=>window.history.length),history);assert.equal(page.context().pages().length,pages);tested++;
  }
  return tested;
 };
 let checked=0;
 for(const slug of examples){await page.goto(`${base}/preview/${slug}`);checked+=await testLinks(page);await page.goto(`http://127.0.0.1:${address.port}/${slug}/`);checked+=await testLinks(page);}
 // Inspect every registered preview, including components whose links live inside child components.
 let inspected=0;
 for(const entry of process.env.VITRINE_SCAN_ALL==='0'?[]:order){await page.goto(`${base}/preview/${entry.split('/')[1]}`);await page.waitForFunction(()=>(document.querySelector('[data-demo-boundary]')?.children.length??0)>1);await page.waitForTimeout(10);assert(await page.locator('[data-demo-boundary] a[href]').evaluateAll(anchors=>anchors.every(anchor=>anchor.getAttribute('href')?.startsWith('#')&&!anchor.hasAttribute('target'))),entry);inspected++;if(inspected%100===0)console.log(`demo navigation: ${inspected}/${order.length} previews inspected`);}
 for(const slug of removed){assert(!order.some(entry=>entry.endsWith('/'+slug)));assert.equal((await page.goto(`${base}/components/${slug}`))!.status(),404);assert.equal((await page.goto(`${base}/preview/${slug}`))!.status(),404);}
 const sitemap=await (await fetch(`${base}/sitemap.xml`)).text();for(const slug of removed)assert(!sitemap.includes(slug));
 // Preview iframe actions must not change either the outer component page or the frame's URL.
 await page.goto(`${base}/components/wayfinder-404`);const outer=page.url();await page.locator('iframe[title]').scrollIntoViewIfNeeded();const frame=page.frameLocator('iframe[title]');await frame.locator('[data-demo-boundary]').waitFor();await frame.getByRole('radio',{name:'Workshop',exact:true}).click();await frame.getByRole('link',{name:/Go to Workshop/}).click();assert.equal(page.url(),outer);assert.match(page.frames().find(frame=>frame.url().includes('/preview/wayfinder-404'))!.url(),/\/preview\/wayfinder-404(?:\?|$)/);
 await page.getByRole('navigation',{name:'Breadcrumb'}).getByRole('link',{name:'Components',exact:true}).click();await page.waitForURL('**/components');
 const touchContext=await browser.newContext({viewport:{width:390,height:844},hasTouch:true,isMobile:true});const touch=await touchContext.newPage();touch.on('pageerror',error=>errors.push(error.message));
 await touch.goto(`${base}/preview/wayfinder-404`);await touch.getByRole('radio',{name:'Collection',exact:true}).tap();const touchUrl=touch.url();await touch.getByRole('link',{name:/Go to Collection/}).tap();assert.equal(touch.url(),touchUrl);await touchContext.close();
 assert.deepEqual(errors,[]);console.log(`demo navigation: ${checked} live/copied links exercised by mouse, keyboard and modifiers; ${inspected} previews inspected; four removed slugs return 404; sitemap, parent iframe, gallery navigation and touch passed`);
} finally {await browser?.close();await new Promise<void>(resolve=>server.close(()=>resolve()));}
