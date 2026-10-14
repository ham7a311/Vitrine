"use client";
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { delay, length, marks, ticks } from "./ruler";
import { nearest } from "./perimeter";
import "./ruler-edge.css";

export type Sheet = "blueprint" | "drafting";

export type RulerEdgeProps = {
  children: ReactNode;
  sheet?: Sheet;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  type?: "button" | "submit";
  className?: string;
};

const PAD = 62;
type Measure = { w: number; h: number; s0: number; n: number };

/**
 * Ruler Edge
 * Point at the button and it gets measured: ruler ticks draw in round its edge from where you came
 * in, with numbers along the top, then dimension lines appear with its real size in pixels and
 * the radius of its corners, like a spec sheet.
 */
export function RulerEdge({ children, sheet = "blueprint", onClick, type = "button", className = "" }: RulerEdgeProps) {
  const btn = useRef<HTMLButtonElement>(null);
  const [m, setM] = useState<Measure | null>(null);
  const [shown, setShown] = useState(false);
  const count = useRef(0);
  useEffect(() => { if (!m) return; const id = requestAnimationFrame(() => setShown(true)); return () => cancelAnimationFrame(id); }, [m]);

  const measure = (x: number, y: number) => {
    const b = btn.current!;
    const w = b.offsetWidth, h = b.offsetHeight;
    setShown(false);
    setM({ w, h, s0: nearest(w, h, h / 2, x, y), n: ++count.current });
  };
  const local = (e: React.PointerEvent<HTMLButtonElement>) => { const r = e.currentTarget.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; };

  let svg = null;
  if (m) {
    const { w, h, s0 } = m, r = h / 2, L = length(w, h, r);
    const all = ticks(w, h, r);
    const last = Math.max(...all.map((t) => delay(t.s, s0, L)));
    const after = Math.min(last, 420) + 80;
    const dimY = -40, dimX = w + 30;
    svg = (
      <svg key={m.n} className="ruled__sheet" data-shown={shown ? "" : undefined} width={w + PAD * 2} height={h + PAD * 2} viewBox={`${-PAD} ${-PAD} ${w + PAD * 2} ${h + PAD * 2}`} aria-hidden="true">
        {/* guides running off the edges */}
        <g className="ruled__guides">
          <line x1={0} y1={-PAD} x2={0} y2={h + PAD} /><line x1={w} y1={-PAD} x2={w} y2={h + PAD} />
          <line x1={-PAD} y1={0} x2={w + PAD} y2={0} /><line x1={-PAD} y1={h} x2={w + PAD} y2={h} />
        </g>
        <g className="ruled__ticks">
          {all.map((t, i) => (
            <line key={i} data-rank={t.rank} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2} pathLength={1} style={{ ["--d" as string]: `${Math.min(420, delay(t.s, s0, L))}ms` } as CSSProperties} />
          ))}
        </g>
        <g className="ruled__nums">
          {marks(w, r).map((x) => <text key={x} x={x} y={-17} style={{ ["--d" as string]: `${Math.min(420, delay(x - r, s0, L)) + 60}ms` } as CSSProperties}>{x}</text>)}
        </g>
        {/* overall width, above */}
        <g className="ruled__dim" style={{ ["--d" as string]: `${after}ms` } as CSSProperties}>
          <line className="ruled__ext" x1={0} y1={-6} x2={0} y2={dimY - 6} /><line className="ruled__ext" x1={w} y1={-6} x2={w} y2={dimY - 6} />
          <line className="ruled__run" x1={w / 2} y1={dimY} x2={0} y2={dimY} pathLength={1} /><line className="ruled__run" x1={w / 2} y1={dimY} x2={w} y2={dimY} pathLength={1} />
          <path className="ruled__head" d={`M0 ${dimY}l6-3v6zM${w} ${dimY}l-6-3v6z`} />
          <g className="ruled__tag" transform={`translate(${w / 2} ${dimY})`}><rect x={-30} y={-9} width={60} height={18} rx={4} /><text y={3.6}>{w} px</text></g>
        </g>
        {/* height, to the right */}
        <g className="ruled__dim" style={{ ["--d" as string]: `${after + 140}ms` } as CSSProperties}>
          <line className="ruled__ext" x1={w - r + 6} y1={0} x2={dimX + 6} y2={0} /><line className="ruled__ext" x1={w - r + 6} y1={h} x2={dimX + 6} y2={h} />
          <line className="ruled__run" x1={dimX} y1={h / 2} x2={dimX} y2={0} pathLength={1} /><line className="ruled__run" x1={dimX} y1={h / 2} x2={dimX} y2={h} pathLength={1} />
          <path className="ruled__head" d={`M${dimX} 0l-3 6h6zM${dimX} ${h}l-3-6h6z`} />
          <g className="ruled__tag" transform={`translate(${dimX} ${h / 2})`}><rect x={-15} y={-9} width={30} height={18} rx={4} /><text y={3.6}>{h}</text></g>
        </g>
        {/* corner radius callout */}
        <g className="ruled__dim" style={{ ["--d" as string]: `${after + 280}ms` } as CSSProperties}>
          <line className="ruled__run" x1={r} y1={r} x2={r - r * Math.SQRT1_2} y2={r - r * Math.SQRT1_2} pathLength={1} />
          <circle className="ruled__pin" cx={r} cy={r} r={1.6} />
          <line className="ruled__run" x1={r - r * Math.SQRT1_2} y1={r - r * Math.SQRT1_2} x2={-24} y2={-22} pathLength={1} />
          <text className="ruled__note" x={-26} y={-26} textAnchor="end">r {r}</text>
        </g>
      </svg>
    );
  }

  return (
    <span className={`ruled ruled--${sheet} ${className}`} style={{ ["--rl-pad" as string]: `${PAD}px` } as CSSProperties}>
      <button ref={btn} type={type} className="ruled__btn" onClick={onClick}
        onPointerEnter={(e) => { if (e.pointerType === "mouse") { const p = local(e); measure(p.x, p.y); } }}
        onPointerLeave={(e) => { if (e.pointerType === "mouse") setShown(false); }}
        onPointerDown={(e) => { if (e.pointerType !== "mouse") { const p = local(e); measure(p.x, p.y); window.setTimeout(() => setShown(false), 2600); } }}
        onFocus={(e) => { if (e.currentTarget.matches(":focus-visible")) measure(e.currentTarget.offsetWidth / 2, 0); }}
        onBlur={() => setShown(false)}>
        {children}
      </button>
      {svg}
    </span>
  );
}

export default RulerEdge;
