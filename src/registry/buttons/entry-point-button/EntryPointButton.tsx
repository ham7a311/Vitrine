"use client";

import { useRef, type ButtonHTMLAttributes, type MouseEvent } from "react";
import "./entry-point-button.css";

/**
 * Entry Point
 * The fill is a circle clip that opens from the exact point where the pointer
 * crossed the edge, and closes toward the point where it leaves. The label is
 * rendered twice — once on the face, once inside the fill — so the letters
 * invert precisely along the growing circle.
 */

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: string;
  tone?: "lilac" | "frost" | "ember";
};

export function EntryPointButton({ children, tone = "lilac", className = "", onMouseEnter, onMouseLeave, onFocus, onBlur, ...rest }: Props) {
  const ref = useRef<HTMLButtonElement>(null);

  const at = (e: MouseEvent<HTMLButtonElement> | null) => {
    const el = ref.current!;
    if (!e) {
      el.style.setProperty("--ex", "50%");
      el.style.setProperty("--ey", "50%");
      return;
    }
    const r = el.getBoundingClientRect();
    el.style.setProperty("--ex", `${(((e.clientX - r.left) / r.width) * 100).toFixed(1)}%`);
    el.style.setProperty("--ey", `${(((e.clientY - r.top) / r.height) * 100).toFixed(1)}%`);
  };

  return (
    <button
      ref={ref}
      type="button"
      className={`entry-point-button entry-point-button--${tone} ${className}`}
      onMouseEnter={(e) => { at(e); ref.current!.dataset.on = ""; onMouseEnter?.(e); }}
      onMouseLeave={(e) => { at(e); delete ref.current!.dataset.on; onMouseLeave?.(e); }}
      onFocus={(e) => { if (!ref.current!.matches(":hover")) at(null); ref.current!.dataset.on = ""; onFocus?.(e); }}
      onBlur={(e) => { if (!ref.current!.matches(":hover")) delete ref.current!.dataset.on; onBlur?.(e); }}
      {...rest}
    >
      <span className="entry-point-button__label">{children}</span>
      <span className="entry-point-button__fill" aria-hidden="true">
        <span className="entry-point-button__label">{children}</span>
      </span>
    </button>
  );
}
