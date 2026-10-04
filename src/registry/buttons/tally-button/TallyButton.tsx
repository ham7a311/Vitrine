"use client";

import { useState, type ButtonHTMLAttributes, type CSSProperties } from "react";
import "./tally-button.css";

/**
 * Tally Button
 * A save or like button with a count that turns like an odometer. Only the
 * digits that change move, one after another from the left, so 1,299 → 1,300
 * rolls three wheels in a little cascade while the 1 stays put. A ring
 * leaves the icon as it fills.
 */

type Props = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onChange"> & {
  /** What it does, e.g. "Save". */
  label: string;
  /** The count with you not included. */
  count: number;
  /** Plural noun for the accessible name, e.g. "saves". */
  noun: string;
  icon?: "bookmark" | "heart";
  pressed?: boolean;
  defaultPressed?: boolean;
  onChange?: (pressed: boolean) => void;
  theme?: "paper" | "night";
  motion?: "full" | "reduced";
};

const fmt = (n: number) => n.toLocaleString("en-US");

function Odometer({ value, from }: { value: number; from: number }) {
  const now = fmt(value).split(""), was = fmt(from).split("");
  // Compare places from the right; the changed ones roll in order from the left.
  const changed = now.map((c, i) => c !== was[was.length - (now.length - i)]);
  let order = 0;
  return (
    <span className="tlb__count" aria-hidden="true">
      {now.map((c, i) => {
        const key = now.length - i;
        if (!/\d/.test(c)) return <span key={`s${key}`} className="tlb__sep">{c}</span>;
        const delay = changed[i] ? order++ * 70 : 0;
        return (
          <span key={key} className="tlb__reel" data-new={was.length - (now.length - i) < 0 || undefined}>
            <span className="tlb__strip" style={{ "--d": Number(c), "--delay": `${delay}ms` } as CSSProperties}>
              {Array.from({ length: 10 }, (_, k) => <span key={k}>{k}</span>)}
            </span>
          </span>
        );
      })}
    </span>
  );
}

export function TallyButton({ label, count, noun, icon = "bookmark", pressed, defaultPressed = false, onChange, theme = "night", motion = "full", className = "", onClick, ...rest }: Props) {
  const [inner, setInner] = useState(defaultPressed);
  const on = pressed ?? inner;
  const value = count + (on ? 1 : 0);
  // The value before the last change, so we know which digits moved.
  const [from, setFrom] = useState(value);
  const [pulse, setPulse] = useState(0);

  return (
    <button
      type="button"
      className={`tlb tlb--${theme} ${className}`}
      data-motion={motion}
      aria-pressed={on}
      aria-label={`${label}, ${fmt(value)} ${noun}`}
      onClick={(e) => {
        const next = !on;
        setFrom(value);
        if (pressed === undefined) setInner(next);
        if (next) setPulse((p) => p + 1);
        onChange?.(next);
        onClick?.(e);
      }}
      {...rest}
    >
      <span className="tlb__icon" aria-hidden="true">
        {icon === "heart" ? (
          <svg viewBox="0 0 20 20"><path d="M10 16.5S3.5 12.6 3.5 8A3.5 3.5 0 0 1 10 6.2 3.5 3.5 0 0 1 16.5 8c0 4.6-6.5 8.5-6.5 8.5Z" /></svg>
        ) : (
          <svg viewBox="0 0 20 20"><path d="M5.5 3.5h9v13L10 13l-4.5 3.5z" /></svg>
        )}
        {pulse > 0 && <span key={pulse} className="tlb__pulse" />}
      </span>
      <span className="tlb__label" aria-hidden="true">{on ? `${label}d` : label}</span>
      <span className="tlb__rule" aria-hidden="true" />
      <Odometer value={value} from={from} />
    </button>
  );
}
