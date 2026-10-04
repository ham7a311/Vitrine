"use client";

import { useId, useState, type ButtonHTMLAttributes } from "react";
import "./gel-toggle.css";

/**
 * Gel Toggle
 * A switch whose thumb is a drop of gel. It leaves with a stretch — the front of the drop runs
 * ahead and the back catches up through a gooey bridge — and squashes when it lands, while the
 * track fills behind it with a wobbling meniscus.
 */

type Props = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onChange"> & {
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (on: boolean) => void;
  label: string;
  accent?: string;
};

export function GelToggle({ checked, defaultChecked = false, onChange, label, accent = "#34c77b", className = "", ...rest }: Props) {
  const [inner, setInner] = useState(defaultChecked);
  const on = checked ?? inner;
  const [beat, setBeat] = useState(0);
  const goo = `gel-${useId().replace(/:/g, "")}`;
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
      className={`gel ${className}`}
      style={{ ["--gel-accent" as string]: accent }}
      data-on={on ? "" : undefined}
      data-beat={beat ? (beat % 2 ? "a" : "b") : undefined}
      onClick={() => {
        const n = !on;
        if (checked === undefined) setInner(n);
        setBeat((b) => b + 1);
        onChange?.(n);
      }}
      {...rest}
    >
      <svg className="gel__defs" aria-hidden="true" width="0" height="0">
        <filter id={goo}>
          <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="b" />
          <feColorMatrix in="b" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -10" />
        </filter>
      </svg>
      <span className="gel__track" aria-hidden="true">
        <span className="gel__fill" />
      </span>
      <span className="gel__drops" style={{ filter: `url(#${goo}) drop-shadow(0 3px 4px rgb(0 0 0 / 0.22))` }} aria-hidden="true">
        <span className="gel__drop gel__drop--tail" />
        <span className="gel__drop gel__drop--head" />
      </span>
      <span className="gel__shine" aria-hidden="true" />
    </button>
  );
}
