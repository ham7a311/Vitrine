"use client";

import { useEffect, useId, useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import "./cohort-retention.css";

/**
 * Cohort Retention
 * Who keeps coming back, month by month after they first booked. Each row
 * is a monthly cohort, each column a month later; cells are shaded on one
 * blue ramp from none to all, and the triangle fills in along its diagonal
 * the first time it's seen. Point at (or arrow to) any cell: its row and
 * column light up, and the curves alongside show that cohort against the
 * average.
 */

export type Cohort = { label: string; size: number; kept: number[] }; // kept[m] = share still active at month m
type Props = { cohorts: Cohort[]; title?: string; theme?: "light" | "dark"; motion?: "full" | "reduced"; className?: string };

// The reference sequential ramp (blue 100 → 700).
const RAMP = ["#cde2fb", "#b7d3f6", "#9ec5f4", "#86b6ef", "#6da7ec", "#5598e7", "#3987e5", "#2a78d6", "#256abf", "#1c5cab", "#184f95", "#104281", "#0d366b"];
const shade = (p: number) => RAMP[Math.max(0, Math.min(RAMP.length - 1, Math.round(p * (RAMP.length - 1))))];
const pct = (p: number) => `${Math.round(p * 100)}%`;

export function CohortRetention({ cohorts, title = "Returning guests", theme = "light", motion = "full", className = "" }: Props) {
  const id = useId();
  const n = cohorts.length;
  const months = Math.max(...cohorts.map((c) => c.kept.length));
  const [at, setAt] = useState<{ r: number; c: number } | null>(null);
  const [seen, setSeen] = useState(false);
  const tableRef = useRef<HTMLTableElement>(null);
  const cellRefs = useRef<Map<string, HTMLTableCellElement>>(new Map());

  useEffect(() => {
    const el = tableRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setSeen(true); io.disconnect(); } }, { threshold: 0.25 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // The average curve, weighted by cohort size, over the cohorts that have reached each month.
  const avg = Array.from({ length: months }, (_, m) => {
    const have = cohorts.filter((c) => c.kept.length > m);
    const w = have.reduce((s, c) => s + c.size, 0);
    return have.reduce((s, c) => s + c.kept[m] * c.size, 0) / w;
  });
  const m3 = 3;
  const best = cohorts.filter((c) => c.kept.length > m3).reduce((b, c) => (c.kept[m3] > b.kept[m3] ? c : b));

  const move = (e: KeyboardEvent, r: number, c: number) => {
    const map: Record<string, [number, number]> = { ArrowUp: [-1, 0], ArrowDown: [1, 0], ArrowLeft: [0, -1], ArrowRight: [0, 1] };
    const d = map[e.key];
    if (!d) return;
    e.preventDefault();
    let nr = Math.max(0, Math.min(n - 1, r + d[0])), nc = Math.max(0, c + d[1]);
    nc = Math.min(nc, cohorts[nr].kept.length - 1);
    setAt({ r: nr, c: nc });
    cellRefs.current.get(`${nr}:${nc}`)?.focus();
  };

  // The linked curves.
  const CW = 300, CH = 220, P = { l: 34, r: 12, t: 12, b: 26 };
  const cx = (m: number) => P.l + (m / (months - 1)) * (CW - P.l - P.r);
  const cy = (p: number) => P.t + (1 - p) * (CH - P.t - P.b);
  const curve = (arr: number[]) => arr.map((p, m) => `${m ? "L" : "M"}${cx(m).toFixed(1)} ${cy(p).toFixed(1)}`).join(" ");
  const focus = at ? cohorts[at.r] : best;

  return (
    <section className={`cr cr--${theme} ${className}`} data-motion={motion} data-seen={seen || undefined} data-active={at ? "" : undefined} aria-labelledby={`${id}-t`}>
      <header className="cr__head">
        <h3 id={`${id}-t`} className="cr__title">{title}</h3>
        <p className="cr__insight"><strong>{best.label}</strong>’s guests held on best — {pct(best.kept[m3])} still booking at month 3, against {pct(avg[m3])} on average.</p>
      </header>

      <div className="cr__body">
        <div className="cr__grid-wrap">
          <table ref={tableRef} className="cr__grid" onPointerLeave={() => setAt(null)}>
            <caption className="cr__sr">Share of each month's new guests still booking in each month after their first booking.</caption>
            <thead>
              <tr>
                <th scope="col" className="cr__corner">Cohort</th>
                <th scope="col" className="cr__size">Guests</th>
                {Array.from({ length: months }, (_, m) => <th key={m} scope="col" data-on={at?.c === m || undefined}>M{m}</th>)}
              </tr>
            </thead>
            <tbody>
              {cohorts.map((co, r) => (
                <tr key={co.label}>
                  <th scope="row" data-on={at?.r === r || undefined}>{co.label}</th>
                  <td className="cr__size">{co.size.toLocaleString("en-GB")}</td>
                  {Array.from({ length: months }, (_, m) => {
                    if (m >= co.kept.length) return <td key={m} className="cr__empty" aria-hidden="true" />;
                    const p = co.kept[m];
                    const dark = p > 0.42;
                    const on = at && (at.r === r || at.c === m);
                    return (
                      <td
                        key={m}
                        ref={(el) => { if (el) cellRefs.current.set(`${r}:${m}`, el); }}
                        className="cr__cell"
                        tabIndex={(at ? at.r === r && at.c === m : r === 0 && m === 0) ? 0 : -1}
                        data-on={on || undefined}
                        data-here={(at && at.r === r && at.c === m) || undefined}
                        style={{ ["--bg" as string]: shade(p), ["--k" as string]: r + m, color: dark ? "#fff" : "#0b0b0b" } as CSSProperties}
                        aria-label={`${co.label} cohort, month ${m}: ${pct(p)} still booking, ${Math.round(p * co.size)} of ${co.size} guests`}
                        onPointerEnter={() => setAt({ r, c: m })}
                        onFocus={() => setAt({ r, c: m })}
                        onKeyDown={(e) => move(e, r, m)}
                      >
                        <span>{m === 0 ? "100" : Math.round(p * 100)}</span>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
          <div className="cr__ramp" aria-hidden="true">
            <span>0%</span>
            <i style={{ background: `linear-gradient(90deg, ${RAMP.join(", ")})` }} />
            <span>100% still booking</span>
          </div>
        </div>

        <figure className="cr__curves">
          <figcaption className="cr__cap">
            <span><i className="cr__k cr__k--sel" />{focus.label}</span>
            <span><i className="cr__k cr__k--avg" />Average</span>
          </figcaption>
          <svg viewBox={`0 0 ${CW} ${CH}`} role="img" aria-label={`${focus.label} cohort retention against the average: month 3 ${pct(focus.kept[Math.min(m3, focus.kept.length - 1)])} vs ${pct(avg[m3])}.`}>
            {[0, 0.25, 0.5, 0.75, 1].map((g) => (
              <g key={g}>
                <line x1={P.l} x2={CW - P.r} y1={cy(g)} y2={cy(g)} className={g === 0 ? "cr__base" : "cr__gl"} />
                <text x={P.l - 6} y={cy(g)} dy="0.32em" className="cr__yt">{g * 100}%</text>
              </g>
            ))}
            {[0, 3, 6, 9].filter((m) => m < months).map((m) => <text key={m} x={cx(m)} y={CH - 8} className="cr__xt">M{m}</text>)}
            {cohorts.map((c) => <path key={c.label} d={curve(c.kept)} className="cr__faint" />)}
            <path d={curve(avg)} className="cr__avg" />
            <path d={curve(focus.kept)} className="cr__sel" key={focus.label} />
            {at && <circle cx={cx(at.c)} cy={cy(cohorts[at.r].kept[at.c])} r="4.5" className="cr__dot" />}
          </svg>
          <p className="cr__read" aria-live="polite">
            {at
              ? `${cohorts[at.r].label}, month ${at.c}: ${pct(cohorts[at.r].kept[at.c])} — ${Math.round(cohorts[at.r].kept[at.c] * cohorts[at.r].size).toLocaleString("en-GB")} of ${cohorts[at.r].size.toLocaleString("en-GB")} guests (${cohorts[at.r].kept[at.c] >= avg[at.c] ? "+" : "−"}${Math.abs(Math.round((cohorts[at.r].kept[at.c] - avg[at.c]) * 100))} pts vs average)`
              : "Point at a cell to compare its cohort with the average."}
          </p>
        </figure>
      </div>
    </section>
  );
}
