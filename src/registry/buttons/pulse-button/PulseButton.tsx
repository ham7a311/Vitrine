"use client";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { compact } from "./pulse";
import "./pulse-button.css";

export type PulseButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> & {
  label: string;
  /** People watching. */
  count?: number;
  icon?: ReactNode;
  /** Whether you've joined: shows the playing state. */
  active?: boolean;
  theme?: "light" | "dark";
};

/**
 * Live Button
 * An on-air button: a red tag whose dot beats, the action, and the number of
 * people watching. Joining turns the play icon into a small equaliser.
 */
export function PulseButton({ label, count, icon, active = false, theme = "light", className = "", ...rest }: PulseButtonProps) {
  return (
    <button type="button" className={`pulb ${theme === "dark" ? "pulb--dark" : ""} ${className}`} data-active={active || undefined} {...rest}>
      <span className="pulb__onair">
        <span className="pulb__dot" aria-hidden="true"><i /><i /></span>
        Live
      </span>
      <span className="pulb__label">
        {active ? <span className="pulb__eq" aria-hidden="true"><i /><i /><i /></span> : icon}
        {label}
      </span>
      {count != null && <span className="pulb__count">{compact(count)}<span className="pulb__sr"> watching</span></span>}
    </button>
  );
}
