"use client";
import { useState } from "react";
import "./pin-drop.css";

export type PinDropProps = {
  saved?: boolean;
  defaultSaved?: boolean;
  onChange?: (saved: boolean) => void;
  /** The place being saved and the list it goes into. */
  place: string;
  list?: string;
  theme?: "night" | "paper";
  className?: string;
};

/**
 * Pin Drop
 * A save-this-place button whose pin really lands: it lifts, falls onto its spot, bounces twice
 * and settles as rings spread across the ground, and a little tag unfolds under it saying where it
 * went. Unsaving plucks the pin back out.
 */
export function PinDrop({ saved, defaultSaved = false, onChange, place, list = "Saved places", theme = "paper", className = "" }: PinDropProps) {
  const [inner, setInner] = useState(defaultSaved);
  const on = saved ?? inner;
  const [beat, setBeat] = useState(0);
  return (
    <span className={`pdrop pdrop--${theme} ${className}`} data-on={on ? "" : undefined}>
      <button
        type="button" aria-pressed={on} className="pdrop__btn"
        aria-label={on ? `Saved ${place} to ${list}` : `Save ${place}`}
        onClick={() => { const n = !on; if (saved === undefined) setInner(n); setBeat((b) => b + 1); onChange?.(n); }}
      >
        <span className="pdrop__spot" key={beat} data-beat={beat ? (on ? "in" : "out") : undefined} aria-hidden="true">
          <i className="pdrop__ground" />
          <i className="pdrop__ripple" /><i className="pdrop__ripple pdrop__ripple--2" />
          <svg className="pdrop__pin" viewBox="0 0 24 30" width="20" height="25">
            <path d="M12 28.5s-8.5-9.3-8.5-16a8.5 8.5 0 0 1 17 0c0 6.7-8.5 16-8.5 16z" />
            <circle cx="12" cy="12.3" r="3.2" />
          </svg>
        </span>
        <span className="pdrop__label" aria-hidden="true">{on ? "Saved" : "Save place"}</span>
      </button>
      <span className="pdrop__tag" key={`t${beat}`} data-fresh={beat ? "" : undefined} aria-hidden="true">
        <svg viewBox="0 0 16 16" width="13" height="13"><path d="M3.5 8.5 6.5 11.5 12.5 4.5" /></svg>
        Added to <b>{list}</b>
      </span>
      <span className="pdrop__sr" role="status">{beat ? (on ? `${place} saved to ${list}` : `${place} removed from ${list}`) : ""}</span>
    </span>
  );
}

export default PinDrop;
