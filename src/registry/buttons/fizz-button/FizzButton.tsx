"use client";
import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { bubble } from "./fizz";
import "./fizz-button.css";

export type FizzButtonProps = {
  children: ReactNode;
  /** The drink: top and bottom of the liquid, the bubbles and the label. */
  drink?: { top: string; bottom: string; bubble: string; label: string };
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  type?: "button" | "submit";
  className?: string;
};

/**
 * Fizz Button
 * A glass of soda for a button. Point at it and it starts to fizz — bubbles rise from the bottom,
 * thickest under the pointer, and now and then one escapes over the rim and pops. A press sends up
 * a burst and the label bobs.
 */
export function FizzButton({ children, drink = { top: "#5a2a18", bottom: "#24100a", bubble: "rgba(255, 228, 196, 0.75)", label: "#fff3e3" }, onClick, type = "button", className = "" }: FizzButtonProps) {
  const btn = useRef<HTMLButtonElement>(null);
  const glass = useRef<HTMLSpanElement>(null);
  const air = useRef<HTMLSpanElement>(null);
  const label = useRef<HTMLSpanElement>(null);
  const px = useRef<number | null>(null);
  const timer = useRef(0);
  const calm = useRef(false);
  useEffect(() => { calm.current = matchMedia("(prefers-reduced-motion: reduce)").matches; return () => clearInterval(timer.current); }, []);

  const rise = () => {
    const b = btn.current, g = glass.current; if (!b || !g) return;
    const w = b.offsetWidth, h = b.offsetHeight, o = bubble(w, h, px.current, Math.random);
    const el = document.createElement("i");
    el.className = "fizz__bubble";
    Object.assign(el.style, { left: `${o.x}px`, width: `${o.r * 2}px`, height: `${o.r * 2}px` });
    g.appendChild(el);
    const a = el.animate([
      { transform: "translate(-50%, 0) scale(0.4)", opacity: 0 },
      { transform: `translate(calc(-50% + ${o.sway * 0.5}px), ${-h * 0.3}px) scale(0.85)`, opacity: 1, offset: 0.25 },
      { transform: `translate(calc(-50% - ${o.sway * 0.4}px), ${-h * 0.65}px) scale(1)`, opacity: 1, offset: 0.62 },
      { transform: `translate(calc(-50% + ${o.sway}px), ${-h - o.r * 2}px) scale(1.08)`, opacity: o.escape ? 1 : 0.2 },
    ], { duration: o.ms, easing: "cubic-bezier(0.4, 0, 0.8, 0.6)" });
    a.onfinish = () => {
      el.remove();
      if (!o.escape || !air.current) return;
      // over the rim: a last little hop, then it pops
      const out = document.createElement("i");
      out.className = "fizz__bubble fizz__bubble--out";
      Object.assign(out.style, { left: `${o.x + o.sway}px`, width: `${o.r * 2}px`, height: `${o.r * 2}px` });
      air.current.appendChild(out);
      const hop = 10 + Math.random() * 14;
      out.animate([{ transform: "translate(-50%, 0)" }, { transform: `translate(-50%, ${-hop}px)` }], { duration: 260 + hop * 12, easing: "cubic-bezier(0.2, 0.6, 0.4, 1)", fill: "forwards" }).onfinish = () => {
        out.animate([{ transform: `translate(-50%, ${-hop}px) scale(1)`, opacity: 1, borderWidth: "1px" }, { transform: `translate(-50%, ${-hop}px) scale(2.2)`, opacity: 0, borderWidth: "0.5px" }], { duration: 220, easing: "ease-out" }).onfinish = () => out.remove();
      };
    };
  };

  const start = () => { if (calm.current) return; clearInterval(timer.current); timer.current = window.setInterval(rise, 38); for (let i = 0; i < 8; i++) rise(); };
  const stop = () => { clearInterval(timer.current); px.current = null; };

  const burst = () => {
    if (calm.current) return;
    const keep = px.current; px.current = null;
    for (let i = 0; i < 26; i++) window.setTimeout(rise, i * 14);
    px.current = keep;
    label.current?.animate([{ transform: "translateY(0)" }, { transform: "translateY(-3px)" }, { transform: "translateY(1px)" }, { transform: "translateY(0)" }], { duration: 520, easing: "cubic-bezier(0.3, 0.7, 0.3, 1)" });
  };

  return (
    <span className={`fizz ${className}`} style={{ ["--fz-top" as string]: drink.top, ["--fz-bottom" as string]: drink.bottom, ["--fz-bubble" as string]: drink.bubble, ["--fz-label" as string]: drink.label } as CSSProperties}>
      <span ref={air} className="fizz__air" aria-hidden="true" />
      <button ref={btn} type={type} className="fizz__btn" onClick={onClick}
        onPointerEnter={(e) => { if (e.pointerType === "mouse") { px.current = e.clientX - e.currentTarget.getBoundingClientRect().left; start(); } }}
        onPointerMove={(e) => { if (e.pointerType === "mouse") px.current = e.clientX - e.currentTarget.getBoundingClientRect().left; }}
        onPointerLeave={stop}
        onPointerDown={(e) => { burst(); if (e.pointerType !== "mouse") { start(); window.setTimeout(stop, 1800); } }}
        onFocus={(e) => { if (e.currentTarget.matches(":focus-visible")) start(); }}
        onBlur={stop}>
        <span ref={glass} className="fizz__glass" aria-hidden="true" />
        <span ref={label} className="fizz__label">{children}</span>
      </button>
    </span>
  );
}

export default FizzButton;
