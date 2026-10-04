"use client";

import type { ReactNode } from "react";
import "./inline-cta.css";

/**
 * Inline CTA
 * The button is part of the prose. At rest it's a phrase with a quiet
 * underline. On hover/focus a pill grows from that underline up around the
 * words (clip-path), the text inverts, an arrow slides in, and horizontal
 * padding opens so the neighbouring words step aside instead of being covered.
 */

type Props = {
  before: ReactNode;
  action: string;
  after?: ReactNode;
  href?: string;
  onClick?: () => void;
  caption?: ReactNode;
  accent?: string;
  className?: string;
};

export function InlineCta({ before, action, after, href = "#", onClick, caption, accent = "#efe8dc", className = "" }: Props) {
  return (
    <section className={`inline-cta ${className}`} style={{ ["--ic-accent" as string]: accent }}>
      <p className="inline-cta__line">
        {before}{" "}
        <a
          className="inline-cta__action"
          href={href}
          onClick={(e) => { if (href === "#") e.preventDefault(); onClick?.(); }}
        >
          <span className="inline-cta__pill" aria-hidden="true" />
          <span className="inline-cta__text">{action}</span>
          <svg className="inline-cta__arrow" viewBox="0 0 16 16" aria-hidden="true"><path d="M4 12 12 4M5.5 4H12v6.5" /></svg>
        </a>{" "}
        {after}
      </p>
      {caption && <p className="inline-cta__caption">{caption}</p>}
    </section>
  );
}
