"use client";

import { useMemo, useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import "./streak-field-stats.css";

/**
 * Streak Field Stats
 * A year of days as a field of small squares, with the streaks pulled out
 * beside it. Touch a day and a ripple spreads out from it through the field,
 * each square lifting a moment later than the one before; pick a streak and
 * its days light up in order, so you can see the run as a run.
 */

type Props = {
  /** One value per day, oldest first. */
  values: number[];
  /** The date of the last value. */
  end: Date;
  /** e.g. "km" */
  unit: string;
  /** e.g. "Days on the move" */
  label: string;
  theme?: "paper" | "night";
  motion?: "full" | "reduced";
  className?: string;
};

type Run = { from: number; to: number };

const DAY = 86400000;
const ROWS = ["Mon", "", "Wed", "", "Fri", "", ""];
const fmt = (d: Date, o: Intl.DateTimeFormatOptions) => d.toLocaleDateString("en-GB", { ...o, timeZone: "UTC" });

function runs(values: number[]) {
  const out: Run[] = [];
  let start = -1;
  values.forEach((v, i) => {
    if (v > 0 && start < 0) start = i;
    if ((v <= 0 || i === values.length - 1) && start >= 0) { out.push({ from: start, to: v > 0 ? i : i - 1 }); start = -1; }
  });
  return out;
}

export function StreakFieldStats({ values, end, unit, label, theme = "paper", motion = "full", className = "" }: Props) {
  const n = values.length;
  const first = new Date(end.getTime() - (n - 1) * DAY);
  const lead = (first.getUTCDay() + 6) % 7; // Monday-first offset of day 0
  const cols = Math.ceil((n + lead) / 7);
  const top = Math.max(...values);
  const level = (v: number) => (v <= 0 ? 0 : Math.min(4, Math.ceil((v / top) * 4)));
  const cell = (i: number) => ({ c: Math.floor((i + lead) / 7), r: (i + lead) % 7 });
  const date = (i: number) => new Date(first.getTime() + i * DAY);

  const stats = useMemo(() => {
    const all = runs(values);
    const longest = all.reduce((a, b) => (b.to - b.from > a.to - a.from ? b : a), all[0] ?? { from: 0, to: -1 });
    const last = all[all.length - 1];
    const current = last && last.to === n - 1 ? last : { from: n, to: n - 1 };
    const total = values.reduce((a, b) => a + b, 0);
    const active = values.filter((v) => v > 0).length;
    return { longest, current, total, active };
  }, [values, n]);

  const field = useRef<HTMLDivElement>(null);
  const cells = useRef<(HTMLButtonElement | null)[]>([]);
  const [focus, setFocus] = useState(n - 1);
  const [tip, setTip] = useState<number | null>(null);
  const [wave, setWave] = useState<{ c: number; r: number; k: number } | null>(null);
  const [lit, setLit] = useState<"longest" | "current" | null>(null);
  const lastWave = useRef(0);

  // A new ripple from this day, but not more often than the last one can travel.
  const ripple = (i: number) => {
    const now = performance.now();
    if (now - lastWave.current < 220) return;
    lastWave.current = now;
    const { c, r } = cell(i);
    setWave((w) => ({ c, r, k: (w?.k ?? 0) + 1 }));
  };

  const show = (i: number) => { setTip(i); ripple(i); };

  const onKey = (e: KeyboardEvent, i: number) => {
    const to =
      e.key === "ArrowRight" ? i + 7 : e.key === "ArrowLeft" ? i - 7 :
      e.key === "ArrowDown" ? i + 1 : e.key === "ArrowUp" ? i - 1 :
      e.key === "Home" ? 0 : e.key === "End" ? n - 1 : null;
    if (to === null) return;
    e.preventDefault();
    const j = Math.max(0, Math.min(n - 1, to));
    setFocus(j);
    cells.current[j]?.focus();
  };

  const run = lit ? stats[lit] : null;
  const span = (r: Run) => r.to - r.from + 1;
  const range = (r: Run) => `${fmt(date(r.from), { day: "numeric", month: "short" })} – ${fmt(date(r.to), { day: "numeric", month: "short" })}`;

  // Month labels over the column where each month's first day falls.
  const months: { c: number; t: string }[] = [];
  for (let i = 0; i < n; i++) if (date(i).getUTCDate() === 1) months.push({ c: cell(i).c, t: fmt(date(i), { month: "short" }) });

  const t = tip !== null ? cell(tip) : null;

  return (
    <section className={`sfs sfs--${theme} ${className}`} data-motion={motion} aria-label={label}>
      <div className="sfs__side">
        <p className="sfs__eyebrow">{label}</p>
        <p className="sfs__total">
          <span className="sfs__big">{Math.round(stats.total).toLocaleString("en-US")}</span> {unit}
        </p>
        <p className="sfs__sub">{stats.active} active days in the last {Math.round(n / 7)} weeks</p>
        <div className="sfs__runs">
          {(["longest", "current"] as const).map((k) => {
            const r = stats[k];
            const len = Math.max(0, span(r));
            return (
              <button
                key={k}
                type="button"
                className="sfs__run"
                aria-pressed={lit === k}
                disabled={len === 0}
                onClick={() => setLit((v) => (v === k ? null : k))}
              >
                <span className="sfs__run-k">{k === "longest" ? "Longest streak" : "Current streak"}</span>
                <span className="sfs__run-v">{len} <small>days</small></span>
                <span className="sfs__run-d">{len ? range(r) : "Not running"}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="sfs__scroll">
        <div className="sfs__frame" style={{ "--cols": cols } as CSSProperties}>
          <div className="sfs__months" aria-hidden="true">
            {months.map((m) => <span key={m.c} style={{ gridColumn: m.c + 1 }}>{m.t}</span>)}
          </div>
          <div className="sfs__days" aria-hidden="true">{ROWS.map((d, i) => <span key={i}>{d}</span>)}</div>
          <div
            ref={field}
            className="sfs__field"
            role="grid"
            aria-label={`${label}, one square per day`}
            data-wave={wave ? (wave.k % 2 ? "a" : "b") : undefined}
            data-lit={lit || undefined}
            style={wave ? ({ "--oc": wave.c, "--or": wave.r } as CSSProperties) : undefined}
            onPointerLeave={() => setTip(null)}
          >
            {Array.from({ length: 7 }, (_, r) => (
              <div key={r} role="row" className="sfs__row">
                {Array.from({ length: cols }, (_, c) => {
                  const i = c * 7 + r - lead;
                  if (i < 0 || i >= n) return <span key={c} role="gridcell" className="sfs__gap" style={{ gridColumn: c + 1, gridRow: r + 1 }} />;
                  const v = values[i];
                  const inRun = run && i >= run.from && i <= run.to;
                  return (
                    <span key={c} role="gridcell" style={{ gridColumn: c + 1, gridRow: r + 1 }}>
                      <button
                        ref={(el) => void (cells.current[i] = el)}
                        type="button"
                        tabIndex={i === focus ? 0 : -1}
                        className="sfs__cell"
                        data-l={level(v)}
                        data-run={inRun || undefined}
                        style={{ "--c": c, "--r": r, "--s": inRun ? i - run!.from : 0 } as CSSProperties}
                        aria-label={`${fmt(date(i), { weekday: "long", day: "numeric", month: "long" })}: ${v > 0 ? `${v} ${unit}` : "rest day"}`}
                        onPointerEnter={() => show(i)}
                        onFocus={() => { setFocus(i); show(i); }}
                        onBlur={() => setTip(null)}
                        onKeyDown={(e) => onKey(e, i)}
                      />
                    </span>
                  );
                })}
              </div>
            ))}
          </div>
          {t && tip !== null && (
            <p className="sfs__tip" aria-hidden="true" data-edge={t.c < 6 ? "start" : t.c > cols - 7 ? "end" : undefined} style={{ "--tc": t.c, "--tr": t.r } as CSSProperties}>
              <strong>{values[tip] > 0 ? `${values[tip]} ${unit}` : "Rest day"}</strong> {fmt(date(tip), { weekday: "short", day: "numeric", month: "short" })}
            </p>
          )}
          <p className="sfs__legend" aria-hidden="true">
            Less {[0, 1, 2, 3, 4].map((l) => <span key={l} className="sfs__cell sfs__cell--key" data-l={l} />)} More
          </p>
        </div>
      </div>
    </section>
  );
}
