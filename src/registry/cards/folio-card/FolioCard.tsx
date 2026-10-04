"use client";

import { useMemo, type CSSProperties } from "react";
import "./folio-card.css";

/**
 * Folio Card
 * An article card that's as thick as the article. Its page edges stack out
 * from the corner, one sheet for every 300 words, so a four-minute note and
 * a half-hour essay look different before you read a word. If you've started
 * it, a ribbon marks your place between the pages. Hover fans the edge.
 */

type Props = {
  href: string;
  kicker: string;
  title: string;
  dek?: string;
  author: string;
  date: string;
  words: number;
  /** 0–1: how far the reader got last time. Shows a ribbon at that page. */
  progress?: number;
  theme?: "paper" | "night";
  motion?: "full" | "reduced";
  className?: string;
};

const WPM = 230;

export function FolioCard({ href, kicker, title, dek, author, date, words, progress, theme = "paper", motion = "full", className = "" }: Props) {
  const pages = Math.max(2, Math.min(30, Math.round(words / 300)));
  const minutes = Math.max(1, Math.round(words / WPM));

  // One shadow per sheet, alternating tone so each page edge reads as a line.
  const edge = useMemo(
    () =>
      Array.from({ length: pages }, (_, k) => {
        const i = k + 1;
        return `calc(var(--fc-fan) * ${i}px) calc(var(--fc-fan) * ${i}px) 0 0 ${i % 2 ? "var(--fc-page-a)" : "var(--fc-page-b)"}`;
      }).join(", ") + `, calc(var(--fc-fan) * ${pages}px + 2px) calc(var(--fc-fan) * ${pages}px + 6px) 14px -4px var(--fc-shadow)`,
    [pages],
  );

  const ribbonAt = progress !== undefined ? Math.max(1, Math.round(progress * pages)) : null;
  const left = progress !== undefined ? Math.max(1, Math.round((1 - progress) * minutes)) : null;

  return (
    <a
      href={href}
      className={`folio folio--${theme} ${className}`}
      data-motion={motion}
      style={{ "--fc-edge": edge, "--fc-depth": pages, "--fc-ribbon": ribbonAt ?? 0 } as CSSProperties}
    >
      <span className="folio__sheet">
        <span className="folio__kicker">{kicker}</span>
        <span className="folio__title">{title}</span>
        {dek && <span className="folio__dek">{dek}</span>}
        <span className="folio__meta">
          <span>{author}</span>
          <span aria-hidden="true">·</span>
          <span>{date}</span>
        </span>
        <span className="folio__length">
          {minutes} min · {words.toLocaleString("en-US")} words
          {left !== null && <span className="folio__left"> · {left} min left</span>}
        </span>
      </span>
      {ribbonAt !== null && <span className="folio__ribbon" aria-hidden="true" />}
    </a>
  );
}
