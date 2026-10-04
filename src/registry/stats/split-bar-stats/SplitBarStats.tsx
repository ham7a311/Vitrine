"use client";

import { useRef, useState, type CSSProperties, type PointerEvent, type ReactNode } from "react";
import "./split-bar-stats.css";

/**
 * Split Bar Stats
 * Where it all went, in one bar. Point at a share and it springs wider while
 * its neighbours give way; its colour floods in from the side you came from,
 * and the label inverts exactly along the edge of the flood. Switch between
 * month and year and the shares slide to their new sizes as the numbers roll.
 */

export type Share = {
  label: string;
  /** One amount per period, in the order of `periods`. */
  values: number[];
  /** The segment's colour. */
  color: string;
};

type Props = {
  shares: Share[];
  periods: string[];
  currency?: string;
  label?: string;
  theme?: "paper" | "night";
  motion?: "full" | "reduced";
  className?: string;
};

function Reels({ text }: { text: string }) {
  const chars = text.split("");
  return (
    <span className="sbs__reels" aria-hidden="true">
      {chars.map((c, i) => {
        const key = chars.length - i;
        return /\d/.test(c) ? (
          <span key={key} className="sbs__reel">
            <span className="sbs__strip" style={{ "--d": Number(c), "--k": i } as CSSProperties}>
              {Array.from({ length: 10 }, (_, k) => <span key={k}>{k}</span>)}
            </span>
          </span>
        ) : (
          <span key={`s${key}`}>{c}</span>
        );
      })}
    </span>
  );
}

export function SplitBarStats({ shares, periods, currency = "OMR", label = "Breakdown", theme = "paper", motion = "full", className = "" }: Props) {
  const [period, setPeriod] = useState(0);
  const [hot, setHot] = useState<number | null>(null);
  const [from, setFrom] = useState<Record<number, "l" | "r">>({});
  // While set, that segment's fill jumps (no transition) to its new starting side.
  const [snap, setSnap] = useState<number | null>(null);
  // Where the pointer last actually moved. A segment that springs wider can slide under a still
  // pointer; those enter events carry the same position and are ignored, so hover doesn't flicker.
  const lastX = useRef<number | null>(null);
  const total = shares.reduce((a, s) => a + s.values[period], 0);
  const pct = (s: Share) => (s.values[period] / total) * 100;
  const money = (n: number) => n.toLocaleString("en-US");

  // Which side the pointer crossed: the flood comes in, and later drains out, that way.
  const sideOf = (e: PointerEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    return e.clientX < r.left + r.width / 2 ? "l" : "r";
  };
  /** Light segment i, its flood starting from side s. */
  const enter = (i: number, s: "l" | "r") => {
    if ((from[i] ?? "l") === s) return setHot(i);
    setFrom((f) => ({ ...f, [i]: s }));
    setSnap(i);
    requestAnimationFrame(() => requestAnimationFrame(() => { setSnap(null); setHot(i); }));
  };

  return (
    <section className={`sbs sbs--${theme} ${className}`} data-motion={motion} aria-label={label}>
      <div className="sbs__top">
        <p className="sbs__total">
          <span className="sbs__cur">{currency}</span>
          <Reels text={money(total)} />
          <span className="sbs__sr">{`${currency} ${money(total)}`}</span>
          <span className="sbs__per">{periods[period].toLowerCase()}</span>
        </p>
        <div className="sbs__periods" role="radiogroup" aria-label="Period">
          {periods.map((p, i) => (
            <button
              key={p}
              type="button"
              role="radio"
              aria-checked={i === period}
              tabIndex={i === period ? 0 : -1}
              className="sbs__period"
              onClick={() => setPeriod(i)}
              onKeyDown={(e) => {
                if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
                e.preventDefault();
                const j = (period + (e.key === "ArrowRight" ? 1 : periods.length - 1)) % periods.length;
                setPeriod(j);
                (e.currentTarget.parentElement?.children[j] as HTMLElement | undefined)?.focus();
              }}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <div
        className="sbs__bar"
        aria-hidden="true"
        onPointerMove={(e) => (lastX.current = e.clientX)}
        onPointerLeave={() => { setHot(null); lastX.current = null; }}
      >
        {shares.map((s, i) => {
          const p = pct(s);
          const on = hot === i;
          // The hovered share gets room for its label; the rest give way in proportion.
          const grow = on ? Math.max(p * 1.25, 24) : p;
          const text: ReactNode = (
            <span className="sbs__seg-text">
              <span className="sbs__seg-name">{s.label}</span>
              <span className="sbs__seg-pct"><Reels text={String(Math.round(p))} />%</span>
            </span>
          );
          return (
            <div
              key={s.label}
              className="sbs__seg"
              data-on={on || undefined}
              data-from={from[i] ?? "l"}
              data-snap={snap === i || undefined}
              style={{ flexGrow: grow, "--c": s.color } as CSSProperties}
              onPointerEnter={(e) => { if (hot !== null && lastX.current === e.clientX) return; enter(i, sideOf(e)); }}
              onPointerLeave={(e) => { if (lastX.current === e.clientX) return; const s = sideOf(e); setFrom((f) => ({ ...f, [i]: s })); }}
            >
              <span className="sbs__face">{text}</span>
              <span className="sbs__face sbs__fill">{text}</span>
            </div>
          );
        })}
      </div>

      <ul className="sbs__legend">
        {shares.map((s, i) => (
          <li key={s.label}>
            <button
              type="button"
              className="sbs__key"
              data-on={hot === i || undefined}
              style={{ "--c": s.color } as CSSProperties}
              aria-label={`${s.label}: ${currency} ${money(s.values[period])}, ${Math.round(pct(s))}% of the ${periods[period].toLowerCase()}`}
              onPointerEnter={() => enter(i, "l")}
              onPointerLeave={() => setHot(null)}
              onFocus={() => enter(i, "l")}
              onBlur={() => setHot(null)}
            >
              <span className="sbs__swatch" aria-hidden="true" />
              <span className="sbs__key-name" aria-hidden="true">{s.label}</span>
              <span className="sbs__key-amt" aria-hidden="true">{currency} <Reels text={money(s.values[period])} /></span>
              <span className="sbs__key-pct" aria-hidden="true"><Reels text={String(Math.round(pct(s)))} />%</span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
