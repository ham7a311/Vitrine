"use client";

import { useEffect, useId, useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { streaks, swatchPath } from "./swatch";
import "./brush-swatch.css";

/**
 * Brush Swatch
 * A word with one stroke of paint laid behind it: pressed down on a slant at
 * the start, wandering slightly along its length, and running dry at the end
 * where the bristles split. It is brushed in left to right the first time the
 * word comes into view.
 */

type Props = {
  children: ReactNode;
  /** Paint colour; defaults to the theme's. */
  color?: string;
  /** Changes the stroke's shape; the same seed always paints the same stroke. */
  seed?: number;
  /** Tilt in degrees. */
  angle?: number;
  /** Wait before brushing in (ms), e.g. to follow the line it sits in. */
  delay?: number;
  theme?: "night" | "paper";
  className?: string;
};

export function BrushSwatch({ children, color, seed = 3, angle = -2, delay = 150, theme = "night", className = "" }: Props) {
  const id = useId().replace(/[^a-zA-Z0-9]/g, "");
  const root = useRef<HTMLSpanElement>(null);
  const paint = useRef<HTMLSpanElement>(null);
  const [size, setSize] = useState<[number, number] | null>(null);
  const [on, setOn] = useState(false);

  useLayoutEffect(() => {
    const el = paint.current;
    if (!el) return;
    const read = () => setSize([el.clientWidth, el.clientHeight]);
    read();
    const ro = new ResizeObserver(read);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setOn(true); io.disconnect(); } }, { threshold: 0.6 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const [w, h] = size ?? [0, 0];
  return (
    <span
      ref={root}
      className={`brushsw brushsw--${theme} ${className}`}
      data-on={on || undefined}
      style={{ ...(color ? { ["--paint" as string]: color } : null), ["--tilt" as string]: `${angle}deg`, ["--delay" as string]: `${delay}ms` } as CSSProperties}
    >
      <span ref={paint} className="brushsw__paint" aria-hidden="true">
        {w > 0 && (
          <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
            <defs>
              {/* Grit along the edges: the paper's tooth catches the paint unevenly. */}
              <filter id={`${id}g`} x="-5%" y="-20%" width="110%" height="140%">
                <feTurbulence type="fractalNoise" baseFrequency="0.035 0.55" numOctaves="2" seed={seed} />
                <feDisplacementMap in="SourceGraphic" scale={Math.max(2, h * 0.07)} />
              </filter>
              <clipPath id={`${id}c`}><path d={swatchPath(w, h, seed)} /></clipPath>
            </defs>
            <g filter={`url(#${id}g)`}>
              <path d={swatchPath(w, h, seed)} className="brushsw__body" />
              <g clipPath={`url(#${id}c)`}>
                {streaks(w, h, seed).map((s, k) => (
                  <path key={k} d={s.d} strokeWidth={s.width} className={s.light ? "brushsw__dry" : "brushsw__pool"} />
                ))}
              </g>
            </g>
          </svg>
        )}
      </span>
      <span className="brushsw__text">{children}</span>
    </span>
  );
}

export default BrushSwatch;
