"use client";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import "./partner-ribbon.css";
export type Partner = { id: string; name: string; imageSrc?: string; size?: number };
export type PartnerRibbonProps = {
  items: Partner[];
  label?: string;
  direction?: "left" | "right";
  /** Pixels per second; omit for 28 desktop / 20 mobile. Zero holds still. */
  speed?: number;
  rows?: 1 | 2;
  treatment?: "muted" | "original";
  className?: string;
};
function PartnerMark({ item }: { item: Partner }) {
  const [failed,setFailed]=useState(false);
  useEffect(()=>setFailed(false),[item.imageSrc]);
  const scale=Number.isFinite(item.size)?Math.max(.5,Math.min(2,item.size!)):1;
  return <span className="pribbon__mark" style={{"--pribbon-size":scale} as CSSProperties}>{item.imageSrc&&!failed?<img src={item.imageSrc} alt={item.name} onError={()=>setFailed(true)} draggable={false}/>:<span>{item.name}</span>}</span>;
}
/** A measured group is the exact repeat period, including its trailing gap. */
function RibbonTrack({ items, direction, speed, paused, staticMode }: { items:Partner[]; direction:"left"|"right"; speed?:number; paused:boolean; staticMode:boolean }) {
  const viewport=useRef<HTMLSpanElement>(null), track=useRef<HTMLSpanElement>(null), group=useRef<HTMLSpanElement>(null);
  const distance=useRef(0), offset=useRef(0), hover=useRef(false), visible=useRef(false);
  const [copies,setCopies]=useState(2);
  const speedValue=Number.isFinite(speed)?Math.max(0,speed!):undefined;
  useEffect(()=>{
    if(staticMode)return;
    const box=viewport.current,first=group.current;if(!box||!first)return;
    const measure=()=>{
      const next=first.getBoundingClientRect().width;
      if(next<=0)return;
      if(distance.current>0)offset.current=offset.current/distance.current*next;
      distance.current=next;
      if(track.current)track.current.style.transform=`translate3d(${direction==="left"?-offset.current:offset.current-next}px,0,0)`;
      setCopies(Math.max(2,Math.ceil(box.getBoundingClientRect().width/next)+2));
    };
    measure();const ro=new ResizeObserver(measure);ro.observe(box);ro.observe(first);
    const fonts=document.fonts;fonts?.addEventListener("loadingdone",measure);
    let active=true;fonts?.ready.then(()=>{if(active)measure();});
    first.addEventListener("load",measure,true);first.addEventListener("error",measure,true);
    return()=>{active=false;ro.disconnect();fonts?.removeEventListener("loadingdone",measure);first.removeEventListener("load",measure,true);first.removeEventListener("error",measure,true);};
  },[items,staticMode,direction]);
  useEffect(()=>{
    if(staticMode||paused)return;
    const box=viewport.current;if(!box)return;
    hover.current=box.matches(":hover");
    let frame=0,last=0,disposed=false;
    const apply=()=>{if(track.current){const d=distance.current;const x=direction==="left"?-offset.current:offset.current-d;track.current.style.transform=`translate3d(${x}px,0,0)`;}};
    const stop=()=>{cancelAnimationFrame(frame);frame=0;last=0;};
    const tick=(now:number)=>{
      frame=0;if(disposed||document.hidden||!visible.current||hover.current)return;
      if(last&&distance.current>0){const elapsed=Math.min((now-last)/1000,.064);const px=speedValue??(box.clientWidth<640?20:28);offset.current=(offset.current+elapsed*px)%distance.current;}
      last=now;apply();frame=requestAnimationFrame(tick);
    };
    const start=()=>{if(!disposed&&!document.hidden&&visible.current&&!hover.current&&speedValue!==0&&!frame)frame=requestAnimationFrame(tick);};
    const visibility=()=>{stop();start();};
    const enter=()=>{hover.current=true;stop();};const leave=()=>{hover.current=false;start();};
    const io=new IntersectionObserver(([entry])=>{visible.current=entry.isIntersecting;stop();start();});io.observe(box);
    document.addEventListener("visibilitychange",visibility);box.addEventListener("pointerenter",enter);box.addEventListener("pointerleave",leave);apply();
    return()=>{disposed=true;stop();io.disconnect();document.removeEventListener("visibilitychange",visibility);box.removeEventListener("pointerenter",enter);box.removeEventListener("pointerleave",leave);hover.current=false;};
  },[direction,paused,speedValue,staticMode,items]);
  if(staticMode)return <span className="pribbon__static">{items.map(item=><PartnerMark key={item.id} item={item}/>)}</span>;
  return <span className="pribbon__viewport" ref={viewport} aria-hidden="true"><span className="pribbon__track" ref={track}>{Array.from({length:copies},(_,i)=><span className="pribbon__group" key={i} ref={i===0?group:undefined}>{items.map(item=><PartnerMark key={item.id} item={item}/>)}</span>)}</span></span>;
}
export function PartnerRibbon({ items,label="In good company",direction="left",speed,rows=1,treatment="muted",className="" }:PartnerRibbonProps) {
  const [paused,setPaused]=useState(false),[reduced,setReduced]=useState(true);
  useEffect(()=>{const query=window.matchMedia("(prefers-reduced-motion: reduce)");const update=()=>setReduced(query.matches);update();query.addEventListener("change",update);return()=>query.removeEventListener("change",update);},[]);
  if(!items.length)return null;
  // Separate, stable sets prevent repeated identities in the two-row treatment.
  const sets=rows===2&&items.length>1?[items.filter((_,i)=>i%2===0),items.filter((_,i)=>i%2===1)]:[items];
  const staticMode=reduced||sets.every(set=>set.length<=1);
  return <section className={`pribbon pribbon--${treatment} ${className}`} aria-label={label} data-paused={paused||staticMode} data-static={staticMode}>
    <header className="pribbon__header"><h2>{label}</h2></header>
    {staticMode ? <span className="pribbon__rows">{sets.map((set,i)=><RibbonTrack key={i} items={set} direction={direction} speed={speed} paused staticMode/>)}</span> : <button type="button" className="pribbon__surface" aria-label={paused?"Resume partner animation":"Pause partner animation"} onClick={()=>setPaused(value=>!value)}><span className="pribbon__rows">{sets.map((set,i)=><RibbonTrack key={i} items={set} direction={i%2===0?direction:direction==="left"?"right":"left"} speed={speed} paused={paused} staticMode={set.length===1}/>)}</span></button>}
    {!staticMode&&<ul className="pribbon__sr" aria-label="Partners">{items.map(item=><li key={item.id}>{item.name}</li>)}</ul>}

  </section>;
}
