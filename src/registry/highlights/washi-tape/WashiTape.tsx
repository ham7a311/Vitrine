"use client";

import { useEffect, useId, useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { tapePath } from "./tape";
import "./washi-tape.css";

/**
 * Washi Tape
 * A strip of translucent paper tape laid over a word, a little crooked: torn
 * ends, a printed pattern, the fibres of the paper and a faint shadow where it
 * lifts. It is smoothed on from one end the first time the word comes into view.
 */

export type TapePattern = "stripes" | "dots" | "grid";

type Props = {
  children: ReactNode;
  /** Tape colour. */
  color?: string;
  pattern?: TapePattern;
  /** Tilt in degrees. */
  angle?: number;
  seed?: number;
  /** Wait before laying it down (ms). */
  delay?: number;
  theme?: "paper" | "night";
  className?: string;
};

export function WashiTape({ children, color, pattern = "stripes", angle = -2.5, seed = 4, delay = 200, theme = "paper", className = "" }: Props) {
  const id = useId().replace(/[^a-zA-Z0-9]/g, "");
  const root = useRef<HTMLSpanElement>(null);
  const strip = useRef<HTMLSpanElement>(null);
  const [size, setSize] = useState<[number, number] | null>(null);
  const [on, setOn] = useState(false);

  useLayoutEffect(() => {
    const el = strip.current;
    if (!el) return;
    const read = () => setSize((s) => (s && s[0] === el.clientWidth && s[1] === el.clientHeight ? s : [el.clientWidth, el.clientHeight]));
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

  const [w, h] = size ?? [0, 0];
  const d = w ? tapePath(w, h, seed) : "";
  return (
    <span
      ref={root}
      className={`washi washi--${theme} ${className}`}
      data-on={on || undefined}
      style={{ ...(color ? { ["--tape" as string]: color } : null), ["--tilt" as string]: `${angle}deg`, ["--delay" as string]: `${delay}ms` } as CSSProperties}
    >
      <span className="washi__word">{children}</span>
      <span ref={strip} className="washi__strip" aria-hidden="true">
        {w > 0 && (
          <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
            <defs>
              <pattern id={`${id}p`} width={pattern === "stripes" ? 7 : 8} height={pattern === "stripes" ? 7 : 8} patternUnits="userSpaceOnUse" patternTransform={pattern === "stripes" ? "rotate(45)" : undefined}>
                {pattern === "stripes" && <rect width={2.6} height={7} className="washi__print" />}
                {pattern === "dots" && <circle cx={4} cy={4} r={1.5} className="washi__print" />}
                {pattern === "grid" && <path d="M0 0.5H8M0.5 0V8" className="washi__rule" />}
              </pattern>
              {/* Paper fibres: a fine noise that thins the tape here and there. */}
              <filter id={`${id}f`}>
                <feTurbulence type="fractalNoise" baseFrequency="0.9 0.25" numOctaves="2" seed={seed} result="n" />
                <feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -0.55 1.05" result="a" />
                <feComposite in="SourceGraphic" in2="a" operator="in" />
              </filter>
              <clipPath id={`${id}c`}><path d={d} /></clipPath>
            </defs>
            <g filter={`url(#${id}f)`}>
              <path d={d} className="washi__body" />
              <rect width={w} height={h} fill={`url(#${id}p)`} clipPath={`url(#${id}c)`} />
            </g>
            {/* The roll's cut edges catch a little more colour than the middle. */}
            <path d={`M0 0.6H${w}M0 ${h - 0.6}H${w}`} className="washi__edge" clipPath={`url(#${id}c)`} />
          </svg>
        )}
      </span>
    </span>
  );
}

export default WashiTape;
