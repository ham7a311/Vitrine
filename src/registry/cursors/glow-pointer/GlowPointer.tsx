"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import "./glow-pointer.css";

/**
 * Glow Pointer
 * A crisp, softly rounded arrow with a slight glow around it — light, not a
 * shape. The glow is a soft core with a long faint tail (two Gaussians,
 * tapered to exactly zero), centred on the arrow's body, so it fades into
 * the page with no edge, no ring and no disc. It moves with the arrow, never
 * behind it; a press brightens it a touch.
 */

type Props = {
  /** Glow colour (hex). */
  color?: string;
  /** Arrow fill and keyline. */
  arrow?: "dark" | "light";
  /** Glow diameter in CSS px (the profile is tuned for 200). */
  size?: number;
  motion?: "full" | "reduced";
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
};

const FIELDS = "input, textarea, select, [contenteditable='true'], [contenteditable='']";

/** The arrow: every corner rounded (tip 2, outer corners 3, notch 3). Tip apex at (3.73, 3.73). */
export const ARROW = "M5.77 3.24 L28.12 10.61 A3 3 0 0 1 28.07 16.33 L20.61 18.63 A3 3 0 0 0 18.63 20.61 L16.33 28.07 A3 3 0 0 1 10.61 28.12 L3.24 5.77 A2 2 0 0 1 5.77 3.24 Z";

/**
 * Glow strength at a distance d (px) from its centre: a soft core plus a long
 * faint tail, tapered by (1 − r⁴) so it reaches exactly zero at the radius.
 * Stops every 4% of the radius (tuned at a 100px radius; the gradient
 * stretches with `size`, so the profile scales with it).
 */
const glowStops = (color: string) => {
  const R = 100;
  const out: string[] = [];
  for (let p = 0; p <= 100; p += 4) {
    const d = (p / 100) * R;
    const a = (0.46 * Math.exp(-(d * d) / (2 * 15 * 15)) + 0.06 * Math.exp(-(d * d) / (2 * 32 * 32))) * (1 - (p / 100) ** 4);
    out.push(`color-mix(in oklab, ${color} ${Math.min(100, (a / 0.87) * 100).toFixed(2)}%, transparent) ${p}%`);
  }
  return `radial-gradient(closest-side, ${out.join(", ")})`;
};

export function GlowPointer({ color = "#3b82f6", arrow = "dark", size = 200, motion = "full", className = "", style, children }: Props) {
  const hostRef = useRef<HTMLDivElement>(null);
  const layerRef = useRef<HTMLDivElement>(null);
  const arrowRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current, layer = layerRef.current, arr = arrowRef.current, glow = glowRef.current;
    if (!host || !layer || !arr || !glow) return;
    if (!matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    host.dataset.live = "";

    // Arrow and glow move together in the same write: the glow never trails.
    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      const r = host.getBoundingClientRect();
      const s = r.width / host.offsetWidth || 1;
      const t = `translate3d(${(e.clientX - r.left) / s}px, ${(e.clientY - r.top) / s}px, 0)`;
      arr.style.transform = t;
      glow.style.transform = t;
      const field = e.target instanceof Element && e.target.closest(FIELDS);
      if (field) delete layer.dataset.in;
      else layer.dataset.in = "";
    };
    const onLeave = () => {
      delete layer.dataset.in;
      delete layer.dataset.down;
    };
    const onDown = (e: PointerEvent) => { if (e.button === 0) layer.dataset.down = ""; };
    const onUp = () => { delete layer.dataset.down; };

    host.addEventListener("pointermove", onMove, { passive: true });
    host.addEventListener("pointerleave", onLeave);
    host.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    return () => {
      delete host.dataset.live;
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerleave", onLeave);
      host.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
    };
  }, []);

  return (
    <div
      ref={hostRef}
      className={`gp gp--${arrow} ${className}`}
      data-motion={motion}
      style={{ ...style, ["--gp-size" as string]: `${size}px`, ["--gp-glow" as string]: glowStops(color) }}
    >
      {children}
      <div ref={layerRef} className="gp__layer" aria-hidden="true">
        <div ref={glowRef} className="gp__glow">
          <span />
        </div>
        <div ref={arrowRef} className="gp__arrow">
          <svg viewBox="0 0 32 32" width="32" height="32">
            <path d={ARROW} />
          </svg>
        </div>
      </div>
    </div>
  );
}
