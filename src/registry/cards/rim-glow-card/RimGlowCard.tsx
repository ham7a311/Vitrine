"use client";

import type { CSSProperties, ReactNode } from "react";
import { TONES, type RimTone } from "./rim";
import "./rim-glow-card.css";

/**
 * Rim Glow Card
 * A dark glass tile lit from below: a thick rim of coloured light runs round its edge, brightest
 * down the left and along the bottom, and a hot band rises from the bottom edge into the dark.
 * An icon in a small glowing tile, a light title, a line of copy and a link sit at the top. On
 * hover the light climbs higher.
 */

type Props = {
  icon?: ReactNode;
  title?: ReactNode;
  children?: ReactNode;
  action?: string;
  href?: string;
  tone?: RimTone;
  className?: string;
  style?: CSSProperties;
};

export const ICONS = {
  inbox: (
    <>
      <path d="M4 13.5 6.5 5h11l2.5 8.5V19H4Z" />
      <path d="M4 13.5h4.5l1.2 2h4.6l1.2-2H20M9 8.5h6M9.5 11h5" />
    </>
  ),
  tools: (
    <>
      <path d="M14.5 6.5a3.5 3.5 0 0 0 4.6 4.6L20 12l-8 8-2.5-2.5 8-8ZM5 5l4.5 4.5" />
      <path d="M4 7.5 7.5 4 11 7.5 7.5 11ZM13 15l4 4" />
    </>
  ),
  network: (
    <>
      <path d="M12 3.5 19.5 7.8v8.4L12 20.5l-7.5-4.3V7.8Z" />
      <circle cx="12" cy="12" r="2.6" />
      <path d="M12 3.5v5.9M19.5 16.2l-5.2-3M4.5 16.2l5.2-3" />
    </>
  ),
};

export function RimGlowCard({
  icon = ICONS.inbox,
  title = "Morning Brief",
  children = "Everything worth knowing, read in five minutes before your coffee cools.",
  action = "Get the brief",
  href = "#",
  tone = TONES.amber,
  className = "",
  style,
}: Props) {
  return (
    <article
      className={`rgwc ${className}`}
      style={{ ["--rgwc-c" as string]: tone.color, ["--rgwc-l" as string]: tone.light, ["--rgwc-t" as string]: tone.tint, ...style }}
    >
      <span className="rgwc__band" aria-hidden="true" />
      <div className="rgwc__body">
        <span className="rgwc__icon" aria-hidden="true">
          <svg viewBox="0 0 24 24">{icon}</svg>
        </span>
        <h3 className="rgwc__title">{title}</h3>
        <p className="rgwc__text">{children}</p>
        <a className="rgwc__link" href={href}>
          {action}
          <span aria-hidden="true">→</span>
        </a>
      </div>
    </article>
  );
}
