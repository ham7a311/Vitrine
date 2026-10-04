"use client";

import { useEffect, useRef } from "react";
import "./chrome-text.css";

/**
 * Chrome Type
 * A word in polished metal, the way album covers did it: a sky in the top
 * of every letter, a hard dark horizon, warm ground reflected below, a
 * bevelled edge and a thin line of light along the top. Every few seconds a
 * glint runs across it and a star flares where it peaks. Move the pointer
 * and the word tilts toward you while the reflections slide inside it, as
 * if the room were moving.
 */

type Props = {
  text: string;
  tagline?: string;
  finish?: "chrome" | "gold" | "rose";
  motion?: "full" | "reduced";
  className?: string;
};

export function ChromeText({ text, tagline, finish = "chrome", motion = "full", className = "" }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const rm = matchMedia("(prefers-reduced-motion: reduce)");
    if (motion === "reduced" || rm.matches) return;
    // Pointer position only sets two custom properties; CSS transitions do the easing, so there is no loop.
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const x = Math.max(-1, Math.min(1, ((e.clientX - r.left) / r.width) * 2 - 1));
      const y = Math.max(-1, Math.min(1, ((e.clientY - r.top) / r.height) * 2 - 1));
      el.style.setProperty("--mx", x.toFixed(3));
      el.style.setProperty("--my", y.toFixed(3));
    };
    const onLeave = () => { el.style.setProperty("--mx", "0"); el.style.setProperty("--my", "0"); };
    el.addEventListener("pointermove", onMove, { passive: true });
    el.addEventListener("pointerleave", onLeave);
    return () => { el.removeEventListener("pointermove", onMove); el.removeEventListener("pointerleave", onLeave); };
  }, [motion]);

  return (
    <div ref={ref} className={`ch ch--${finish} ${className}`} data-motion={motion}>
      <div className="ch__stage">
        <h2 className="ch__word" aria-label={text}>
          {/* Bevel and depth, behind. */}
          <span className="ch__layer ch__depth" aria-hidden="true">{text}</span>
          {/* The metal itself. */}
          <span className="ch__layer ch__metal" aria-hidden="true">{text}</span>
          {/* A line of light along the top edges. */}
          <span className="ch__layer ch__rim" aria-hidden="true">{text}</span>
          {/* The glint that runs across every few seconds. */}
          <span className="ch__layer ch__glint" aria-hidden="true">{text}</span>
          <svg className="ch__star" viewBox="0 0 40 40" aria-hidden="true">
            <path d="M20 0 C21 14 26 19 40 20 C26 21 21 26 20 40 C19 26 14 21 0 20 C14 19 19 14 20 0Z" />
          </svg>
        </h2>
        {/* Its reflection on the floor. */}
        <div className="ch__floor" aria-hidden="true">
          <span className="ch__layer ch__metal">{text}</span>
        </div>
      </div>
      {tagline && <p className="ch__tag">{tagline}</p>}
    </div>
  );
}
