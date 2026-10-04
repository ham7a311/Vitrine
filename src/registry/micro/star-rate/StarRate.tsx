"use client";

import { useState, type KeyboardEvent } from "react";
import "./star-rate.css";

/**
 * Star Rate
 * A five-star rating where choosing fills the stars one after another, each popping as it
 * lights; five stars throws a little sparkle. Hovering previews the fill, and the line below
 * says what the rating means.
 */

type Props = { value?: number; defaultValue?: number; onChange?: (v: number) => void; label?: string; words?: string[]; className?: string };

const WORDS = ["Not rated", "Not for me", "It was fine", "Good", "Really good", "Loved it"];

export function StarRate({ value, defaultValue = 0, onChange, label = "Rating", words = WORDS, className = "" }: Props) {
  const [inner, setInner] = useState(defaultValue);
  const v = value ?? inner;
  const [hover, setHover] = useState(0);
  const [beat, setBeat] = useState(0);
  const set = (n: number) => {
    if (value === undefined) setInner(n);
    setBeat((b) => b + 1);
    onChange?.(n);
  };
  const shown = hover || v;
  const onKey = (e: KeyboardEvent) => {
    const m: Record<string, number> = { ArrowRight: v + 1, ArrowUp: v + 1, ArrowLeft: v - 1, ArrowDown: v - 1, Home: 1, End: 5 };
    if (!(e.key in m)) return;
    e.preventDefault();
    const n = Math.max(1, Math.min(5, m[e.key]));
    set(n);
    (e.currentTarget.querySelector(`[data-n="${n}"]`) as HTMLElement | null)?.focus();
  };
  return (
    <div className={`sr ${className}`}>
      <div role="radiogroup" aria-label={label} className="sr__stars" onKeyDown={onKey} onPointerLeave={() => setHover(0)} data-beat={beat}>
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            role="radio"
            data-n={n}
            aria-checked={v === n}
            aria-label={`${n} star${n > 1 ? "s" : ""}`}
            tabIndex={v ? (v === n ? 0 : -1) : n === 1 ? 0 : -1}
            className="sr__star"
            data-on={n <= shown ? "" : undefined}
            data-pop={beat && n <= v ? (beat % 2 ? "a" : "b") : undefined}
            style={{ ["--d" as string]: `${(n - 1) * 70}ms` }}
            onPointerEnter={() => setHover(n)}
            onClick={() => set(n)}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 2.8l2.7 5.7 6.2.8-4.6 4.3 1.2 6.2L12 16.8l-5.5 3 1.2-6.2-4.6-4.3 6.2-.8Z" />
            </svg>
            {n === 5 && beat > 0 && v === 5 && (
              <span className="sr__sparks" key={beat} aria-hidden="true">
                {Array.from({ length: 8 }, (_, i) => (
                  <i key={i} style={{ ["--a" as string]: `${i * 45}deg` }} />
                ))}
              </span>
            )}
          </button>
        ))}
      </div>
      <p className="sr__word" aria-live="polite">
        {words[shown] ?? ""}
      </p>
    </div>
  );
}
