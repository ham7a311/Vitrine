"use client";

import { useState, type ButtonHTMLAttributes } from "react";
import "./rocker-switch.css";

/**
 * Rocker Switch
 * An industrial rocker in its housing. The convex cap tilts on its pivot, the lit half catches
 * the light while the far half falls into shadow, and the LED above warms on. Holding it down
 * tilts it only part way — it snaps over when you let go.
 */

type Props = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onChange"> & {
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (on: boolean) => void;
  label: string;
  /** LED colour when on. */
  led?: string;
};

export function RockerSwitch({ checked, defaultChecked = false, onChange, label, led = "#ff5a2a", className = "", ...rest }: Props) {
  const [inner, setInner] = useState(defaultChecked);
  const on = checked ?? inner;
  const [held, setHeld] = useState(false);
  const flip = () => {
    const n = !on;
    if (checked === undefined) setInner(n);
    onChange?.(n);
  };
  return (
    <div className={`rk ${className}`} style={{ ["--rk-led" as string]: led }}>
      <span className="rk__led" data-on={on ? "" : undefined} aria-hidden="true" />
      <button
        type="button"
        role="switch"
        aria-checked={on}
        aria-label={label}
        className="rk__housing"
        data-on={on ? "" : undefined}
        data-held={held ? "" : undefined}
        onPointerDown={() => setHeld(true)}
        onPointerUp={() => setHeld(false)}
        onPointerLeave={() => setHeld(false)}
        onClick={flip}
        {...rest}
      >
        <span className="rk__cap" aria-hidden="true">
          <span className="rk__half rk__half--on">I</span>
          <span className="rk__half rk__half--off">O</span>
        </span>
      </button>
      <span className="rk__label" aria-hidden="true">
        {label}
      </span>
    </div>
  );
}
