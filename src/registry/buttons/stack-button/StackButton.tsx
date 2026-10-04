"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import "./stack-button.css";

/**
 * Stack Button
 * The count isn't a badge — it's the stack. Each item is a sheet the same
 * shape as the button, sliding out from behind it and settling a few pixels
 * higher with its own slight lean. Taking one away peels the top sheet off.
 */

type Props = {
  label?: string;
  /** Word used in the live announcement, e.g. "in bag". */
  unit?: string;
  value?: number;
  onChange?: (n: number) => void;
  max?: number;
  /** How many sheets are ever drawn; the count keeps going past this. */
  visible?: number;
  tone?: "ember" | "frost" | "paper";
  className?: string;
};

// deterministic lean per sheet — never random, so the stack always looks the same
const LEAN = [-1.3, 0.9, -0.5, 1.4, -1, 0.6, -0.8, 1.1];

export function StackButton({ label = "Add to bag", unit = "in bag", value, onChange, max = 99, visible = 6, tone = "ember", className = "" }: Props) {
  const [n, setN] = useState(value ?? 0);
  const [leaving, setLeaving] = useState<number | null>(null);
  const [bump, setBump] = useState(0);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => { if (value !== undefined) setN(value); }, [value]);
  useEffect(() => () => clearTimeout(timer.current), []);

  const set = (next: number) => { setN(next); onChange?.(next); };
  const add = () => { if (n >= max) return; set(n + 1); setBump((b) => b + 1); };
  const remove = () => {
    if (n <= 0) return;
    if (n <= visible) {
      setLeaving(n - 1);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setLeaving(null), 520);
    }
    set(n - 1);
  };

  const drawn = Math.min(n, visible);
  const sheets = Array.from({ length: Math.max(drawn, leaving !== null ? leaving + 1 : 0) }, (_, i) => i);

  return (
    <div className={`stack-button stack-button--${tone} ${className}`} data-count={n} style={{ "--sb-n": drawn } as CSSProperties}>
      <div className="stack-button__stack" aria-hidden="true">
        {sheets.map((i) => (
          <span
            key={i}
            className="stack-button__sheet"
            data-leaving={leaving === i || undefined}
            style={{ "--i": i, "--lean": `${LEAN[i % LEAN.length]}deg` } as CSSProperties}
          />
        ))}
      </div>

      <div className="stack-button__body">
        <button type="button" className="stack-button__minus" onClick={remove} disabled={n === 0} tabIndex={n === 0 ? -1 : 0} aria-label="Remove one">
          <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M4 8h8" /></svg>
        </button>
        <button type="button" className="stack-button__main" onClick={add} disabled={n >= max}>
          <span className="stack-button__label">{label}</span>
          <span className="stack-button__count" aria-hidden="true">
            <span key={bump + "-" + n} className="stack-button__digits">{n}</span>
          </span>
        </button>
      </div>
      <p className="stack-button__sr" aria-live="polite">{n ? `${n} ${unit}` : ""}</p>
    </div>
  );
}
