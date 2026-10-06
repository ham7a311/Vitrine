"use client";
import { useEffect, useRef, type CSSProperties } from "react";
import "./echo-outline-text.css";

export type EchoOutlineTextProps = {
  /** The word (or short phrase) to echo. */
  text: string;
  theme?: "light" | "dark";
  motion?: boolean;
  className?: string;
};

const ECHOES = 5;

/**
 * Echo Outline Text
 * One huge solid word with five hairline copies stacked behind it. The copies
 * lean away from the pointer, and sway slowly on their own when it's away.
 */
export function EchoOutlineText({ text, theme = "light", motion = true, className = "" }: EchoOutlineTextProps) {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const still = !motion || matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0, hover = false, t = 0, last = 0;
    const set = (x: number, y: number) => { el.style.setProperty("--eotx-dx", `${x.toFixed(2)}px`); el.style.setProperty("--eotx-dy", `${y.toFixed(2)}px`); };
    const sway = (now: number) => {
      raf = 0;
      if (hover) return;
      t += last ? Math.min(0.05, (now - last) / 1000) : 0;
      last = now;
      set(6 + 3 * Math.sin(t * 0.8), 6 + 3 * Math.cos(t * 0.6));
      raf = requestAnimationFrame(sway);
    };
    const move = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const r = el.getBoundingClientRect();
      const nx = (e.clientX - r.left) / r.width - 0.5, ny = (e.clientY - r.top) / r.height - 0.5;
      hover = true; cancelAnimationFrame(raf); raf = 0;
      // Away from the pointer, further the closer it is to the edge.
      set(-nx * 26, -ny * 26);
    };
    const leave = () => { hover = false; last = 0; if (!still) { if (!raf) raf = requestAnimationFrame(sway); } else set(6, 6); };
    const io = new IntersectionObserver(([en]) => { if (en.isIntersecting && !still && !hover) { if (!raf) raf = requestAnimationFrame(sway); } else { cancelAnimationFrame(raf); raf = 0; } });
    set(6, 6);
    io.observe(el);
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    return () => { cancelAnimationFrame(raf); io.disconnect(); el.removeEventListener("pointermove", move); el.removeEventListener("pointerleave", leave); };
  }, [motion]);

  return (
    <section ref={root} className={`eotx ${theme === "dark" ? "eotx--dark" : ""} ${className}`} aria-label={text}>
      <div className="eotx__echo" aria-hidden="true">
        {Array.from({ length: ECHOES }, (_, k) => (
          <span key={k} className="eotx__ghost" style={{ ["--k" as string]: ECHOES - k } as CSSProperties}>{text}</span>
        ))}
        <span className="eotx__front">{text}</span>
      </div>
    </section>
  );
}
