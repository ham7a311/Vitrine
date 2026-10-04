"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import "./keycap.css";

/**
 * Keycap
 * The face sits on a skirt 5px tall. Pressing (pointer or the real key) sinks
 * the face into the skirt, compressing the shadow — actual travel, not a
 * colour change. Every button remembers its shortcut and responds to it.
 */

type Props = {
  keys: string[];
  label?: ReactNode;
  /** KeyboardEvent.key values that press this cap, e.g. ["k"] with meta. */
  match?: { key: string; meta?: boolean; shift?: boolean };
  wide?: boolean;
  tone?: "graphite" | "bone" | "accent";
  onPress?: () => void;
  className?: string;
};

export function Keycap({ keys, label, match, wide, tone = "graphite", onPress, className = "" }: Props) {
  const [down, setDown] = useState(false);
  const ref = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!match) return;
    const hit = (e: KeyboardEvent) =>
      e.key.toLowerCase() === match.key.toLowerCase() && !!match.meta === (e.metaKey || e.ctrlKey) && !!match.shift === e.shiftKey;
    const d = (e: KeyboardEvent) => { if (hit(e)) { if (match.meta) e.preventDefault(); if (!e.repeat) { setDown(true); onPress?.(); } } };
    const u = (e: KeyboardEvent) => { if (e.key.toLowerCase() === match.key.toLowerCase() || e.key === "Meta" || e.key === "Control") setDown(false); };
    window.addEventListener("keydown", d);
    window.addEventListener("keyup", u);
    return () => { window.removeEventListener("keydown", d); window.removeEventListener("keyup", u); };
  }, [match, onPress]);

  return (
    <button
      ref={ref}
      type="button"
      className={`keycap keycap--${tone} ${wide ? "keycap--wide" : ""} ${className}`}
      data-down={down || undefined}
      onPointerDown={() => setDown(true)}
      onPointerUp={() => setDown(false)}
      onPointerLeave={() => setDown(false)}
      onClick={() => onPress?.()}
    >
      <span className="keycap__face">
        {label && <span className="keycap__label">{label}</span>}
        <span className="keycap__legend">
          {keys.map((k) => <kbd key={k}>{k}</kbd>)}
        </span>
      </span>
    </button>
  );
}
