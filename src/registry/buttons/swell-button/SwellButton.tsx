"use client";

import { useRef, type ButtonHTMLAttributes, type CSSProperties, type MouseEvent, type PointerEvent } from "react";
import "./swell-button.css";

/**
 * Swell Button
 * The label moves like water. Come onto it and the letter under your cursor
 * lifts first, its neighbours a moment later, so a swell runs outward both
 * ways along the word. Click and a bigger wave crosses the whole thing from
 * where you pressed.
 */

type Props = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> & {
  children: string;
  theme?: "paper" | "night";
  motion?: "full" | "reduced";
};

export function SwellButton({ children, theme = "night", motion = "full", className = "", onPointerEnter, onClick, onFocus, ...rest }: Props) {
  const ref = useRef<HTMLButtonElement>(null);
  const letters = Array.from(children);

  /** Restart the wave from letter `from`; each letter waits in proportion to its distance. */
  const swell = (from: number, big = false) => {
    const el = ref.current!;
    el.querySelectorAll<HTMLElement>(".swb__ch").forEach((c, i) => c.style.setProperty("--d", `${Math.abs(i - from) * 38}ms`));
    el.removeAttribute("data-wave");
    void el.offsetWidth; // let the animation start again
    el.setAttribute("data-wave", big ? "big" : "small");
  };
  const nearest = (x: number) => {
    const chars = ref.current!.querySelectorAll<HTMLElement>(".swb__ch");
    let best = 0, dist = Infinity;
    chars.forEach((c, i) => { const r = c.getBoundingClientRect(); const d = Math.abs(r.left + r.width / 2 - x); if (d < dist) { dist = d; best = i; } });
    return best;
  };

  return (
    <button
      ref={ref}
      type="button"
      className={`swb swb--${theme} ${className}`}
      data-motion={motion}
      aria-label={children}
      onPointerEnter={(e: PointerEvent<HTMLButtonElement>) => { swell(nearest(e.clientX)); onPointerEnter?.(e); }}
      onFocus={(e) => { if (!ref.current!.matches(":hover")) swell(Math.floor(letters.length / 2)); onFocus?.(e); }}
      onClick={(e: MouseEvent<HTMLButtonElement>) => { swell(e.detail ? nearest(e.clientX) : Math.floor(letters.length / 2), true); onClick?.(e); }}
      {...rest}
    >
      <span className="swb__word" aria-hidden="true">
        {letters.map((c, i) => (
          <span key={i} className="swb__ch" style={{ "--i": i } as CSSProperties}>{c === " " ? " " : c}</span>
        ))}
      </span>
    </button>
  );
}
