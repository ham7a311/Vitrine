"use client";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import "./outline-text.css";

export type OutlineTextProps = {
  /** One string per line; each word fills on hover. */
  lines: string[];
  theme?: "light" | "dark";
  motion?: boolean;
  className?: string;
};

/**
 * Hover Outline Text
 * Big hairline lettering that fills with ink word by word as you point at it.
 * The first time it scrolls into view, the words fill and clear once in order.
 */
export function OutlineText({ lines, theme = "light", motion = true, className = "" }: OutlineTextProps) {
  const root = useRef<HTMLElement>(null);
  const [seen, setSeen] = useState(false);

  // The words fill once in sequence when the headline first comes into view.
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setSeen(true); io.disconnect(); } }, { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  let n = 0;
  return (
    <section ref={root} className={`otxt ${theme === "dark" ? "otxt--dark" : ""} ${motion ? "" : "otxt--still"} ${className}`} data-seen={seen || undefined}>
      <h2 className="otxt__words">
        {lines.map((l, i) => (
          <span key={i} className="otxt__wline">
            {l.split(" ").map((w, j) => (
              <span key={j} className="otxt__w" data-text={w} style={{ ["--i" as string]: n++ } as CSSProperties}>{w}</span>
            ))}
          </span>
        ))}
      </h2>
    </section>
  );
}
