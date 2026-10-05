"use client";
import { QuietReturn404 } from "./QuietReturn404";
export default function Demo() { return <div style={{display:"contents"}} onClick={event => { if ((event.target as Element).closest("a")) event.preventDefault(); }} onAuxClick={event => { if ((event.target as Element).closest("a")) event.preventDefault(); }}><QuietReturn404 home={{label:"Home",href:"#demo-home"}} destinations={[{label:"Collection",href:"#demo-collection"},{label:"Workshop",href:"#demo-workshop"}]}/></div>; }
