"use client";
import { useEffect, useRef, type ElementType, type ReactNode } from "react";
import "./spotlight-text.css";

export type SpotlightTextProps = {
  as?: ElementType;
  children: ReactNode;
  theme?: "light" | "dark";
  motion?: boolean;
  className?: string;
};

/**
 * Spotlight Text
 * Muted letters with a pool of colour that follows the pointer through them.
 * When the pointer is away, the pool drifts on its own along a slow path.
 */
export function SpotlightText({ as: Tag = "span", children, theme = "light", motion = true, className = "" }: SpotlightTextProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const still = !motion || matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0, hover = false, t = 0, last = 0;
    const set = (x: number, y: number) => { el.style.setProperty("--sptx-x", `${x}%`); el.style.setProperty("--sptx-y", `${y}%`); };
    const drift = (now: number) => {
      raf = 0;
      if (hover) return;
      t += last ? Math.min(0.05, (now - last) / 1000) : 0;
      last = now;
      set(50 + 38 * Math.sin(t * 0.45), 50 + 30 * Math.sin(t * 0.7 + 1));
      raf = requestAnimationFrame(drift);
    };
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      hover = true; cancelAnimationFrame(raf); raf = 0;
      set(((e.clientX - r.left) / r.width) * 100, ((e.clientY - r.top) / r.height) * 100);
    };
    const leave = () => { hover = false; last = 0; if (!still && !raf) raf = requestAnimationFrame(drift); };
    const io = new IntersectionObserver(([en]) => { if (en.isIntersecting && !hover && !still) { if (!raf) raf = requestAnimationFrame(drift); } else { cancelAnimationFrame(raf); raf = 0; } });
    set(50, 50);
    io.observe(el);
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    return () => { cancelAnimationFrame(raf); io.disconnect(); el.removeEventListener("pointermove", move); el.removeEventListener("pointerleave", leave); };
  }, [motion]);

  return <Tag ref={ref} className={`sptx ${theme === "dark" ? "sptx--dark" : ""} ${className}`}>{children}</Tag>;
}
