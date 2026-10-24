"use client";

import { useEffect, useId, useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import "./riso-mark.css";

/**
 * Riso Mark
 * A highlight printed the way a risograph prints: a flat fluorescent pink with
 * a blue halftone screen over it, not quite in register, so a third colour
 * appears wherever the dots land on pink, with the speckle of ink that didn't take.
 * The two passes slide into their (slightly off) registration as the word
 * comes into view; the word itself carries a faint pink misprint.
 */

type Props = {
  children: ReactNode;
  /** First ink. */
  first?: string;
  /** Second ink. */
  second?: string;
  /** Wait before printing (ms). */
  delay?: number;
  theme?: "paper" | "night";
  className?: string;
};

export function RisoMark({ children, first, second, delay = 200, theme = "paper", className = "" }: Props) {
  const id = useId().replace(/[^a-zA-Z0-9]/g, "");
  const root = useRef<HTMLSpanElement>(null);
  const plate = useRef<HTMLSpanElement>(null);
  const [size, setSize] = useState<[number, number] | null>(null);
  const [on, setOn] = useState(false);

  useLayoutEffect(() => {
    const el = plate.current;
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
  return (
    <span
      ref={root}
      className={`riso riso--${theme} ${className}`}
      data-on={on || undefined}
      style={{ ...(first ? { ["--ink-a" as string]: first } : null), ...(second ? { ["--ink-b" as string]: second } : null), ["--delay" as string]: `${delay}ms` } as CSSProperties}
    >
      <span ref={plate} className="riso__plate" aria-hidden="true">
        {w > 0 && (
          <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
            <defs>
              {/* The second ink is a coarse halftone screen at a riso screen angle. */}
              <pattern id={`${id}d`} width={5} height={5} patternUnits="userSpaceOnUse" patternTransform="rotate(18)">
                <circle className="riso__dot" cx={2.5} cy={2.5} r={1.45} />
              </pattern>
              {/* Ink that didn't take: a fine noise thresholded into tiny bare specks. */}
              <filter id={`${id}g`} x="0" y="0" width="100%" height="100%">
                <feTurbulence type="fractalNoise" baseFrequency="1.1" numOctaves="1" seed="3" result="n" />
                <feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -9 6.2" result="m" />
                <feComposite in="SourceGraphic" in2="m" operator="in" />
              </filter>
            </defs>
            <g className="riso__pass riso__pass--a" filter={`url(#${id}g)`}><rect width={w} height={h} rx={1.5} /></g>
            <g className="riso__pass riso__pass--b" filter={`url(#${id}g)`}><rect width={w} height={h} rx={1.5} fill={`url(#${id}d)`} /></g>
          </svg>
        )}
      </span>
      <span className="riso__word">{children}</span>
    </span>
  );
}

export default RisoMark;
