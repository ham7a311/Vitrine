"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import "./spotlight-grid.css";

/**
 * Spotlight Grid
 * A faint dot grid on black. A second, brighter grid is revealed through a
 * soft circular mask that eases after the cursor — like sweeping a torch
 * across graph paper. The loop stops the moment the light has settled.
 */

type Props = {
  /** Colour of the lit dots. */
  accent?: string;
  /** Grid spacing in px. */
  gap?: number;
  /** Spotlight radius in px. */
  radius?: number;
  className?: string;
  children?: ReactNode;
};

const LERP = 0.15;
const OPACITY_LERP = 0.12;

export function SpotlightGrid({ accent = "#86efac", gap = 28, radius = 450, className = "", children }: Props) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const grid = gridRef.current;
    if (!section || !grid) return;
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduced) return;

    let tx = 0, ty = 0, cx = 0, cy = 0, to = 0, co = 0;
    let raf: number | null = null;

    const tick = () => {
      cx += (tx - cx) * LERP;
      cy += (ty - cy) * LERP;
      co += (to - co) * OPACITY_LERP;
      grid.style.setProperty("--spotlight-grid-x", `${cx}px`);
      grid.style.setProperty("--spotlight-grid-y", `${cy}px`);
      grid.style.setProperty("--spotlight-grid-o", String(co));
      const settled = Math.abs(tx - cx) < 0.5 && Math.abs(ty - cy) < 0.5 && Math.abs(to - co) < 0.008 && to === 0;
      raf = settled ? null : requestAnimationFrame(tick);
    };
    const start = () => {
      if (raf === null) raf = requestAnimationFrame(tick);
    };
    const onMove = (e: PointerEvent) => {
      const r = section.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      if (x < 0 || y < 0 || x > r.width || y > r.height) {
        to = 0;
      } else {
        // first entry: jump to the pointer so the light doesn't sweep in from the corner
        if (co < 0.01) {
          cx = x;
          cy = y;
        }
        tx = x;
        ty = y;
        to = 1;
      }
      start();
    };
    const onLeave = () => {
      to = 0;
      start();
    };
    section.addEventListener("pointermove", onMove);
    section.addEventListener("pointerleave", onLeave);
    return () => {
      section.removeEventListener("pointermove", onMove);
      section.removeEventListener("pointerleave", onLeave);
      if (raf !== null) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={sectionRef}
      className={`spotlight-grid ${className}`}
      style={{ "--spotlight-grid-accent": accent, "--spotlight-grid-gap": `${gap}px`, "--spotlight-grid-radius": `${radius}px` } as CSSProperties}
    >
      <div ref={gridRef} className="spotlight-grid__grid" aria-hidden="true" />
      {children && <div className="spotlight-grid__content">{children}</div>}
    </div>
  );
}
