"use client";

import { useEffect, useId, useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { blob } from "./wash";
import "./watercolour-wash.css";

/**
 * Watercolour Wash
 * A wash of pigment that blooms out behind a word as the paper takes the
 * water: paler in the middle, darker where the pigment pooled and dried at the
 * edge, granulated, with a small "cauliflower" bloom where the water ran back.
 * It spreads once when the word comes into view.
 */

type Props = {
  children: ReactNode;
  /** Pigment colour. */
  pigment?: string;
  /** Darker shade for the dried edge. */
  edge?: string;
  seed?: number;
  /** Wait before the wash spreads (ms). */
  delay?: number;
  className?: string;
};

export function WatercolourWash({ children, pigment, edge, seed = 5, delay = 200, className = "" }: Props) {
  const id = useId().replace(/[^a-zA-Z0-9]/g, "");
  const root = useRef<HTMLSpanElement>(null);
  const paper = useRef<HTMLSpanElement>(null);
  const [size, setSize] = useState<[number, number, number] | null>(null);
  const [on, setOn] = useState(false);

  useLayoutEffect(() => {
    const el = paper.current;
    if (!el) return;
    const read = () => {
      const next: [number, number, number] = [el.clientWidth, el.clientHeight, parseFloat(window.getComputedStyle(el).fontSize) || 16];
      setSize((s) => (s && s.join() === next.join() ? s : next));
    };
    read();
    const ro = new ResizeObserver(read);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setOn(true); io.disconnect(); } }, { threshold: 0.7 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const [w, h, fs] = size ?? [0, 0, 16];
  const main = w ? blob(w / 2, h / 2, w * 0.46, h * 0.4, seed) : "";
  const back = w ? blob(w * 0.7, h * 0.36, Math.min(w * 0.12, h * 0.28), h * 0.18, seed + 3, 18) : "";

  return (
    <span
      ref={root}
      className={`wcwash ${className}`}
      data-on={on || undefined}
      style={{ ...(pigment ? { ["--pigment" as string]: pigment } : null), ...(edge ? { ["--pigment-edge" as string]: edge } : null), ["--delay" as string]: `${delay}ms` } as CSSProperties}
    >
      <span ref={paper} className="wcwash__paper" aria-hidden="true">
        {w > 0 && (
          <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
            <defs>
              {/* Water spreads unevenly: a low-frequency displacement turns the blob's edge organic. */}
              <filter id={`${id}e`} x="-10%" y="-20%" width="120%" height="140%">
                <feTurbulence type="fractalNoise" baseFrequency="0.016 0.026" numOctaves="2" seed={seed} />
                <feDisplacementMap in="SourceGraphic" scale={fs * 0.28} />
              </filter>
              {/* The pooled edge, softened a little as it dried. */}
              <filter id={`${id}r`} x="-10%" y="-20%" width="120%" height="140%">
                <feTurbulence type="fractalNoise" baseFrequency="0.016 0.026" numOctaves="2" seed={seed} result="t" />
                <feDisplacementMap in="SourceGraphic" in2="t" scale={fs * 0.28} result="d" />
                <feGaussianBlur in="d" stdDeviation={Math.max(0.6, fs * 0.012)} />
              </filter>
              {/* Granulation: pigment settling into the paper's tooth. */}
              <filter id={`${id}g`} x="0" y="0" width="100%" height="100%">
                <feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="2" seed={seed + 1} result="n" />
                <feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 4 -2.1" result="m" />
                <feComposite in="SourceGraphic" in2="m" operator="in" />
              </filter>
              <radialGradient id={`${id}w`} cx="50%" cy="52%" r="60%">
                <stop offset="0%" className="wcwash__stop-mid" />
                <stop offset="78%" className="wcwash__stop-pool" />
              </radialGradient>
            </defs>
            <g className="wcwash__wash">
              <g filter={`url(#${id}e)`}>
                <path d={main} fill={`url(#${id}w)`} />
                <path d={main} className="wcwash__grain" filter={`url(#${id}g)`} />
              </g>
              <path d={main} className="wcwash__rim" strokeWidth={Math.max(1.2, fs * 0.04)} filter={`url(#${id}r)`} />
              <g className="wcwash__bloom" filter={`url(#${id}e)`}>
                <path d={back} className="wcwash__bloom-fill" />
                <path d={back} className="wcwash__bloom-rim" strokeWidth={Math.max(1, fs * 0.025)} />
              </g>
            </g>
          </svg>
        )}
      </span>
      <span className="wcwash__word">{children}</span>
    </span>
  );
}

export default WatercolourWash;
