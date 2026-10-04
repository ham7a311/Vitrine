"use client";

import { useState, type ButtonHTMLAttributes } from "react";
import "./chromatic-button.css";

/**
 * Chromatic Button
 * A terminal-style button that glitches on purpose. On hover the label splits into red, green
 * and blue copies that slip apart, a few horizontal slices jump sideways for a moment, and a
 * scanline sweeps down the face — then it settles, sharp again, while you stay.
 */

type Props = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> & { label: string };

export function ChromaticButton({ label, className = "", onPointerEnter, onFocus, ...rest }: Props) {
  const [beat, setBeat] = useState(0);
  const kick = () => setBeat((b) => b + 1);
  return (
    <button
      type="button"
      className={`chb ${className}`}
      data-beat={beat ? (beat % 2 ? "a" : "b") : undefined}
      onPointerEnter={(e) => {
        kick();
        onPointerEnter?.(e);
      }}
      onFocus={(e) => {
        kick();
        onFocus?.(e);
      }}
      aria-label={label}
      {...rest}
    >
      <span className="chb__text" data-text={label} aria-hidden="true">
        {label}
      </span>
      <span className="chb__scan" aria-hidden="true" />
    </button>
  );
}
