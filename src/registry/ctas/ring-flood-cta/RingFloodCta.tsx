"use client";

import { useRef, type ReactNode } from "react";
import "./ring-flood-cta.css";

/**
 * Ring Flood CTA
 * A closing banner framed by a slowly turning gradient. Point at the main
 * action and the gradient floods out of the button across the whole banner,
 * a soft tide line spreading from the button to the far corners, and every
 * word turns to ink as it arrives. Move away and it drains back in.
 */

type Props = {
  eyebrow?: string;
  headline: ReactNode;
  sub?: ReactNode;
  action: string;
  href?: string;
  secondary?: { label: string; href: string };
  note?: string;
  theme?: "paper" | "night";
  motion?: "full" | "reduced";
  className?: string;
};

export function RingFloodCta({ eyebrow, headline, sub, action, href = "#", secondary, note, theme = "night", motion = "full", className = "" }: Props) {
  const banner = useRef<HTMLDivElement>(null);
  const btn = useRef<HTMLAnchorElement>(null);

  // Put the flood's origin at the button's centre and size it to reach the farthest corner.
  const flood = (on: boolean) => {
    const b = banner.current!, a = btn.current!;
    if (on) {
      const r = b.getBoundingClientRect(), q = a.getBoundingClientRect();
      const x = q.left + q.width / 2 - r.left, y = q.top + q.height / 2 - r.top;
      const far = Math.max(Math.hypot(x, y), Math.hypot(r.width - x, y), Math.hypot(x, r.height - y), Math.hypot(r.width - x, r.height - y));
      b.style.setProperty("--rf-x", `${x}px`);
      b.style.setProperty("--rf-y", `${y}px`);
      b.style.setProperty("--rf-max", `${Math.ceil(far + 80)}px`);
      b.dataset.flood = "";
    } else delete b.dataset.flood;
  };

  return (
    <section className={`rfcta rfcta--${theme} ${className}`} data-motion={motion}>
      <div ref={banner} className="rfcta__banner">
        <span className="rfcta__bloom" aria-hidden="true" />
        <span className="rfcta__face" aria-hidden="true" />
        <div className="rfcta__content">
          {eyebrow && <p className="rfcta__eyebrow">{eyebrow}</p>}
          <h2 className="rfcta__headline">{headline}</h2>
          {sub && <p className="rfcta__sub">{sub}</p>}
          <div className="rfcta__actions">
            <a
              ref={btn}
              href={href}
              className="rfcta__primary"
              onPointerEnter={(e) => e.pointerType === "mouse" && flood(true)}
              onPointerLeave={(e) => e.pointerType === "mouse" && document.activeElement !== btn.current && flood(false)}
              onFocus={() => flood(true)}
              onBlur={() => !btn.current!.matches(":hover") && flood(false)}
            >
              {action}
              <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 8h10M9 4l4 4-4 4" /></svg>
            </a>
            {secondary && <a href={secondary.href} className="rfcta__secondary">{secondary.label}</a>}
          </div>
          {note && <p className="rfcta__note">{note}</p>}
        </div>
      </div>
    </section>
  );
}
