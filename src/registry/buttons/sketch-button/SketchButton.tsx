"use client";

import { useEffect, useLayoutEffect, useRef, useState, type ButtonHTMLAttributes } from "react";
import "./sketch-button.css";

/**
 * Sketch Button
 * A button drawn by hand: two loose pencil outlines that never quite meet.
 * Point at it and the lines boil, redrawn eight times a second the way hand
 * animation wobbles, while a quick hatch fills in behind the label. Leave and
 * it settles back onto the page.
 */

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  theme?: "paper" | "night";
  motion?: "full" | "reduced";
};

function rng(seed: number) {
  let s = seed % 2147483647 || 1;
  return () => ((s = (s * 16807) % 2147483647) - 1) / 2147483646;
}

/** A loose rounded rectangle, overshooting where the pen starts and stops. */
function outline(w: number, h: number, seed: number, wob: number) {
  const r = rng(seed), j = () => (r() - 0.5) * wob * 2;
  const m = 4, rad = Math.min(14, h / 2 - m);
  const pts: [number, number][] = [];
  const add = (x: number, y: number) => pts.push([x + j(), y + j()]);
  for (let x = m + rad; x <= w - m - rad; x += 18) add(x, m);
  add(w - m - rad * 0.3, m + rad * 0.3);
  for (let y = m + rad; y <= h - m - rad; y += 12) add(w - m, y);
  add(w - m - rad * 0.3, h - m - rad * 0.3);
  for (let x = w - m - rad; x >= m + rad; x -= 18) add(x, h - m);
  add(m + rad * 0.3, h - m - rad * 0.3);
  for (let y = h - m - rad; y >= m + rad; y -= 12) add(m, y);
  add(m + rad * 0.3, m + rad * 0.3);
  add(m + rad + 10, m - 1); // overshoot past the start
  let d = `M ${pts[0][0] - 6} ${pts[0][1] + j()}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const [x0, y0] = pts[i], [x1, y1] = pts[i + 1];
    d += ` Q ${x0} ${y0} ${(x0 + x1) / 2} ${(y0 + y1) / 2}`;
  }
  return d;
}

/** A zigzag hatch across the face. */
function hatch(w: number, h: number, seed: number) {
  const r = rng(seed);
  let d = `M 10 ${h - 10}`;
  for (let x = 10, up = true; x < w - 10; x += 7, up = !up) d += ` L ${x + 7 + (r() - 0.5) * 2} ${up ? 10 + r() * 3 : h - 10 - r() * 3}`;
  return d;
}

export function SketchButton({ theme = "paper", motion = "full", className = "", children, ...rest }: Props) {
  const btn = useRef<HTMLButtonElement>(null);
  const [box, setBox] = useState({ w: 0, h: 0 });
  const [frame, setFrame] = useState(1);
  const [hot, setHot] = useState(false);

  useLayoutEffect(() => {
    const el = btn.current!;
    const read = () => setBox({ w: el.offsetWidth, h: el.offsetHeight });
    read();
    const ro = new ResizeObserver(read);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Boil: new jitter 8 times a second, only while pointed at.
  useEffect(() => {
    if (!hot || motion === "reduced" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => setFrame((f) => f + 1), 125);
    return () => clearInterval(t);
  }, [hot, motion]);

  const { w, h } = box;
  return (
    <button
      ref={btn}
      type="button"
      className={`skb skb--${theme} ${className}`}
      data-motion={motion}
      data-hot={hot || undefined}
      onPointerEnter={() => setHot(true)}
      onPointerLeave={() => { setHot(false); setFrame(1); }}
      onFocus={() => setHot(true)}
      onBlur={() => { setHot(false); setFrame(1); }}
      {...rest}
    >
      {w > 0 && (
        <svg className="skb__ink" width={w} height={h} viewBox={`0 0 ${w} ${h}`} aria-hidden="true">
          <path className="skb__hatch" d={hatch(w, h, 7 + (frame % 3))} pathLength={1} />
          <path className="skb__line" d={outline(w, h, 11 * frame, 1.4)} />
          <path className="skb__line skb__line--2" d={outline(w, h, 97 * frame + 5, 2)} />
        </svg>
      )}
      <span className="skb__label">{children}</span>
    </button>
  );
}
