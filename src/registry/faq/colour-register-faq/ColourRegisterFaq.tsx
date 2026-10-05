"use client";
import { useId, useState, type KeyboardEvent, type ReactNode } from "react";
import "./colour-register-faq.css";
export type RegisterTone = "mint" | "lilac" | "blue" | "peach" | "butter";
export type RegisterQuestion = { id: string; question: string; answer: ReactNode; tone?: RegisterTone };
const tones: RegisterTone[]=["mint","lilac","blue","peach","butter"];
export function ColourRegisterFaq({ items, initiallyOpenId, className="" }: { items: RegisterQuestion[]; initiallyOpenId?: string; className?: string }) {
 const uid=useId();const [open,setOpen]=useState<string|null>(initiallyOpenId??null);
 const focus=(e:KeyboardEvent<HTMLButtonElement>,i:number)=>{const to=e.key==="ArrowDown"?(i+1)%items.length:e.key==="ArrowUp"?(i-1+items.length)%items.length:e.key==="Home"?0:e.key==="End"?items.length-1:null;if(to===null)return;e.preventDefault();e.currentTarget.closest("ol")?.querySelectorAll<HTMLButtonElement>(".crfaq__question")[to]?.focus();};
 return <ol className={`crfaq ${className}`}>{items.map((it,i)=>{const expanded=it.id===open;return <li className={`crfaq__item crfaq--${it.tone??tones[i%tones.length]}`} key={it.id} data-open={expanded||undefined}><h3><button className="crfaq__question" type="button" id={`${uid}-q${i}`} aria-controls={`${uid}-a${i}`} aria-expanded={expanded} onClick={()=>setOpen(expanded?null:it.id)} onKeyDown={e=>focus(e,i)}><span className="crfaq__register" aria-hidden="true"/><span className="crfaq__number" aria-hidden="true">{String(i+1).padStart(2,"0")}</span><span>{it.question}</span><span className="crfaq__icon" aria-hidden="true"/></button></h3><div className="crfaq__answer" id={`${uid}-a${i}`} role="region" aria-labelledby={`${uid}-q${i}`} aria-hidden={!expanded} inert={!expanded}><div className="crfaq__clip"><div className="crfaq__body">{it.answer}</div></div></div></li>;})}</ol>;
}
