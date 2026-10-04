import type { ReactNode } from "react";
import "./halftone-cta.css";

/**
 * Halftone CTA
 * A tall, centred call-to-action banner. A faint halftone dot grid covers it,
 * and a slow gold swirl is visible *only through the dots* — the mask stays
 * locked to the banner, so the grid never slides while the paint drifts.
 */

type Props = {
  badge: string;
  heading: ReactNode;
  subtext: string;
  action: { href: string; label: string; external?: boolean; ariaLabel?: string };
  /** "dark" is the default; "light" prints the dots in ink on paper. */
  theme?: "dark" | "light";
  className?: string;
};

export function HalftoneCta({ badge, heading, subtext, action, theme = "dark", className = "" }: Props) {
  return (
    <div className={`halftone-cta halftone-cta--${theme} ${className}`}>
      <div className="halftone-cta__swirl" aria-hidden="true">
        <div className="halftone-cta__paint" />
      </div>
      <div className="halftone-cta__scrim" aria-hidden="true" />
      <div className="halftone-cta__content">
        <span className="halftone-cta__badge">{badge}</span>
        <h2 className="halftone-cta__heading">{heading}</h2>
        <p className="halftone-cta__subtext">{subtext}</p>
        <a
          href={action.href}
          className="halftone-cta__button"
          aria-label={action.ariaLabel}
          {...(action.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        >
          {action.label}
        </a>
      </div>
    </div>
  );
}
