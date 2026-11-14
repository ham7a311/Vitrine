import type { ButtonHTMLAttributes, ReactNode } from "react";
import "./plan-pill-button.css";

/**
 * Plan Pill Button
 * The quiet pill that closes a pricing card: a short, solid capsule with one medium-weight word or two. It
 * does nothing loud. On hover a soft halo of its own colour opens round it; a press sinks it slightly.
 */

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  children?: ReactNode;
  /** white: on dark glass. ink: on paper. glass: frosted, on any dark ground. glow: lit teal, for the plan to choose. */
  look?: "white" | "ink" | "glass" | "glow";
  size?: "sm" | "md" | "lg";
};

export function PlanPillButton({ children = "Choose Plan", look = "white", size = "md", className = "", ...rest }: Props) {
  return (
    <button type="button" className={`ppill ppill--${look} ppill--${size} ${className}`} {...rest}>
      {children}
    </button>
  );
}

export default PlanPillButton;
