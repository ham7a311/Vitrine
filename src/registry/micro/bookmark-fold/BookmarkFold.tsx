"use client";

import { useId, useState } from "react";
import "./bookmark-fold.css";

/**
 * Bookmark Fold
 * Saving pours colour down the ribbon from the top, drops it a little lower in its slot, and
 * flips the notch at the bottom like a ribbon catching. A small "Saved" note rises and fades.
 */

type Props = { saved?: boolean; defaultSaved?: boolean; onChange?: (saved: boolean) => void; label?: string; className?: string };

export function BookmarkFold({ saved, defaultSaved = false, onChange, label = "Save", className = "" }: Props) {
  const [inner, setInner] = useState(defaultSaved);
  const on = saved ?? inner;
  const [beat, setBeat] = useState(0);
  const clip = `bf-${useId().replace(/:/g, "")}`;
  return (
    <button
      type="button"
      aria-pressed={on}
      aria-label={label}
      className={`bf ${className}`}
      data-on={on ? "" : undefined}
      onClick={() => {
        const n = !on;
        if (saved === undefined) setInner(n);
        setBeat((b) => b + 1);
        onChange?.(n);
      }}
    >
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <defs>
          <clipPath id={clip}>
            <path d="M6 3.5h12v17.2l-6-4.2-6 4.2Z" />
          </clipPath>
        </defs>
        <g clipPath={`url(#${clip})`}>
          <rect className="bf__fill" x="5" y="3" width="14" height="19" />
        </g>
        <path className="bf__shape" d="M6 3.5h12v17.2l-6-4.2-6 4.2Z" />
      </svg>
      {beat > 0 && on && (
        <span className="bf__note" key={beat} aria-hidden="true">
          Saved
        </span>
      )}
    </button>
  );
}
