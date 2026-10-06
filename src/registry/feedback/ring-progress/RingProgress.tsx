"use client";
import { useId, type ReactNode } from "react";
import { clamp, ringOffset } from "./progress";
import "./ring-progress.css";

export type RingProgressProps = {
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
 * Ring Progress
 * A circle that fills clockwise from 12 o'clock with the percentage in the
 * middle, and the label and a muted detail beside it.
 */
export function RingProgress({ label, value = 0, detail, size = "md", theme = "light", className = "" }: RingProgressProps) {
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
  const r = 26;
  return (
    <div className={`rprg rprg--${size} ${theme === "dark" ? "rprg--dark" : ""} ${v >= 100 ? "rprg--full" : ""} ${className}`} {...aria}>
      <svg className="rprg__ring" viewBox="0 0 64 64" aria-hidden="true">
        <circle cx="32" cy="32" r={r} />
        <circle cx="32" cy="32" r={r} style={{ strokeDasharray: 2 * Math.PI * r, strokeDashoffset: ringOffset(r, v) }} />
      </svg>
      <span className="rprg__center" aria-hidden="true">{pct}</span>
      <span className="rprg__caption"><span id={`${id}-l`}>{label}</span>{detail && <small>{detail}</small>}</span>
    </div>
  );
}
