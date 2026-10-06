"use client";

import type { ReactNode, RefObject } from "react";
import "./colophon-footer.css";

/**
 * Colophon Footer
 * The small print as a colophon: the facts a book keeps on its last page, such as
 * what it was set in, where it was made and when it was last revised, as
 * ruled rows, with the legal line and links beneath. It says true things
 * instead of listing a sitemap, and it ends with a way back to the top.
 */

export type ColophonRow = { label: string; value: ReactNode };
export type FooterLink = { label: string; href: string };

type Props = {
  rows: ColophonRow[];
  /** "© 2026 Hamza Al-Bulushi" */
  legal: ReactNode;
  links?: FooterLink[];
  /** Label for the return control. */
  topLabel?: string;
  /** Element that scrolls. Defaults to the window. */
  scrollRef?: RefObject<HTMLElement | null>;
  theme?: "paper" | "night";
  motion?: "auto" | "reduced";
  className?: string;
};

export function ColophonFooter({ rows, legal, links = [], topLabel = "Back to top", scrollRef, theme = "paper", motion = "auto", className = "" }: Props) {
  const toTop = () => {
    const reduced = motion === "reduced" || window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const target = scrollRef?.current ?? window;
    target.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
  };
  return (
    <footer className={`colophon-footer colophon-footer--${theme} ${className}`}>
      <h2 className="colophon-footer__title">Colophon</h2>
      <dl className="colophon-footer__rows">
        {rows.map((r) => (
          <div key={r.label} className="colophon-footer__row">
            <dt>{r.label}</dt>
            <dd>{r.value}</dd>
          </div>
        ))}
      </dl>
      <div className="colophon-footer__base">
        <p className="colophon-footer__legal">{legal}</p>
        {links.length > 0 && (
          <nav aria-label="Legal">
            <ul>
              {links.map((l) => (
                <li key={l.href}><a href={l.href}>{l.label}</a></li>
              ))}
            </ul>
          </nav>
        )}
        <button type="button" className="colophon-footer__top" onClick={toTop}>
          {topLabel}
          <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 13V3M3.5 7.5L8 3l4.5 4.5" /></svg>
        </button>
      </div>
    </footer>
  );
}
