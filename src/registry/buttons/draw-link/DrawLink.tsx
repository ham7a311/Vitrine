"use client";

import { useRef, type AnchorHTMLAttributes, type MouseEvent } from "react";
import "./draw-link.css";

/**
 * Draw Link
 * The underline is a scaled line whose transform-origin is set by where the
 * pointer enters: arriving from the left, it grows rightward from the left;
 * leaving, it shrinks toward the exit side — so the stroke always travels
 * through the word instead of just appearing and disappearing.
 */

type Props = AnchorHTMLAttributes<HTMLAnchorElement> & { arrow?: boolean };

export function DrawLink({ children, arrow = true, className = "", onMouseEnter, onMouseLeave, ...rest }: Props) {
  const ref = useRef<HTMLAnchorElement>(null);
  const side = (e: MouseEvent<HTMLAnchorElement>) => {
    const r = ref.current!.getBoundingClientRect();
    return e.clientX < r.left + r.width / 2 ? "left" : "right";
  };
  return (
    <a
      ref={ref}
      className={`draw-link ${className}`}
      onMouseEnter={(e) => { ref.current!.dataset.from = side(e); ref.current!.dataset.on = ""; onMouseEnter?.(e); }}
      onMouseLeave={(e) => { ref.current!.dataset.from = side(e); delete ref.current!.dataset.on; onMouseLeave?.(e); }}
      {...rest}
    >
      <span className="draw-link__text">{children}</span>
      {arrow && (
        <svg className="draw-link__arrow" viewBox="0 0 16 16" aria-hidden="true"><path d="M4.5 11.5l7-7M6 4.5h5.5V10" /></svg>
      )}
    </a>
  );
}
