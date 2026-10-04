"use client";

import { useRef, type AnchorHTMLAttributes, type PointerEvent } from "react";
import "./entry-point-card.css";

/**
 * Entry Point Card
 * A case-study card whose colour blooms from the exact point your cursor
 * crossed its edge, and drains toward the point where you leave. Everything
 * on it is printed twice — once on the card, once inside the colour — so the
 * words invert exactly along the edge of the circle as it passes over them.
 */

type Props = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "children"> & {
  client: string;
  year: string;
  title: string;
  summary: string;
  /** A headline result, e.g. { value: "+38%", label: "bookings in 3 months" }. */
  result?: { value: string; label: string };
  tags?: string[];
  theme?: "paper" | "night";
  motion?: "full" | "reduced";
};

export function EntryPointCard({ client, year, title, summary, result, tags = [], theme = "paper", motion = "full", className = "", onPointerEnter, onPointerLeave, onPointerDown, onFocus, onBlur, ...rest }: Props) {
  const ref = useRef<HTMLAnchorElement>(null);

  const at = (e: PointerEvent<HTMLAnchorElement> | null) => {
    const el = ref.current!;
    if (!e) { el.style.setProperty("--ex", "50%"); el.style.setProperty("--ey", "50%"); return; }
    const r = el.getBoundingClientRect();
    el.style.setProperty("--ex", `${(((e.clientX - r.left) / r.width) * 100).toFixed(1)}%`);
    el.style.setProperty("--ey", `${(((e.clientY - r.top) / r.height) * 100).toFixed(1)}%`);
  };
  const on = () => (ref.current!.dataset.on = "");
  const off = () => delete ref.current!.dataset.on;

  const face = (
    <>
      <span className="epc__top">
        <span className="epc__client">{client}</span>
        <span className="epc__year">{year}</span>
      </span>
      <span className="epc__title">{title}</span>
      <span className="epc__summary">{summary}</span>
      <span className="epc__foot">
        {result && (
          <span className="epc__result">
            <span className="epc__value">{result.value}</span>
            <span className="epc__label">{result.label}</span>
          </span>
        )}
        <span className="epc__arrow">
          <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M6 14 14 6M7.5 6H14v6.5" /></svg>
        </span>
      </span>
      {tags.length > 0 && (
        <span className="epc__tags">
          {tags.map((t) => <span key={t} className="epc__tag">{t}</span>)}
        </span>
      )}
    </>
  );

  return (
    <a
      ref={ref}
      className={`epc epc--${theme} ${className}`}
      data-motion={motion}
      onPointerEnter={(e) => { if (e.pointerType === "mouse") { at(e); on(); } onPointerEnter?.(e); }}
      onPointerLeave={(e) => { if (e.pointerType === "mouse") { at(e); if (document.activeElement !== ref.current) off(); } onPointerLeave?.(e); }}
      onPointerDown={(e) => { if (e.pointerType !== "mouse") { at(e); on(); } onPointerDown?.(e); }}
      onFocus={(e) => { if (!ref.current!.matches(":hover")) at(null); on(); onFocus?.(e); }}
      onBlur={(e) => { if (!ref.current!.matches(":hover")) off(); onBlur?.(e); }}
      {...rest}
    >
      <span className="epc__face">{face}</span>
      <span className="epc__fill" aria-hidden="true">{face}</span>
    </a>
  );
}
