"use client";

import { useEffect, useRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import "./soft-body-button.css";

/**
 * Soft-Body Button
 * The pill is a soft body. Press it and it dents where you pressed and bulges out on the other sides, as
 * something filled would; let go and it springs back with a wobble that settles. Nothing moves at rest.
 */

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  children?: ReactNode;
  tone?: "tangerine" | "mint" | "ink";
  /** How far it gives, 0 to 2. */
  softness?: number;
};

/** The pill's outline with each side pushed out (or in) by a number of pixels: top, right, bottom, left. */
export function body(w: number, h: number, [t, r, b, l]: number[]) {
  const R = h / 2, k = (4 / 3) * R;
  return `M${R} 0Q${w / 2} ${-2 * t} ${w - R} 0C${w - R + k + (4 / 3) * r} 0 ${w - R + k + (4 / 3) * r} ${h} ${w - R} ${h}Q${w / 2} ${h + 2 * b} ${R} ${h}C${R - k - (4 / 3) * l} ${h} ${R - k - (4 / 3) * l} 0 ${R} 0Z`;
}

/** Where each side wants to be while pressed at (u, v), each −1…1: the near side dents, the far sides bulge. */
export function pressed(u: number, v: number, give: number) {
  return [give * (0.2 + 0.75 * v), give * (0.2 - 0.75 * u), give * (0.2 - 0.75 * v), give * (0.2 + 0.75 * u)];
}

export function SoftBodyButton({ children, tone = "tangerine", softness = 1, className = "", onPointerDown, onPointerUp, onPointerLeave, onKeyDown, onKeyUp, onBlur, ...rest }: Props) {
  const ref = useRef<HTMLButtonElement>(null);
  const path = useRef<SVGPathElement>(null);
  const shine = useRef<SVGPathElement>(null);
  const press = useRef<(at: [number, number] | null) => void>(() => {});

  useEffect(() => {
    const el = ref.current!;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let w = el.offsetWidth, h = el.offsetHeight, raf = 0;
    const at = [0, 0, 0, 0], vel = [0, 0, 0, 0];
    let target = [0, 0, 0, 0];
    const paint = () => {
      const d = body(w, h, at);
      path.current?.setAttribute("d", d);
      shine.current?.setAttribute("d", d);
    };
    // Four springs, one per side: stiff enough to snap back, loose enough to wobble twice on the way.
    const tick = () => {
      let energy = 0;
      for (let i = 0; i < 4; i++) {
        vel[i] = (vel[i] + (target[i] - at[i]) * 0.2) * 0.8;
        at[i] += vel[i];
        energy += Math.abs(vel[i]) + Math.abs(target[i] - at[i]);
      }
      paint();
      raf = energy > 0.02 ? requestAnimationFrame(tick) : 0;
    };
    press.current = (point) => {
      const give = Math.min(h * 0.16, 10) * softness;
      target = point ? pressed(point[0], point[1], give) : [0, 0, 0, 0];
      if (reduced) { for (let i = 0; i < 4; i++) at[i] = target[i] * 0.5; return paint(); }
      if (!raf) raf = requestAnimationFrame(tick);
    };
    const ro = new ResizeObserver(() => { w = el.offsetWidth; h = el.offsetHeight; paint(); });
    ro.observe(el);
    paint();
    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, [softness]);

  return (
    <button
      ref={ref}
      type="button"
      className={`softb softb--${tone} ${className}`}
      onPointerDown={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        press.current([((e.clientX - r.left) / r.width) * 2 - 1, ((e.clientY - r.top) / r.height) * 2 - 1]);
        onPointerDown?.(e);
      }}
      onPointerUp={(e) => { press.current(null); onPointerUp?.(e); }}
      onPointerLeave={(e) => { press.current(null); onPointerLeave?.(e); }}
      // From the keyboard the press lands in the middle, so every side bulges a little.
      onKeyDown={(e) => { if ((e.key === " " || e.key === "Enter") && !e.repeat) press.current([0, 0]); onKeyDown?.(e); }}
      onKeyUp={(e) => { press.current(null); onKeyUp?.(e); }}
      onBlur={(e) => { press.current(null); onBlur?.(e); }}
      {...rest}
    >
      <svg className="softb__body" aria-hidden="true">
        <path ref={path} className="softb__fill" />
        <path ref={shine} className="softb__shine" />
      </svg>
      <span className="softb__label">{children}</span>
    </button>
  );
}

export default SoftBodyButton;
