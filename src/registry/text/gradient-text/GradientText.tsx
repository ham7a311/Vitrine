"use client";
import { useEffect, useRef, type ElementType, type ReactNode } from "react";
import "./gradient-text.css";

export type GradientTextProps = {
  /** aurora: slow flowing colour; shine: metal with a passing light; spotlight: colour follows the pointer. */
  effect?: "aurora" | "shine" | "spotlight";
  as?: ElementType;
  children: ReactNode;
  theme?: "light" | "dark";
  motion?: boolean;
  className?: string;
};

/**
 * Gradient Text
 * Real, selectable text filled with colour: an aurora that flows slowly
 * through the letters, brushed metal with a light passing over it, or a
 * spotlight of colour that follows the pointer over muted letters.
 */
export function GradientText({ effect = "aurora", as: Tag = "span", children, theme = "light", motion = true, className = "" }: GradientTextProps) {
  const ref = useRef<HTMLElement>(null);

  // Spotlight: track the pointer over the text; drift on its own when it's away.
  useEffect(() => {
    const el = ref.current;
    if (!el || effect !== "spotlight") return;
    const still = !motion || matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0, hover = false, t = 0, last = 0;
    const set = (x: number, y: number) => { el.style.setProperty("--grdt-x", `${x}%`); el.style.setProperty("--grdt-y", `${y}%`); };
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
  }, [effect, motion]);

  return (
    <Tag ref={ref} className={`grdt grdt--${effect} ${theme === "dark" ? "grdt--dark" : ""} ${motion ? "" : "grdt--still"} ${className}`}>
      {children}
    </Tag>
  );
}
