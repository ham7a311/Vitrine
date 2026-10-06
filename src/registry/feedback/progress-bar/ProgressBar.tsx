"use client";
import { useId, type ReactNode } from "react";
import { clamp } from "./progress";
import "./progress-bar.css";

export type ProgressBarProps = {
  label: string;
  /** 0–100. */
  value?: number;
  /** A lighter second fill, for media buffering. */
  buffer?: number;
  /** Text on the right of the label row. Defaults to the percentage. */
  detail?: ReactNode;
  size?: "sm" | "md" | "lg";
  theme?: "light" | "dark";
  className?: string;
};

/**
 * Linear Progress
 * A bar with its label and value above it: one fill that scales from the left,
 * an optional lighter buffer behind it for media, and a green finish at 100.
 */
export function ProgressBar({ label, value = 0, buffer, detail, size = "md", theme = "light", className = "" }: ProgressBarProps) {
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
    <div className={`prgb prgb--${size} ${theme === "dark" ? "prgb--dark" : ""} ${v >= 100 ? "prgb--full" : ""} ${className}`}>
      <div className="prgb__row">
        <span id={`${id}-l`}>{label}</span>
        <span className="prgb__value" aria-hidden="true">{detail ?? pct}</span>
      </div>
      <div className="prgb__track" {...aria} style={{ ["--prgb-v" as string]: v / 100 }}>
        {buffer != null && <span className="prgb__buffer" style={{ transform: `scaleX(${clamp(buffer) / 100})` }} />}
        <span className="prgb__fill" />
      </div>
    </div>
  );
}
