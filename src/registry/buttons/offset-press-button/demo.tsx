"use client";
import { useState } from "react";
import { OffsetPressButton } from "./OffsetPressButton";
export default function Demo({ variant }: { variant?: string }) {
 const [saved,setSaved]=useState(false);const accent=variant==="lilac"?"lilac":variant==="butter"?"butter":"mint";
 return <div style={{minHeight:"100%",display:"grid",placeContent:"center",gap:28,padding:32,background:"#f1f0e9",color:"#3b4438",textAlign:"center"}}><p style={{font:"10px 'Geist Mono',monospace",letterSpacing:".13em",margin:0}}>A LITTLE WEIGHT. A CLEAR ACTION.</p><OffsetPressButton style={{justifySelf:"center"}} accent={accent} aria-pressed={saved} onClick={()=>setSaved(v=>!v)}>{saved?"Saved to your collection":"Keep this one"}<span aria-hidden="true">{saved?"✓":"↗"}</span></OffsetPressButton><p role="status" style={{font:"12px 'Geist',sans-serif",margin:0}}>{saved?"Kept locally in this demo.":"Press to keep. Press again to release."}</p></div>;
}
