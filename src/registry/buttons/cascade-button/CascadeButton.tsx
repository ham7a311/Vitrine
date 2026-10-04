"use client";

import type { AnchorHTMLAttributes, CSSProperties } from "react";
import "./cascade-button.css";

/**
 * Cascade Button
 * The label is a two-row reel per letter: the resting word and an identical
 * copy beneath it. On hover each letter rolls up one row, staggered left to
 * right, so the word turns over like a wave. The arrow does the same trick
 * sideways — the old arrow leaves right as a new one arrives from the left.
 */

type Props = AnchorHTMLAttributes<HTMLAnchorElement> & {
  label: string;
  tone?: "ink" | "bone" | "frost";
  arrow?: boolean;
};

export function CascadeButton({ label, tone = "bone", arrow = true, className = "", ...rest }: Props) {
  const letters = Array.from(label);
  return (
    <a className={`cascade-button cascade-button--${tone} ${className}`} aria-label={label} {...rest}>
      <span className="cascade-button__word" aria-hidden="true">
        {letters.map((ch, i) => (
          <span key={i} className="cascade-button__reel" style={{ "--i": i } as CSSProperties}>
            <span>{ch === " " ? " " : ch}</span>
            <span>{ch === " " ? " " : ch}</span>
          </span>
        ))}
      </span>
      {arrow && (
        <span className="cascade-button__arrow" aria-hidden="true">
          <svg viewBox="0 0 16 16"><path d="M3 8h10M9 4l4 4-4 4" /></svg>
          <svg viewBox="0 0 16 16"><path d="M3 8h10M9 4l4 4-4 4" /></svg>
        </span>
      )}
    </a>
  );
}
