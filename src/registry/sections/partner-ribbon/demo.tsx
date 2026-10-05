import { PartnerRibbon, type Partner } from "./PartnerRibbon";
// Original typographic marks generated inline, with no remote assets.
function mark(name:string,colour:string,kind:number){
 const shape=kind%3===0?'<path d="M8 10h10v10H8zm12 12h10v10H20z"/>':kind%3===1?'<circle cx="19" cy="20" r="11" fill="none" stroke="'+colour+'" stroke-width="3"/><path d="m12 20 7-7 7 7-7 7Z"/>':'<path d="m8 30 11-21 11 21H8Zm7-5h8l-4-8-4 8Z" fill-rule="evenodd"/>';
 const width=45+name.length*14;
 return 'data:image/svg+xml,'+encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="40" viewBox="0 0 ${width} 40"><g fill="${colour}">${shape}<text x="42" y="28" font-family="sans-serif" font-size="23" font-weight="600" letter-spacing="-1">${name}</text></g></svg>`);
}
const companies=['Fieldwork','Odd Hours','Northline','Forma','Common Ground','Morrow','Good Measure','Still'];
const items:Partner[]=companies.map((name,i)=>({id:`partner-${i}`,name,imageSrc:mark(name,['#c6dba6','#b8cde0','#debab0'][i%3],i),size:i===4?.85:1}));
export default function Demo({variant}:{variant?:string}){
 const names=variant==='names';const rows=variant==='opposing'?2:1;
 return <div style={{minHeight:"100%",display:"grid",gridTemplateColumns:"minmax(0,1fr)",alignContent:"center",padding:"48px 0",background:"#142019",color:"#dce4dc"}}><div style={{padding:"0 clamp(24px,5vw,64px)",marginBottom:40}}><p style={{font:"10px 'Geist Mono',monospace",letterSpacing:".12em",color:"#b6c6b5",margin:"0 0 16px"}}>INDEPENDENT MINDS. SHARED DIRECTION.</p><h2 style={{font:"clamp(32px,5vw,52px) 'Instrument Serif',serif",margin:0}}>Better, together.</h2></div><PartnerRibbon items={names?items.map(({imageSrc,...item})=>item):items} rows={rows} label={names?'A circle of collaborators':rows===2?'A growing community':'Companies we keep'} treatment={rows===2?'original':'muted'}/><p style={{padding:"0 24px",margin:"28px 0 0",font:"10px 'Geist Mono',monospace",color:"#b6c6b5"}}>FICTIONAL COMPANIES / ORIGINAL MARKS</p></div>;
}
