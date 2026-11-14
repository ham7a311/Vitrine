"use client";

import { useEffect, useRef, type ButtonHTMLAttributes } from "react";
import "./weight-shift-button.css";

/**
 * Weight Shift Button
 * A quiet button whose only signal is type. The letters under the pointer grow heavier, a swell that follows
 * it along the word, and a press commits the whole label to bold for a moment. No fill, no glow: made for
 * dense interfaces where a button should not shout.
 */

type Props = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> & {
  /** The label. It is split into letters, so it must be plain text. */
  children: string;
  theme?: "light" | "dark";
  /** How wide the swell is, in pixels. */
  spread?: number;
};

/** How heavy a letter is, 0…1, when the pointer is `distance` pixels from its centre. */
export const swell = (distance: number, spread: number) => Math.exp(-((distance / spread) ** 2));

export function WeightShiftButton({ children, theme = "light", spread = 30, className = "", onPointerMove, onPointerLeave, onPointerDown, onClick, ...rest }: Props) {
  const ref = useRef<HTMLButtonElement>(null);
  const state = useRef({ x: null as number | null, held: 0, wake: () => {} });

  useEffect(() => {
    const el = ref.current!, s = state.current;
    const letters = [...el.querySelectorAll<HTMLElement>(".wshift__ch")];
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const now = letters.map(() => 0);
    let centres: number[] = [], raf = 0;
    const measure = () => {
      const left = el.getBoundingClientRect().left;
      centres = letters.map((l) => { const r = l.getBoundingClientRect(); return r.left - left + r.width / 2; });
    };
    const tick = () => {
      const committed = performance.now() < s.held;
      let moving = committed;
      letters.forEach((letter, i) => {
        const want = committed ? 1 : s.x === null ? 0 : swell(s.x - centres[i], spread);
        // Letters gain weight quickly and lose it slowly, so the swell leaves a short wake.
        now[i] = reduced ? want : now[i] + (want - now[i]) * (want > now[i] ? 0.32 : 0.12);
        if (Math.abs(want - now[i]) > 0.004) moving = true;
        letter.style.setProperty("--wshift-w", now[i].toFixed(3));
      });
      raf = moving ? requestAnimationFrame(tick) : 0;
    };
    s.wake = () => { if (!centres.length) measure(); if (!raf) raf = requestAnimationFrame(tick); };
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    document.fonts?.ready.then(measure);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, [children, spread]);

  const s = state.current;
  return (
    <button
      ref={ref}
      type="button"
      className={`wshift wshift--${theme} ${className}`}
      aria-label={children}
      onPointerMove={(e) => { s.x = e.clientX - e.currentTarget.getBoundingClientRect().left; s.wake(); onPointerMove?.(e); }}
      onPointerLeave={(e) => { s.x = null; s.wake(); onPointerLeave?.(e); }}
      onPointerDown={(e) => { s.x = e.clientX - e.currentTarget.getBoundingClientRect().left; s.wake(); onPointerDown?.(e); }}
      // The press commits: every letter goes to full weight and holds it for a moment.
      onClick={(e) => { s.held = performance.now() + 520; s.wake(); onClick?.(e); }}
      {...rest}
    >
      <span className="wshift__label" aria-hidden="true">
        {[...children].map((ch, i) => (ch === " " ? <span key={i} className="wshift__gap"> </span> : <span key={i} className="wshift__ch">{ch}</span>))}
      </span>
    </button>
  );
}

export default WeightShiftButton;
