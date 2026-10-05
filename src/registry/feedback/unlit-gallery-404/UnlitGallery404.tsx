"use client";
import type { PointerEvent } from "react";
import type { RecoveryProps } from "../recovery";
import "./unlit-gallery-404.css";
export function UnlitGallery404({ title = "An empty room.", description = "There was something here once. The collection continues just beyond this door.", home = { label: "Enter the collection", href: "/" }, destinations = [], className = "" }: RecoveryProps) {
  const point = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse" || !window.matchMedia("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)").matches) return;
    const b=e.currentTarget.getBoundingClientRect(); e.currentTarget.style.setProperty("--ug404-x", `${20 + (e.clientX-b.left)/b.width*60}%`);
  };
  return <section className={`ug404 ${className}`} aria-label="Page not found"><div className="ug404__room" aria-hidden="true" onPointerMove={point} onPointerLeave={e=>e.currentTarget.style.removeProperty("--ug404-x")}>
    <div className="ug404__light"/><svg className="ug404__architecture" viewBox="0 0 800 700" fill="none"><path d="M0 90 400 20 800 90M400 20v425M0 560l400-115 400 115M0 560v140m800-140v140"/><path d="M294 418 400 386l106 32v132l-106 34-106-34V418Z"/><path d="m294 418 106 33 106-33M400 451v133"/><path className="ug404__outline" d="m348 267 52-16 52 16v85l-52 17-52-17v-85Z" strokeDasharray="3 8"/><path d="m348 267 52 17 52-17M400 284v85" strokeDasharray="3 8"/></svg><span className="ug404__label">EXHIBIT 404<br/>OBJECT NOT LOCATED</span><span className="ug404__room-number">ROOM / 00</span>
    </div><div className="ug404__copy"><p className="ug404__status">THE UNLIT GALLERY / 404</p><h1>{title}</h1><p className="ug404__description">{description}</p><a className="ug404__home" href={home.href}>{home.label}<span aria-hidden="true">↗</span></a><nav aria-label="Other destinations">{destinations.map((d,i)=><a key={`${d.href}-${i}`} href={d.href}>{d.label}</a>)}</nav><p className="ug404__foot">NOT ALL ABSENCE IS AN ENDING.</p></div></section>;
}
