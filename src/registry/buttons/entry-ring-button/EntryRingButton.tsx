"use client";

import { useId, useLayoutEffect, useRef, useState, type ButtonHTMLAttributes, type PointerEvent } from "react";
import "./entry-ring-button.css";

/**
 * Entry Ring Button
 * The border draws itself from where you came in. Cross the edge and a
 * gradient line grows both ways round the pill from that exact point, meeting
 * on the far side; leave and it shrinks away toward the point you left by.
 * Press and the colour floods the face.
 */

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  theme?: "paper" | "night";
  motion?: "full" | "reduced";
};

const IN = 1; // the line sits just inside the edge

/** Where a point lands on the pill outline, as a fraction 0–1 of the way round from the top-left of the top edge, clockwise. */
function along(w: number, h: number, x: number, y: number) {
  const r = h / 2 - IN, x0 = IN + r, x1 = w - IN - r, cy = h / 2;
  const straight = x1 - x0, arc = Math.PI * r, total = 2 * straight + 2 * arc;
  let d: number;
  if (x >= x0 && x <= x1) d = y < cy ? x - x0 : straight + arc + (x1 - x);
  else if (x > x1) { const a = Math.atan2(y - cy, x - x1); d = straight + (a + Math.PI / 2) * r; }
  else { const a = Math.atan2(y - cy, x - x0); const t = a < 0 ? a + 2 * Math.PI : a; d = 2 * straight + arc + (t - Math.PI / 2) * r; }
  return ((d / total) % 1 + 1) % 1;
}

export function EntryRingButton({ theme = "night", motion = "full", className = "", children, onPointerEnter, onPointerLeave, onFocus, onBlur, ...rest }: Props) {
  const uid = useId().replace(/:/g, "");
  const ref = useRef<HTMLButtonElement>(null);
  const line = useRef<SVGPathElement>(null);
  const [box, setBox] = useState({ w: 0, h: 0 });

  useLayoutEffect(() => {
    const el = ref.current!;
    const read = () => setBox({ w: el.offsetWidth, h: el.offsetHeight });
    read();
    const ro = new ResizeObserver(read);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // The visible dash is centred on the entry point: dasharray "len 1−len", dashoffset −(s − len/2).
  const set = (len: number, s: number, animate: boolean) => {
    const p = line.current;
    if (!p) return;
    p.style.transition = animate ? "" : "none";
    p.style.strokeDasharray = `${len} ${1 - len + 0.0001}`;
    p.style.strokeDashoffset = String(-(s - len / 2));
  };
  const point = (e: PointerEvent<HTMLButtonElement> | null) => {
    if (!e) return 0.75; // from the keyboard: grow from the middle of the bottom edge
    const r = ref.current!.getBoundingClientRect();
    return along(box.w, box.h, e.clientX - r.left, e.clientY - r.top);
  };
  const grow = (s: number) => {
    set(0, s, false);
    void line.current?.getBoundingClientRect();
    requestAnimationFrame(() => set(1, s, true));
  };
  const shrink = (s: number) => {
    // At full length the offset doesn't show, so re-centre on the exit point first, then shrink there.
    set(1, s, false);
    void line.current?.getBoundingClientRect();
    requestAnimationFrame(() => set(0, s, true));
  };

  const r = box.h / 2 - IN;
  const d = box.w ? `M ${IN + r} ${IN} H ${box.w - IN - r} A ${r} ${r} 0 0 1 ${box.w - IN - r} ${box.h - IN} H ${IN + r} A ${r} ${r} 0 0 1 ${IN + r} ${IN} Z` : "";

  return (
    <button
      ref={ref}
      type="button"
      className={`erb erb--${theme} ${className}`}
      data-motion={motion}
      onPointerEnter={(e) => { if (e.pointerType === "mouse") grow(point(e)); onPointerEnter?.(e); }}
      onPointerLeave={(e) => { if (e.pointerType === "mouse" && document.activeElement !== ref.current) shrink(point(e)); onPointerLeave?.(e); }}
      onFocus={(e) => { if (!ref.current!.matches(":hover")) grow(point(null)); onFocus?.(e); }}
      onBlur={(e) => { if (!ref.current!.matches(":hover")) shrink(point(null)); onBlur?.(e); }}
      {...rest}
    >
      {d && (
        <svg className="erb__ring" width={box.w} height={box.h} viewBox={`0 0 ${box.w} ${box.h}`} aria-hidden="true">
          <defs>
            <linearGradient id={`${uid}-g`} x1="0" x2={box.w} y1="0" y2={box.h} gradientUnits="userSpaceOnUse">
              <stop offset="0" className="erb__s1" />
              <stop offset="0.5" className="erb__s2" />
              <stop offset="1" className="erb__s3" />
            </linearGradient>
          </defs>
          <path ref={line} d={d} pathLength={1} className="erb__line" stroke={`url(#${uid}-g)`} style={{ strokeDasharray: "0 1" }} />
        </svg>
      )}
      <span className="erb__flood" aria-hidden="true" />
      <span className="erb__label">{children}</span>
    </button>
  );
}
