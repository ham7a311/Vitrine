"use client";

import { useEffect, useRef, useState } from "react";
import "./slope-chart.css";

/**
 * Slope Chart
 * How a ranking changed between two periods, drawn as one line per item from its old rank to
 * its new one. Climbers and fallers take the two poles of a diverging pair; steady items stay
 * grey. Switch the measure and every line swings to its new ranks.
 */

export type SlopeItem = { name: string; values: Record<string, [number, number]> };
type Props = { items: SlopeItem[]; periods: [string, string]; measures: string[]; title?: string; theme?: "light" | "dark"; motion?: "full" | "reduced"; className?: string };

const W = 640, ROW = 40, PADX = 150;

const rank = (items: SlopeItem[], m: string, side: 0 | 1) => {
  const order = [...items].sort((a, b) => b.values[m][side] - a.values[m][side]).map((x) => x.name);
  return Object.fromEntries(order.map((n, i) => [n, i]));
};

export function SlopeChart({ items, periods, measures, title = "Top destinations", theme = "light", motion = "full", className = "" }: Props) {
  const [m, setM] = useState(measures[0]);
  const [hover, setHover] = useState<string | null>(null);
  const [view, setView] = useState<"chart" | "table">("chart");
  const H = items.length * ROW + 40;
  const target = { a: rank(items, m, 0), b: rank(items, m, 1) };
  const [pos, setPos] = useState(target);
  const from = useRef(target);

  useEffect(() => {
    const to = { a: rank(items, m, 0), b: rank(items, m, 1) };
    const reduced = motion === "reduced" || matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return void (setPos(to), (from.current = to));
    const start = from.current, t0 = performance.now();
    let raf = 0;
    const step = (t: number) => {
      const u = Math.min(1, (t - t0) / 700), e = 1 - Math.pow(1 - u, 3);
      const mix = (s: Record<string, number>, d: Record<string, number>) => Object.fromEntries(Object.keys(d).map((k) => [k, s[k] + (d[k] - s[k]) * e]));
      const now = { a: mix(start.a, to.a), b: mix(start.b, to.b) };
      setPos(now);
      if (u < 1) raf = requestAnimationFrame(step);
      else from.current = to;
    };
    raf = requestAnimationFrame(step);
    return () => {
      cancelAnimationFrame(raf);
    };
  }, [m, items, motion]);

  const y = (r: number) => 30 + r * ROW;
  const delta = (n: string) => target.a[n] - target.b[n];
  const climber = [...items].sort((p, q) => delta(q.name) - delta(p.name))[0];
  const fmt = (v: number) => (m === "Revenue" ? `OMR ${(v / 1000).toFixed(0)}k` : v.toLocaleString("en-GB"));

  return (
    <div className={`slc slc--${theme} ${className}`}>
      <header className="slc__head">
        <div>
          <p className="slc__title">
            {title} · {m.toLowerCase()}, {periods[0]} → {periods[1]}
          </p>
          <p className="slc__hero">
            {climber.name} climbs <strong>{delta(climber.name)}</strong> {delta(climber.name) === 1 ? "place" : "places"}
          </p>
        </div>
        <div className="slc__controls">
          <div role="radiogroup" aria-label="Measure" className="slc__seg">
            {measures.map((x) => (
              <button key={x} type="button" role="radio" aria-checked={m === x} onClick={() => setM(x)}>
                {x}
              </button>
            ))}
          </div>
          <button type="button" className="slc__view" aria-pressed={view === "table"} onClick={() => setView((v) => (v === "chart" ? "table" : "chart"))}>
            {view === "chart" ? "Table" : "Chart"}
          </button>
        </div>
      </header>
      {view === "chart" ? (
        <svg viewBox={`0 0 ${W} ${H}`} className="slc__svg" role="img" aria-label={`Ranks by ${m.toLowerCase()}, ${periods[0]} to ${periods[1]}. ${climber.name} climbs the most.`}>
          <text x={PADX} y={14} className="slc__period" textAnchor="middle">
            {periods[0]}
          </text>
          <text x={W - PADX} y={14} className="slc__period" textAnchor="middle">
            {periods[1]}
          </text>
          {items.map((it) => {
            const d = delta(it.name);
            const kind = d > 0 ? "up" : d < 0 ? "down" : "flat";
            const ya = y(pos.a[it.name]), yb = y(pos.b[it.name]);
            const dim = hover && hover !== it.name;
            return (
              <g key={it.name} className="slc__item" data-kind={kind} data-dim={dim ? "" : undefined} onPointerEnter={() => setHover(it.name)} onPointerLeave={() => setHover(null)}>
                <line x1={PADX} y1={ya} x2={W - PADX} y2={yb} className="slc__line" />
                <circle cx={PADX} cy={ya} r={5} className="slc__dot" />
                <circle cx={W - PADX} cy={yb} r={5} className="slc__dot" />
                <text x={PADX - 12} y={ya + 4} textAnchor="end" className="slc__lab">
                  {it.name} <tspan className="slc__v">{fmt(it.values[m][0])}</tspan>
                </text>
                <text x={W - PADX + 12} y={yb + 4} className="slc__lab">
                  <tspan className="slc__v">{fmt(it.values[m][1])}</tspan> {it.name}
                  {d !== 0 && (
                    <tspan className="slc__d" dx="6">
                      {d > 0 ? `▲${d}` : `▼${-d}`}
                    </tspan>
                  )}
                </text>
                <rect x={0} y={Math.min(ya, yb) - 14} width={W} height={Math.abs(yb - ya) + 28} fill="transparent" />
              </g>
            );
          })}
        </svg>
      ) : (
        <table className="slc__table">
          <thead>
            <tr>
              <th scope="col">Destination</th>
              <th scope="col">{periods[0]}</th>
              <th scope="col">{periods[1]}</th>
              <th scope="col">Rank change</th>
            </tr>
          </thead>
          <tbody>
            {items.map((it) => (
              <tr key={it.name}>
                <th scope="row">{it.name}</th>
                <td>{fmt(it.values[m][0])}</td>
                <td>{fmt(it.values[m][1])}</td>
                <td>{delta(it.name) > 0 ? `up ${delta(it.name)}` : delta(it.name) < 0 ? `down ${-delta(it.name)}` : "no change"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <p className="slc__legend">
        <span data-kind="up">▲ Climbed</span>
        <span data-kind="down">▼ Fell</span>
        <span data-kind="flat">— Held</span>
      </p>
    </div>
  );
}
