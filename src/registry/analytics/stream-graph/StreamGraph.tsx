"use client";

import { useEffect, useId, useMemo, useRef, useState, type KeyboardEvent, type PointerEvent as RPointerEvent } from "react";
import "./stream-graph.css";

/**
 * Stream Graph
 * Where a year of visits came from, as one river of channels. Streams are
 * stacked symmetrically around a centre line, so the shape reads as flow
 * rather than as a pile. Point at a stream and it lights
 * while the others fall back, with its name laid along it; the crosshair
 * lists every channel for that week. Hide a channel from the legend and the
 * river re-forms around the rest — colours stay with their channels.
 */

export type Stream = { key: string; label: string; values: number[] };
type Props = { streams: Stream[]; dates: Date[]; title?: string; theme?: "light" | "dark"; motion?: "full" | "reduced"; className?: string };

const H = 300, PAD = { t: 16, r: 16, b: 30, l: 16 };
const mon = new Intl.DateTimeFormat("en-GB", { month: "short" });
const wk = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short" });
const fmt = (v: number) => (v >= 1000 ? `${(v / 1000).toFixed(1)}k` : `${Math.round(v)}`);

/**
 * Stack around a centre line (the "silhouette" offset): each week's streams are
 * centred on zero, so the river stays balanced however the channels change.
 */
function layout(vals: number[][]) {
  const n = vals.length, m = vals[0].length;
  const y0: number[][] = [], y1: number[][] = [];
  for (let i = 0; i < n; i++) { y0.push([]); y1.push([]); }
  for (let j = 0; j < m; j++) {
    let sum = 0;
    for (let i = 0; i < n; i++) sum += vals[i][j];
    let base = -sum / 2;
    for (let i = 0; i < n; i++) { y0[i].push(base); base += vals[i][j]; y1[i].push(base); }
  }
  return { y0, y1 };
}
/** A smooth path through points (Catmull–Rom as Béziers). */
function smooth(pts: [number, number][], move = true) {
  let d = move ? `M${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}` : `L${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] ?? p2;
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6], c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C${c1[0].toFixed(1)} ${c1[1].toFixed(1)} ${c2[0].toFixed(1)} ${c2[1].toFixed(1)} ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`;
  }
  return d;
}

export function StreamGraph({ streams, dates, title = "Sessions by channel", theme = "light", motion = "full", className = "" }: Props) {
  const id = useId();
  const wrapRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [W, setW] = useState(760);
  const [hidden, setHidden] = useState<Set<string>>(new Set());
  const [focus, setFocus] = useState<string | null>(null);
  const [col, setCol] = useState<number | null>(null);
  const [view, setView] = useState<"chart" | "table">("chart");
  const [seen, setSeen] = useState(false);
  const reduced = () => motion === "reduced" || (typeof window !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches);
  const m = dates.length;

  // Hidden channels animate to zero thickness, so the river re-forms smoothly.
  const target = useMemo(() => streams.map((s) => (hidden.has(s.key) ? s.values.map(() => 0) : s.values)), [streams, hidden]);
  const [vals, setVals] = useState(target);
  const fromRef = useRef(target);
  useEffect(() => {
    if (reduced()) { setVals(target); fromRef.current = target; return; }
    const from = fromRef.current, t0 = performance.now();
    let raf = 0;
    const step = (now: number) => {
      const t = Math.min(1, (now - t0) / 560), e = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      const cur = target.map((row, i) => row.map((v, j) => from[i][j] + (v - from[i][j]) * e));
      setVals(cur); fromRef.current = cur;
      if (t < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setW(Math.max(300, Math.round(e.contentRect.width))));
    ro.observe(el);
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setSeen(true); io.disconnect(); } }, { threshold: 0.3 });
    io.observe(el);
    return () => { ro.disconnect(); io.disconnect(); };
  }, []);

  const { y0, y1 } = useMemo(() => layout(vals), [vals]);
  // Fit the whole river, centred, using the full (all-visible) extent so hiding never rescales jarringly.
  const full = useMemo(() => layout(streams.map((s) => s.values)), [streams]);
  const half = Math.max(...full.y1[streams.length - 1].map(Math.abs), ...full.y0[0].map(Math.abs)) * 1.04;
  const lo = -half, hi = half;
  const iw = W - PAD.l - PAD.r, ih = H - PAD.t - PAD.b;
  const x = (j: number) => PAD.l + (j / (m - 1)) * iw;
  const y = (v: number) => PAD.t + ih - ((v - lo) / (hi - lo)) * ih;

  const paths = streams.map((s, i) => {
    const top = y1[i].map((v, j) => [x(j), y(v)] as [number, number]);
    const bot = y0[i].map((v, j) => [x(j), y(v)] as [number, number]).reverse();
    return `${smooth(top)} ${smooth(bot, false)} Z`;
  });
  // Where each stream is thickest: its label goes there, along the stream.
  const labelAt = streams.map((s, i) => {
    let best = 0;
    for (let j = 2; j < m - 2; j++) if (y1[i][j] - y0[i][j] > y1[i][best] - y0[i][best]) best = j;
    return { j: best, h: ((y1[i][best] - y0[i][best]) / (hi - lo)) * ih };
  });

  const pick = (e: RPointerEvent) => {
    const r = svgRef.current!.getBoundingClientRect();
    const px = ((e.clientX - r.left) / r.width) * W;
    const j = Math.max(0, Math.min(m - 1, Math.round(((px - PAD.l) / iw) * (m - 1))));
    setCol(j);
  };
  const onKey = (e: KeyboardEvent) => {
    if (e.key === "ArrowRight") { e.preventDefault(); setCol((c) => Math.min(m - 1, (c ?? -1) + 1)); }
    if (e.key === "ArrowLeft") { e.preventDefault(); setCol((c) => Math.max(0, (c ?? m) - 1)); }
    if (e.key === "Escape") setCol(null);
  };
  const toggle = (k: string) => setHidden((h) => {
    const n = new Set(h);
    if (n.has(k)) n.delete(k);
    else if (n.size < streams.length - 1) n.add(k); // always keep one
    return n;
  });

  const totals = streams.map((s) => s.values.reduce((a, b) => a + b, 0));
  const lead = streams[totals.indexOf(Math.max(...totals))];
  const summary = `${title} over ${m} weeks. ${lead.label} brought the most visits (${fmt(Math.max(...totals))}). Channels: ${streams.map((s, i) => `${s.label} ${fmt(totals[i])}`).join(", ")}.`;
  const monthTicks = dates.map((d, j) => ({ d, j })).filter(({ d, j }) => j === 0 || d.getMonth() !== dates[j - 1].getMonth()).filter((_, k) => W > 560 || k % 2 === 0);
  const tipX = col !== null ? x(col) : 0;

  return (
    <section className={`stream-graph stream-graph--${theme} ${className}`} data-motion={motion} aria-labelledby={`${id}-t`}>
      <header className="stream-graph__head">
        <div>
          <h3 id={`${id}-t`} className="stream-graph__title">{title}</h3>
          <p className="stream-graph__insight"><strong>{lead.label}</strong> is still the biggest source — but social is catching up fast.</p>
        </div>
        <button type="button" className="stream-graph__view" aria-pressed={view === "table"} onClick={() => setView((v) => (v === "chart" ? "table" : "chart"))}>{view === "chart" ? "Table" : "Chart"}</button>
      </header>
      <div className="stream-graph__legend" role="group" aria-label="Show or hide channels">
        {streams.map((s, i) => (
          <button key={s.key} type="button" aria-pressed={!hidden.has(s.key)} onClick={() => toggle(s.key)} onPointerEnter={() => setFocus(s.key)} onPointerLeave={() => setFocus(null)} onFocus={() => setFocus(s.key)} onBlur={() => setFocus(null)} style={{ ["--c" as string]: `var(--s${i + 1})` }}>
            <i />{s.label}
          </button>
        ))}
      </div>

      <div ref={wrapRef} className="stream-graph__plot" hidden={view === "table"}>
        <svg ref={svgRef} viewBox={`0 0 ${W} ${H}`} width="100%" height={H} role="img" aria-label={summary} tabIndex={0} onPointerMove={pick} onPointerLeave={() => { setCol(null); setFocus(null); }} onKeyDown={onKey} onBlur={() => setCol(null)} data-seen={seen || undefined}>
          {monthTicks.map(({ d, j }) => (
            <g key={j}>
              <line x1={x(j)} x2={x(j)} y1={PAD.t} y2={H - PAD.b} className="stream-graph__grid" />
              <text x={x(j) + 4} y={H - 10} className="stream-graph__tick">{mon.format(d)}</text>
            </g>
          ))}
          <g className="stream-graph__river">
            {streams.map((s, i) => (
              <path
                key={s.key}
                d={paths[i]}
                className="stream-graph__stream"
                style={{ fill: `var(--s${i + 1})`, transitionDelay: `${i * 70}ms` }}
                data-dim={(focus && focus !== s.key) || undefined}
                onPointerEnter={() => setFocus(s.key)}
              />
            ))}
          </g>
          {/* Names laid along each stream at its widest, where there's room. */}
          {seen && streams.map((s, i) => labelAt[i].h > 18 && !hidden.has(s.key) && (
            <text key={s.key} x={Math.min(W - PAD.r - 34, Math.max(PAD.l + 34, x(labelAt[i].j)))} y={y((y0[i][labelAt[i].j] + y1[i][labelAt[i].j]) / 2)} className="stream-graph__label" dy="0.34em" textAnchor="middle" data-dim={(focus && focus !== s.key) || undefined}>{s.label}</text>
          ))}
          {col !== null && (
            <g aria-hidden="true">
              <line x1={tipX} x2={tipX} y1={PAD.t} y2={H - PAD.b} className="stream-graph__cross" />
            </g>
          )}
        </svg>
        {col !== null && (
          <div className="stream-graph__tip" style={{ left: `${(tipX / W) * 100}%` }} data-side={tipX > W * 0.62 ? "left" : "right"} role="status">
            <span className="stream-graph__tip-d">Week of {wk.format(dates[col])}</span>
            {streams.map((s, i) => !hidden.has(s.key) && (
              <span key={s.key} className="stream-graph__tip-r" data-on={focus === s.key || undefined}>
                <i style={{ background: `var(--s${i + 1})` }} />{s.label}<b>{fmt(s.values[col])}</b>
              </span>
            ))}
          </div>
        )}
      </div>

      {view === "table" && (
        <div className="stream-graph__table-wrap">
          <table className="stream-graph__table">
            <caption className="stream-graph__sr">{summary}</caption>
            <thead><tr><th scope="col">Week of</th>{streams.map((s) => <th key={s.key} scope="col">{s.label}</th>)}</tr></thead>
            <tbody>{dates.map((d, j) => <tr key={j}><th scope="row">{wk.format(d)}</th>{streams.map((s) => <td key={s.key}>{Math.round(s.values[j]).toLocaleString("en-GB")}</td>)}</tr>)}</tbody>
          </table>
        </div>
      )}
    </section>
  );
}
