"use client";
import { Errata404 } from "./Errata404";
export default function Demo() { return <div style={{display:"contents"}} onClick={event => { if ((event.target as Element).closest("a")) event.preventDefault(); }} onAuxClick={event => { if ((event.target as Element).closest("a")) event.preventDefault(); }}><Errata404 home={{label:"Home",href:"#demo-home"}} destinations={[{label:"Collection",href:"#demo-collection"},{label:"Workshop",href:"#demo-workshop"}]}/></div>; }
