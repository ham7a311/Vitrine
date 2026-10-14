"use client";
import { useId, useLayoutEffect, useMemo, useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent } from "react";
import { level, ms, percentile, region } from "./latency";
import "./latency-heatmap.css";

export type LatencyColumn = { label: string; counts: number[] };

export type LatencyHeatmapProps = {
  title: string;
  /** One column per time slot; counts per latency bucket, lowest first. */
  columns: LatencyColumn[];
  /** Bucket edges in ms (one more than the buckets), lowest first. */
  edges: number[];
  /** A target to draw across the chart, in ms. */
  slo?: number;
  theme?: "night" | "paper";
  className?: string;
};

const H = 300, PAD = { l: 52, r: 64, t: 10, b: 26 };
const LINES = [{ p: 0.5, id: "p50" }, { p: 0.95, id: "p95" }, { p: 0.99, id: "p99" }] as const;
type Cell = { c: number; r: number };

/**
 * Latency Heatmap
 * Every request in a day, by when it happened and how long it took: time across, latency up a log
 * scale, each cell shaded by how many requests landed there, with the p50, p95 and p99 traced
 * through it and the target drawn across. Point at a cell to read it; drag (or shift + arrows) to
 * select a region and count what's in it.
 */
export function LatencyHeatmap({ title, columns, edges, slo, theme = "night", className = "" }: LatencyHeatmapProps) {
  const uid = useId();
  const box = useRef<HTMLDivElement>(null);
  const [w, setW] = useState(720);
  const [on, setOn] = useState({ p50: true, p95: true, p99: true });
  const [cursor, setCursor] = useState<Cell | null>(null);
  const [sel, setSel] = useState<{ a: Cell; b: Cell } | null>(null);
  const dragging = useRef(false);

  useLayoutEffect(() => {
    const el = box.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setW(Math.max(300, Math.round(e.contentRect.width))));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const grid = useMemo(() => columns.map((c) => c.counts), [columns]);
  const max = useMemo(() => Math.max(1, ...grid.flat()), [grid]);
  const lines = useMemo(() => LINES.map((l) => ({ ...l, values: grid.map((h) => percentile(h, edges, l.p)) })), [grid, edges]);
  const overall = useMemo(() => {
    const merged = edges.slice(1).map((_, r) => grid.reduce((s, h) => s + h[r], 0));
    return { total: merged.reduce((s, v) => s + v, 0), p: LINES.map((l) => percentile(merged, edges, l.p)) };
  }, [grid, edges]);

  const C = columns.length, R = edges.length - 1;
  const iw = w - PAD.l - PAD.r, ih = H - PAD.t - PAD.b, cw = iw / C, rh = ih / R;
  const lo = Math.log(edges[0]), hi = Math.log(edges[R]);
  const Y = (v: number) => PAD.t + ih * (1 - (Math.log(v) - lo) / (hi - lo));
  const cellAt = (e: PointerEvent): Cell => {
    const b = box.current!.getBoundingClientRect();
    const x = e.clientX - b.left - PAD.l, y = e.clientY - b.top - PAD.t;
    return { c: Math.max(0, Math.min(C - 1, Math.floor(x / cw))), r: Math.max(0, Math.min(R - 1, R - 1 - Math.floor(y / rh))) };
  };
  const shade = (v: number) => {
    const k = level(v, max) * 4, i = Math.min(3, Math.floor(k));
    return v ? `color-mix(in oklab, var(--lh-r${i + 1}) ${Math.round((k - i) * 100)}%, var(--lh-r${i}))` : "var(--lh-r0)";
  };

  const key = (e: KeyboardEvent) => {
    const now = cursor ?? { c: C - 1, r: Math.floor(R / 2) };
    const mv: Record<string, [number, number]> = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, 1], ArrowDown: [0, -1] };
    if (e.key in mv) {
      e.preventDefault();
      const [dc, dr] = mv[e.key];
      const next = { c: Math.max(0, Math.min(C - 1, now.c + dc)), r: Math.max(0, Math.min(R - 1, now.r + dr)) };
      setCursor(next);
      if (e.shiftKey) setSel((s) => ({ a: s?.a ?? now, b: next }));
    } else if (e.key === "Escape") { setSel(null); setCursor(null); }
  };

  const picked = sel && region(grid, sel.a.c, sel.b.c, sel.a.r, sel.b.r);
  const span = sel && { c0: Math.min(sel.a.c, sel.b.c), c1: Math.max(sel.a.c, sel.b.c), r0: Math.min(sel.a.r, sel.b.r), r1: Math.max(sel.a.r, sel.b.r) };
  const tip = cursor && grid[cursor.c][cursor.r];
  const colTotal = cursor ? grid[cursor.c].reduce((s, v) => s + v, 0) : 0;
  const ticksY = [1, 3, 10, 30, 100, 300, 1000, 3000, 10000].filter((v) => v >= edges[0] && v <= edges[R]);
  const every = Math.max(1, Math.round(C / (w < 520 ? 4 : 8)));

  return (
    <section className={`lheat lheat--${theme} ${className}`} aria-labelledby={`${uid}-t`}>
      <header className="lheat__head">
        <div>
          <h3 id={`${uid}-t`} className="lheat__title">{title}</h3>
          <p className="lheat__sum">{overall.total.toLocaleString("en-GB")} requests · p50 <b>{ms(overall.p[0] ?? 0)}</b> · p95 <b>{ms(overall.p[1] ?? 0)}</b> · p99 <b>{ms(overall.p[2] ?? 0)}</b></p>
        </div>
        <div className="lheat__keys">
          {LINES.map((l) => (
            <button key={l.id} type="button" className={`lheat__key lheat__key--${l.id}`} aria-pressed={on[l.id]} onClick={() => setOn((o) => ({ ...o, [l.id]: !o[l.id] }))}>
              <i aria-hidden="true" />{l.id}
            </button>
          ))}
        </div>
      </header>

      <div
        ref={box} className="lheat__plot" tabIndex={0} role="group"
        aria-label={`${title}. ${overall.total} requests; median ${ms(overall.p[0] ?? 0)}, 95th percentile ${ms(overall.p[1] ?? 0)}, 99th ${ms(overall.p[2] ?? 0)}. Arrow keys move between cells; hold Shift to select a region; Escape clears.`}
        onPointerDown={(e) => { if (e.button !== 0) return; const c = cellAt(e); dragging.current = true; e.currentTarget.setPointerCapture(e.pointerId); setSel({ a: c, b: c }); setCursor(c); }}
        onPointerMove={(e) => { const c = cellAt(e); setCursor(c); if (dragging.current) setSel((s) => (s ? { a: s.a, b: c } : s)); }}
        onPointerUp={() => { dragging.current = false; }}
        onPointerLeave={(e) => { if (e.pointerType === "mouse" && !dragging.current) setCursor(null); }}
        onKeyDown={key}
      >
        <svg width={w} height={H} viewBox={`0 0 ${w} ${H}`} aria-hidden="true">
          {grid.map((h, c) => h.map((v, r) => (
            <rect key={`${c}-${r}`} x={PAD.l + c * cw + 0.5} y={PAD.t + (R - 1 - r) * rh + 0.5} width={Math.max(0.5, cw - 1)} height={Math.max(0.5, rh - 1)} rx={1.5} style={{ fill: shade(v) } as CSSProperties} />
          )))}
          {ticksY.map((v) => (
            <g key={v}>
              <line className="lheat__tick" x1={PAD.l - 4} x2={PAD.l} y1={Y(v)} y2={Y(v)} />
              <text className="lheat__axis" x={PAD.l - 8} y={Y(v) + 3.5} textAnchor="end">{ms(v)}</text>
            </g>
          ))}
          {columns.map((col, c) => (c % every === 0 ? <text key={c} className="lheat__axis" x={PAD.l + c * cw} y={H - 8}>{col.label}</text> : null))}
          {lines.map((l) => on[l.id] && (
            <g key={l.id} className={`lheat__line lheat__line--${l.id}`}>
              <polyline points={l.values.map((v, c) => (v ? `${PAD.l + (c + 0.5) * cw},${Y(v)}` : "")).filter(Boolean).join(" ")} />
              {(() => { const v = l.values[C - 1]; return v ? <text x={PAD.l + iw + 8} y={Y(v) + 3.5}>{l.id} {ms(v)}</text> : null; })()}
            </g>
          ))}
          {slo && slo > edges[0] && slo < edges[R] && (
            <g className="lheat__slo">
              <line x1={PAD.l} x2={PAD.l + iw} y1={Y(slo)} y2={Y(slo)} />
              <text x={PAD.l + 6} y={Y(slo) - 5}>Target {ms(slo)}</text>
            </g>
          )}
          {span && <rect className="lheat__sel" x={PAD.l + span.c0 * cw} y={PAD.t + (R - 1 - span.r1) * rh} width={(span.c1 - span.c0 + 1) * cw} height={(span.r1 - span.r0 + 1) * rh} rx={3} />}
          {cursor && <rect className="lheat__cur" x={PAD.l + cursor.c * cw} y={PAD.t + (R - 1 - cursor.r) * rh} width={cw} height={rh} rx={2} />}
        </svg>
        {cursor && tip !== null && (
          <div className="lheat__tip" style={{ left: Math.min(Math.max(PAD.l + (cursor.c + 0.5) * cw, 110), w - 110), top: Math.max(4, PAD.t + (R - 1 - cursor.r) * rh - 64) }}>
            <p><b>{columns[cursor.c].label}</b> · {ms(edges[cursor.r])}–{ms(edges[cursor.r + 1])}</p>
            <p>{tip.toLocaleString("en-GB")} {tip === 1 ? "request" : "requests"} · {colTotal ? ((tip / colTotal) * 100).toFixed(1) : 0}% of the slot</p>
          </div>
        )}
      </div>

      <div className="lheat__foot">
        <p className="lheat__ramp" aria-hidden="true"><span>Fewer</span>{[0, 1, 2, 3, 4].map((i) => <i key={i} style={{ background: `var(--lh-r${i})` }} />)}<span>More</span></p>
        <p className="lheat__picked" aria-live="polite">
          {picked && span ? (
            <>
              <b>{picked.n.toLocaleString("en-GB")}</b> {picked.n === 1 ? "request" : "requests"} between {columns[span.c0].label} and {columns[span.c1].label} at {ms(edges[span.r0])}–{ms(edges[span.r1 + 1])} · {(picked.share * 100).toFixed(1)}% of traffic then
              <button type="button" className="lheat__clear" onClick={() => setSel(null)}>Clear</button>
            </>
          ) : "Drag across the chart to count a region."}
        </p>
      </div>
    </section>
  );
}

export default LatencyHeatmap;
