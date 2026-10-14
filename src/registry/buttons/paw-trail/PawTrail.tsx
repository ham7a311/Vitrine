"use client";
import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { GAITS, lap, step, type Animal } from "./gait";
import { nearest, pointAt } from "./perimeter";
import { PRINT } from "./prints";
import "./paw-trail.css";

export type PawTrailProps = {
  children: ReactNode;
  animal?: Animal;
  /** Colour of the prints; they sit on whatever is around the button. */
  ink?: string;
  /** Button colours. */
  tone?: { face: string; label: string };
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  type?: "button" | "submit";
  className?: string;
};

const PAD = 34; // room around the button for the prints

/**
 * Paw Trail
 * Point at the button and an animal walks round it from where you came in, in the direction you
 * were heading — each print stamped into the ground and fading behind it, lap after lap until you
 * leave. Pressing stamps one big print on the face.
 */
export function PawTrail({ children, animal = "pup", ink = "#3b2a1e", tone = { face: "#2b211a", label: "#fbf3e6" }, onClick, type = "button", className = "" }: PawTrailProps) {
  const btn = useRef<HTMLButtonElement>(null);
  const layer = useRef<HTMLSpanElement>(null);
  const walk = useRef<{ timer: number; n: number } | null>(null);
  const calm = useRef(false);
  useEffect(() => {
    calm.current = matchMedia("(prefers-reduced-motion: reduce)").matches;
    return () => stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const box = () => { const b = btn.current!; return { w: b.offsetWidth, h: b.offsetHeight, r: b.offsetHeight / 2 }; };

  const stamp = (x: number, y: number, angle: number, size: number, still = false, delay = 0) => {
    const el = document.createElement("span");
    el.className = "ptrail__print";
    el.innerHTML = PRINT[animal];
    Object.assign(el.style, { left: `${x + PAD}px`, top: `${y + PAD}px`, width: `${size}px`, height: `${size}px`, transform: `translate(-50%, -50%) rotate(${angle}deg)` });
    layer.current?.appendChild(el);
    const base = `translate(-50%, -50%) rotate(${angle}deg)`;
    if (still) {
      el.animate([{ opacity: 0 }, { opacity: 0.85 }], { duration: 400, delay, fill: "forwards" });
      return el;
    }
    el.animate([
      { transform: `${base} scale(1.45)`, opacity: 0, filter: "blur(1.5px)" },
      { transform: `${base} scale(0.9)`, opacity: 1, filter: "blur(0)", offset: 0.45 },
      { transform: `${base} scale(1)`, opacity: 0.9 },
    ], { duration: 240, easing: "cubic-bezier(0.2, 0.8, 0.3, 1)", fill: "forwards" });
    // a little puff of dust where the foot lands
    const puff = document.createElement("i");
    puff.className = "ptrail__puff";
    Object.assign(puff.style, { left: `${x + PAD}px`, top: `${y + PAD}px` });
    layer.current?.appendChild(puff);
    puff.animate([{ transform: "translate(-50%, -50%) scale(0.3)", opacity: 0.5 }, { transform: "translate(-50%, -50%) scale(1.6)", opacity: 0 }], { duration: 420, easing: "ease-out" }).onfinish = () => puff.remove();
    el.animate([{ opacity: 0.9 }, { opacity: 0 }], { duration: 700, delay: 1500, fill: "forwards", easing: "ease-in" }).onfinish = () => el.remove();
    return el;
  };

  const stop = () => { if (walk.current) clearInterval(walk.current.timer); walk.current = null; };

  const start = (s0: number, dir: 1 | -1) => {
    stop();
    const g = GAITS[animal], { w, h, r } = box();
    if (calm.current) {
      // a still ring of prints, no walking
      layer.current?.querySelectorAll(".ptrail__print").forEach((n) => n.remove());
      const n = lap(w, h, r, g);
      for (let i = 0; i < n; i += 2) for (const p of step(i, s0, dir, w, h, r, g)) stamp(p.x, p.y, p.angle, g.size, true, i * 12).dataset.still = "";
      return;
    }
    const state = { timer: 0, n: 0 };
    const go = () => { for (const p of step(state.n, s0, dir, w, h, r, g)) stamp(p.x, p.y, p.angle, g.size); state.n += 1; };
    go();
    state.timer = window.setInterval(go, g.ms);
    walk.current = state;
  };

  const enter = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (e.pointerType !== "mouse") return;
    const rect = e.currentTarget.getBoundingClientRect(), { w, h, r } = box();
    const x = e.clientX - rect.left, y = e.clientY - rect.top;
    const s0 = nearest(w, h, r, x, y);
    // walk the way the pointer was travelling along the edge
    const p = pointAt(w, h, r, s0);
    const along = p.tx * (e.movementX || 0) + p.ty * (e.movementY || 0);
    start(s0, along < 0 ? -1 : 1);
  };
  const leave = () => {
    stop();
    layer.current?.querySelectorAll<HTMLElement>("[data-still]").forEach((n) => n.animate([{ opacity: 0.85 }, { opacity: 0 }], { duration: 300, fill: "forwards" }).onfinish = () => n.remove());
  };

  const press = (e: React.PointerEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left, y = e.clientY - rect.top;
    if (e.pointerType !== "mouse") { const { w, h, r } = box(); start(nearest(w, h, r, x, y), 1); window.setTimeout(stop, 2200); }
    if (calm.current) return;
    const el = document.createElement("span");
    el.className = "ptrail__big";
    el.innerHTML = PRINT[animal];
    Object.assign(el.style, { left: `${x}px`, top: `${y}px` });
    btn.current?.appendChild(el);
    el.animate([
      { transform: "translate(-50%, -50%) rotate(-8deg) scale(1.6)", opacity: 0 },
      { transform: "translate(-50%, -50%) rotate(-8deg) scale(0.95)", opacity: 0.32, offset: 0.35 },
      { transform: "translate(-50%, -50%) rotate(-8deg) scale(1)", opacity: 0.32, offset: 0.7 },
      { transform: "translate(-50%, -50%) rotate(-8deg) scale(1)", opacity: 0 },
    ], { duration: 1100, easing: "ease-out" }).onfinish = () => el.remove();
  };

  return (
    <span className={`ptrail ptrail--${animal} ${className}`} style={{ ["--pt-ink" as string]: ink, ["--pt-face" as string]: tone.face, ["--pt-label" as string]: tone.label, ["--pt-pad" as string]: `${PAD}px` } as CSSProperties}>
      <span ref={layer} className="ptrail__ground" aria-hidden="true" />
      <button ref={btn} type={type} className="ptrail__btn" onClick={onClick}
        onPointerEnter={enter} onPointerLeave={leave} onPointerDown={press}
        onFocus={(e) => { if (e.currentTarget.matches(":focus-visible")) { const { w, h, r } = box(); start(nearest(w, h, r, w / 2, 0), 1); } }}
        onBlur={leave}>
        <span className="ptrail__icon" aria-hidden="true" dangerouslySetInnerHTML={{ __html: PRINT[animal] }} />
        {children}
      </button>
    </span>
  );
}

export default PawTrail;
