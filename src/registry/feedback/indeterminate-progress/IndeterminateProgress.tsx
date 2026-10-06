"use client";
import { useId, type ReactNode } from "react";
import "./indeterminate-progress.css";

export type IndeterminateProgressProps = {
  label: string;
  /** Moving stripes instead of the sliding bar. */
  striped?: boolean;
  /** Text on the right of the label row. Defaults to the percentage. */
  detail?: ReactNode;
  size?: "sm" | "md" | "lg";
  theme?: "light" | "dark";
  className?: string;
};

/**
 * Indeterminate Progress
 * For work of unknown length: a bar that slides and stretches across the
 * track, or a track of moving stripes. There is no value, only "still going".
 */
export function IndeterminateProgress({ label, striped = false, detail, size = "md", theme = "light", className = "" }: IndeterminateProgressProps) {
  const id = useId();
  return (
    <div className={`ipbr ipbr--${size} ${theme === "dark" ? "ipbr--dark" : ""} ${className}`}>
      <div className="ipbr__row">
        <span id={`${id}-l`}>{label}</span>
        <span className="ipbr__value" aria-hidden="true">{detail}</span>
      </div>
      <div className="ipbr__track" role="progressbar" aria-labelledby={`${id}-l`} aria-busy="true" data-striped={striped || undefined}>
        <span className="ipbr__slide" />
      </div>
    </div>
  );
}
