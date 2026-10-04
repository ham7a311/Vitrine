"use client";

import { useLayoutEffect, useRef, useState, type ButtonHTMLAttributes, type CSSProperties } from "react";
import "./marquee-lights-button.css";

/**
 * Marquee Lights Button
 * A theatre marquee for a border: a row of warm bulbs runs around the
 * button, chasing in threes the way a cinema front does. Point at it and
 * every bulb comes up while the chase quickens: the show's about to start.
 */

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  theme?: "paper" | "night";
  motion?: "full" | "reduced";
};

const INSET = 7;
const STEP = 12;

/** Evenly spaced points round a rounded rectangle (corner radius r), clockwise from the top-left of the top edge. */
function bulbs(w: number, h: number, r: number) {
  const x0 = INSET, y0 = INSET, x1 = w - INSET, y1 = h - INSET;
  const sw = x1 - x0 - 2 * r, sh = y1 - y0 - 2 * r, arc = (Math.PI / 2) * r;
  const segs: [number, (t: number) => [number, number]][] = [
    [sw, (t) => [x0 + r + t, y0]],
    [arc, (t) => { const a = -Math.PI / 2 + t / r; return [x1 - r + Math.cos(a) * r, y0 + r + Math.sin(a) * r]; }],
    [sh, (t) => [x1, y0 + r + t]],
    [arc, (t) => { const a = t / r; return [x1 - r + Math.cos(a) * r, y1 - r + Math.sin(a) * r]; }],
    [sw, (t) => [x1 - r - t, y1]],
    [arc, (t) => { const a = Math.PI / 2 + t / r; return [x0 + r + Math.cos(a) * r, y1 - r + Math.sin(a) * r]; }],
    [sh, (t) => [x0, y1 - r - t]],
    [arc, (t) => { const a = Math.PI + t / r; return [x0 + r + Math.cos(a) * r, y0 + r + Math.sin(a) * r]; }],
  ];
  const total = segs.reduce((s, [l]) => s + l, 0);
  // A multiple of three, so the chase closes up.
  const n = Math.max(3, Math.round(total / STEP / 3) * 3);
  const gap = total / n;
  const pts: [number, number][] = [];
  for (let k = 0; k < n; k++) {
    let d = k * gap;
    for (const [l, f] of segs) { if (d <= l) { pts.push(f(d)); break; } d -= l; }
  }
  return pts;
}

export function MarqueeLightsButton({ theme = "night", motion = "full", className = "", children, ...rest }: Props) {
  const btn = useRef<HTMLButtonElement>(null);
  const [pts, setPts] = useState<[number, number][]>([]);
  useLayoutEffect(() => {
    const el = btn.current!;
    const read = () => setPts(bulbs(el.offsetWidth, el.offsetHeight, 8));
    read();
    const ro = new ResizeObserver(read);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return (
    <button ref={btn} type="button" className={`mlb mlb--${theme} ${className}`} data-motion={motion} {...rest}>
      <span className="mlb__bulbs" aria-hidden="true">
        {pts.map(([x, y], i) => (
          <span key={i} className="mlb__bulb" style={{ left: x, top: y, "--k": i % 3 } as CSSProperties} />
        ))}
      </span>
      <span className="mlb__label">{children}</span>
    </button>
  );
}
