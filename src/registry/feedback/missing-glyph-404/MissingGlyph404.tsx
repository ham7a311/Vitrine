"use client";
import type { CSSProperties, PointerEvent } from "react";
import type { RecoveryProps } from "../recovery";
import "./missing-glyph-404.css";
export function MissingGlyph404({ title = "Something is missing.", description = "The address is here. The page isn't. Choose a familiar place and begin again.", home = { label: "Back to the beginning", href: "/" }, destinations = [], className = "" }: RecoveryProps) {
  const light = (e: PointerEvent<HTMLElement>) => {
    if (e.pointerType !== "mouse" || !window.matchMedia("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)").matches) return;
    const box = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mg404-light", `${(e.clientX - box.left) / box.width * 100}%`);
  };
  return <section className={`mg404 ${className}`} onPointerMove={light} onPointerLeave={e => e.currentTarget.style.removeProperty("--mg404-light")} style={{ "--mg404-light": "50%" } as CSSProperties} aria-label="Page not found">
    <header className="mg404__header"><span>V / LOST & FOUND</span><span>ERROR — 404</span></header>
    <div className="mg404__numeral" aria-hidden="true"><span>4</span><span className="mg404__aperture"><i /><b>ABSENT</b></span><span>4</span><div className="mg404__registration" /></div>
    <div className="mg404__footer"><div><p className="mg404__eyebrow">ONE PAGE SHORT</p><h1>{title}</h1><p className="mg404__description">{description}</p></div><nav aria-label="Recovery"><a className="mg404__home" href={home.href}>{home.label}<span aria-hidden="true">↗</span></a>{destinations.map((d,i) => <a key={`${d.href}-${i}`} href={d.href}>{d.label}<span aria-hidden="true">↗</span></a>)}</nav></div>
  </section>;
}
