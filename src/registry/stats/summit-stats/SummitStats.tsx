"use client";
import { useEffect, useId, useLayoutEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { heightAt, progress, ridge, upTo, type P } from "./summit";
import "./summit-stats.css";

export type Checkpoint = { at: number; label: string; date: string };

export type SummitStatsProps = {
  title: string;
  value: number;
  goal: number;
  checkpoints: Checkpoint[];
  format?: (n: number) => string;
  /** A short line under the figure, e.g. "64 days to go". */
  note?: string;
  seed?: number;
  theme?: "paper" | "night";
  className?: string;
};

const H = 270, PAD = { l: 24, r: 70, t: 46, b: 30 };

/**
 * Summit Stats
 * Progress towards a goal drawn as a climb. The figure so far stands on a ridge that rises to the
 * goal at the summit; milestones are flags along the way, planted where they were reached; and a
 * climber walks the trail up to today when the section comes into view.
 */
export function SummitStats({ title, value, goal, checkpoints, format = (n) => n.toLocaleString("en-GB"), note, seed = 3, theme = "paper", className = "" }: SummitStatsProps) {
  const uid = useId().replace(/:/g, "");
  const root = useRef<HTMLElement>(null);
  const box = useRef<HTMLDivElement>(null);
  const [w, setW] = useState(720);
  const [shown, setShown] = useState(false);
  const [tip, setTip] = useState<number | null>(null);

  useLayoutEffect(() => {
    const el = box.current;
    if (!el) return;
    setW(Math.max(300, el.clientWidth));
    const ro = new ResizeObserver(([e]) => setW(Math.max(300, Math.round(e.contentRect.width))));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const reach = () => setShown(true);
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { reach(); io.disconnect(); } }, { threshold: 0.3 });
    io.observe(el);
    const b = el.getBoundingClientRect();
    if (b.top < window.innerHeight && b.bottom > 0) reach();
    return () => io.disconnect();
  }, []);

  const r = useMemo(() => ridge(48, seed), [seed]);
  const far = useMemo(() => ridge(30, seed + 7), [seed]);
  const X = (x: number) => PAD.l + x * (w - PAD.l - PAD.r), Y = (y: number) => H - PAD.b - y * (H - PAD.t - PAD.b);
  const line = (pts: P[], sx = X, sy = Y) => pts.map((p, i) => `${i ? "L" : "M"}${sx(p.x).toFixed(1)} ${sy(p.y).toFixed(1)}`).join("");
  const p = progress(value, goal);
  const hill = `${line(r)}L${w} ${Y(0.55)}L${w} ${H}L0 ${H}L0 ${Y(0)}Z`;
  const back = `${line(far, (x) => x * w * 1.05 - w * 0.12, (y) => Y(y * 0.62 + 0.08))}L${w} ${H}L0 ${H}Z`;
  const walked = line(upTo(r, p));
  const here = { x: X(p), y: Y(heightAt(r, p)) };
  // the snow line: a jagged edge across the top of the mountain
  const snow = `M0 0H${w}V${Y(0.8)}${Array.from({ length: 24 }, (_, i) => `L${w - (i + 1) * (w / 24)} ${Y(0.8) + (i % 2 ? 7 : -3)}`).join("")}Z`;

  return (
    <section ref={root} className={`summit summit--${theme} ${className}`} data-shown={shown ? "" : undefined} aria-labelledby={`${uid}-t`}>
      <header className="summit__head">
        <p id={`${uid}-t`} className="summit__title">{title}</p>
        <p className="summit__figure"><span className="summit__value">{format(value)}</span><span className="summit__goal">of {format(goal)}</span><span className="summit__pct">{Math.round(p * 100)}%</span></p>
        {note && <p className="summit__note">{note}</p>}
      </header>
      <div ref={box} className="summit__scene">
        <svg width={w} height={H} viewBox={`0 0 ${w} ${H}`} role="img" aria-label={`${format(value)} of a ${format(goal)} goal, ${Math.round(p * 100)}% of the way up. ${checkpoints.filter((c) => c.at <= value).length} of ${checkpoints.length} milestones passed.`}>
          <defs>
            <clipPath id={`${uid}s`}><path d={snow} /></clipPath>
            <linearGradient id={`${uid}m`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" className="summit__rock-top" /><stop offset="1" className="summit__rock-foot" /></linearGradient>
          </defs>
          <path d={back} className="summit__far" />
          <path d={hill} fill={`url(#${uid}m)`} />
          <path d={hill} clipPath={`url(#${uid}s)`} className="summit__snow" />
          <path d={line(r)} className="summit__trail" />
          <path d={walked} className="summit__walked" pathLength={1} />
          {checkpoints.map((c, i) => {
            const x = progress(c.at, goal), cx = X(x), cy = Y(heightAt(r, x)), passed = c.at <= value;
            return (
              <g key={i} className={`summit__flag ${passed ? "is-passed" : ""}`} transform={`translate(${cx} ${cy})`}>
                <line y1={0} y2={-24} /><path d="M0 -24 L13 -19.5 L0 -15Z" />
              </g>
            );
          })}
          <g className="summit__flag summit__flag--goal" transform={`translate(${X(1)} ${Y(1)})`}>
            <line y1={0} y2={-30} /><path d="M0 -30 L18 -24 L0 -18Z" />
            <text x={0} y={-36} textAnchor="middle">Goal</text>
          </g>
          <g className="summit__climber" style={{ offsetPath: `path("${walked}")` } as CSSProperties}>
            <circle r={9} className="summit__halo" /><circle r={5} className="summit__dot" />
          </g>
          <circle cx={here.x} cy={here.y} r={5} className="summit__still" />
        </svg>
        {checkpoints.map((c, i) => {
          const x = progress(c.at, goal);
          return (
            <button key={i} type="button" className="summit__hit" style={{ left: X(x), top: Y(heightAt(r, x)) - 20 }}
              aria-label={`${c.label}, ${format(c.at)}, ${c.date}`} aria-describedby={tip === i ? `${uid}-tip` : undefined}
              onPointerEnter={() => setTip(i)} onPointerLeave={() => setTip(null)} onFocus={() => setTip(i)} onBlur={() => setTip(null)} />
          );
        })}
        {tip !== null && (() => {
          const c = checkpoints[tip], x = progress(c.at, goal);
          return (
            <div id={`${uid}-tip`} role="tooltip" className="summit__tip" style={{ left: Math.min(Math.max(X(x), 90), w - 90), top: Y(heightAt(r, x)) - 34 }}>
              <b>{format(c.at)}</b><span>{c.label}</span><small>{c.date}</small>
            </div>
          );
        })()}
      </div>
    </section>
  );
}

export default SummitStats;
