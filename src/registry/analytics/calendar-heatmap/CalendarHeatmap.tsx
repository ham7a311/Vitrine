"use client";

import { useMemo, useState, type KeyboardEvent } from "react";
import "./calendar-heatmap.css";

/**
 * Calendar Heatmap
 * A year of daily activity, one square per day, shaded on a single-hue ramp. The rhythm shows at
 * a glance — quiet Fridays, the summer rush — and every day can be read exactly: hover it, or
 * move through the year with the arrow keys.
 */

type Props = { years: Record<string, number[]>; unit?: string; title?: string; theme?: "light" | "dark"; className?: string };

const DAY = ["Mon", "", "Wed", "", "Fri", "", "Sun"];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const RAMP_LIGHT = ["#ecebe6", "#cfe1f7", "#9cc2ef", "#5f9de4", "#2a78d6", "#1b549d"];
const RAMP_DARK = ["#262624", "#1c3554", "#24518a", "#2f6fbc", "#3987e5", "#8ab9f2"];
const CELL = 12, G = 3;

export function CalendarHeatmap({ years, unit = "bookings", title = "Daily bookings", theme = "light", className = "" }: Props) {
  const keys = Object.keys(years);
  const [year, setYear] = useState(keys[keys.length - 1]);
  const [at, setAt] = useState<number | null>(null);
  const values = years[year];
  const ramp = theme === "dark" ? RAMP_DARK : RAMP_LIGHT;
  const y = Number(year);
  const first = new Date(Date.UTC(y, 0, 1));
  const offset = (first.getUTCDay() + 6) % 7; // Monday-first
  const max = Math.max(...values);
  const level = (v: number) => (v === 0 ? 0 : Math.min(5, 1 + Math.floor((v / max) * 4.999)));
  const dateOf = (i: number) => new Date(Date.UTC(y, 0, 1 + i));
  const label = (i: number) => dateOf(i).toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", timeZone: "UTC" });

  const stats = useMemo(() => {
    const total = values.reduce((a, b) => a + b, 0);
    let best = 0, streak = 0, run = 0;
    values.forEach((v, i) => {
      if (v > values[best]) best = i;
      run = v > 0 ? run + 1 : 0;
      streak = Math.max(streak, run);
    });
    const byDow = Array(7).fill(0);
    values.forEach((v, i) => (byDow[(offset + i) % 7] += v));
    const quiet = byDow.indexOf(Math.min(...byDow));
    return { total, best, streak, quiet };
  }, [values, offset]);

  const weeks = Math.ceil((values.length + offset) / 7);
  const W = 30 + weeks * (CELL + G), H = 18 + 7 * (CELL + G);
  const onKey = (e: KeyboardEvent) => {
    const d: Record<string, number> = { ArrowRight: 7, ArrowLeft: -7, ArrowDown: 1, ArrowUp: -1, Home: -Infinity, End: Infinity };
    if (!(e.key in d)) return;
    e.preventDefault();
    const cur = at ?? 0;
    const n = e.key === "Home" ? 0 : e.key === "End" ? values.length - 1 : Math.max(0, Math.min(values.length - 1, cur + d[e.key]));
    setAt(n);
  };
  const monthTotals = MONTHS.map((_, m) => values.reduce((a, v, i) => (dateOf(i).getUTCMonth() === m ? a + v : a), 0));

  return (
    <div className={`chm chm--${theme} ${className}`}>
      <header className="chm__head">
        <div>
          <p className="chm__title">
            {title} · {year}
          </p>
          <p className="chm__hero">
            {stats.total.toLocaleString("en-GB")} <span>{unit}</span>
          </p>
        </div>
        <div role="radiogroup" aria-label="Year" className="chm__seg">
          {keys.map((k) => (
            <button key={k} type="button" role="radio" aria-checked={year === k} onClick={() => setYear(k)}>
              {k}
            </button>
          ))}
        </div>
      </header>
      <dl className="chm__stats">
        <div>
          <dt>Busiest day</dt>
          <dd>
            {label(stats.best)} · {values[stats.best]}
          </dd>
        </div>
        <div>
          <dt>Longest streak</dt>
          <dd>{stats.streak} days</dd>
        </div>
        <div>
          <dt>Quietest weekday</dt>
          <dd>{["Mondays", "Tuesdays", "Wednesdays", "Thursdays", "Fridays", "Saturdays", "Sundays"][stats.quiet]}</dd>
        </div>
      </dl>
      <div className="chm__scroll">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          width={W}
          height={H}
          tabIndex={0}
          role="img"
          aria-label={`${title} for ${year}: ${stats.total} ${unit}. Use the arrow keys to read individual days.`}
          onKeyDown={onKey}
          onFocus={() => at === null && setAt(0)}
          onBlur={() => setAt(null)}
          className="chm__svg"
        >
          {MONTHS.map((m, i) => {
            const d = Math.floor((new Date(Date.UTC(y, i, 1)).getTime() - first.getTime()) / 86400000);
            return (
              <text key={m} x={30 + Math.floor((d + offset) / 7) * (CELL + G)} y={10} className="chm__lbl">
                {m}
              </text>
            );
          })}
          {DAY.map((d, i) => (
            <text key={i} x={0} y={18 + i * (CELL + G) + CELL - 2} className="chm__lbl">
              {d}
            </text>
          ))}
          {values.map((v, i) => {
            const c = i + offset;
            return (
              <rect
                key={i}
                x={30 + Math.floor(c / 7) * (CELL + G)}
                y={18 + (c % 7) * (CELL + G)}
                width={CELL}
                height={CELL}
                rx={3}
                fill={ramp[level(v)]}
                className="chm__cell"
                data-on={at === i ? "" : undefined}
                style={{ transitionDelay: `${Math.floor(c / 7) * 6}ms` }}
                onPointerEnter={() => setAt(i)}
                onPointerLeave={() => setAt(null)}
              />
            );
          })}
        </svg>
      </div>
      <div className="chm__foot">
        <p className="chm__read" aria-live="polite">
          {at !== null ? `${label(at)}: ${values[at]} ${unit}` : "Hover a day, or focus the calendar and use the arrow keys."}
        </p>
        <div className="chm__legend" aria-hidden="true">
          Less
          {ramp.map((c) => (
            <i key={c} style={{ background: c }} />
          ))}
          More
        </div>
      </div>
      <table className="chm__sr">
        <caption>
          {unit} per month, {year}
        </caption>
        <tbody>
          {MONTHS.map((m, i) => (
            <tr key={m}>
              <th scope="row">{m}</th>
              <td>{monthTotals[i]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
