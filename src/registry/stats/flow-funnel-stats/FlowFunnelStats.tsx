"use client";

import { useEffect, useId, useRef, useState } from "react";
import "./flow-funnel-stats.css";

/**
 * Flow Funnel Stats
 * A funnel you can follow. Each source keeps its colour from the first
 * visit to the last booking, so the bands narrowing between stages are the
 * people who went on — and how much each one narrows is where they left.
 * Point at a source and its path lights end to end with its conversion;
 * point at a stage and the step into it is read out.
 */

export type Source = { name: string; values: number[] };
type Props = {
  stages: string[];
  sources: Source[];
  title?: string;
  theme?: "paper" | "night";
  motion?: "full" | "reduced";
  className?: string;
};

const W = 760, H = 360;
const TOP = 50, BOT = 16;
const NODE = 14; // stage bar width
const GAP = 3; // between source segments in a stage
const fmt = (n: number) => Math.round(n).toLocaleString("en-US");
const pct = (a: number, b: number) => `${((a / b) * 100).toFixed(a / b < 0.1 ? 1 : 0)}%`;

export function FlowFunnelStats({ stages, sources, title = "Conversion funnel", theme = "paper", motion = "full", className = "" }: Props) {
  const id = useId().replace(/:/g, "");
  const root = useRef<HTMLElement>(null);
  const [on, setOn] = useState(false);
  const [hot, setHot] = useState<number | null>(null);
  const [pinned, setPinned] = useState<number | null>(null);
  const [stageHot, setStageHot] = useState<number | null>(null);
  const focus = pinned ?? hot;

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setOn(true); io.disconnect(); } }, { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const S = stages.length;
  const totals = stages.map((_, s) => sources.reduce((a, src) => a + src.values[s], 0));
  // One scale for every stage, so a band's width is always the same number of people.
  const k = (H - TOP - BOT - GAP * (sources.length - 1)) / totals[0];
  const xs = stages.map((_, s) => 120 + (s * (W - 120 - 120)) / (S - 1));

  // Each stage's stack is centred on the chart's middle, so the funnel narrows toward its axis.
  const mid = TOP + (H - TOP - BOT) / 2;
  const seg = stages.map((_, s) => {
    const hs = sources.map((src) => src.values[s] * k);
    const gap = s === 0 ? GAP * 2.5 : GAP;
    const total = hs.reduce((a, b) => a + b, 0) + gap * (sources.length - 1);
    let y = mid - total / 2;
    return hs.map((h) => {
      const r = { y, h };
      y += h + gap;
      return r;
    });
  });

  const band = (s: number, i: number) => {
    const a = seg[s][i], b = seg[s + 1][i];
    const x0 = xs[s] + NODE / 2, x1 = xs[s + 1] - NODE / 2, c = (x1 - x0) * 0.5;
    return `M${x0} ${a.y} C${x0 + c} ${a.y} ${x1 - c} ${b.y} ${x1} ${b.y} L${x1} ${b.y + b.h} C${x1 - c} ${b.y + b.h} ${x0 + c} ${a.y + a.h} ${x0} ${a.y + a.h} Z`;
  };

  // End labels: at their segments when there's room, otherwise pushed apart (14px) and re-centred.
  const endY = (() => {
    const want = seg[S - 1].map((r) => r.y + r.h / 2);
    const out = want.slice();
    for (let i = 1; i < out.length; i++) out[i] = Math.max(out[i], out[i - 1] + 14);
    const shift = (want.reduce((a, b) => a + b, 0) - out.reduce((a, b) => a + b, 0)) / out.length;
    return out.map((y) => y + shift);
  })();

  const say = focus !== null
    ? `${sources[focus].name}: ${fmt(sources[focus].values[0])} ${stages[0].toLowerCase()} → ${fmt(sources[focus].values[S - 1])} ${stages[S - 1].toLowerCase()} · ${pct(sources[focus].values[S - 1], sources[focus].values[0])} convert`
    : stageHot !== null && stageHot > 0
      ? `${stages[stageHot - 1]} → ${stages[stageHot]}: ${pct(totals[stageHot], totals[stageHot - 1])} carry on (${fmt(totals[stageHot])} of ${fmt(totals[stageHot - 1])})`
      : `${pct(totals[S - 1], totals[0])} of ${fmt(totals[0])} visits end in a booking`;

  return (
    <section ref={root} className={`ff ff--${theme} ${className}`} data-motion={motion} data-on={on || undefined} data-focus={focus !== null || undefined} aria-label={title}>
      <div className="ff__head">
        <p className="ff__big">
          {fmt(totals[S - 1])} <span>{stages[S - 1].toLowerCase()} from {fmt(totals[0])} visits</span>
        </p>
        <p className="ff__say" aria-live="polite">{say}</p>
      </div>

      <div className="ff__legend" role="group" aria-label="Sources — select one to follow it">
        {sources.map((src, i) => (
          <button
            key={src.name}
            type="button"
            className="ff__key"
            data-i={i}
            aria-pressed={pinned === i}
            data-dim={focus !== null && focus !== i ? "" : undefined}
            onClick={() => setPinned((p) => (p === i ? null : i))}
            onPointerEnter={() => setHot(i)}
            onPointerLeave={() => setHot(null)}
            onFocus={() => setHot(i)}
            onBlur={() => setHot(null)}
          >
            <span className="ff__sw" aria-hidden="true" />
            {src.name}
            <span className="ff__rate">{pct(src.values[S - 1], src.values[0])}</span>
          </button>
        ))}
      </div>

      <div className="ff__scroll">
        <svg viewBox={`0 0 ${W} ${H}`} className="ff__svg" role="img" aria-labelledby={`${id}-sum`}>
          <title id={`${id}-sum`}>{`${title}: ${stages.map((st, s) => `${fmt(totals[s])} ${st.toLowerCase()}`).join(", then ")}.`}</title>
          <defs>
            {/* Bands are revealed left to right, stage by stage. */}
            <clipPath id={`${id}-reveal`}>
              <rect x={0} y={0} width={W} height={H} className="ff__reveal" />
            </clipPath>
          </defs>

          {stages.map((st, s) => (
            <g key={st} className="ff__stage" data-hot={stageHot === s || undefined} onPointerEnter={() => setStageHot(s)} onPointerLeave={() => setStageHot(null)}>
              <rect x={xs[s] - 46} y={0} width={92} height={H} className="ff__stage-hit" />
              <text x={xs[s]} y={14} textAnchor="middle" className="ff__stage-name">{st}</text>
              <text x={xs[s]} y={28} textAnchor="middle" className="ff__stage-num">{fmt(totals[s])}</text>
            </g>
          ))}

          <g clipPath={`url(#${id}-reveal)`}>
            {stages.slice(0, -1).map((_, s) =>
              sources.map((src, i) => (
                <path key={`${s}-${i}`} d={band(s, i)} className="ff__band" data-i={i} data-dim={focus !== null && focus !== i ? "" : undefined} data-lit={focus === i || undefined} />
              )),
            )}
          </g>

          {stages.map((st, s) =>
            sources.map((src, i) => (
              <rect key={`${st}-${i}`} x={xs[s] - NODE / 2} y={seg[s][i].y} width={NODE} height={Math.max(1, seg[s][i].h)} rx={Math.min(3, seg[s][i].h / 2)} className="ff__node" data-i={i} data-dim={focus !== null && focus !== i ? "" : undefined} />
            )),
          )}

          {/* Direct labels on the first column, values on the last. */}
          {sources.map((src, i) => (
            <g key={src.name} className="ff__label" data-dim={focus !== null && focus !== i ? "" : undefined}>
              <text x={xs[0] - NODE / 2 - 10} y={seg[0][i].y + seg[0][i].h / 2} textAnchor="end" dominantBaseline="central" className="ff__src">{src.name}</text>
              <text x={xs[0] - NODE / 2 - 10} y={seg[0][i].y + seg[0][i].h / 2 + 14} textAnchor="end" dominantBaseline="central" className="ff__src-n">{fmt(src.values[0])}</text>
            </g>
          ))}
          {sources.map((src, i) => {
            const r = seg[S - 1][i];
            return (
              <g key={src.name} className="ff__end-g" data-dim={focus !== null && focus !== i ? "" : undefined}>
                {Math.abs(endY[i] - (r.y + r.h / 2)) > 1 && (
                  <path d={`M${xs[S - 1] + NODE / 2 + 2} ${r.y + r.h / 2} L${xs[S - 1] + NODE / 2 + 7} ${endY[i]}`} className="ff__leader" />
                )}
                <text x={xs[S - 1] + NODE / 2 + 10} y={endY[i]} dominantBaseline="central" className="ff__end" data-i={i}>
                  {fmt(src.values[S - 1])}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Tables ignore overflow, so the hidden table sits inside a hidden box. */}
      <div className="ff__sr">
      <table>
        <caption>{title}</caption>
        <thead>
          <tr>
            <th scope="col">Source</th>
            {stages.map((st) => <th key={st} scope="col">{st}</th>)}
          </tr>
        </thead>
        <tbody>
          {sources.map((src) => (
            <tr key={src.name}>
              <th scope="row">{src.name}</th>
              {src.values.map((v, s) => <td key={s}>{fmt(v)}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </section>
  );
}
