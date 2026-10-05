"use client";

import { useEffect, useId, useMemo, useRef, useState, type KeyboardEvent, type PointerEvent as RPointerEvent } from "react";
import "./pulse-line-chart.css";

/**
 * Pulse Line
 * Revenue over time, the way a good dashboard opens: the line draws itself
 * in over a soft area, the previous period sits behind it as a dashed
 * ghost, and the peak and the latest day are labelled where they are.
 * Switch the range and the line morphs into its new shape rather than
 * blinking; move along it and a crosshair snaps to the nearest day with
 * the value and how it compares.
 */

export type Point = { date: Date; value: number; prev: number };
type Range = "7D" | "30D" | "90D" | "12M";
type Props = { daily: Point[]; currency?: string; title?: string; theme?: "light" | "dark"; motion?: "full" | "reduced"; className?: string };

const N = 72; // samples per morphable curve
const H = 280, PAD = { t: 22, r: 18, b: 30, l: 50 };
const fmtK = (v: number) => (v >= 1000 ? `${(v / 1000).toFixed(v >= 10000 ? 0 : 1)}k` : `${Math.round(v)}`);
const fmtFull = (v: number) => Math.round(v).toLocaleString("en-GB");
const dayFmt = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short" });
const monFmt = new Intl.DateTimeFormat("en-GB", { month: "short", year: "2-digit" });

/** Monotone cubic (Fritsch–Carlson) through points, evaluated at x — smooth but never overshoots. */
function monotone(xs: number[], ys: number[]) {
  const n = xs.length;
  if (n === 1) return () => ys[0];
  const d = xs.slice(0, -1).map((x, i) => (ys[i + 1] - ys[i]) / (xs[i + 1] - x));
  const m = ys.map((_, i) => (i === 0 ? d[0] : i === n - 1 ? d[n - 2] : d[i - 1] * d[i] <= 0 ? 0 : (d[i - 1] + d[i]) / 2));
  for (let i = 0; i < n - 1; i++) {
    if (d[i] === 0) { m[i] = m[i + 1] = 0; continue; }
    const a = m[i] / d[i], b = m[i + 1] / d[i], s = a * a + b * b;
    if (s > 9) { const t = 3 / Math.sqrt(s); m[i] = t * a * d[i]; m[i + 1] = t * b * d[i]; }
  }
  return (x: number) => {
    let i = Math.min(n - 2, Math.max(0, xs.findIndex((v, k) => k < n - 1 && x <= xs[k + 1])));
    if (i < 0) i = n - 2;
    const h = xs[i + 1] - xs[i], t = (x - xs[i]) / h;
    const t2 = t * t, t3 = t2 * t;
    return (2 * t3 - 3 * t2 + 1) * ys[i] + (t3 - 2 * t2 + t) * h * m[i] + (-2 * t3 + 3 * t2) * ys[i + 1] + (t3 - t2) * h * m[i + 1];
  };
}
/** A "nice" axis maximum and step. */
function nice(max: number, ticks = 4) {
  const raw = max / ticks, p = Math.pow(10, Math.floor(Math.log10(raw))), f = raw / p;
  const step = (f <= 1 ? 1 : f <= 2 ? 2 : f <= 2.5 ? 2.5 : f <= 5 ? 5 : 10) * p;
  return { top: Math.ceil(max / step) * step, step };
}

export function PulseLineChart({ daily, currency = "OMR", title = "Revenue", theme = "light", motion = "full", className = "" }: Props) {
  const id = useId();
  const wrapRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [W, setW] = useState(720);
  const [range, setRange] = useState<Range>("30D");
  const [view, setView] = useState<"chart" | "table">("chart");
  const [hover, setHover] = useState<number | null>(null);
  const [seen, setSeen] = useState(false);
  const reduced = () => motion === "reduced" || (typeof window !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches);

  // The points for the chosen range: days, or months for the year.
  const pts = useMemo(() => {
    if (range === "12M") {
      const out: Point[] = [];
      const last = daily[daily.length - 1].date;
      for (let k = 11; k >= 0; k--) {
        const m = new Date(last.getFullYear(), last.getMonth() - k, 1);
        const inM = daily.filter((p) => p.date.getFullYear() === m.getFullYear() && p.date.getMonth() === m.getMonth());
        out.push({ date: m, value: inM.reduce((s, p) => s + p.value, 0), prev: inM.reduce((s, p) => s + p.prev, 0) });
      }
      return out;
    }
    const n = range === "7D" ? 7 : range === "30D" ? 30 : 90;
    return daily.slice(-n);
  }, [daily, range]);

  const total = pts.reduce((s, p) => s + p.value, 0), prevTotal = pts.reduce((s, p) => s + p.prev, 0);
  const delta = (total - prevTotal) / prevTotal;
  const scale = nice(Math.max(...pts.map((p) => Math.max(p.value, p.prev))) * 1.08);
  const iw = W - PAD.l - PAD.r, ih = H - PAD.t - PAD.b;
  const xAt = (i: number) => PAD.l + (pts.length === 1 ? iw / 2 : (i / (pts.length - 1)) * iw);

  // The curve sampled at N positions, so any range can morph into any other.
  const sample = (key: "value" | "prev") => {
    const xs = pts.map((_, i) => i / Math.max(1, pts.length - 1)), ys = pts.map((p) => p[key]);
    const f = monotone(xs, ys);
    return Array.from({ length: N }, (_, k) => f(k / (N - 1)));
  };
  const target = useMemo(() => ({ v: sample("value"), p: sample("prev"), top: scale.top }), [pts, scale.top]); // eslint-disable-line react-hooks/exhaustive-deps
  const [shown, setShown] = useState(target);
  const fromRef = useRef(target);

  useEffect(() => {
    if (reduced()) { setShown(target); fromRef.current = target; return; }
    const from = fromRef.current, t0 = performance.now();
    let raf = 0;
    const step = (now: number) => {
      const t = Math.min(1, (now - t0) / 520), e = 1 - Math.pow(1 - t, 3);
      const cur = { v: target.v.map((y, k) => from.v[k] + (y - from.v[k]) * e), p: target.p.map((y, k) => from.p[k] + (y - from.p[k]) * e), top: from.top + (target.top - from.top) * e };
      setShown(cur);
      fromRef.current = cur;
      if (t < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target]); // eslint-disable-line react-hooks/exhaustive-deps

  // Width from the container; draw-in once in view.
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setW(Math.max(300, Math.round(e.contentRect.width))));
    ro.observe(el);
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setSeen(true); io.disconnect(); } }, { threshold: 0.3 });
    io.observe(el);
    return () => { ro.disconnect(); io.disconnect(); };
  }, []);

  const y = (v: number) => PAD.t + ih - (v / shown.top) * ih;
  const path = (arr: number[]) => arr.map((v, k) => `${k ? "L" : "M"}${(PAD.l + (k / (N - 1)) * iw).toFixed(1)} ${y(v).toFixed(1)}`).join(" ");
  const line = path(shown.v), ghost = path(shown.p);
  const area = `${line} L${PAD.l + iw} ${PAD.t + ih} L${PAD.l} ${PAD.t + ih} Z`;
  const ticks = Array.from({ length: Math.round(shown.top / scale.step) + 1 }, (_, k) => k * scale.step).filter((v) => v <= shown.top + 1e-6);
  const label = (d: Date) => (range === "12M" ? monFmt.format(d) : dayFmt.format(d));
  // Evenly spaced ticks counted back from the latest point, so the last one is always labelled.
  const xTicks = (() => {
    const want = Math.min(pts.length, W < 520 ? 4 : 6);
    const step = Math.max(1, Math.ceil((pts.length - 1) / (want - 1)));
    const out: number[] = [];
    for (let i = pts.length - 1; i >= 0; i -= step) out.unshift(i);
    return out;
  })();
  const peakI = pts.reduce((b, p, i) => (p.value > pts[b].value ? i : b), 0);
  const lastI = pts.length - 1;

  // Crosshair: snap to the nearest real point.
  const pick = (e: RPointerEvent) => {
    const r = svgRef.current!.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) * W;
    const i = Math.round(((x - PAD.l) / iw) * (pts.length - 1));
    setHover(Math.max(0, Math.min(pts.length - 1, i)));
  };
  const onKey = (e: KeyboardEvent) => {
    if (e.key === "ArrowRight") { e.preventDefault(); setHover((h) => Math.min(lastI, (h ?? -1) + 1)); }
    else if (e.key === "ArrowLeft") { e.preventDefault(); setHover((h) => Math.max(0, (h ?? lastI + 1) - 1)); }
    else if (e.key === "Home") { e.preventDefault(); setHover(0); }
    else if (e.key === "End") { e.preventDefault(); setHover(lastI); }
    else if (e.key === "Escape") setHover(null);
  };
  const hp = hover !== null ? pts[hover] : null;
  const hx = hover !== null ? xAt(hover) : 0;
  const hy = hp ? y(hp.value) : 0;
  const hd = hp ? (hp.value - hp.prev) / hp.prev : 0;
  const summary = `${title}, last ${range === "12M" ? "12 months" : range.replace("D", " days")}: ${currency} ${fmtFull(total)}, ${delta >= 0 ? "up" : "down"} ${Math.abs(delta * 100).toFixed(1)}% on the previous period. Peak ${currency} ${fmtFull(pts[peakI].value)} on ${label(pts[peakI].date)}.`;

  return (
    <section className={`pulse-line-chart pulse-line-chart--${theme} ${className}`} data-motion={motion} aria-labelledby={`${id}-t`}>
      <header className="pulse-line-chart__head">
        <div>
          <h3 id={`${id}-t`} className="pulse-line-chart__title">{title}</h3>
          <p className="pulse-line-chart__hero">
            <span className="pulse-line-chart__cur">{currency}</span> <Counter value={total} reduced={reduced()} />
            <span className="pulse-line-chart__delta" data-dir={delta >= 0 ? "up" : "down"}>
              <svg viewBox="0 0 10 10" aria-hidden="true"><path d={delta >= 0 ? "M5 1.5 9 7.5H1z" : "M5 8.5 1 2.5h8z"} /></svg>
              {Math.abs(delta * 100).toFixed(1)}% vs previous
            </span>
          </p>
        </div>
        <div className="pulse-line-chart__ctl">
          <div className="pulse-line-chart__seg" role="radiogroup" aria-label="Time range">
            {(["7D", "30D", "90D", "12M"] as Range[]).map((r) => (
              <button key={r} type="button" role="radio" aria-checked={range === r} onClick={() => { setRange(r); setHover(null); }}>{r}</button>
            ))}
          </div>
          <button type="button" className="pulse-line-chart__view" aria-pressed={view === "table"} onClick={() => setView((v) => (v === "chart" ? "table" : "chart"))}>{view === "chart" ? "Table" : "Chart"}</button>
        </div>
      </header>

      <div className="pulse-line-chart__legend" aria-hidden="true">
        <span><i className="pulse-line-chart__k pulse-line-chart__k--now" />This period</span>
        <span><i className="pulse-line-chart__k pulse-line-chart__k--prev" />Previous period</span>
      </div>

      <div ref={wrapRef} className="pulse-line-chart__plot" hidden={view === "table"}>
        <svg
          ref={svgRef}
          viewBox={`0 0 ${W} ${H}`}
          width="100%"
          height={H}
          role="img"
          aria-label={summary}
          tabIndex={0}
          onPointerMove={pick}
          onPointerLeave={() => setHover(null)}
          onKeyDown={onKey}
          onBlur={() => setHover(null)}
          data-seen={seen || undefined}
        >
          <defs>
            <linearGradient id={`${id}-fill`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" className="pulse-line-chart__fill-a" />
              <stop offset="1" className="pulse-line-chart__fill-b" />
            </linearGradient>
            <clipPath id={`${id}-reveal`}><rect x="0" y="0" height={H} className="pulse-line-chart__reveal" /></clipPath>
          </defs>
          {ticks.map((v) => (
            <g key={v}>
              <line x1={PAD.l} x2={W - PAD.r} y1={y(v)} y2={y(v)} className={v === 0 ? "pulse-line-chart__base" : "pulse-line-chart__grid"} />
              <text x={PAD.l - 10} y={y(v)} className="pulse-line-chart__ytick" dy="0.32em">{fmtK(v)}</text>
            </g>
          ))}
          {xTicks.map((i) => <text key={i} x={xAt(i)} y={H - 8} className="pulse-line-chart__xtick" textAnchor={xAt(i) < PAD.l + 24 ? "start" : i === lastI ? "end" : "middle"}>{label(pts[i].date)}</text>)}
          <g clipPath={`url(#${id}-reveal)`}>
            <path d={area} fill={`url(#${id}-fill)`} className="pulse-line-chart__area" />
            <path d={ghost} className="pulse-line-chart__ghost" />
            <path d={line} className="pulse-line-chart__line" />
          </g>
          {/* Direct labels: the peak and the latest point. */}
          {seen && hover === null && (
            <g className="pulse-line-chart__notes" aria-hidden="true">
              {[peakI, lastI].filter((v, k, a) => a.indexOf(v) === k).map((i) => {
                const px = xAt(i), py = y(pts[i].value), end = i === lastI;
                const anchor = px > W - 120 ? "end" : px < PAD.l + 60 ? "start" : "middle";
                return (
                  <g key={i}>
                    <circle cx={px} cy={py} r="4" className="pulse-line-chart__dot" />
                    <text x={px + (anchor === "end" ? -2 : 0)} y={py - 12} textAnchor={anchor} className="pulse-line-chart__note">
                      {end && i !== peakI ? "Latest " : "Peak "}<tspan className="pulse-line-chart__note-v">{fmtK(pts[i].value)}</tspan>
                    </text>
                  </g>
                );
              })}
            </g>
          )}
          {hp && (
            <g aria-hidden="true">
              <line x1={hx} x2={hx} y1={PAD.t} y2={PAD.t + ih} className="pulse-line-chart__cross" />
              <circle cx={hx} cy={y(hp.prev)} r="3.5" className="pulse-line-chart__dot pulse-line-chart__dot--prev" />
              <circle cx={hx} cy={hy} r="5" className="pulse-line-chart__dot pulse-line-chart__dot--hi" />
            </g>
          )}
        </svg>
        {hp && (
          <div className="pulse-line-chart__tip" style={{ left: `${(hx / W) * 100}%`, top: hy - 12 }} data-side={hx > W * 0.66 ? "left" : "right"} role="status">
            <span className="pulse-line-chart__tip-d">{label(hp.date)}</span>
            <span className="pulse-line-chart__tip-v">{currency} {fmtFull(hp.value)}</span>
            <span className="pulse-line-chart__tip-p">Previous {fmtFull(hp.prev)}</span>
            <span className="pulse-line-chart__tip-x" data-dir={hd >= 0 ? "up" : "down"}>{hd >= 0 ? "▲" : "▼"} {Math.abs(hd * 100).toFixed(1)}%</span>
          </div>
        )}
      </div>

      {view === "table" && (
        <div className="pulse-line-chart__table-wrap">
          <table className="pulse-line-chart__table">
            <caption className="pulse-line-chart__sr">{summary}</caption>
            <thead><tr><th scope="col">{range === "12M" ? "Month" : "Day"}</th><th scope="col">This period ({currency})</th><th scope="col">Previous ({currency})</th><th scope="col">Change</th></tr></thead>
            <tbody>
              {pts.map((p) => {
                const d = (p.value - p.prev) / p.prev;
                return <tr key={+p.date}><th scope="row">{label(p.date)}</th><td>{fmtFull(p.value)}</td><td>{fmtFull(p.prev)}</td><td>{d >= 0 ? "+" : "−"}{Math.abs(d * 100).toFixed(1)}%</td></tr>;
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

/** The hero number, counting to its new value. */
function Counter({ value, reduced }: { value: number; reduced: boolean }) {
  const [v, setV] = useState(value);
  const from = useRef(value);
  useEffect(() => {
    if (reduced) { setV(value); from.current = value; return; }
    const a = from.current, t0 = performance.now();
    let raf = 0;
    const step = (now: number) => {
      const t = Math.min(1, (now - t0) / 700), e = 1 - Math.pow(1 - t, 3);
      const x = a + (value - a) * e;
      setV(x); from.current = x;
      if (t < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [value, reduced]);
  return <span className="pulse-line-chart__num">{fmtFull(v)}</span>;
}
