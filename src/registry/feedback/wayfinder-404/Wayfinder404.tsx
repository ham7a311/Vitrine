"use client";
import { useId, useState, type KeyboardEvent, type CSSProperties } from "react";
import type { RecoveryProps } from "../recovery";
import "./wayfinder-404.css";
export function Wayfinder404({ title = "You are somewhere else.", description = "This address is off the map. Set a new direction.", home = { label: "Home", href: "/" }, destinations = [], className = "" }: RecoveryProps) {
  const uid=useId(); const places=[home,...destinations]; const [choice,setChoice]=useState(home.href);
  const index=Math.max(0,places.findIndex(p=>p.href===choice)); const selected=places[index];
  const navigate=(e:KeyboardEvent<HTMLButtonElement>,i:number)=>{
    const to=e.key==="ArrowRight"||e.key==="ArrowDown"?(i+1)%places.length:e.key==="ArrowLeft"||e.key==="ArrowUp"?(i-1+places.length)%places.length:e.key==="Home"?0:e.key==="End"?places.length-1:null;
    if(to===null)return;e.preventDefault();setChoice(places[to].href);e.currentTarget.parentElement?.querySelectorAll<HTMLButtonElement>("button")[to]?.focus();
  };
  return <section className={`wf404 ${className}`} aria-label="Page not found"><div className="wf404__intro"><p className="wf404__status">WAYFINDER / LOCATION UNKNOWN</p><h1>{title}</h1><p>{description}</p><a className="wf404__home" href={home.href}>Return to {home.label}<span aria-hidden="true">↗</span></a></div><div className="wf404__instrument"><div className="wf404__dial" aria-hidden="true"><span className="wf404__north">N</span><span className="wf404__south">S</span><span className="wf404__west">W</span><span className="wf404__east">E</span><div className="wf404__ticks"/><div className="wf404__needle" style={{"--wf404-angle":`${index*360/places.length}deg`} as CSSProperties}/><div className="wf404__centre"><b>404</b><span>NO FIX</span></div></div><div className="wf404__choices" role="radiogroup" aria-label="Choose a destination">{places.map((p,i)=><button key={`${p.href}-${i}`} type="button" role="radio" aria-checked={index===i} tabIndex={index===i?0:-1} onClick={()=>setChoice(p.href)} onKeyDown={e=>navigate(e,i)}>{p.label}</button>)}</div><a className="wf404__go" href={selected.href} aria-describedby={`${uid}-selection`}>Go to {selected.label}<span aria-hidden="true">↗</span></a><p className="wf404__selection" id={`${uid}-selection`} aria-live="polite">Direction set: {selected.label}</p></div></section>;
}
