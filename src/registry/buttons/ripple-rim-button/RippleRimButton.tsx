"use client";

import { useEffect, useLayoutEffect, useRef, useState, type ButtonHTMLAttributes, type MouseEvent } from "react";
import "./ripple-rim-button.css";

/**
 * Ripple Rim Button
 * A nudge you can see go out. Press it and a wave leaves the spot you
 * touched and runs both ways round the button's rim, fading as it travels,
 * like a tap on the side of a glass. The wave is the confirmation; the label
 * says "Nudged" while it settles.
 */

type Props = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> & {
  label: string;
  doneLabel?: string;
  theme?: "paper" | "night";
  motion?: "full" | "reduced";
};

const IN = 2;

/** Points round a pill, every ~3px, with outward normals. s runs 0 → 1 clockwise from the top-left of the top edge. */
function rim(w: number, h: number) {
  const r = h / 2 - IN, x0 = IN + r, x1 = w - IN - r, cy = h / 2;
  const straight = x1 - x0, arc = Math.PI * r, total = 2 * straight + 2 * arc;
  const n = Math.max(40, Math.round(total / 3));
  const pts: { x: number; y: number; nx: number; ny: number }[] = [];
  for (let i = 0; i < n; i++) {
    let d = (i / n) * total;
    if (d < straight) { pts.push({ x: x0 + d, y: IN, nx: 0, ny: -1 }); continue; }
    d -= straight;
    if (d < arc) { const a = -Math.PI / 2 + d / r; pts.push({ x: x1 + Math.cos(a) * r, y: cy + Math.sin(a) * r, nx: Math.cos(a), ny: Math.sin(a) }); continue; }
    d -= arc;
    if (d < straight) { pts.push({ x: x1 - d, y: h - IN, nx: 0, ny: 1 }); continue; }
    d -= straight;
    const a = Math.PI / 2 + d / r;
    pts.push({ x: x0 + Math.cos(a) * r, y: cy + Math.sin(a) * r, nx: Math.cos(a), ny: Math.sin(a) });
  }
  return { pts, total };
}

export function RippleRimButton({ label, doneLabel = "Nudged", theme = "night", motion = "full", className = "", onClick, ...rest }: Props) {
  const btn = useRef<HTMLButtonElement>(null);
  const path = useRef<SVGPathElement>(null);
  const [box, setBox] = useState({ w: 0, h: 0 });
  const [done, setDone] = useState(false);
  const raf = useRef(0);

  useLayoutEffect(() => {
    const el = btn.current!;
    const read = () => setBox({ w: el.offsetWidth, h: el.offsetHeight });
    read();
    const ro = new ResizeObserver(read);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const shape = box.w ? rim(box.w, box.h) : null;
  const draw = (off?: (i: number) => number) => {
    if (!shape || !path.current) return;
    const d = shape.pts.map((p, i) => { const o = off ? off(i) : 0; return `${i ? "L" : "M"}${(p.x + p.nx * o).toFixed(2)} ${(p.y + p.ny * o).toFixed(2)}`; }).join("") + "Z";
    path.current.setAttribute("d", d);
  };
  // Redraw the resting outline when the size changes (not on every render, or a running wave would be cut off).
  useEffect(() => { if (!raf.current) draw(); }, [box.w, box.h]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => () => cancelAnimationFrame(raf.current), []);

  useEffect(() => {
    if (!done) return;
    const t = setTimeout(() => setDone(false), 2400);
    return () => clearTimeout(t);
  }, [done]);

  const ripple = (e: MouseEvent<HTMLButtonElement>) => {
    setDone(true);
    onClick?.(e);
    if (!shape || motion === "reduced" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const r = btn.current!.getBoundingClientRect();
    // Start where you pressed; from the keyboard (no pointer position), from the top centre.
    const px = e.detail ? e.clientX - r.left : box.w / 2, py = e.detail ? e.clientY - r.top : 0;
    let start = 0, best = Infinity;
    shape.pts.forEach((p, i) => { const dd = (p.x - px) ** 2 + (p.y - py) ** 2; if (dd < best) { best = dd; start = i; } });
    const n = shape.pts.length, speed = n / 0.9, width = 5;
    const t0 = performance.now();
    cancelAnimationFrame(raf.current);
    const tick = (now: number) => {
      const t = (now - t0) / 1000;
      const amp = 5.5 * Math.exp(-t / 0.42);
      const front = t * speed;
      draw((i) => {
        let ds = Math.abs(i - start);
        ds = Math.min(ds, n - ds); // distance round the rim
        const g = Math.exp(-(((ds - front) / width) ** 2));
        return amp * g * Math.cos((ds - front) * 0.5);
      });
      if (t < 1.4) raf.current = requestAnimationFrame(tick);
      else { raf.current = 0; draw(); }
    };
    raf.current = requestAnimationFrame(tick);
  };

  return (
    <button ref={btn} type="button" className={`rrb rrb--${theme} ${className}`} data-motion={motion} data-done={done || undefined} onClick={ripple} {...rest}>
      {shape && (
        <svg className="rrb__rim" width={box.w} height={box.h} viewBox={`0 0 ${box.w} ${box.h}`} aria-hidden="true">
          <path ref={path} className="rrb__shape" />
        </svg>
      )}
      <span className="rrb__label" aria-live="polite">
        {done ? (<><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3.5 8.5l3 3 6-7" /></svg>{doneLabel}</>) : label}
      </span>
    </button>
  );
}
