"use client";

import { useEffect, useId, useRef, useState, type PointerEvent as RPointerEvent } from "react";
import "./bubble-timeline.css";

/**
 * Bubble Timeline
 * Seven years of where people went, played like a film. Each destination
 * is a bubble — across by what a trip costs, up by how much people loved
 * it, sized by how many went — and pressing play moves them through the
 * years with the year itself watermarked behind. Faint trails show the path
 * each one took; pick one to follow it.
 */

export type Dest = { name: string; region: 0 | 1 | 2; cost: number[]; score: number[]; trips: number[] };
type Props = { dests: Dest[]; years: number[]; regions: [string, string, string]; currency?: string; title?: string; theme?: "light" | "dark"; motion?: "full" | "reduced"; className?: string };

const H = 420, PAD = { t: 18, r: 22, b: 40, l: 48 };
const COST = [40, 1000], SCORE = [3.4, 5];
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const at = (arr: number[], t: number) => { const i = Math.min(arr.length - 2, Math.floor(t)); return lerp(arr[i], arr[i + 1], t - i); };

export function BubbleTimeline({ dests, years, regions, currency = "OMR", title = "Destinations", theme = "light", motion = "full", className = "" }: Props) {
  const id = useId();
  const wrapRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [W, setW] = useState(820);
  const [t, setT] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [hover, setHover] = useState<number | null>(null);
  const [picked, setPicked] = useState<number | null>(null);
  const [view, setView] = useState<"chart" | "table">("chart");
  const tRef = useRef(0);
  tRef.current = t;
  const last = years.length - 1;
  const reduced = () => motion === "reduced" || (typeof window !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setW(Math.max(320, Math.round(e.contentRect.width))));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Playing: about 1.4s a year, then stop on the last one.
  useEffect(() => {
    if (!playing) return;
    if (reduced()) { setT(last); setPlaying(false); return; }
    let raf = 0, prev = performance.now();
    if (tRef.current >= last) setT(0);
    const step = (now: number) => {
      const dt = (now - prev) / 1000;
      prev = now;
      const next = Math.min(last, tRef.current + dt / 1.4);
      setT(next);
      if (next >= last) { setPlaying(false); return; }
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [playing]); // eslint-disable-line react-hooks/exhaustive-deps

  const iw = W - PAD.l - PAD.r, ih = H - PAD.t - PAD.b;
  const x = (c: number) => PAD.l + ((Math.log(c) - Math.log(COST[0])) / (Math.log(COST[1]) - Math.log(COST[0]))) * iw;
  const y = (s: number) => PAD.t + ih - ((s - SCORE[0]) / (SCORE[1] - SCORE[0])) * ih;
  const maxTrips = Math.max(...dests.flatMap((d) => d.trips));
  const r = (n: number) => 4 + Math.sqrt(n / maxTrips) * (W < 560 ? 26 : 38); // area ∝ trips
  const yearNow = Math.round(t);
  const cur = dests.map((d, i) => ({ i, d, cx: x(at(d.cost, t)), cy: y(at(d.score, t)), rr: r(at(d.trips, t)), trips: at(d.trips, t), cost: at(d.cost, t), score: at(d.score, t) }));
  const order = [...cur].sort((a, b) => b.rr - a.rr); // big ones behind
  const labelled = new Set([...cur].sort((a, b) => b.trips - a.trips).slice(0, 4).map((c) => c.i));
  const focus = hover ?? picked;
  // Place labels biggest first; one that would overlap a placed label moves below its bubble, or is skipped.
  const placed: { x0: number; x1: number; y0: number; y1: number }[] = [];
  const labelPos = new Map<number, { x: number; y: number }>();
  [...cur].filter((c) => labelled.has(c.i) || focus === c.i).sort((a, b) => (a.i === focus ? -1 : b.i === focus ? 1 : b.rr - a.rr)).forEach((c) => {
    const w = c.d.name.length * 6.6 + 6;
    for (const yy of [c.cy - c.rr - 6, c.cy + c.rr + 14]) {
      const box = { x0: c.cx - w / 2, x1: c.cx + w / 2, y0: yy - 11, y1: yy + 2 };
      if (!placed.some((b) => box.x0 < b.x1 && box.x1 > b.x0 && box.y0 < b.y1 && box.y1 > b.y0)) {
        placed.push(box);
        labelPos.set(c.i, { x: c.cx, y: yy });
        return;
      }
    }
  });
  const trail = (d: Dest) => {
    const pts: string[] = [];
    for (let k = 0; k <= Math.floor(t); k++) pts.push(`${x(d.cost[k]).toFixed(1)},${y(d.score[k]).toFixed(1)}`);
    pts.push(`${x(at(d.cost, t)).toFixed(1)},${y(at(d.score, t)).toFixed(1)}`);
    return pts.join(" ");
  };
  const pick = (e: RPointerEvent) => {
    const rect = svgRef.current!.getBoundingClientRect();
    const px = ((e.clientX - rect.left) / rect.width) * W, py = ((e.clientY - rect.top) / rect.height) * H;
    // The smallest bubble under the pointer wins, so little ones stay reachable.
    const hit = cur.filter((c) => Math.hypot(c.cx - px, c.cy - py) <= c.rr + 4).sort((a, b) => a.rr - b.rr)[0];
    setHover(hit ? hit.i : null);
  };
  const fc = focus !== null ? cur[focus] : null;
  const summary = `${title}, ${years[0]}–${years[last]}: trip cost (log scale) against rating, sized by trips. In ${years[yearNow]}, ${cur.reduce((a, b) => (b.trips > a.trips ? b : a)).d.name} had the most trips.`;

  return (
    <section className={`bt bt--${theme} ${className}`} data-motion={motion} aria-labelledby={`${id}-t`}>
      <header className="bt__head">
        <div>
          <h3 id={`${id}-t`} className="bt__title">{title}</h3>
          <p className="bt__insight">Trips abroad collapsed in 2020 — and close-to-home Oman never gave the ground back.</p>
        </div>
        <button type="button" className="bt__view" aria-pressed={view === "table"} onClick={() => setView((v) => (v === "chart" ? "table" : "chart"))}>{view === "chart" ? "Table" : "Chart"}</button>
      </header>
      <div className="bt__legend" aria-hidden="true">
        {regions.map((g, k) => <span key={g}><i style={{ background: `var(--s${k + 1})` }} />{g}</span>)}
        <span className="bt__size"><i className="bt__size-k" />Bubble area = trips</span>
      </div>

      <div ref={wrapRef} className="bt__plot" hidden={view === "table"}>
        <svg ref={svgRef} viewBox={`0 0 ${W} ${H}`} width="100%" height={H} role="img" aria-label={summary} onPointerMove={pick} onPointerLeave={() => setHover(null)} onClick={() => setPicked(hover)}>
          <text x={PAD.l + iw / 2} y={PAD.t + ih / 2} className="bt__year" dy="0.35em">{years[yearNow]}</text>
          {[50, 100, 200, 400, 800].map((c) => (
            <g key={c}>
              <line x1={x(c)} x2={x(c)} y1={PAD.t} y2={PAD.t + ih} className="bt__grid" />
              <text x={x(c)} y={H - 18} className="bt__tick" textAnchor="middle">{c}</text>
            </g>
          ))}
          {[3.5, 4, 4.5, 5].map((s) => (
            <g key={s}>
              <line x1={PAD.l} x2={W - PAD.r} y1={y(s)} y2={y(s)} className="bt__grid" />
              <text x={PAD.l - 8} y={y(s)} className="bt__tick" textAnchor="end" dy="0.32em">{s.toFixed(1)}</text>
            </g>
          ))}
          <text x={W - PAD.r} y={H - 2} className="bt__axis" textAnchor="end">Average trip cost ({currency}, log scale) →</text>
          <text x={PAD.l} y={PAD.t - 6} className="bt__axis">↑ Guest rating</text>
          {/* Trails: faint for all, clear for the one you follow. */}
          {t > 0.02 && dests.map((d, i) => <polyline key={d.name} points={trail(d)} className="bt__trail" data-on={focus === i || undefined} style={{ stroke: `var(--s${d.region + 1})` }} />)}
          {focus !== null && (() => {
            // Year stops along the followed path; a year label only where it has room.
            let lx = -1e9, ly = -1e9;
            return Array.from({ length: Math.floor(t) + 1 }, (_, k) => {
              const sx = x(dests[focus].cost[k]), sy = y(dests[focus].score[k]);
              const room = Math.hypot(sx - lx, sy - ly) > 34;
              if (room) { lx = sx; ly = sy; }
              return (
                <g key={k}>
                  <circle cx={sx} cy={sy} r="3" className="bt__stop" style={{ fill: `var(--s${dests[focus].region + 1})` }} />
                  {room && <text x={sx + 6} y={sy - 6} className="bt__stop-y">{years[k]}</text>}
                </g>
              );
            });
          })()}
          {order.map((c) => (
            <circle key={c.d.name} cx={c.cx} cy={c.cy} r={c.rr} className="bt__bub" data-dim={(focus !== null && focus !== c.i) || undefined} style={{ fill: `var(--s${c.d.region + 1})` }} />
          ))}
          {cur.map((c) => labelPos.has(c.i) && (
            <text key={c.d.name} x={labelPos.get(c.i)!.x} y={labelPos.get(c.i)!.y} className="bt__label" textAnchor="middle">{c.d.name}</text>
          ))}
        </svg>
        {fc && (
          <div className="bt__tip" style={{ left: `${(fc.cx / W) * 100}%`, top: fc.cy - fc.rr - 10 }} data-side={fc.cx > W * 0.66 ? "left" : "right"} role="status">
            <b>{fc.d.name}</b>
            <span>{regions[fc.d.region]} · {years[yearNow]}</span>
            <span>{Math.round(fc.trips).toLocaleString("en-GB")} trips</span>
            <span>{currency} {Math.round(fc.cost)} average · rated {fc.score.toFixed(2)}</span>
          </div>
        )}
      </div>

      {view === "table" && (
        <div className="bt__table-wrap">
          <table className="bt__table">
            <caption>{years[yearNow]}</caption>
            <thead><tr><th scope="col">Destination</th><th scope="col">Region</th><th scope="col">Trips</th><th scope="col">Avg cost ({currency})</th><th scope="col">Rating</th></tr></thead>
            <tbody>{[...cur].sort((a, b) => b.trips - a.trips).map((c) => <tr key={c.d.name}><th scope="row">{c.d.name}</th><td>{regions[c.d.region]}</td><td>{Math.round(c.trips).toLocaleString("en-GB")}</td><td>{Math.round(c.cost)}</td><td>{c.score.toFixed(2)}</td></tr>)}</tbody>
          </table>
        </div>
      )}

      <div className="bt__time">
        <button type="button" className="bt__play" onClick={() => setPlaying((p) => !p)} aria-label={playing ? "Pause" : t >= last ? "Replay from 2019" : "Play through the years"}>
          {playing ? <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M6 4h3v12H6zM11 4h3v12h-3z" /></svg> : <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M6.5 4.2v11.6L16 10z" /></svg>}
        </button>
        <div className="bt__scrub">
          <input
            type="range"
            min={0}
            max={last}
            step={0.01}
            value={t}
            aria-label="Year"
            aria-valuetext={String(years[yearNow])}
            onChange={(e) => { setPlaying(false); setT(Number(e.target.value)); }}
            onPointerUp={() => setT((v) => Math.round(v))}
            onKeyDown={(e) => {
              if (e.key === "ArrowRight" || e.key === "ArrowUp") { e.preventDefault(); setPlaying(false); setT((v) => Math.min(last, Math.floor(v + 1e-6) + 1)); }
              if (e.key === "ArrowLeft" || e.key === "ArrowDown") { e.preventDefault(); setPlaying(false); setT((v) => Math.max(0, Math.ceil(v - 1e-6) - 1)); }
            }}
          />
          <div className="bt__years" aria-hidden="true">{years.map((yr, k) => <span key={yr} data-on={k === yearNow || undefined}>{yr}</span>)}</div>
        </div>
      </div>
    </section>
  );
}
