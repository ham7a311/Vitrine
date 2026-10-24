"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import "./inverse-sweep.css";

/**
 * Inverse Sweep
 * A solid bar sweeps across a phrase, and the letters invert exactly where it
 * covers them — the text is printed twice, once plain and once reversed out of
 * the bar, and both share one moving edge. Point at it and the bar slides away
 * to the right; move off and it sweeps back.
 */

type Props = {
  children: ReactNode;
  /** Bar colour. */
  fill?: string;
  /** Text colour on the bar. */
  ink?: string;
  /** Wait before sweeping in (ms), to sweep several phrases in order. */
  delay?: number;
  theme?: "night" | "paper";
  className?: string;
};

export function InverseSweep({ children, fill, ink, delay = 0, theme = "night", className = "" }: Props) {
  const root = useRef<HTMLSpanElement>(null);
  const [on, setOn] = useState(false);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setOn(true); io.disconnect(); } }, { threshold: 0.9 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <span
      ref={root}
      className={`invsweep invsweep--${theme} ${className}`}
      data-on={on || undefined}
      style={{ ...(fill ? { ["--bar" as string]: fill } : null), ...(ink ? { ["--on-bar" as string]: ink } : null), ["--delay" as string]: `${delay}ms` } as CSSProperties}
    >
      <span className="invsweep__base">{children}</span>
      <span className="invsweep__bar" aria-hidden="true">{children}</span>
    </span>
  );
}

export default InverseSweep;
