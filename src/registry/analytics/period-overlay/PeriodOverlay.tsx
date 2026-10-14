"use client";
import { useEffect, useId, useLayoutEffect, useRef, useState, type KeyboardEvent } from "react";
import { compact, delta, monotone, nearest, niceMax, pct, resample, sum } from "./period";
import "./period-overlay.css";

export type PeriodRange = {
  id: string;
  /** Segment label, e.g. "30D". */
  label: string;
  /** What the comparison is called, e.g. "previous 30 days". */
  versus: string;
  current: number[];
  previous: number[];
  /** A label per point, e.g. "Mon 6 Oct", for both periods. */
  labels: string[];
  previousLabels: string[];
};

export type PeriodOverlayProps = {
  title: string;
  ranges: PeriodRange[];
  /** Which range shows first (defaults to the second, or the only one). */
  initial?: string;
  format?: (n: number) => string;
  theme?: "night" | "paper";
  className?: string;
};

const H = 248, PAD = { l: 44, r: 12, t: 14, b: 26 };
const ease = (k: number) => 1 - (1 - k) ** 3;

/**
 * Period Overlay
 * This period against the last one on the same axis: the current line solid over a soft area, the
 * previous one dashed behind it, and the gap between them tinted by which way it went. Scrub with
 * the pointer or arrow keys to compare any day with its counterpart; switching the range morphs
 * both lines into place.
 */
export function PeriodOverlay({ title, ranges, initial, format = (n) => n.toLocaleString("en-GB"), theme = "night", className = "" }: PeriodOverlayProps) {
  const uid = useId();
  const [rangeId, setRangeId] = useState(initial ?? ranges[Math.min(1, ranges.length - 1)].id);
  const range = ranges.find((r) => r.id === rangeId) ?? ranges[0];
  const box = useRef<HTMLDivElement>(null);
  const [w, setW] = useState(640);
  const [at, setAt] = useState<number | null>(null);
  // what's drawn: eased from the last range's lines to this one's
  const target = { cur: range.current, prev: range.previous, max: niceMax(Math.max(...range.current, ...range.previous) * 1.08) };
  const [shown, setShown] = useState(target);
  const from = useRef(target);

  useLayoutEffect(() => {
    const el = box.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setW(Math.max(260, Math.round(e.contentRect.width))));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    setAt(null);
    const n = range.current.length;
    const a = { cur: resample(from.current.cur, n), prev: resample(from.current.prev, n), max: from.current.max };
    const b = { cur: range.current, prev: range.previous, max: niceMax(Math.max(...range.current, ...range.previous) * 1.08) };
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) { setShown(b); from.current = b; return; }
    let raf = 0;
    const t0 = performance.now();
    const step = (now: number) => {
      const k = ease(Math.min(1, (now - t0) / 600));
      const mix = (x: number[], y: number[]) => x.map((v, i) => v + (y[i] - v) * k);
      const s = { cur: mix(a.cur, b.cur), prev: mix(a.prev, b.prev), max: a.max + (b.max - a.max) * k };
      setShown(s); from.current = s;
      if (k < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rangeId]);

  const n = shown.cur.length;
  const iw = w - PAD.l - PAD.r, ih = H - PAD.t - PAD.b;
  const X = (i: number) => PAD.l + (n <= 1 ? iw / 2 : (i / (n - 1)) * iw);
  const Y = (v: number) => PAD.t + ih - (v / shown.max) * ih;
  const cur = shown.cur.map((v, i) => ({ x: X(i), y: Y(v) })), prev = shown.prev.map((v, i) => ({ x: X(i), y: Y(v) }));
  const curPath = monotone(cur), prevPath = monotone(prev);
  const area = `${curPath}L${X(n - 1)},${PAD.t + ih}L${X(0)},${PAD.t + ih}Z`;
  const total = sum(range.current), before = sum(range.previous), d = delta(total, before);
  const ticks = [0, 0.25, 0.5, 0.75, 1].map((k) => k * shown.max);
  const lab = range.labels, show = at !== null && at < range.current.length ? at : null;

  const move = (clientX: number) => {
    const r = box.current!.getBoundingClientRect();
    setAt(nearest(clientX - r.left - PAD.l, iw, range.current.length));
  };
  const key = (e: KeyboardEvent) => {
    const last = range.current.length - 1;
    const next = e.key === "ArrowRight" ? Math.min(last, (at ?? -1) + 1) : e.key === "ArrowLeft" ? Math.max(0, (at ?? last + 1) - 1) : e.key === "Home" ? 0 : e.key === "End" ? last : undefined;
    if (next !== undefined) { e.preventDefault(); setAt(next); }
    else if (e.key === "Escape") setAt(null);
  };

  const pd = show !== null ? delta(range.current[show], range.previous[show]) : null;
  return (
    <section className={`pover pover--${theme} ${className}`} aria-labelledby={`${uid}-t`}>
      <header className="pover__head">
        <div>
          <h3 id={`${uid}-t`} className="pover__title">{title}</h3>
          <p className="pover__total">
            <span className="pover__num">{format(total)}</span>
            <span className={`pover__chip ${d !== null && d < 0 ? "is-down" : "is-up"}`}>
              <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true"><path d={d !== null && d < 0 ? "M5 8.5 1.5 4h7z" : "M5 1.5 8.5 6h-7z"} fill="currentColor" /></svg>
              {pct(d)}
            </span>
          </p>
          <p className="pover__vs">vs {range.versus} · {format(before)}</p>
        </div>
        <div className="pover__seg" role="radiogroup" aria-label="Range">
          {ranges.map((r) => (
            <button key={r.id} type="button" role="radio" aria-checked={r.id === rangeId} onClick={() => setRangeId(r.id)}>{r.label}</button>
          ))}
        </div>
      </header>
      <ul className="pover__legend" aria-hidden="true">
        <li><i className="pover__key pover__key--cur" />This period</li>
        <li><i className="pover__key pover__key--prev" />Previous</li>
      </ul>
      <div
        ref={box} className="pover__plot" tabIndex={0} role="group"
        aria-label={`${title}: ${format(total)} this period, ${pct(d)} against ${range.versus}. Use the arrow keys to compare day by day.`}
        onPointerMove={(e) => move(e.clientX)} onPointerDown={(e) => move(e.clientX)} onPointerLeave={(e) => { if (e.pointerType === "mouse") setAt(null); }} onKeyDown={key} onBlur={() => setAt(null)}
      >
        <svg width={w} height={H} viewBox={`0 0 ${w} ${H}`} aria-hidden="true">
          <defs>
            <linearGradient id={`${uid}-a`} x1="0" x2="0" y1="0" y2="1"><stop offset="0" className="pover__fade0" /><stop offset="1" className="pover__fade1" /></linearGradient>
          </defs>
          {ticks.map((t, i) => (
            <g key={i}>
              <line className="pover__grid" x1={PAD.l} x2={w - PAD.r} y1={Y(t)} y2={Y(t)} />
              <text className="pover__axis" x={PAD.l - 8} y={Y(t) + 3.5} textAnchor="end">{compact(t)}</text>
            </g>
          ))}
          {/* the gap between the periods, tinted by direction */}
          {cur.slice(0, -1).map((p, i) => {
            const up = shown.cur[i] + shown.cur[i + 1] >= shown.prev[i] + shown.prev[i + 1];
            return <path key={i} className={up ? "pover__gap is-up" : "pover__gap is-down"} d={`M${p.x},${p.y}L${cur[i + 1].x},${cur[i + 1].y}L${prev[i + 1].x},${prev[i + 1].y}L${prev[i].x},${prev[i].y}Z`} />;
          })}
          <path d={area} fill={`url(#${uid}-a)`} />
          <path className="pover__prev" d={prevPath} />
          <path className="pover__cur" d={curPath} />
          {[0, Math.floor((lab.length - 1) / 2), lab.length - 1].filter((v, i, a) => a.indexOf(v) === i).map((i) => (
            <text key={i} className="pover__axis" x={X(Math.min(i, n - 1))} y={H - 6} textAnchor={i === 0 ? "start" : i === lab.length - 1 ? "end" : "middle"}>{lab[i]}</text>
          ))}
          {show !== null && (
            <g>
              <line className="pover__cross" x1={X(show)} x2={X(show)} y1={PAD.t} y2={PAD.t + ih} />
              <circle className="pover__dot pover__dot--prev" cx={X(show)} cy={Y(shown.prev[show])} r={4} />
              <circle className="pover__dot" cx={X(show)} cy={Y(shown.cur[show])} r={4.5} />
            </g>
          )}
        </svg>
        {show !== null && (
          <div className="pover__tip" style={{ left: Math.min(Math.max(X(show), 90), w - 90) }}>
            <p className="pover__tip-row"><i className="pover__key pover__key--cur" /><span>{range.labels[show]}</span><b>{format(range.current[show])}</b></p>
            <p className="pover__tip-row"><i className="pover__key pover__key--prev" /><span>{range.previousLabels[show]}</span><b>{format(range.previous[show])}</b></p>
            <p className={`pover__tip-d ${pd !== null && pd < 0 ? "is-down" : "is-up"}`}>{pd !== null && pd < 0 ? "▼" : "▲"} {pct(pd)}</p>
          </div>
        )}
      </div>
      <p className="pover__sr" aria-live="polite">
        {show !== null ? `${range.labels[show]}: ${format(range.current[show])}, against ${format(range.previous[show])} on ${range.previousLabels[show]}, ${pct(pd)}.` : ""}
      </p>
    </section>
  );
}

export default PeriodOverlay;
