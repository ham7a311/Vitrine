"use client";

import { useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import "./tidefill-card.css";

/**
 * Tidefill Card
 * A savings goal you can see the level of. The card fills with water to the
 * share you've saved, rolling gently at the surface, and everything printed
 * on it inverts exactly along the wave. Add to it and the tide rises with a
 * little overshoot while the total rolls up digit by digit.
 */

type Props = {
  label: string;
  name: string;
  saved: number;
  goal: number;
  /** The amount the button adds. */
  step?: number;
  currency?: string;
  /** e.g. "on track for May 2027" */
  note?: string;
  onAdd?: (next: number) => void;
  theme?: "paper" | "night";
  motion?: "full" | "reduced";
  className?: string;
};

const fmt = (n: number) => n.toLocaleString("en-US");

/** Digits as reels, keyed from the right so places stay put as the number grows. */
function Rolling({ value }: { value: number }) {
  const chars = fmt(value).split("");
  return (
    <span className="tfc__roll">
      {chars.map((c, i) => {
        const key = chars.length - i;
        return /\d/.test(c) ? (
          <span key={key} className="tfc__reel" style={{ "--d": Number(c), "--i": key } as CSSProperties}>
            <span className="tfc__strip">{Array.from({ length: 10 }, (_, k) => <span key={k}>{k}</span>)}</span>
          </span>
        ) : (
          <span key={`s${key}`}>{c}</span>
        );
      })}
    </span>
  );
}

export function TidefillCard({ label, name, saved: initial, goal, step = 50, currency = "OMR", note, onAdd, theme = "paper", motion = "full", className = "" }: Props) {
  const card = useRef<HTMLElement>(null);
  const [saved, setSaved] = useState(initial);
  const [h, setH] = useState(0);
  const p = Math.min(1, saved / goal);
  const done = saved >= goal;
  const left = Math.max(0, goal - saved);

  useLayoutEffect(() => {
    const el = card.current!;
    const read = () => setH(el.offsetHeight);
    read();
    const ro = new ResizeObserver(read);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const add = () => {
    const next = Math.min(goal, saved + step);
    setSaved(next);
    onAdd?.(next);
  };

  // Printed twice: on the card, and in the water (inverted, inert, masked to the tide).
  const face = (live: boolean): ReactNode => (
    <>
      <p className="tfc__label">{label}</p>
      <h3 className="tfc__name">{name}</h3>
      <p className="tfc__amount">
        <span className="tfc__cur">{currency}</span>
        <Rolling value={saved} />
      </p>
      <p className="tfc__of">
        of {currency} {fmt(goal)} · <span className="tfc__pct">{Math.round(p * 100)}%</span>
      </p>
      <p className="tfc__note" aria-live={live ? "polite" : undefined}>
        {done ? "Goal reached. Mabrook!" : `${currency} ${fmt(left)} to go${note ? ` · ${note}` : ""}`}
      </p>
      {live ? (
        <button type="button" className="tfc__add" onClick={add} disabled={done}>
          {done ? "Goal reached" : `Add ${currency} ${fmt(step)}`}
        </button>
      ) : (
        <span className="tfc__add">{done ? "Goal reached" : `Add ${currency} ${fmt(step)}`}</span>
      )}
    </>
  );

  return (
    <article
      ref={card}
      className={`tfc tfc--${theme} ${className}`}
      data-motion={motion}
      data-done={done || undefined}
      style={{ "--tfc-p": p, "--tfc-h": `${h}px` } as CSSProperties}
    >
      <div className="tfc__face" role="group" aria-label={`${name}: ${currency} ${fmt(saved)} of ${fmt(goal)} saved`}>
        <span className="tfc__sr" role="progressbar" aria-valuemin={0} aria-valuemax={goal} aria-valuenow={saved} aria-valuetext={`${Math.round(p * 100)}% saved`} />
        {face(true)}
      </div>
      <div className="tfc__water tfc__water--back" aria-hidden="true" />
      <div className="tfc__water tfc__face" aria-hidden="true" inert>
        {face(false)}
      </div>
    </article>
  );
}
