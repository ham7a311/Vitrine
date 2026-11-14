"use client";

import type { ButtonHTMLAttributes, CSSProperties, ReactNode } from "react";
import "./edge-lit-button.css";

/**
 * Edge-Lit Button
 * A slab of dark acrylic with an engraved label, lit the way engraved signs are: light enters through the
 * edge and only the engraving catches it. The edge nearest the pointer lights up, and the letters brighten
 * as the light reaches them. Keyboard focus lights the whole edge.
 */

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  children?: ReactNode;
  /** The colour of the light. */
  light?: "ice" | "amber" | "rose";
  size?: "md" | "lg";
};

export function EdgeLitButton({ children, light = "ice", size = "md", className = "", style, onPointerMove, onPointerDown, ...rest }: Props) {
  const place = (el: HTMLElement, x: number, y: number) => {
    const r = el.getBoundingClientRect();
    el.style.setProperty("--edgelit-x", `${x - r.left}px`);
    el.style.setProperty("--edgelit-y", `${y - r.top}px`);
  };
  return (
    <button
      type="button"
      className={`edgelit edgelit--${light} edgelit--${size} ${className}`}
      style={style as CSSProperties}
      onPointerMove={(e) => { place(e.currentTarget, e.clientX, e.clientY); onPointerMove?.(e); }}
      // A touch has no hover: put the light where the finger lands.
      onPointerDown={(e) => { place(e.currentTarget, e.clientX, e.clientY); onPointerDown?.(e); }}
      {...rest}
    >
      <span className="edgelit__edge" aria-hidden="true" />
      <span className="edgelit__label">{children}</span>
    </button>
  );
}

export default EdgeLitButton;
