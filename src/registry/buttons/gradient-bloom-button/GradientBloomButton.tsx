"use client";

import { useRef, type ButtonHTMLAttributes, type PointerEvent } from "react";
import "./gradient-bloom-button.css";

/**
 * Gradient Bloom Button
 * At rest, a hairline of slowly turning gradient. Cross the edge and that
 * gradient blooms into the button from the exact point you came in, a circle
 * opening across the face; leave and it drains toward where you went out.
 * The label is printed twice, so it inverts precisely along the circle.
 */

type Props = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> & {
  children: string;
  theme?: "paper" | "night";
  motion?: "full" | "reduced";
};

export function GradientBloomButton({ children, theme = "night", motion = "full", className = "", onPointerEnter, onPointerLeave, onPointerDown, onFocus, onBlur, ...rest }: Props) {
  const ref = useRef<HTMLButtonElement>(null);

  const at = (e: PointerEvent<HTMLButtonElement> | null) => {
    const el = ref.current!;
    if (!e) { el.style.setProperty("--ex", "50%"); el.style.setProperty("--ey", "50%"); return; }
    const r = el.getBoundingClientRect();
    el.style.setProperty("--ex", `${(((e.clientX - r.left) / r.width) * 100).toFixed(1)}%`);
    el.style.setProperty("--ey", `${(((e.clientY - r.top) / r.height) * 100).toFixed(1)}%`);
  };
  const on = () => (ref.current!.dataset.on = "");
  const off = () => delete ref.current!.dataset.on;

  return (
    <button
      ref={ref}
      type="button"
      className={`gbb gbb--${theme} ${className}`}
      data-motion={motion}
      onPointerEnter={(e) => { if (e.pointerType === "mouse") { at(e); on(); } onPointerEnter?.(e); }}
      onPointerLeave={(e) => { if (e.pointerType === "mouse") { at(e); if (document.activeElement !== ref.current) off(); } onPointerLeave?.(e); }}
      onPointerDown={(e) => { if (e.pointerType !== "mouse") { at(e); on(); setTimeout(off, 700); } onPointerDown?.(e); }}
      onFocus={(e) => { if (!ref.current!.matches(":hover")) at(null); on(); onFocus?.(e); }}
      onBlur={(e) => { if (!ref.current!.matches(":hover")) off(); onBlur?.(e); }}
      {...rest}
    >
      <span className="gbb__ring" aria-hidden="true" />
      <span className="gbb__label">{children}</span>
      <span className="gbb__bloom" aria-hidden="true">
        <span className="gbb__label">{children}</span>
      </span>
    </button>
  );
}
