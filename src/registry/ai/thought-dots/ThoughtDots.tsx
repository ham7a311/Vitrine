"use client";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import "./thought-dots.css";

/**
 * Thought Dots
 * The small "it's thinking" mark beside an assistant's reply, in six designs that each move a different
 * way: dots orbiting on a tilted ring with depth, a chase that bunches and spreads, a wave that squashes
 * as it lands, a ring that gathers in and lets go, two dots swinging past each other, and a spiral that
 * unwinds. Pure CSS; it stops when it's off screen and holds a still pose with reduced motion.
 */

export type ThoughtDesign = "orbit" | "chase" | "wave" | "gather" | "pendulum" | "spiral";

export const THOUGHT_DESIGNS: { id: ThoughtDesign; name: string }[] = [
  { id: "orbit", name: "Orbit" },
  { id: "chase", name: "Chase" },
  { id: "wave", name: "Wave" },
  { id: "gather", name: "Gather" },
  { id: "pendulum", name: "Pendulum" },
  { id: "spiral", name: "Spiral" },
];

const COUNT: Record<ThoughtDesign, number> = { orbit: 3, chase: 8, wave: 3, gather: 6, pendulum: 2, spiral: 7 };

export type ThoughtDotsProps = {
  design?: ThoughtDesign;
  /** The words beside the dots; also what's announced. Pass "" for the dots alone. */
  label?: string;
  /** Show seconds since it started thinking. */
  elapsed?: boolean;
  /** Dot colour; defaults to the text colour. */
  color?: string;
  theme?: "dark" | "light";
  className?: string;
};

export function ThoughtDots({ design = "orbit", label = "Thinking", elapsed = false, color, theme = "dark", className = "" }: ThoughtDotsProps) {
  const root = useRef<HTMLSpanElement>(null);
  const [paused, setPaused] = useState(false);
  const [secs, setSecs] = useState(0);

  /* Nothing moves where nobody can see it. */
  useEffect(() => {
    const el = root.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    let onScreen = true;
    const sync = () => setPaused(!onScreen || document.hidden);
    const io = new IntersectionObserver(([e]) => { onScreen = e.isIntersecting; sync(); });
    io.observe(el);
    document.addEventListener("visibilitychange", sync);
    return () => { io.disconnect(); document.removeEventListener("visibilitychange", sync); };
  }, []);

  useEffect(() => {
    if (!elapsed) return;
    const t0 = Date.now();
    const id = window.setInterval(() => setSecs(Math.floor((Date.now() - t0) / 1000)), 1000);
    return () => window.clearInterval(id);
  }, [elapsed]);

  const n = COUNT[design];
  return (
    <span
      ref={root}
      className={`thdt thdt--${theme} ${className}`}
      data-design={design}
      data-paused={paused || undefined}
      style={color ? ({ ["--thdt-dot" as string]: color } as CSSProperties) : undefined}
      role="status"
      aria-label={label || "Thinking"}
    >
      <span className="thdt__glyph" aria-hidden="true">
        {Array.from({ length: n }, (_, i) => (
          <i key={i} style={{ ["--i" as string]: i, ["--n" as string]: n } as CSSProperties} />
        ))}
      </span>
      {label && (
        <span className="thdt__label" aria-hidden="true">
          {label}
          {elapsed && <span className="thdt__secs"> · {secs}s</span>}
        </span>
      )}
    </span>
  );
}
