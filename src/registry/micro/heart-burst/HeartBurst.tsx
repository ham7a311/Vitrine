"use client";

import { useState, type ButtonHTMLAttributes } from "react";
import "./heart-burst.css";

/**
 * Heart Burst
 * A like button with one good moment: the heart pops in red, a ring blooms out, a few sparks
 * fly, and the count rolls up a digit. Unliking is quiet — the heart just empties.
 */

type Props = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onChange"> & {
  liked?: boolean;
  defaultLiked?: boolean;
  count?: number;
  onChange?: (liked: boolean) => void;
  label?: string;
};

const SPARKS = ["#ff4d6d", "#ffb703", "#7c5cff", "#2ec4b6", "#ff4d6d", "#ffb703", "#2ec4b6"];

export function HeartBurst({ liked, defaultLiked = false, count = 0, onChange, label = "Like", className = "", ...rest }: Props) {
  const [inner, setInner] = useState(defaultLiked);
  const on = liked ?? inner;
  const [beat, setBeat] = useState(0);
  const n = count + (on ? 1 : 0);
  return (
    <button
      type="button"
      aria-pressed={on}
      aria-label={`${label}, ${n} ${n === 1 ? "like" : "likes"}`}
      className={`hb ${className}`}
      data-on={on ? "" : undefined}
      onClick={() => {
        const next = !on;
        if (liked === undefined) setInner(next);
        if (next) setBeat((b) => b + 1);
        onChange?.(next);
      }}
      {...rest}
    >
      <span className="hb__icon" aria-hidden="true">
        {beat > 0 && on && (
          <span className="hb__fx" key={beat}>
            <span className="hb__ring" />
            {SPARKS.map((c, i) => (
              <i key={i} style={{ ["--a" as string]: `${(i / SPARKS.length) * 360 + 12}deg`, ["--c" as string]: c }} />
            ))}
          </span>
        )}
        <svg viewBox="0 0 24 24">
          <path d="M12 20.3s-7.6-4.6-9.2-9.4C1.7 7.6 3.8 4.4 7.1 4.4c2 0 3.6 1.1 4.9 2.9 1.3-1.8 2.9-2.9 4.9-2.9 3.3 0 5.4 3.2 4.3 6.5-1.6 4.8-9.2 9.4-9.2 9.4Z" />
        </svg>
      </span>
      <span className="hb__count" aria-hidden="true">
        <span className="hb__reel" style={{ translate: `0 ${on ? -50 : 0}%` }}>
          <span>{count}</span>
          <span>{count + 1}</span>
        </span>
      </span>
    </button>
  );
}
