"use client";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import "./breathe-button.css";

export type BreatheButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> & {
  label: string;
  icon?: ReactNode;
  theme?: "light" | "dark";
};

/**
 * Breathe Button
 * A gradient call to action with a halo that slowly swells and fades, as if
 * the button were breathing; hover brightens it and quickens the breath.
 */
export function BreatheButton({ label, icon, theme = "light", className = "", ...rest }: BreatheButtonProps) {
  return (
    <button type="button" className={`brth ${theme === "dark" ? "brth--dark" : ""} ${className}`} {...rest}>
      <span className="brth__halo" aria-hidden="true" />
      <span className="brth__label">{label}{icon}</span>
    </button>
  );
}
