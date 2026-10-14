"use client";
import { useEffect, useId, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { along, coil, lengths, toPath, type P } from "./yarn";
import { nearest, pointAt } from "./perimeter";
import "./yarn-wrap.css";

export type Yarn = "wool" | "cotton" | "neon";

export type YarnWrapProps = {
  children: ReactNode;
  yarn?: Yarn;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  type?: "button" | "submit";
  motion?: "full" | "reduced";
  className?: string;
};

const PAD = 34;
const ease = (k: number) => 1 - (1 - k) ** 3;

/**
 * Yarn Wrap
 * Point at the button and a ball of yarn rolls round it from where you came in, unwinding as it
 * goes and leaving the thread wrapped in loose crossing laps; the ball shrinks as it pays out.
 * Leave and it winds itself back up. Press to give the ball a hop.
 */
export function YarnWrap({ children, yarn = "wool", onClick, type = "button", motion = "full", className = "" }: YarnWrapProps) {
  const uid = useId().replace(/:/g, "");
  const btn = useRef<HTMLButtonElement>(null);
  const reveal = useRef<SVGPathElement>(null);
  const ball = useRef<SVGGElement>(null);
  const [shape, setShape] = useState<{ d: string; pts: P[]; lens: number[] } | null>(null);
  const state = useRef({ p: 0, target: 0, raf: 0, hop: 0 });
  const live = useRef(shape);
  live.current = shape;

  const paint = () => {
    const s = live.current && reveal.current && ball.current ? live.current : null;
    if (!s) return;
    const total = s.lens[s.lens.length - 1], p = state.current.p, at = along(s.pts, s.lens, p * total);
    reveal.current!.style.strokeDashoffset = `${total * (1 - p)}`;
    const r = 11 - p * 5, hop = Math.sin(Math.min(1, state.current.hop) * Math.PI) * 10;
    // the ball rolls: its turn is the distance travelled over its radius
    ball.current!.setAttribute("transform", `translate(${at.x + PAD} ${at.y + PAD - r * 0.2 - hop}) rotate(${((p * total) / r) * (180 / Math.PI)}) scale(${r / 11})`);
    ball.current!.style.opacity = p > 0.001 || state.current.target > 0 ? "1" : "0";
  };

  useEffect(() => { paint(); });

  const run = () => {
    const st = state.current;
    if (st.raf) return;
    const still = motion === "reduced" || matchMedia("(prefers-reduced-motion: reduce)").matches;
    let last = 0;
    const tick = (now: number) => {
      const dt = last ? Math.min(0.05, (now - last) / 1000) : 1 / 60; last = now;
      const speed = st.target > st.p ? 0.6 : 1.5; // pays out slowly, winds back quickly
      st.p = still ? st.target : st.target > st.p ? Math.min(st.target, st.p + dt * speed * (1.15 - ease(st.p) * 0.6)) : Math.max(st.target, st.p - dt * speed);
      if (st.hop > 0) st.hop = Math.min(1.01, st.hop + dt * 3.2);
      if (st.hop > 1) st.hop = 0;
      paint();
      st.raf = st.p !== st.target || st.hop > 0 ? requestAnimationFrame(tick) : 0;
    };
    st.raf = requestAnimationFrame(tick);
  };
  useEffect(() => () => cancelAnimationFrame(state.current.raf), []);

  const wrap = (x: number, y: number, mx = 0, my = 0) => {
    const b = btn.current!, w = b.offsetWidth, h = b.offsetHeight, r = h / 2;
    if (state.current.p < 0.02) {
      const s0 = nearest(w, h, r, x, y), p = pointAt(w, h, r, s0);
      const pts = coil(w, h, r, s0, p.tx * mx + p.ty * my < 0 ? -1 : 1);
      setShape({ d: toPath(pts.map((q) => ({ x: q.x + PAD, y: q.y + PAD }))), pts, lens: lengths(pts) });
    }
    state.current.target = 1; run();
  };
  const unwind = () => { state.current.target = 0; run(); };
  const local = (e: React.PointerEvent<HTMLButtonElement>) => { const b = e.currentTarget.getBoundingClientRect(); return { x: e.clientX - b.left, y: e.clientY - b.top }; };
  const total = shape ? shape.lens[shape.lens.length - 1] : 0;

  return (
    <span className={`ywrap ywrap--${yarn} ${className}`} style={{ ["--yw-pad" as string]: `${PAD}px` } as CSSProperties}>
      <button ref={btn} type={type} className="ywrap__btn" onClick={onClick}
        onPointerEnter={(e) => { if (e.pointerType === "mouse") { const p = local(e); wrap(p.x, p.y, e.movementX, e.movementY); } }}
        onPointerLeave={(e) => { if (e.pointerType === "mouse") unwind(); }}
        onPointerDown={(e) => { state.current.hop = 0.01; if (e.pointerType !== "mouse") { const p = local(e); wrap(p.x, p.y); window.setTimeout(unwind, 2400); } run(); }}
        onFocus={(e) => { if (e.currentTarget.matches(":focus-visible")) wrap(e.currentTarget.offsetWidth / 2, 0); }}
        onBlur={unwind}>
        {children}
      </button>
      <svg className="ywrap__wool" aria-hidden="true">
        {shape && (
          <>
            <defs>
              <mask id={`${uid}m`} maskUnits="userSpaceOnUse">
                <path ref={reveal} d={shape.d} fill="none" stroke="#fff" strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" style={{ strokeDasharray: total, strokeDashoffset: total }} />
              </mask>
            </defs>
            <g mask={`url(#${uid}m)`}>
              <path className="ywrap__thread" d={shape.d} />
              <path className="ywrap__twist" d={shape.d} />
            </g>
            <g ref={ball} className="ywrap__ball" style={{ opacity: 0 }}>
              <circle r={11} className="ywrap__ball-body" />
              <path d="M-9-5C-3-9 4-9 9-4M-10 1C-3-4 5-4 10 2M-8 6C-2 2 4 2 8 7M-4-10C-8-3-8 4-3 10M3-10C7-3 7 4 2 10" className="ywrap__ball-strands" />
            </g>
          </>
        )}
      </svg>
    </span>
  );
}

export default YarnWrap;
