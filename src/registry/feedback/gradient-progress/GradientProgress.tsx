"use client";
import { useId, type ReactNode } from "react";
import { clamp } from "./progress";
import "./gradient-progress.css";

export type GradientProgressProps = {
  label: string;
  /** 0–100. */
  value?: number;
  /** Text on the right of the label row. Defaults to the percentage. */
  detail?: ReactNode;
  size?: "sm" | "md" | "lg";
  theme?: "light" | "dark";
  className?: string;
};

/**
 * Gradient Progress
 * A colourful bar whose full gradient spans the track, so the colours arrive
 * in order as the bar grows, with a soft glow leading its end.
 */
export function GradientProgress({ label, value = 0, detail, size = "md", theme = "light", className = "" }: GradientProgressProps) {
  const id = useId();
  const v = clamp(value);
  const pct = `${Math.round(v)}%`;
  const aria = {
    role: "progressbar" as const,
    "aria-labelledby": `${id}-l`,
    "aria-valuemin": 0,
    "aria-valuemax": 100,
    "aria-valuenow": Math.round(v),
    "aria-valuetext": typeof detail === "string" ? detail : pct,
  };
  return (
    <div className={`gpbr gpbr--${size} ${theme === "dark" ? "gpbr--dark" : ""} ${className}`}>
      <div className="gpbr__row">
        <span id={`${id}-l`}>{label}</span>
        <span className="gpbr__value" aria-hidden="true">{detail ?? pct}</span>
      </div>
      <div className="gpbr__track" {...aria} style={{ ["--gpbr-v" as string]: v / 100 }}>
        <span className="gpbr__fill" />
      </div>
    </div>
  );
}
