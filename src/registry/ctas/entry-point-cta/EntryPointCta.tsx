"use client";

import { useRef, type PointerEvent, type ReactNode } from "react";
import "./entry-point-cta.css";

/**
 * Entry Point CTA
 * The whole closing banner is one link. Colour blooms from the exact point
 * where your cursor came in, and drains toward the point where you leave.
 * The banner is printed twice, so the big headline inverts precisely along
 * the edge of the circle as it sweeps across.
 */

type Props = {
  href: string;
  eyebrow?: string;
  headline: ReactNode;
  details?: string[];
  theme?: "paper" | "night";
  motion?: "full" | "reduced";
  className?: string;
};

export function EntryPointCta({ href, eyebrow, headline, details = [], theme = "night", motion = "full", className = "" }: Props) {
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
      <span className="epcta__top">
        {eyebrow && <span className="epcta__eyebrow">{eyebrow}</span>}
        <span className="epcta__arrow">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 17 17 7M8.5 7H17v8.5" /></svg>
        </span>
      </span>
      <span className="epcta__headline">{headline}</span>
      {details.length > 0 && (
        <span className="epcta__details">
          {details.map((d) => <span key={d}>{d}</span>)}
        </span>
      )}
    </>
  );

  return (
    <section className={`epcta epcta--${theme} ${className}`} data-motion={motion}>
      <a
        ref={ref}
        href={href}
        className="epcta__link"
        onPointerEnter={(e) => { if (e.pointerType === "mouse") { at(e); on(); } }}
        onPointerLeave={(e) => { if (e.pointerType === "mouse") { at(e); if (document.activeElement !== ref.current) off(); } }}
        onPointerDown={(e) => { if (e.pointerType !== "mouse") { at(e); on(); } }}
        onFocus={() => { if (!ref.current!.matches(":hover")) at(null); on(); }}
        onBlur={() => { if (!ref.current!.matches(":hover")) off(); }}
      >
        <span className="epcta__face">{face}</span>
        <span className="epcta__fill" aria-hidden="true">{face}</span>
      </a>
    </section>
  );
}
