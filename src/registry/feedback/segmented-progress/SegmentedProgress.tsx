"use client";
import { useId, type ReactNode } from "react";
import { clamp, segments } from "./progress";
import "./segmented-progress.css";

export type SegmentedProgressProps = {
  label: string;
  /** 0–100. */
  value?: number;
  /** Number of equal segments. */
  steps?: number;
  /** Text on the right of the label row. Defaults to the percentage. */
  detail?: ReactNode;
  size?: "sm" | "md" | "lg";
  theme?: "light" | "dark";
  className?: string;
};

/**
 * Segmented Progress
 * The track is split into equal steps: whole segments fill solid and the
 * current one fills partly, so progress reads as "step 3 of 5".
 */
export function SegmentedProgress({ label, value = 0, steps = 5, detail, size = "md", theme = "light", className = "" }: SegmentedProgressProps) {
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
    <div className={`sgpb sgpb--${size} ${theme === "dark" ? "sgpb--dark" : ""} ${v >= 100 ? "sgpb--full" : ""} ${className}`}>
      <div className="sgpb__row">
        <span id={`${id}-l`}>{label}</span>
        <span className="sgpb__value" aria-hidden="true">{detail ?? pct}</span>
      </div>
      <div className="sgpb__steps" {...aria}>
        {segments(v, steps).map((f, i) => <span key={i} className="sgpb__step"><i style={{ transform: `scaleX(${f})` }} /></span>)}
      </div>
    </div>
  );
}
