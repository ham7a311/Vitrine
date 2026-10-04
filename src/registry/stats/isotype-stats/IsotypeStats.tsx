"use client";

import { useEffect, useRef, useState } from "react";
import "./isotype-stats.css";

/**
 * Isotype Stats
 * Counting in people, the way Otto Neurath's charts did: each figure stands
 * for a fixed number, a row of figures is a quantity you can see at a
 * glance, and the last figure is cut to the fraction left over. The figures
 * are stamped in row by row as the chart scrolls into view; switching the
 * period stamps in the new figures and lets the lost ones fade.
 */

export type IsoRow = { label: string; note?: string; values: Record<string, number> };

type Props = {
  rows: IsoRow[];
  /** Period keys in order, e.g. ["2024", "2025"]. The last is shown first. */
  periods: string[];
  /** How many people one figure stands for. */
  unit: number;
  /** Plural noun for the legend, e.g. "weekly riders". */
  noun: string;
  title?: string;
  theme?: "paper" | "night";
  motion?: "full" | "reduced";
  className?: string;
};

const fmt = (n: number) => Math.round(n).toLocaleString("en-US");

function Figure() {
  return (
    <svg viewBox="0 0 20 40" aria-hidden="true">
      <circle cx="10" cy="5.2" r="4.6" />
      <path d="M4.2 11.6h11.6a2.6 2.6 0 0 1 2.6 2.6v10.4a1.8 1.8 0 0 1-3.6 0v-7.2h-.9V38a2 2 0 0 1-4 0V26.8h-.8V38a2 2 0 0 1-4 0V17.4h-.9v7.2a1.8 1.8 0 0 1-3.6 0V14.2a2.6 2.6 0 0 1 2.6-2.6z" />
    </svg>
  );
}

export function IsotypeStats({ rows, periods, unit, noun, title, theme = "paper", motion = "full", className = "" }: Props) {
  const root = useRef<HTMLElement>(null);
  const [period, setPeriod] = useState(periods[periods.length - 1]);
  const [on, setOn] = useState(false);
  // Change is only ever against the period before; the earliest has none.
  const prev: string | undefined = periods[periods.indexOf(period) - 1];
  const slots = Math.ceil(Math.max(...rows.flatMap((r) => periods.map((p) => r.values[p] ?? 0))) / unit);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setOn(true); io.disconnect(); } }, { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const total = rows.reduce((s, r) => s + (r.values[period] ?? 0), 0);
  const totalPrev = prev ? rows.reduce((s, r) => s + (r.values[prev] ?? 0), 0) : 0;

  return (
    <section ref={root} className={`iso iso--${theme} ${className}`} data-motion={motion} data-on={on || undefined} aria-label={title ?? "Pictogram chart"} style={{ ["--slots" as string]: slots }}>
      <div className="iso__head">
        <div>
          <p className="iso__total">
            {fmt(total)} <span>{noun}</span>
          </p>
          <p className="iso__delta">
            {prev ? `${total >= totalPrev ? "+" : "−"}${Math.abs(((total - totalPrev) / totalPrev) * 100).toFixed(1)}% on ${prev}` : `First year counted · ${period}`}
          </p>
        </div>
        <div className="iso__periods" role="radiogroup" aria-label="Period">
          {periods.map((p) => (
            <button key={p} type="button" role="radio" aria-checked={p === period} className="iso__period" onClick={() => setPeriod(p)}>
              {p}
            </button>
          ))}
        </div>
      </div>

      <ul className="iso__rows">
        {rows.map((r, ri) => {
          const v = r.values[period] ?? 0;
          const was = prev ? r.values[prev] ?? 0 : 0;
          const n = v / unit;
          const change = prev && was ? ((v - was) / was) * 100 : null;
          return (
            <li
              key={r.label}
              className="iso__row"
              tabIndex={0}
              aria-label={`${r.label}: ${fmt(v)} ${noun} in ${period}${change === null ? "" : `, ${change >= 0 ? "up" : "down"} ${Math.abs(change).toFixed(0)}% on ${prev}`}`}
              style={{ ["--ri" as string]: ri }}
            >
              <div className="iso__label" aria-hidden="true">
                <span className="iso__name">{r.label}</span>
                {r.note && <span className="iso__note">{r.note}</span>}
              </div>
              <div className="iso__figs" aria-hidden="true">
                {Array.from({ length: slots }, (_, i) => {
                  const f = Math.max(0, Math.min(1, n - i));
                  return (
                    <span key={i} className="iso__fig" data-f={f > 0 || undefined} style={{ ["--i" as string]: i, ["--f" as string]: f }}>
                      <span className="iso__clip">
                        <Figure />
                      </span>
                    </span>
                  );
                })}
              </div>
              <div className="iso__value" aria-hidden="true">
                <span className="iso__num">{fmt(v)}</span>
                {change !== null && (
                  <span className="iso__chg" data-down={change < 0 || undefined}>
                    {change >= 0 ? "+" : "−"}
                    {Math.abs(change).toFixed(0)}%
                  </span>
                )}
              </div>
            </li>
          );
        })}
      </ul>

      <p className="iso__legend">
        <span className="iso__key" aria-hidden="true">
          <Figure />
        </span>
        = {fmt(unit)} {noun}
      </p>

      {/* Tables ignore overflow, so the hidden table sits inside a hidden box. */}
      <div className="iso__sr">
      <table>
        <caption>{title ?? "Pictogram chart"}, {noun}</caption>
        <thead>
          <tr>
            <th scope="col">Route</th>
            {periods.map((p) => (
              <th key={p} scope="col">{p}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.label}>
              <th scope="row">{r.label}</th>
              {periods.map((p) => (
                <td key={p}>{fmt(r.values[p] ?? 0)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </section>
  );
}
