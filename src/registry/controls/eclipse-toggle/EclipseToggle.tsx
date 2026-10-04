"use client";

import { useState, type ButtonHTMLAttributes } from "react";
import "./eclipse-toggle.css";

/**
 * Eclipse Toggle
 * A day/night switch drawn as a small sky. Switching to night, the sun sinks behind the
 * horizon as the moon rises on the other side; clouds drift out, stars come on, and the sky
 * deepens. Switching back, morning returns the same way.
 */

type Props = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onChange"> & {
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (night: boolean) => void;
  label?: string;
  size?: "md" | "lg";
};

export function EclipseToggle({ checked, defaultChecked = false, onChange, label = "Dark mode", size = "md", className = "", ...rest }: Props) {
  const [inner, setInner] = useState(defaultChecked);
  const night = checked ?? inner;
  return (
    <button
      type="button"
      role="switch"
      aria-checked={night}
      aria-label={label}
      className={`ecl ecl--${size} ${className}`}
      data-night={night ? "" : undefined}
      onClick={() => {
        const n = !night;
        if (checked === undefined) setInner(n);
        onChange?.(n);
      }}
      {...rest}
    >
      <span className="ecl__sky" aria-hidden="true">
        <span className="ecl__stars">
          {Array.from({ length: 7 }, (_, i) => (
            <i key={i} style={{ ["--i" as string]: i, ["--t" as string]: `${14 + ((i * 23) % 40)}%` }} />
          ))}
        </span>
        <span className="ecl__cloud ecl__cloud--a" />
        <span className="ecl__cloud ecl__cloud--b" />
        <span className="ecl__sun" />
        <span className="ecl__moon" />
        <span className="ecl__hills" />
      </span>
    </button>
  );
}
