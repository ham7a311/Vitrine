"use client";
import { useId, type ReactNode } from "react";
import { clamp, ringOffset, segments } from "./progress";
import "./progress-bar.css";

export type ProgressBarProps = {
  /** linear: a bar; segmented: equal steps; indeterminate: unknown length; gradient: a colourful bar; ring: a circle. */
  look?: "linear" | "segmented" | "indeterminate" | "gradient" | "ring";
  /** 0–100. Ignored when indeterminate. */
  value?: number;
  /** A lighter second fill, for media buffering (linear only). */
  buffer?: number;
  /** Number of segments (segmented only). */
  steps?: number;
  label: string;
  /** Text on the right of the label row, or under the ring. Defaults to the percentage. */
  detail?: ReactNode;
  /** Draw the moving stripes on an indeterminate bar instead of the sliding bar. */
  striped?: boolean;
  size?: "sm" | "md" | "lg";
  theme?: "light" | "dark";
  className?: string;
};

/**
 * Progress Bar
 * How far along something is: a bar with its label and value, equal steps,
 * a bar for work of unknown length, a colourful bar that reveals its
 * gradient as it grows, or a ring.
 */
export function ProgressBar({ look = "linear", value = 0, buffer, steps = 5, label, detail, striped = false, size = "md", theme = "light", className = "" }: ProgressBarProps) {
  const id = useId();
  const v = clamp(value);
  const known = look !== "indeterminate";
  const pct = `${Math.round(v)}%`;
  const aria = {
    role: "progressbar" as const,
    "aria-labelledby": `${id}-l`,
    "aria-valuemin": known ? 0 : undefined,
    "aria-valuemax": known ? 100 : undefined,
    "aria-valuenow": known ? Math.round(v) : undefined,
    "aria-valuetext": known ? (typeof detail === "string" ? detail : pct) : undefined,
    "aria-busy": !known || undefined,
  };
  const cls = `prgb prgb--${look} prgb--${size} ${theme === "dark" ? "prgb--dark" : ""} ${v >= 100 ? "prgb--full" : ""} ${className}`;

  if (look === "ring") {
    const r = 26;
    return (
      <div className={cls} {...aria}>
        <svg className="prgb__ring" viewBox="0 0 64 64" aria-hidden="true">
          <circle cx="32" cy="32" r={r} />
          <circle cx="32" cy="32" r={r} style={{ strokeDasharray: 2 * Math.PI * r, strokeDashoffset: ringOffset(r, v) }} />
        </svg>
        <span className="prgb__center" aria-hidden="true">{pct}</span>
        <span className="prgb__caption"><span id={`${id}-l`}>{label}</span>{detail && <small>{detail}</small>}</span>
      </div>
    );
  }

  return (
    <div className={cls}>
      <div className="prgb__row">
        <span id={`${id}-l`} className="prgb__label">{label}</span>
        <span className="prgb__value" aria-hidden="true">{known ? detail ?? pct : detail}</span>
      </div>
      {look === "segmented" ? (
        <div className="prgb__steps" {...aria}>
          {segments(v, steps).map((f, i) => <span key={i} className="prgb__step"><i style={{ transform: `scaleX(${f})` }} /></span>)}
        </div>
      ) : (
        <div className="prgb__track" {...aria} data-striped={striped || undefined} style={{ ["--prgb-v" as string]: v / 100 }}>
          {buffer != null && known && <span className="prgb__buffer" style={{ transform: `scaleX(${clamp(buffer) / 100})` }} />}
          {known ? <span className="prgb__fill" /> : <span className="prgb__slide" />}
        </div>
      )}
    </div>
  );
}
