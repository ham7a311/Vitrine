"use client";

import { useEffect, useRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import "./magnetic-button.css";

/**
 * Magnetic Button
 * A button with a pull. As the pointer comes near, the pill leans toward it and the label leans
 * further, a soft light gathers where you are, and when you leave it springs back with a
 * little overshoot, like something on an elastic.
 */

type Props = ButtonHTMLAttributes<HTMLButtonElement> & { children: ReactNode; strength?: number; radius?: number; motion?: "full" | "reduced" };

export function MagneticButton({ children, strength = 0.32, radius = 140, motion = "full", className = "", ...rest }: Props) {
  const ref = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const b = ref.current;
    if (!b) return;
    if (motion === "reduced" || matchMedia("(prefers-reduced-motion: reduce)").matches || !matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const s = { x: 0, y: 0, vx: 0, vy: 0, tx: 0, ty: 0, raf: 0 };
    const tick = () => {
      s.raf = 0;
      // a spring, so the release overshoots a touch
      s.vx = (s.vx + (s.tx - s.x) * 0.16) * 0.74;
      s.vy = (s.vy + (s.ty - s.y) * 0.16) * 0.74;
      s.x += s.vx;
      s.y += s.vy;
      b.style.setProperty("--mx", `${s.x.toFixed(2)}px`);
      b.style.setProperty("--my", `${s.y.toFixed(2)}px`);
      if (Math.abs(s.tx - s.x) + Math.abs(s.ty - s.y) + Math.abs(s.vx) + Math.abs(s.vy) > 0.05) s.raf = requestAnimationFrame(tick);
    };
    const wake = () => !s.raf && (s.raf = requestAnimationFrame(tick));
    const onMove = (e: PointerEvent) => {
      const r = b.getBoundingClientRect();
      const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
      const dx = e.clientX - cx, dy = e.clientY - cy;
      const d = Math.hypot(dx, dy);
      const reach = radius + Math.max(r.width, r.height) / 2;
      const k = d < reach ? (1 - d / reach) ** 0.6 : 0;
      s.tx = dx * strength * k;
      s.ty = dy * strength * k;
      b.style.setProperty("--lx", `${((e.clientX - r.left) / r.width) * 100}%`);
      b.style.setProperty("--ly", `${((e.clientY - r.top) / r.height) * 100}%`);
      b.style.setProperty("--near", k.toFixed(3));
      wake();
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      cancelAnimationFrame(s.raf);
      window.removeEventListener("pointermove", onMove);
    };
  }, [strength, radius, motion]);
  return (
    <button ref={ref} type="button" className={`mgb ${className}`} {...rest}>
      <span className="mgb__glow" aria-hidden="true" />
      <span className="mgb__label">{children}</span>
    </button>
  );
}
