"use client";

import { useState, type ButtonHTMLAttributes } from "react";
import { state } from "./subscribe";
import "./bell-subscribe-button.css";

/**
 * Bell Subscribe Button
 * A chunky outlined pill on a hard black shadow, with a bell in a coloured disc. Hover lifts it
 * and rings the bell; pressing sinks the face into its shadow; clicking toggles subscribed, which
 * rolls the label over and inverts the disc.
 */

type Props = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children" | "onChange"> & {
  /** Disc colour. */
  accent?: string;
  /** Controlled state; leave unset to let the button keep its own. */
  subscribed?: boolean;
  defaultSubscribed?: boolean;
  onChange?: (subscribed: boolean) => void;
  labels?: { off: string; on: string };
  /** Font size in px; everything else scales from it. */
  size?: number;
};

function Bell() {
  return (
    <svg className="bsub__bell" viewBox="0 0 24 24" aria-hidden="true">
      <g className="bsub__swing">
        <path className="bsub__body" d="M12 4.6c-3 0-5.1 2.4-5.1 5.4v3.2l-1.6 2.4c-.4.7 0 1.5.8 1.5h11.8c.8 0 1.2-.8.8-1.5l-1.6-2.4V10c0-3-2.1-5.4-5.1-5.4Z" />
        <circle className="bsub__body" cx="12" cy="3.7" r="1.25" />
        <ellipse className="bsub__body" cx="12" cy="18.7" rx="1.9" ry="1.3" />
      </g>
      <g className="bsub__waves">
        <path d="M4.6 6.3a8.6 8.6 0 0 0-1.4 4.9" />
        <path d="M5.4 17.6a8.4 8.4 0 0 0 2 1.8" />
        <path d="M19.4 6.3a8.6 8.6 0 0 1 1.4 4.9" />
        <path d="M18.6 17.6a8.4 8.4 0 0 1-2 1.8" />
      </g>
    </svg>
  );
}

export function BellSubscribeButton({ accent = "#f4c1a8", subscribed, defaultSubscribed = false, onChange, labels = { off: "Subscribe", on: "Subscribed" }, size = 20, className = "", style, onClick, ...rest }: Props) {
  const [own, setOwn] = useState(defaultSubscribed);
  // Only announce after a real toggle, never on first render.
  const [touched, setTouched] = useState(false);
  const on = subscribed ?? own;
  const s = state(on, labels);
  return (
    <>
      <button
        type="button"
        aria-pressed={on}
        className={`bsub ${className}`}
        style={{ ["--bsub-accent" as string]: accent, fontSize: size, ...style }}
        onClick={(e) => {
          onClick?.(e);
          if (e.defaultPrevented) return;
          if (subscribed === undefined) setOwn(!on);
          setTouched(true);
          onChange?.(!on);
        }}
        {...rest}
      >
        <span className="bsub__face">
          <span className="bsub__labels">
            <span className="bsub__label bsub__label--off" aria-hidden={on}>{labels.off}</span>
            <span className="bsub__label bsub__label--on" aria-hidden={!on}>{labels.on}</span>
          </span>
          <span className="bsub__disc">
            <Bell />
          </span>
        </span>
      </button>
      <span className="bsub__sr" role="status" aria-live="polite">
        {touched ? s.announce : ""}
      </span>
    </>
  );
}
