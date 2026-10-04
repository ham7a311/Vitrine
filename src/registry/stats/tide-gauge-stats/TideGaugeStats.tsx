"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import "./tide-gauge-stats.css";

/**
 * Tide Gauge Stats
 * A row of glass tubes, one per metric. When the row scrolls into view each
 * tube fills to its value, one after another, with a rolling surface. The
 * number floats on that surface, half under water, and is inverted exactly
 * where the wave crosses it — so you read the level and the value as one.
 */

export type Gauge = {
  label: string;
  value: number;
  /** Full scale. Defaults to 100. */
  max?: number;
  /** Printed after the number, e.g. "%". */
  unit?: string;
  note?: string;
  /** Draws a dashed goal line across the tube. Same scale as value. */
  target?: number;
};

type Props = {
  gauges: Gauge[];
  label?: string;
  theme?: "paper" | "night";
  motion?: "full" | "reduced";
  className?: string;
};

/** Each digit is a reel that turns to its value; places are keyed from the right. */
function Reels({ text, on }: { text: string; on: boolean }) {
  const chars = text.split("");
  return (
    <>
      {chars.map((c, i) => {
        const key = chars.length - i;
        return /\d/.test(c) ? (
          <span key={key} className="tgs__reel" style={{ "--d": on ? Number(c) : 0, "--k": key } as CSSProperties}>
            <span className="tgs__strip">{Array.from({ length: 10 }, (_, k) => <span key={k}>{k}</span>)}</span>
          </span>
        ) : (
          <span key={`s${key}`}>{c}</span>
        );
      })}
    </>
  );
}

export function TideGaugeStats({ gauges, label = "Key figures", theme = "paper", motion = "full", className = "" }: Props) {
  const root = useRef<HTMLElement>(null);
  const [on, setOn] = useState(false);

  useEffect(() => {
    const el = root.current!;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setOn(true); io.disconnect(); } }, { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section ref={root} className={`tgs tgs--${theme} ${className}`} data-motion={motion} data-on={on || undefined} aria-label={label}>
      <ul className="tgs__row">
        {gauges.map((g, i) => {
          const max = g.max ?? 100;
          const p = Math.max(0, Math.min(1, g.value / max));
          const text = String(g.value);
          // The number is printed twice: on the glass, and inverted inside the water.
          const num: ReactNode = (
            <span className="tgs__num">
              <Reels text={text} on={on} />
              {g.unit && <span className="tgs__unit">{g.unit}</span>}
            </span>
          );
          return (
            <li key={g.label} className="tgs__item">
              <div
                className="tgs__tube"
                role="meter"
                aria-label={g.label}
                aria-valuemin={0}
                aria-valuemax={max}
                aria-valuenow={g.value}
                aria-valuetext={`${g.value}${g.unit ?? ""}${g.target !== undefined ? `, goal ${g.target}${g.unit ?? ""}` : ""}`}
                style={{ "--tgs-p": on ? p : 0, "--i": i } as CSSProperties}
              >
                <span className="tgs__ticks" aria-hidden="true" />
                <span className="tgs__print" aria-hidden="true">{num}</span>
                <span className="tgs__water tgs__water--back" aria-hidden="true" />
                <span className="tgs__water tgs__print" aria-hidden="true">{num}</span>
                {g.target !== undefined && (
                  <span className="tgs__goal" aria-hidden="true" style={{ "--t": Math.min(1, g.target / max) } as CSSProperties}>
                    <span>{g.target}</span>
                  </span>
                )}
                <span className="tgs__gloss" aria-hidden="true" />
              </div>
              <p className="tgs__label">{g.label}</p>
              {g.note && <p className="tgs__note">{g.note}</p>}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
