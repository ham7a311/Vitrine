"use client";
import { useEffect, useId, useMemo, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import { monotonePath, nearest, niceTicks, sampleMonotone, scale, short } from "./chart";
import "./line-chart.css";

export type LineSeries = { name: string; values: number[] };
export type LineChartProps = {
  title: string;
  /** One date per value, oldest first. */
  dates: Date[];
  /** Up to three series, in a fixed colour order. */
  series: LineSeries[];
  /** The same measure for the period before (aligned to the end), drawn dashed against the first series. */
  previous?: number[];
  /** Selectable windows in days, ending at the last date. */
  ranges?: number[];
  format?: (n: number) => string;
  theme?: "light" | "dark";
  className?: string;
};

const H = 260, M = { t: 14, r: 88, b: 30, l: 46 }, N = 96;
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const day = (d: Date) => `${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]}`;
const ease = (t: number) => 1 - Math.pow(1 - t, 3);
type Shape = { lines: number[][]; prev: number[]; top: number };

/**
 * Line Chart
 * A dashboard line chart: up to three series as smooth monotone lines, an
 * area under the first, an optional dashed previous period, range tabs that
 * morph the lines, legend toggles, a crosshair that reads every series at
 * once, keyboard stepping, and a table of the same numbers.
 */
export function LineChart({ title, dates, series, previous, ranges = [7, 30, 90], format = (n) => n.toLocaleString("en-US"), theme = "light", className = "" }: LineChartProps) {
  const id = useId();
  const box = useRef<HTMLDivElement>(null);
  const [w, setW] = useState(640);
  const [range, setRange] = useState(ranges[Math.min(1, ranges.length - 1)]);
  const [off, setOff] = useState<boolean[]>(series.map(() => false));
  const [showPrev, setShowPrev] = useState(!!previous);
  const [hover, setHover] = useState<number | null>(null);
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setW(Math.max(280, Math.round(e.contentRect.width))));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // The window being shown.
  const n = Math.min(range, dates.length);
  const from = dates.length - n;
  const win = useMemo(() => ({
    dates: dates.slice(from),
    values: series.map((s) => s.values.slice(from)),
    prev: previous ? previous.slice(previous.length - n) : [],
  }), [dates, series, previous, from, n]);

  // Target shape: every series resampled to N points on the same curve, and the axis top.
  const target = useMemo<Shape>(() => {
    const visible = win.values.filter((_, i) => !off[i]);
    const all = [...visible.flat(), ...(showPrev ? win.prev : [])];
    const top = niceTicks(0, Math.max(1, ...all), 4).hi;
    const pts = (v: number[]) => sampleMonotone(v.map((y, i) => [n > 1 ? i / (n - 1) : 0, y] as [number, number]), N).map((p) => p[1]);
    return { lines: win.values.map(pts), prev: win.prev.length ? pts(win.prev) : [], top };
  }, [win, off, showPrev, n]);

  // Morph from what's on screen to the target.
  const [shape, setShape] = useState<Shape>(target);
  const shown = useRef(shape);
  useEffect(() => {
    const a = shown.current, b = target;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) { shown.current = b; setShape(b); return; }
    const t0 = performance.now();
    let raf = 0;
    const mix = (x: number[], y: number[], k: number) => y.map((v, i) => (x[i] ?? v) + (v - (x[i] ?? v)) * k);
    const tick = (now: number) => {
      const k = ease(Math.min(1, (now - t0) / 520));
      const s = { lines: b.lines.map((l, i) => mix(a.lines[i] ?? l, l, k)), prev: mix(a.prev.length ? a.prev : b.prev, b.prev, k), top: a.top + (b.top - a.top) * k };
      shown.current = s; setShape(s);
      if (k < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target]);

  const iw = w - M.l - M.r, ih = H - M.t - M.b;
  const x = scale(0, 1, M.l, M.l + iw), y = scale(0, shape.top, M.t + ih, M.t);
  const ticks = niceTicks(0, shape.top, 4).ticks.filter((t) => t <= shape.top + 1e-9);
  const path = (vals: number[]) => monotonePath(vals.map((v, i) => [x(i / (N - 1)), y(v)] as [number, number]));
  const xi = (i: number) => x(n > 1 ? i / (n - 1) : 0);
  const xLabels = Array.from(new Set([0, Math.round((n - 1) / 3), Math.round((2 * (n - 1)) / 3), n - 1]));

  // Direct labels at the right end, nudged apart so they never collide.
  const ends = series.map((s, i) => ({ i, name: s.name, y: y(shape.lines[i]?.[N - 1] ?? 0) })).filter((e) => !off[e.i]).sort((a, b) => a.y - b.y);
  for (let k = 1; k < ends.length; k++) if (ends[k].y - ends[k - 1].y < 16) ends[k].y = ends[k - 1].y + 16;

  // The headline: total of the visible series over the window, and the change against the previous period.
  const total = win.values.reduce((sum, v, i) => (off[i] ? sum : sum + v.reduce((a, b) => a + b, 0)), 0);
  const firstTotal = win.values[0]?.reduce((a, b) => a + b, 0) ?? 0;
  const prevTotal = win.prev.reduce((a, b) => a + b, 0);
  const delta = prevTotal ? (firstTotal - prevTotal) / prevTotal : null;

  const pick = (e: PointerEvent<SVGRectElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const px = ((e.clientX - r.left) / r.width) * iw;
    setHover(nearest(win.dates.map((_, i) => (n > 1 ? (i / (n - 1)) * iw : 0)), px));
  };
  const key = (e: KeyboardEvent) => {
    const cur = hover ?? n - 1;
    const next = e.key === "ArrowLeft" ? cur - 1 : e.key === "ArrowRight" ? cur + 1 : e.key === "Home" ? 0 : e.key === "End" ? n - 1 : null;
    if (next == null) return;
    e.preventDefault();
    setHover(Math.max(0, Math.min(n - 1, next)));
  };
  const at = hover != null && hover < n ? hover : null;
  const readout = at != null ? `${day(win.dates[at])}: ${series.map((s, i) => (off[i] ? "" : `${s.name} ${format(win.values[i][at])}`)).filter(Boolean).join(", ")}${showPrev && win.prev.length ? `, previous period ${format(win.prev[at])}` : ""}` : "";
  const tipLeft = at != null ? xi(at) : 0;

  return (
    <section className={`lnch lnch--${theme} ${className}`} aria-labelledby={`${id}-t`}>
      <header className="lnch__head">
        <div>
          <h3 id={`${id}-t`}>{title}</h3>
          <p className="lnch__total">
            <strong>{format(total)}</strong>
            {delta != null && (
              <span className={`lnch__delta ${delta >= 0 ? "lnch__delta--up" : "lnch__delta--down"}`}>
                <svg viewBox="0 0 12 12" aria-hidden="true"><path d={delta >= 0 ? "M6 2.5 10 8H2Z" : "M6 9.5 2 4h8Z"} fill="currentColor" /></svg>
                {`${(Math.abs(delta) * 100).toFixed(1)}%`}<span className="lnch__sr"> {delta >= 0 ? "up" : "down"}</span> <small>vs previous {n} days</small>
              </span>
            )}
          </p>
        </div>
        <div className="lnch__ranges" role="group" aria-label="Range">
          {ranges.map((r) => <button key={r} type="button" aria-pressed={range === r} onClick={() => { setRange(r); setHover(null); }}>{r}d</button>)}
        </div>
      </header>

      <div className="lnch__legend" role="group" aria-label="Series">
        {series.map((s, i) => (
          <button key={s.name} type="button" aria-pressed={!off[i]} className={`lnch__key lnch__key--${i + 1}`}
            onClick={() => setOff((o) => { const n2 = [...o]; n2[i] = !n2[i]; return n2.every(Boolean) ? o : n2; })}>
            <i aria-hidden="true" />{s.name}
          </button>
        ))}
        {previous && <button type="button" aria-pressed={showPrev} className="lnch__key lnch__key--prev" onClick={() => setShowPrev((v) => !v)}><i aria-hidden="true" />Previous period</button>}
      </div>

      <div ref={box} className="lnch__plot">
        <svg width={w} height={H} viewBox={`0 0 ${w} ${H}`} aria-hidden="true">
          <defs>
            <linearGradient id={`${id}-a`} x1="0" x2="0" y1="0" y2="1">
              <stop offset="0" className="lnch__area-top" />
              <stop offset="1" className="lnch__area-bottom" />
            </linearGradient>
          </defs>
          {ticks.map((t) => (
            <g key={t}>
              <line className={t === 0 ? "lnch__base" : "lnch__grid"} x1={M.l} x2={M.l + iw} y1={y(t)} y2={y(t)} />
              <text className="lnch__tick" x={M.l - 10} y={y(t)} dy="0.32em" textAnchor="end">{short(t)}</text>
            </g>
          ))}
          {xLabels.map((i) => win.dates[i] && <text key={i} className="lnch__tick" x={xi(i)} y={H - 8} textAnchor={i === 0 ? "start" : i === n - 1 ? "end" : "middle"}>{day(win.dates[i])}</text>)}
          {!off[0] && shape.lines[0] && <path className="lnch__area" d={`${path(shape.lines[0])}L${x(1)},${y(0)}L${x(0)},${y(0)}Z`} fill={`url(#${id}-a)`} />}
          {showPrev && shape.prev.length > 0 && <path className="lnch__prev" d={path(shape.prev)} />}
          {shape.lines.map((l, i) => <path key={i} className={`lnch__line lnch__line--${i + 1}`} d={path(l)} data-off={off[i] || undefined} />)}
          {ends.map((e) => (
            <g key={e.i} className={`lnch__end lnch__end--${e.i + 1}`}>
              <circle cx={M.l + iw + 10} cy={e.y} r="3.5" />
              <text x={M.l + iw + 18} y={e.y} dy="0.32em">{e.name}</text>
            </g>
          ))}
          {at != null && (
            <g className="lnch__cross">
              <line x1={xi(at)} x2={xi(at)} y1={M.t} y2={M.t + ih} />
              {showPrev && win.prev.length > 0 && <circle className="lnch__dot lnch__dot--prev" cx={xi(at)} cy={y(win.prev[at])} r="4" />}
              {series.map((_, i) => !off[i] && <circle key={i} className={`lnch__dot lnch__dot--${i + 1}`} cx={xi(at)} cy={y(win.values[i][at])} r="4.5" />)}
            </g>
          )}
          <rect className="lnch__hit" x={M.l} y={M.t} width={iw} height={ih} onPointerMove={pick} onPointerDown={pick} onPointerLeave={() => !focused && setHover(null)} />
        </svg>
        {/* The keyboard layer: one stop, arrows step through the days. */}
        <div className="lnch__focus" tabIndex={0} role="application" aria-roledescription="chart" aria-label={`${title}. Use the left and right arrow keys to read each day.`}
          style={{ left: M.l, top: M.t, width: iw, height: ih }} onKeyDown={key}
          onFocus={() => { setFocused(true); setHover((h) => h ?? n - 1); }} onBlur={() => { setFocused(false); setHover(null); }} />
        {at != null && (
          <div className="lnch__tip" style={{ left: tipLeft, ["--flip" as string]: tipLeft > w - 200 ? 1 : 0 }} aria-hidden="true">
            <p>{day(win.dates[at])}</p>
            {series.map((s, i) => !off[i] && <p key={s.name} className={`lnch__row lnch__row--${i + 1}`}><i /><strong>{format(win.values[i][at])}</strong><span>{s.name}</span></p>)}
            {showPrev && win.prev.length > 0 && <p className="lnch__row lnch__row--prev"><i /><strong>{format(win.prev[at])}</strong><span>Previous</span></p>}
          </div>
        )}
        <p className="lnch__sr" aria-live="polite">{focused ? readout : ""}</p>
      </div>

      <table className="lnch__sr">
        <caption>{title}, last {n} days</caption>
        <thead><tr><th scope="col">Date</th>{series.map((s) => <th key={s.name} scope="col">{s.name}</th>)}{win.prev.length > 0 && <th scope="col">Previous period</th>}</tr></thead>
        <tbody>
          {win.dates.map((d, i) => (
            <tr key={i}><th scope="row">{day(d)}</th>{win.values.map((v, k) => <td key={k}>{format(v[i])}</td>)}{win.prev.length > 0 && <td>{format(win.prev[i])}</td>}</tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
