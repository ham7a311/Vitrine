import type { ButtonHTMLAttributes, ReactNode } from "react";
import "./tidefill-button.css";

/**
 * Tidefill Button
 * The label is printed twice — once in cream on the dark surface and once in
 * ink on a liquid fill. On hover the fill rises from the bottom edge with a
 * rolling wave surface, and the ink label is revealed exactly where the liquid is.
 */

type Props = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> & { children: string; tone?: "frost" | "lilac" | "cream" };

export function TidefillButton({ children, tone = "frost", className = "", ...rest }: Props) {
  return (
    <button type="button" className={`tide tide--${tone} ${className}`} {...rest}>
      <span className="tide__label">{children}</span>
      <span className="tide__liquid" aria-hidden="true">
        <svg className="tide__wave" viewBox="0 0 240 24" preserveAspectRatio="none">
          <path d="M0 12 C 20 0, 40 24, 60 12 S 100 0, 120 12 S 160 24, 180 12 S 220 0, 240 12 V24 H0 Z" />
        </svg>
        <span className="tide__body" />
      </span>
      {/* the ink label is clipped by a box that rises with the liquid, so it only shows where the liquid is */}
      <span className="tide__ink" aria-hidden="true">
        <span className="tide__label tide__label--ink">{children}</span>
      </span>
    </button>
  );
}
