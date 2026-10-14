"use client";
import { useEffect, useId, useMemo, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { chain, gearPath, turn, type Gear } from "./gears";
import "./clockwork-edge.css";

export type Metal = "brass" | "steel";

export type ClockworkEdgeProps = {
  children: ReactNode;
  metal?: Metal;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  type?: "button" | "submit";
  motion?: "full" | "reduced";
  className?: string;
};

const PAD = 36, M = 2.2;
const TOP = [14, 9, 12, 8, 13, 9, 11, 8, 14, 9, 12];
const BOTTOM = [10, 13, 8, 12, 9, 14, 8, 11, 10, 13];

/**
 * Clockwork Edge
 * Point at the button and a train of gears rises from behind its top and bottom edges, meshing
 * tooth into gap. They turn as one machine — each the opposite way to its neighbour at the ratio of
 * their teeth — quicker when you move, and a press ratchets them on by a tooth at a time.
 */
export function ClockworkEdge({ children, metal = "brass", onClick, type = "button", motion = "full", className = "" }: ClockworkEdgeProps) {
  const uid = useId().replace(/:/g, "");
  const btn = useRef<HTMLButtonElement>(null);
  const els = useRef<(SVGGElement | null)[]>([]);
  const [size, setSize] = useState({ w: 220, h: 54 });
  const [on, setOn] = useState(false);
  const st = useRef({ phi: 0, w: 0, target: 0, raf: 0, last: 0, ratchet: 0 });

  useEffect(() => {
    const el = btn.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setSize({ w: el.offsetWidth, h: el.offsetHeight }));
    ro.observe(el);
    return () => { ro.disconnect(); cancelAnimationFrame(st.current.raf); };
  }, []);

  // two trains: one peeking over the top edge, one under the bottom, each kept within the flat part
  const gears = useMemo(() => {
    const { w, h } = size, r = h / 2;
    const fit = (gs: Gear[]) => gs.filter((g) => g.x + g.R <= w - r * 0.35);
    const top = fit(chain(TOP, M, r * 0.6, (R) => -R * 0.12));
    const bottom = fit(chain(BOTTOM, M, r * 0.75, (R) => h + R * 0.12)).map((g) => ({ ...g, k: -g.k }));
    return [...top.map((g) => ({ ...g, side: -1 })), ...bottom.map((g) => ({ ...g, side: 1 }))];
  }, [size]);
  const paths = useMemo(() => Object.fromEntries([...new Set(gears.map((g) => g.N))].map((N) => [N, gearPath(N, M)])), [gears]);

  const draw = () => gears.forEach((g, i) => els.current[i]?.setAttribute("transform", `rotate(${((turn(g, st.current.phi) * 180) / Math.PI).toFixed(2)})`));
  useEffect(draw);

  const run = () => {
    const s = st.current;
    if (s.raf || motion === "reduced" || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    s.last = 0;
    const tick = (now: number) => {
      const dt = s.last ? Math.min(0.05, (now - s.last) / 1000) : 1 / 60; s.last = now;
      if (s.ratchet > 0) {
        // a tooth at a time: quick steps with a pause between
        s.ratchet -= dt;
        const k = (s.ratchet * 6) % 1;
        s.w = k > 0.6 ? 9 : 0;
      } else s.w += (s.target - s.w) * Math.min(1, dt * 3);
      s.phi += s.w * dt;
      s.target *= Math.pow(0.4, dt) ; // pointer pushes fade
      if (on) s.target = Math.max(s.target, 0.7);
      draw();
      s.raf = Math.abs(s.w) > 0.01 || s.ratchet > 0 || on ? requestAnimationFrame(tick) : 0;
    };
    s.raf = requestAnimationFrame(tick);
  };
  useEffect(() => { if (on) run(); else st.current.target = 0; /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [on]);

  const { w, h } = size;
  return (
    <span className={`cwork cwork--${metal} ${className}`} data-on={on ? "" : undefined} style={{ ["--cw-pad" as string]: `${PAD}px` } as CSSProperties}>
      <svg className="cwork__train" width={w + PAD * 2} height={h + PAD * 2} viewBox={`${-PAD} ${-PAD} ${w + PAD * 2} ${h + PAD * 2}`} aria-hidden="true">
        <defs>
          <linearGradient id={`${uid}g`} x1="0" y1="0" x2="0.6" y2="1"><stop offset="0" className="cwork__lite" /><stop offset="1" className="cwork__dark" /></linearGradient>
        </defs>
        {gears.map((g, i) => (
          <g key={i} className="cwork__slot" style={{ ["--out" as string]: `${g.side * (g.R * 0.55 + 4)}px`, ["--i" as string]: i % 11 } as CSSProperties} transform={`translate(${g.x} ${g.y})`}>
            <g className="cwork__rise">
              <g ref={(el) => { els.current[i] = el; }}>
                <path d={paths[g.N]} fillRule="evenodd" fill={`url(#${uid}g)`} className="cwork__gear" />
                <circle r={g.R * 0.55} className="cwork__groove" />
              </g>
              <circle r={1.6} className="cwork__pin" />
            </g>
          </g>
        ))}
      </svg>
      <button ref={btn} type={type} className="cwork__btn" onClick={onClick}
        onPointerEnter={(e) => { if (e.pointerType === "mouse") setOn(true); }}
        onPointerMove={(e) => { if (e.pointerType === "mouse") { st.current.target = Math.min(6, st.current.target + Math.abs(e.movementX) * 0.05) * Math.sign(e.movementX || 1); run(); } }}
        onPointerLeave={(e) => { if (e.pointerType === "mouse") setOn(false); }}
        onPointerDown={(e) => { if (e.pointerType !== "mouse") { setOn(true); window.setTimeout(() => setOn(false), 2600); } st.current.ratchet = 0.66; run(); }}
        onFocus={(e) => { if (e.currentTarget.matches(":focus-visible")) setOn(true); }}
        onBlur={() => setOn(false)}>
        {children}
      </button>
    </span>
  );
}

export default ClockworkEdge;
