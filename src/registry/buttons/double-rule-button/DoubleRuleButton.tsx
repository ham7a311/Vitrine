"use client";

import type { ButtonHTMLAttributes } from "react";
import "./double-rule-button.css";

/**
 * Double Rule Button
 * Bordered like a certificate: two hairline rules with fine engraving
 * between them. Point at it and the inner rule moves out to meet the outer,
 * closing into one firm frame, as if the document is being sealed. For the
 * actions people should take seriously.
 */

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  theme?: "paper" | "night";
  motion?: "full" | "reduced";
};

export function DoubleRuleButton({ theme = "paper", motion = "full", className = "", children, ...rest }: Props) {
  return (
    <button type="button" className={`drb drb--${theme} ${className}`} data-motion={motion} {...rest}>
      <span className="drb__engraving" aria-hidden="true" />
      <span className="drb__inner" aria-hidden="true" />
      <span className="drb__label">{children}</span>
    </button>
  );
}
