"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import "./model-bench.css";

/**
 * Model Bench
 * Compare AI models the way you'd choose one: how well they do against what they cost, or how
 * long they take. Each model is a dot; the efficient frontier links the ones nothing beats on
 * both axes; the ranked list beside it shows each score with its 95% interval. Hover either
 * view and the same model lights up in both.
 */

export type Model = { id: string; name: string; provider: string; score: number; lo: number; hi: number; cost: number; seconds: number };

type Axis = "cost" | "seconds";
type Props = { models: Model[]; providers: string[]; title?: string; tasks?: number; theme?: "light" | "dark"; motion?: "full" | "reduced"; className?: string };

const W = 620, H = 380, M = { l: 52, r: 18, t: 18, b: 44 };
const SERIES_LIGHT = ["#2a78d6", "#eb6834", "#1baf7a", "#eda100", "#e87ba4"];
const SERIES_DARK = ["#3987e5", "#d95926", "#199e70", "#c98500", "#d55181"];

const logScale = (v: number, a: number, b: number) => (Math.log(v) - Math.log(a)) / (Math.log(b) - Math.log(a));

/** Models that no other model beats on both score (higher) and the x measure (lower). */
function frontier(ms: Model[], axis: Axis) {
  const sorted = [...ms].sort((a, b) => a[axis] - b[axis]);
  const out: Model[] = [];
  let best = -Infinity;
  for (const m of sorted) if (m.score > best) {
    out.push(m);
    best = m.score;
  }
  return out;
}

export function ModelBench({ models, providers, title = "Agentic coding bench", tasks = 412, theme = "light", motion = "full", className = "" }: Props) {
  const [axis, setAxis] = useState<Axis>("cost");
  const [hover, setHover] = useState<string | null>(null);
  const [hidden, setHidden] = useState<string[]>([]);
  const [view, setView] = useState<"chart" | "table">("chart");
  const [k, setK] = useState(1);
  const series = theme === "dark" ? SERIES_DARK : SERIES_LIGHT;
  const colour = (p: string) => series[providers.indexOf(p) % series.length];
  const vis = models.filter((m) => !hidden.includes(m.provider));

  // Positions for both axes; switching tweens between them.
  const range = (a: Axis) => {
    const vs = models.map((m) => m[a]);
    return [Math.min(...vs) / 1.4, Math.max(...vs) * 1.4] as const;
  };
  const yMin = Math.floor(Math.min(...models.map((m) => m.lo)) / 5) * 5, yMax = Math.ceil(Math.max(...models.map((m) => m.hi)) / 5) * 5;
  const px = (m: Model, a: Axis) => M.l + logScale(m[a], ...range(a)) * (W - M.l - M.r);
  const py = (v: number) => M.t + (1 - (v - yMin) / (yMax - yMin)) * (H - M.t - M.b);
  const from = useRef<Axis>("cost");
  useEffect(() => {
    const reduced = motion === "reduced" || matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return setK(1);
    let raf = 0;
    const t0 = performance.now();
    const step = (t: number) => {
      const u = Math.min(1, (t - t0) / 650);
      setK(1 - Math.pow(1 - u, 3));
      if (u < 1) raf = requestAnimationFrame(step);
      else from.current = axis;
    };
    setK(0);
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [axis, motion]);
  const x = (m: Model) => px(m, from.current) + (px(m, axis) - px(m, from.current)) * k;

  const front = useMemo(() => frontier(vis, axis), [vis, axis]);
  const frontPath = front.map((m, i) => `${i ? "L" : "M"}${x(m).toFixed(1)} ${py(m.score).toFixed(1)}`).join(" ");
  const leader = [...vis].sort((a, b) => b.score - a.score)[0];
  // The value pick: the cheapest frontier model within 88% of the leader's score.
  const value = leader ? front.filter((m) => m.id !== leader.id && m.score >= leader.score * 0.88).sort((a, b) => a[axis] - b[axis])[0] : undefined;
  const ticks = useMemo(() => {
    const [a, b] = range(axis);
    const out: number[] = [];
    for (let e = Math.floor(Math.log10(a)); e <= Math.ceil(Math.log10(b)); e++) for (const m of [1, 2, 5]) { const v = m * 10 ** e; if (v >= a && v <= b) out.push(v); }
    return out;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [axis]);
  const fmtX = (v: number) => (axis === "cost" ? `$${v < 1 ? v.toFixed(2) : v.toFixed(v < 10 ? 1 : 0)}` : `${v < 10 ? v.toFixed(1) : Math.round(v)}s`);
  const ranked = [...vis].sort((a, b) => b.score - a.score);
  const hm = models.find((m) => m.id === hover);

  return (
    <div className={`mb mb--${theme} ${className}`}>
      <header className="mb__head">
        <div>
          <p className="mb__title">
            {title} · {tasks} tasks
          </p>
          <p className="mb__hero">
            {leader && (
              <>
                {leader.name} leads at <strong>{leader.score.toFixed(1)}%</strong>
                {value && (
                  <span>
                    {" "}
                    · {value.name} gets {Math.round((value.score / leader.score) * 100)}% of that {axis === "cost" ? `for ${Math.round((value.cost / leader.cost) * 100)}% of the cost` : `in ${Math.round((value.seconds / leader.seconds) * 100)}% of the time`}
                  </span>
                )}
              </>
            )}
          </p>
        </div>
        <div className="mb__controls">
          <div role="radiogroup" aria-label="Compare score against" className="mb__seg">
            {(["cost", "seconds"] as Axis[]).map((a) => (
              <button key={a} type="button" role="radio" aria-checked={axis === a} onClick={() => setAxis(a)}>
                {a === "cost" ? "Cost per task" : "Time per task"}
              </button>
            ))}
          </div>
          <button type="button" className="mb__view" aria-pressed={view === "table"} onClick={() => setView((v) => (v === "chart" ? "table" : "chart"))}>
            {view === "chart" ? "Table" : "Chart"}
          </button>
        </div>
      </header>

      <ul className="mb__legend" aria-label="Providers">
        {providers.map((p) => (
          <li key={p}>
            <button type="button" aria-pressed={!hidden.includes(p)} onClick={() => setHidden((h) => (h.includes(p) ? h.filter((x) => x !== p) : [...h, p]))}>
              <i style={{ background: colour(p) }} />
              {p}
            </button>
          </li>
        ))}
      </ul>

      {view === "chart" ? (
        <div className="mb__body">
          <div className="mb__plot">
            <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`Score against ${axis === "cost" ? "cost per task" : "time per task"} for ${vis.length} models. ${leader ? `${leader.name} scores highest.` : ""}`}>
              {Array.from({ length: (yMax - yMin) / 5 + 1 }, (_, i) => yMin + i * 5).map((v) => (
                <g key={v}>
                  <line x1={M.l} x2={W - M.r} y1={py(v)} y2={py(v)} className="mb__grid" />
                  <text x={M.l - 8} y={py(v) + 4} className="mb__tick" textAnchor="end">
                    {v}%
                  </text>
                </g>
              ))}
              {ticks.map((v) => {
                const xx = M.l + logScale(v, ...range(axis)) * (W - M.l - M.r);
                return (
                  <text key={v} x={xx} y={H - M.b + 18} className="mb__tick" textAnchor="middle">
                    {fmtX(v)}
                  </text>
                );
              })}
              <text x={(M.l + W - M.r) / 2} y={H - 6} className="mb__axis" textAnchor="middle">
                {axis === "cost" ? "Cost per task (log scale) — further left is cheaper" : "Median time per task (log scale) — further left is faster"}
              </text>
              {/* the efficient frontier: nothing beats these on both axes */}
              <path d={`${frontPath} L${W - M.r} ${py(front[front.length - 1]?.score ?? yMin)}`} className="mb__front" />
              {vis.map((m) => {
                const on = !hover || hover === m.id;
                const isFront = front.includes(m);
                return (
                  <g key={m.id} className="mb__dot" data-dim={on ? undefined : ""} onPointerEnter={() => setHover(m.id)} onPointerLeave={() => setHover(null)}>
                    <line x1={x(m)} x2={x(m)} y1={py(m.lo)} y2={py(m.hi)} stroke={colour(m.provider)} className="mb__ci" />
                    <circle cx={x(m)} cy={py(m.score)} r={hover === m.id ? 8 : 6} fill={isFront ? colour(m.provider) : "var(--surface)"} stroke={colour(m.provider)} />
                    <text x={x(m) + 10} y={py(m.score) + 4} className="mb__label">
                      {m.name}
                    </text>
                    <circle cx={x(m)} cy={py(m.score)} r={16} fill="transparent" />
                  </g>
                );
              })}
            </svg>
            {hm && (
              <div className="mb__tip" style={{ left: `${(x(hm) / W) * 100}%`, top: `${(py(hm.score) / H) * 100}%` }} aria-hidden="true">
                <strong>{hm.name}</strong>
                <span>{hm.provider}</span>
                <span>
                  Score {hm.score.toFixed(1)}% ({hm.lo.toFixed(1)}–{hm.hi.toFixed(1)})
                </span>
                <span>
                  ${hm.cost.toFixed(2)} · {hm.seconds.toFixed(0)}s per task
                </span>
              </div>
            )}
            <p className="mb__note">Filled dots are on the efficient frontier. Whiskers show 95% intervals.</p>
          </div>
          <ol className="mb__rank" aria-label="Models ranked by score">
            {ranked.map((m, i) => (
              <li key={m.id} data-dim={hover && hover !== m.id ? "" : undefined} onPointerEnter={() => setHover(m.id)} onPointerLeave={() => setHover(null)} tabIndex={0} onFocus={() => setHover(m.id)} onBlur={() => setHover(null)}>
                <span className="mb__pos">{i + 1}</span>
                <span className="mb__name">{m.name}</span>
                <span className="mb__track">
                  <span className="mb__ci2" style={{ left: `${((m.lo - yMin) / (yMax - yMin)) * 100}%`, width: `${((m.hi - m.lo) / (yMax - yMin)) * 100}%`, background: colour(m.provider) }} />
                  <span className="mb__fill" style={{ width: `${((m.score - yMin) / (yMax - yMin)) * 100}%`, background: colour(m.provider) }} />
                </span>
                <span className="mb__val">{m.score.toFixed(1)}</span>
              </li>
            ))}
          </ol>
        </div>
      ) : (
        <div className="mb__table-wrap">
          <table className="mb__table">
            <caption className="mb__sr">Benchmark results by model</caption>
            <thead>
              <tr>
                <th scope="col">Model</th>
                <th scope="col">Provider</th>
                <th scope="col">Score</th>
                <th scope="col">95% interval</th>
                <th scope="col">Cost / task</th>
                <th scope="col">Time / task</th>
              </tr>
            </thead>
            <tbody>
              {ranked.map((m) => (
                <tr key={m.id}>
                  <th scope="row">{m.name}</th>
                  <td>{m.provider}</td>
                  <td>{m.score.toFixed(1)}%</td>
                  <td>
                    {m.lo.toFixed(1)}–{m.hi.toFixed(1)}
                  </td>
                  <td>${m.cost.toFixed(2)}</td>
                  <td>{m.seconds.toFixed(0)}s</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
