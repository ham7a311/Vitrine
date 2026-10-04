"use client";

import type { ButtonHTMLAttributes } from "react";
import "./ring-flood-button.css";

/**
 * Ring Flood Button
 * A gradient loops slowly around the border, pulling the eye to the one
 * action that matters. Hover and the dark face draws in from every side, so
 * the gradient floods the whole button and the label turns to ink. Leave and
 * the face grows back over it.
 */

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  theme?: "paper" | "night";
  motion?: "full" | "reduced";
};

export function RingFloodButton({ theme = "night", motion = "full", className = "", children, ...rest }: Props) {
  return (
    <button type="button" className={`rfb rfb--${theme} ${className}`} data-motion={motion} {...rest}>
      <span className="rfb__label">{children}</span>
    </button>
  );
}
