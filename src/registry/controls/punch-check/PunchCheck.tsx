"use client";

import { useId, useState, type InputHTMLAttributes, type ReactNode } from "react";
import "./punch-check.css";

/**
 * Punch Check
 * Checkboxes on a ticket. Checking one punches it: the paper squashes under the punch, a clean
 * hole opens, and the little paper chad drops out and tumbles away. Unchecking puts the chad
 * back and the hole closes.
 */

type Props = Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "children"> & {
  children: ReactNode;
  hint?: ReactNode;
};

export function PunchCheck({ children, hint, checked, defaultChecked, onChange, className = "", id, ...rest }: Props) {
  const auto = useId();
  const inputId = id ?? auto;
  const [inner, setInner] = useState(!!defaultChecked);
  const on = checked ?? inner;
  const [beat, setBeat] = useState(0);
  // Each chad falls its own way, from a seed in its id.
  const seed = [...auto].reduce((a, c) => a + c.charCodeAt(0), 0);
  const drift = ((seed * 37) % 60) - 30;
  const spin = 280 + ((seed * 53) % 260);
  return (
    <label className={`punch-check ${className}`} htmlFor={inputId} data-on={on ? "" : undefined} data-beat={beat ? (on ? "in" : "out") : undefined}>
      <span className="punch-check__text">
        <span className="punch-check__title">{children}</span>
        {hint && <span className="punch-check__hint">{hint}</span>}
      </span>
      <input
        id={inputId}
        type="checkbox"
        className="punch-check__input"
        checked={on}
        onChange={(e) => {
          if (checked === undefined) setInner(e.target.checked);
          setBeat((b) => b + 1);
          onChange?.(e);
        }}
        {...rest}
      />
      <span className="punch-check__spot" aria-hidden="true" style={{ ["--drift" as string]: `${drift}px`, ["--spin" as string]: `${spin}deg` }}>
        <span className="punch-check__ring" />
        <span className="punch-check__hole" />
        <span className="punch-check__chad" key={beat} />
      </span>
    </label>
  );
}

/** The ticket the punches live on. */
export function PunchTicket({ title, code, children, className = "", hole }: { title: ReactNode; code: string; children: ReactNode; className?: string; /** What shows through a punched hole — usually the page colour. */ hole?: string }) {
  return (
    <fieldset className={`pt ${className}`} style={hole ? { ["--hole" as string]: hole } : undefined}>
      <div className="pt__stub" aria-hidden="true">
        <span>{code}</span>
      </div>
      <div className="pt__body">
        <legend className="pt__title">{title}</legend>
        <div className="pt__rows">{children}</div>
      </div>
    </fieldset>
  );
}
