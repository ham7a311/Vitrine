"use client";

import { useRef, type ButtonHTMLAttributes, type PointerEvent, type ReactNode } from "react";
import "./glass-slab-button.css";

/**
 * Glass Slab Button
 * A button made like a thick glass tile: a dark face with a bevel that catches light. The bright
 * line on the rim turns to face the pointer, a soft beam slides through the glass as you cross
 * it, and pressing sinks the slab into its frame.
 */

type Props = ButtonHTMLAttributes<HTMLButtonElement> & { children: ReactNode; glow?: string };

export function GlassSlabButton({ children, glow = "#c25cff", className = "", style, onPointerMove, ...rest }: Props) {
  const ref = useRef<HTMLButtonElement>(null);
  const move = (e: PointerEvent<HTMLButtonElement>) => {
    const b = ref.current;
    if (b) {
      const r = b.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
      // the rim light faces the pointer: an angle from the centre, as conic-gradient measures it
      b.style.setProperty("--a", `${(Math.atan2(y - 0.5, x - 0.5) * 180) / Math.PI + 90}deg`);
      b.style.setProperty("--x", `${(x * 100).toFixed(1)}%`);
    }
    onPointerMove?.(e);
  };
  return (
    <button ref={ref} type="button" className={`gsb ${className}`} style={{ ["--g" as string]: glow, ...style }} onPointerMove={move} {...rest}>
      <span className="gsb__beam" aria-hidden="true" />
      <span className="gsb__label">{children}</span>
    </button>
  );
}
