"use client";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import "./corner-bracket-button.css";

export type CornerBracketButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> & {
  /** solid: a faint wash behind the label; outline: the brackets alone. */
  tone?: "solid" | "outline";
  size?: "sm" | "md" | "lg";
  icon?: ReactNode;
  theme?: "light" | "dark";
  children: ReactNode;
};

/**
 * Corner Bracket Button
 * A square button with no outline, only four L-shaped brackets sitting just
 * outside its corners. On hover they close in on the corners and turn to the
 * accent, and the label opens its tracking.
 */
export function CornerBracketButton({ tone = "solid", size = "md", icon, theme = "light", className = "", children, ...rest }: CornerBracketButtonProps) {
  return (
    <button type="button" className={`ccbk ccbk--${tone} ccbk--${size} ${theme === "dark" ? "ccbk--dark" : ""} ${className}`} {...rest}>
      <span className="ccbk__corners" aria-hidden="true"><i /><i /><i /><i /></span>
      <span className="ccbk__label">{children}{icon && <span className="ccbk__icon" aria-hidden="true">{icon}</span>}</span>
    </button>
  );
}
