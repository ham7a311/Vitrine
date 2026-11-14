import type { ButtonHTMLAttributes, ReactNode } from "react";
import "./lozenge-button.css";

/**
 * Lozenge Button
 * A glossy button that is a pill on one end and a soft square on the other, made to sit in the corner of a
 * panel with its round end facing in. Inside a pale ring, colour pools at the top and a white glow rises
 * from the bottom. The glow widens on hover and the whole thing dips when pressed.
 */

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  children?: ReactNode;
  tone?: "azure" | "violet" | "jade";
  /** Which end is the round one. */
  round?: "left" | "right";
  size?: "sm" | "md" | "lg";
};

export function LozengeButton({ children, tone = "azure", round = "left", size = "md", className = "", ...rest }: Props) {
  return (
    <button type="button" className={`lozb lozb--${tone} lozb--${round} lozb--${size} ${className}`} {...rest}>
      <span className="lozb__label">{children}</span>
    </button>
  );
}

export default LozengeButton;
