"use client";
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { line, string, swing, type Swing } from "./flags";
import "./bunting.css";

export type BuntingStyle = "fete" | "nautical" | "mono";

export type BuntingProps = {
  children: ReactNode;
  look?: BuntingStyle;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  type?: "button" | "submit";
  motion?: "full" | "reduced";
  className?: string;
};

const TOP = 58, SIDE = 16, GAP = 19, SAG = 12, Y = -40;

/**
 * Bunting
 * Point at the button and a string of pennants drops over it, sagging between two pins and swinging
 * as it settles. Move the pointer and the flags catch the gust, the nearest first; press and they
 * flutter. Leave and the string lifts away.
 */
export function Bunting({ children, look = "fete", onClick, type = "button", motion = "full", className = "" }: BuntingProps) {
  const btn = useRef<HTMLButtonElement>(null);
  const flagEls = useRef<(SVGGElement | null)[]>([]);
  const [w, setW] = useState(220);
  const [up, setUp] = useState(false);
  const sim = useRef<{ swings: Swing[]; raf: number; last: number; gust: { x: number; f: number } | null; flutter: number }>({ swings: [], raf: 0, last: 0, gust: null, flutter: 0 });

  useEffect(() => {
    const el = btn.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setW(el.offsetWidth));
    ro.observe(el);
    setW(el.offsetWidth);
    return () => { ro.disconnect(); cancelAnimationFrame(sim.current.raf); };
  }, []);

  const x0 = -SIDE + 4, x1 = w + SIDE - 4;
  const hangs = line(x0, x1, Y, SAG, GAP);

  const step = (now: number) => {
    const s = sim.current;
    const dt = s.last ? Math.min(0.04, (now - s.last) / 1000) : 1 / 60; s.last = now;
    let moving = false;
    hangs.forEach((h, i) => {
      const sw = (s.swings[i] ??= { a: 0, v: 0 });
      let f = 0;
      if (s.gust) f += s.gust.f * Math.exp(-(((h.x - s.gust.x) / 70) ** 2));
      if (s.flutter > 0) f += Math.sin(now / 40 + i * 1.7) * 900 * s.flutter;
      swing(sw, dt, f);
      if (Math.abs(sw.a) > 0.05 || Math.abs(sw.v) > 0.05) moving = true;
      flagEls.current[i]?.setAttribute("transform", `translate(${h.x + SIDE} ${h.y + TOP}) rotate(${h.slope + sw.a})`);
    });
    s.gust = null;
    s.flutter = Math.max(0, s.flutter - dt * 1.4);
    s.raf = moving || s.flutter > 0 ? requestAnimationFrame(step) : 0;
  };
  const kick = (fn: (s: typeof sim.current) => void) => {
    if (motion === "reduced" || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    fn(sim.current);
    if (!sim.current.raf) { sim.current.last = 0; sim.current.raf = requestAnimationFrame(step); }
  };
  const show = () => {
    setUp(true);
    // they land swinging, alternately
    kick((s) => { s.swings = hangs.map((_, i) => ({ a: (i % 2 ? 1 : -1) * 14, v: 0 })); });
  };
  const hide = () => setUp(false);

  return (
    <span className={`bunt bunt--${look} ${className}`} data-up={up ? "" : undefined} style={{ ["--bt-top" as string]: `${TOP}px`, ["--bt-side" as string]: `${SIDE}px` } as CSSProperties}>
      <svg className="bunt__line" width={w + SIDE * 2} height={TOP + 4} aria-hidden="true">
        <g className="bunt__drop">
          <circle cx={x0 + SIDE} cy={Y + TOP} r={2.2} className="bunt__pin" /><circle cx={x1 + SIDE} cy={Y + TOP} r={2.2} className="bunt__pin" />
          <path d={string(x0 + SIDE, x1 + SIDE, Y + TOP, SAG)} className="bunt__string" />
          {hangs.map((h, i) => (
            <g key={i} ref={(el) => { flagEls.current[i] = el; }} transform={`translate(${h.x + SIDE} ${h.y + TOP}) rotate(${h.slope})`}>
              <g className={`bunt__flag bunt__flag--c${i % 4}`} style={{ ["--i" as string]: i } as CSSProperties}>
                <path d="M-7 0H7L0 17Z" className="bunt__cloth" />
                <path d="M-4.4 3.6H4.4" className="bunt__trim" />
              </g>
            </g>
          ))}
        </g>
      </svg>
      <button ref={btn} type={type} className="bunt__btn" onClick={onClick}
        onPointerEnter={(e) => { if (e.pointerType === "mouse") show(); }}
        onPointerMove={(e) => { if (e.pointerType === "mouse" && up && Math.abs(e.movementX) > 1) { const b = e.currentTarget.getBoundingClientRect(); const x = e.clientX - b.left; kick((s) => { s.gust = { x, f: Math.max(-1600, Math.min(1600, e.movementX * 120)) }; }); } }}
        onPointerLeave={(e) => { if (e.pointerType === "mouse") hide(); }}
        onPointerDown={(e) => { if (e.pointerType !== "mouse") { show(); window.setTimeout(hide, 2600); } kick((s) => { s.flutter = 1; }); }}
        onFocus={(e) => { if (e.currentTarget.matches(":focus-visible")) show(); }}
        onBlur={hide}>
        {children}
      </button>
    </span>
  );
}

export default Bunting;
