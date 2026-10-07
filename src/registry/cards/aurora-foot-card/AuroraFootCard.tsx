"use client";

import type { CSSProperties, ReactNode } from "react";
import { blobBox, LOOKS, type AuroraLook } from "./aurora";
import "./aurora-foot-card.css";

/**
 * Aurora Foot Card
 * A dark card whose lower half catches fire: soft clouds of vivid colour rise from the bottom
 * edge into a white-hot band, and the colour spills onto the page around it. The title and copy
 * sit up in the dark. On hover the bloom climbs and the glow grows.
 */

type Props = {
  icon?: ReactNode;
  title?: ReactNode;
  children?: ReactNode;
  action?: string;
  href?: string;
  look?: AuroraLook;
  className?: string;
  style?: CSSProperties;
};

export const ICONS = {
  lock: (
    <>
      <rect x="5.5" y="10.5" width="13" height="9.5" rx="2" />
      <path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5" />
    </>
  ),
  link: <path d="M10 14a3.8 3.8 0 0 0 5.4 0l2.7-2.7a3.8 3.8 0 0 0-5.4-5.4l-.9.9M14 10a3.8 3.8 0 0 0-5.4 0l-2.7 2.7a3.8 3.8 0 0 0 5.4 5.4l.9-.9" />,
  trend: <path d="M4 17 9.5 11.5l3.5 3.5L20 8M15 8h5v5" />,
  gauge: (
    <>
      <path d="M4.5 16a7.5 7.5 0 1 1 15 0" />
      <path d="m12 16 3.5-4.5" />
    </>
  ),
};

export function AuroraFootCard({
  icon = ICONS.lock,
  title = "Always guarded",
  children = "Every payment is screened as it happens, so fraud stops before it starts.",
  action = "Learn more",
  href = "#",
  look = LOOKS.magenta,
  className = "",
  style,
}: Props) {
  return (
    <article className={`afcd ${className}`} style={{ ["--afcd-glow" as string]: look.glow, ["--afcd-tint" as string]: look.tint, ["--afcd-foot" as string]: look.foot, ...style }}>
      <span className="afcd__halo" aria-hidden="true" />
      <span className="afcd__paint" aria-hidden="true">
        <span className="afcd__bloom">
          {look.blobs.map((b, i) => (
            <span key={i} className={`afcd__blob afcd__blob--${i % 3}`} style={{ ...blobBox(b), background: `radial-gradient(closest-side, ${b.c}, ${b.c} 45%, transparent)`, opacity: b.o ?? 1 }} />
          ))}
        </span>
        <span className="afcd__foot" />
      </span>
      <div className="afcd__body">
        <span className="afcd__icon" aria-hidden="true">
          <svg viewBox="0 0 24 24">{icon}</svg>
        </span>
        <h3 className="afcd__title">{title}</h3>
        <p className="afcd__text">{children}</p>
        <a className="afcd__link" href={href}>
          {action}
        </a>
      </div>
    </article>
  );
}
