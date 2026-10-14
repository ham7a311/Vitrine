"use client";
import { useState, type CSSProperties } from "react";
import "./shackle-lock.css";

export type ShackleLockProps = {
  locked?: boolean;
  defaultLocked?: boolean;
  onChange?: (locked: boolean) => void;
  /** Words for each state. */
  labels?: { locked: string; unlocked: string };
  /** What it locks, for screen readers ("Make this board private"). */
  name?: string;
  theme?: "night" | "paper";
  className?: string;
};

/**
 * Shackle Lock
 * A private/public switch that behaves like a padlock: the key turns, then the shackle springs up
 * and swings open on its hinge; locking swings it back and it drops home with a click — the body
 * dips and a ring snaps out — while the label rolls to the new word.
 */
export function ShackleLock({ locked, defaultLocked = true, onChange, labels = { locked: "Private", unlocked: "Public" }, name = "Private", theme = "night", className = "" }: ShackleLockProps) {
  const [inner, setInner] = useState(defaultLocked);
  const on = locked ?? inner;
  const [beat, setBeat] = useState(0);
  return (
    <button
      type="button" role="switch" aria-checked={on} aria-label={name}
      className={`slock slock--${theme} ${className}`} data-locked={on ? "" : undefined} data-beat={beat ? (on ? "close" : "open") : undefined}
      onClick={() => { const n = !on; if (locked === undefined) setInner(n); setBeat((b) => b + 1); onChange?.(n); }}
    >
      <span className="slock__icon" key={beat} aria-hidden="true">
        <svg viewBox="0 0 24 24" width="22" height="22">
          <path className="slock__shackle" d="M8 11V7.6a4 4 0 0 1 8 0V11" />
          <rect className="slock__body" x="4.75" y="10.5" width="14.5" height="10.75" rx="2.75" />
          <g className="slock__key"><circle cx="12" cy="15.2" r="1.55" /><rect x="11.35" y="15.6" width="1.3" height="2.7" rx="0.6" /></g>
        </svg>
        <i className="slock__ring" />
      </span>
      <span className="slock__words" aria-hidden="true">
        <span className="slock__roll" style={{ ["--n" as string]: on ? 0 : 1 } as CSSProperties}>
          <span>{labels.locked}</span><span>{labels.unlocked}</span>
        </span>
      </span>
    </button>
  );
}

export default ShackleLock;
