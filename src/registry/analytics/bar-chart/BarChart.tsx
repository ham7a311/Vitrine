"use client";
import { useEffect, useId, useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import { niceTicks, short } from "../line-chart/chart";
import { layout, move, peak } from "./bars";
import "./bar-chart.css";

export type BarSeries = { name: string; values: number[] };
export type BarChartProps = {
  title: string;
  subtitle?: string;
  categories: string[];
  /** Up to three series, in a fixed colour order. */
  series: BarSeries[];
  mode?: "grouped" | "stacked";
  orientation?: "vertical" | "horizontal";
  /** Show the Grouped/Stacked and orientation switches. */
  controls?: boolean;
  format?: (n: number) => string;
  theme?: "light" | "dark";
  className?: string;
};

/**
 * Bar Chart
 * Grouped or stacked bars that move between the two (and between upright
 * and sideways) instead of jumping, with rounded data ends, a hairline gap
 * between neighbours, a tooltip per bar, arrow-key navigation and a table.
 */
export function BarChart({ title, subtitle, categories, series, mode: initialMode = "grouped", orientation: initialOrient = "vertical", controls = true, format = (n) => n.toLocaleString("en-US"), theme = "light", className = "" }: BarChartProps) {
  const id = useId();
  const root = useRef<HTMLElement>(null);
  const [mode, setMode] = useState(initialMode);
  const [orient, setOrient] = useState(initialOrient);
  const [seen, setSeen] = useState(false);
  const [active, setActive] = useState<[number, number] | null>(null);
  const [cursor, setCursor] = useState<[number, number]>([categories.length - 1, 0]);
  const barRefs = useRef(new Map<string, HTMLDivElement>());

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setSeen(true); io.disconnect(); } }, { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Turning the chart sideways regrows the bars along their new axis.
  const firstOrient = useRef(true);
  useEffect(() => {
    if (firstOrient.current) { firstOrient.current = false; return; }
    setSeen(false);
    let r2 = 0;
    const r1 = requestAnimationFrame(() => { r2 = requestAnimationFrame(() => setSeen(true)); });
    return () => { cancelAnimationFrame(r1); cancelAnimationFrame(r2); };
  }, [orient]);

  const data = series.map((s) => s.values);
  const ticks = niceTicks(0, peak(data, mode), 4);
  const boxes = layout(data, ticks.hi, mode);
  const vertical = orient === "vertical";
  const totals = categories.map((_, i) => data.reduce((a, s) => a + s[i], 0));
  const keyOf = (c: number, s: number) => `${c}:${s}`;

  const onKey = (e: KeyboardEvent, c: number, s: number) => {
    // Up and down follow the series when upright; sideways, the arrows swap roles.
    const k = vertical ? e.key : ({ ArrowUp: "ArrowLeft", ArrowDown: "ArrowRight", ArrowLeft: "ArrowDown", ArrowRight: "ArrowUp" } as Record<string, string>)[e.key] ?? e.key;
    const next = move(c, s, k, categories.length, series.length);
    if (!next) return;
    e.preventDefault();
    setCursor(next); setActive(next);
    barRefs.current.get(keyOf(...next))?.focus();
  };
  const label = (c: number, s: number) => `${categories[c]}, ${series[s].name}: ${format(data[s][c])}${mode === "stacked" ? ` of ${format(totals[c])}` : ""}`;
  const tip = active && boxes.find((b) => b.cat === active[0] && b.s === active[1]);

  return (
    <section ref={root} className={`brch brch--${theme} brch--${orient} brch--${mode} ${className}`} data-in={seen || undefined} aria-labelledby={`${id}-t`}>
      <header className="brch__head">
        <div>
          <h3 id={`${id}-t`}>{title}</h3>
          {subtitle && <p>{subtitle}</p>}
        </div>
        {controls && (
          <div className="brch__controls">
            <div className="brch__seg" role="group" aria-label="Layout">
              {(["grouped", "stacked"] as const).map((m) => <button key={m} type="button" aria-pressed={mode === m} onClick={() => setMode(m)}>{m === "grouped" ? "Grouped" : "Stacked"}</button>)}
            </div>
            <div className="brch__seg" role="group" aria-label="Orientation">
              <button type="button" aria-pressed={vertical} aria-label="Upright bars" onClick={() => setOrient("vertical")}>
                <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 13V8M8 13V3M13 13V6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" /></svg>
              </button>
              <button type="button" aria-pressed={!vertical} aria-label="Sideways bars" onClick={() => setOrient("horizontal")}>
                <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 3h5M3 8h10M3 13h7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" /></svg>
              </button>
            </div>
          </div>
        )}
      </header>

      <div className="brch__legend" aria-hidden="true">
        {series.map((s, i) => <span key={s.name} className={`brch__key brch__key--${i + 1}`}><i />{s.name}</span>)}
      </div>

      <div className="brch__frame">
        <div className="brch__plot" data-hover={active ? true : undefined} onPointerLeave={() => setActive(null)}>
          {ticks.ticks.map((t) => (
            <div key={t} className={`brch__grid ${t === 0 ? "brch__grid--base" : ""}`} style={{ ["--p" as string]: `${(t / ticks.hi) * 100}%` } as CSSProperties}>
              <span>{short(t)}</span>
            </div>
          ))}
          <div className="brch__bars" role="group" aria-label={`${title}. Use the arrow keys to move between bars.`}>
            {boxes.map((b) => {
              const k = keyOf(b.cat, b.s);
              const on = active && active[0] === b.cat && active[1] === b.s;
              const focusable = cursor[0] === b.cat && cursor[1] === b.s;
              return (
                <div
                  key={k}
                  ref={(el) => { if (el) barRefs.current.set(k, el); else barRefs.current.delete(k); }}
                  className={`brch__bar brch__bar--${b.s + 1}`}
                  data-top={b.top || undefined}
                  data-first={(b.from === 0) || undefined}
                  data-on={on || undefined}
                  style={{ ["--a" as string]: `${b.along}%`, ["--z" as string]: `${b.size}%`, ["--f" as string]: `${b.from}%`, ["--t" as string]: `${b.to}%`, ["--d" as string]: `${b.cat * 45 + b.s * 25}ms` } as CSSProperties}
                  role="img"
                  tabIndex={focusable ? 0 : -1}
                  aria-label={label(b.cat, b.s)}
                  onPointerEnter={() => setActive([b.cat, b.s])}
                  onFocus={() => { setCursor([b.cat, b.s]); setActive([b.cat, b.s]); }}
                  onBlur={() => setActive(null)}
                  onKeyDown={(e) => onKey(e, b.cat, b.s)}
                />
              );
            })}
            {mode === "stacked" && categories.map((c, i) => (
              <span key={c} className="brch__total" aria-hidden="true" style={{ ["--a" as string]: `${(100 / categories.length) * (i + 0.5)}%`, ["--t" as string]: `${(totals[i] / ticks.hi) * 100}%` } as CSSProperties}>{short(totals[i])}</span>
            ))}
          </div>
          {tip && (
            <div className="brch__tip" aria-hidden="true" style={{ ["--a" as string]: `${tip.along + tip.size / 2}%`, ["--t" as string]: `${tip.to}%` } as CSSProperties}>
              <p>{categories[tip.cat]}</p>
              <p className={`brch__row brch__row--${tip.s + 1}`}><i /><strong>{format(tip.v)}</strong><span>{series[tip.s].name}</span></p>
              {mode === "stacked" && <p className="brch__row brch__row--sum"><strong>{format(totals[tip.cat])}</strong><span>Total</span></p>}
            </div>
          )}
        </div>
        <div className="brch__cats" aria-hidden="true">
          {categories.map((c, i) => <span key={c} style={{ ["--a" as string]: `${(100 / categories.length) * (i + 0.5)}%` } as CSSProperties}>{c}</span>)}
        </div>
      </div>

      <table className="brch__sr">
        <caption>{title}{subtitle ? `, ${subtitle}` : ""}</caption>
        <thead><tr><th scope="col">Month</th>{series.map((s) => <th key={s.name} scope="col">{s.name}</th>)}<th scope="col">Total</th></tr></thead>
        <tbody>{categories.map((c, i) => <tr key={c}><th scope="row">{c}</th>{data.map((s, k) => <td key={k}>{format(s[i])}</td>)}<td>{format(totals[i])}</td></tr>)}</tbody>
      </table>
    </section>
  );
}
