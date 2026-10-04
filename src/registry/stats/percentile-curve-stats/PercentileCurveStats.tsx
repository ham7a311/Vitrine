"use client";

import { useEffect, useId, useMemo, useRef, useState, type KeyboardEvent, type PointerEvent as RPointerEvent } from "react";
import "./percentile-curve-stats.css";

/**
 * Percentile Curve Stats
 * Where you sit among everyone else. A distribution curve shows how a
 * number is spread across people; your marker drops onto it and the share
 * of people you're ahead of fills in, counting up. Drag the marker to ask
 * "what if"; switch metric and the curve reshapes itself into the new
 * distribution while your marker slides to your new place on it.
 */

export type Metric = {
  id: string;
  label: string;
  unit: string;
  /** Domain shown on the axis. */
  min: number;
  max: number;
  /** Keyboard step. */
  step: number;
  /** Your value. */
  you: number;
  /** Is a lower value better (e.g. commute time)? */
  lowerIsBetter?: boolean;
  /** Density at a value (any scale). */
  density: (x: number) => number;
  /** Who you're compared with, e.g. "commuters". */
  people: string;
};

type Props = { metrics: Metric[]; title?: string; theme?: "paper" | "night"; motion?: "full" | "reduced"; className?: string };

const N = 72;
const W = 640, H = 240, PAD = { l: 18, r: 18, t: 46, b: 34 };
const PW = W - PAD.l - PAD.r, PH = H - PAD.t - PAD.b;

/** Sample a metric's density on N evenly spaced points, normalised to peak 1, with its CDF. */
function sample(m: Metric) {
  const ys: number[] = [];
  for (let i = 0; i < N; i++) ys.push(Math.max(0, m.density(m.min + ((m.max - m.min) * i) / (N - 1))));
  const peak = Math.max(...ys) || 1;
  const norm = ys.map((y) => y / peak);
  const cdf: number[] = [0];
  for (let i = 1; i < N; i++) cdf.push(cdf[i - 1] + (norm[i] + norm[i - 1]) / 2);
  const total = cdf[N - 1] || 1;
  return { ys: norm, cdf: cdf.map((c) => c / total) };
}

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

export function PercentileCurveStats({ metrics, title = "Where you sit", theme = "paper", motion = "full", className = "" }: Props) {
  const id = useId().replace(/:/g, "");
  const root = useRef<HTMLElement>(null);
  const svg = useRef<SVGSVGElement>(null);
  const samples = useMemo(() => metrics.map(sample), [metrics]);
  const [mi, setMi] = useState(0);
  const [vals, setVals] = useState(() => metrics.map((m) => m.you));
  const [, force] = useState(0);
  const anim = useRef({
    from: samples[0].ys.slice(),
    shown: samples[0].ys.slice(),
    t: 1,
    fx: (metrics[0].you - metrics[0].min) / (metrics[0].max - metrics[0].min),
    fxv: 0,
    drop: 0,
    dropv: 0,
    on: false,
    raf: 0,
    last: 0,
  });
  const dragging = useRef(false);
  // The loop reads the latest metric and values from here, never from a stale render.
  const cur = useRef({ mi: 0, vals: metrics.map((m) => m.you) });

  const m = metrics[mi];
  const s = samples[mi];
  const value = vals[mi];
  cur.current = { mi, vals };
  const still = () => motion === "reduced" || (typeof window !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches);

  const run = () => {
    const a = anim.current;
    if (a.raf) return;
    const step = (now: number) => {
      const dt = Math.min(0.032, a.last ? (now - a.last) / 1000 : 0.016);
      a.last = now;
      const { mi: ci, vals: cv } = cur.current;
      const target = samples[ci].ys;
      const fxTo = (cv[ci] - metrics[ci].min) / (metrics[ci].max - metrics[ci].min);
      let busy = false;
      if (still()) {
        a.t = 1; a.fx = fxTo; a.fxv = 0; a.drop = a.on ? 1 : 0; a.dropv = 0;
      } else {
        if (a.t < 1) { a.t = Math.min(1, a.t + dt / 0.65); busy = true; }
        // The marker slides on a spring; while dragging it follows exactly.
        if (dragging.current) { a.fx = fxTo; a.fxv = 0; }
        else {
          const k = 160, c = 2 * 0.8 * Math.sqrt(k);
          a.fxv += ((fxTo - a.fx) * k - a.fxv * c) * dt;
          a.fx += a.fxv * dt;
          if (Math.abs(fxTo - a.fx) > 0.0005 || Math.abs(a.fxv) > 0.001) busy = true;
          else { a.fx = fxTo; a.fxv = 0; }
        }
        // The drop: falls onto the curve with a small bounce.
        if (a.on) {
          const k = 120, c = 2 * 0.42 * Math.sqrt(k);
          a.dropv += ((1 - a.drop) * k - a.dropv * c) * dt;
          a.drop += a.dropv * dt;
          if (Math.abs(1 - a.drop) > 0.001 || Math.abs(a.dropv) > 0.002) busy = true;
          else { a.drop = 1; a.dropv = 0; }
        }
      }
      const e = ease(a.t);
      a.shown = target.map((y, i) => lerp(a.from[i], y, e));
      force((n) => n + 1);
      if (busy && !document.hidden) a.raf = requestAnimationFrame(step);
      else { a.raf = 0; a.last = 0; }
    };
    a.raf = requestAnimationFrame(step);
  };

  // Metric changes: morph from whatever is on screen now to the new shape.
  useEffect(() => {
    const a = anim.current;
    a.from = a.shown.slice();
    a.t = still() ? 1 : 0;
    cancelAnimationFrame(a.raf);
    a.raf = 0;
    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mi]);
  useEffect(() => { run(); /* value moved */ // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vals]);
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { anim.current.on = true; run(); io.disconnect(); } }, { threshold: 0.4 });
    io.observe(el);
    return () => { io.disconnect(); cancelAnimationFrame(anim.current.raf); anim.current.raf = 0; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const a = anim.current;
  const X = (f: number) => PAD.l + f * PW;
  const Y = (y: number) => PAD.t + PH - y * PH;
  const ys = a.shown;
  const yAt = (f: number) => {
    const p = Math.max(0, Math.min(N - 1, f * (N - 1)));
    const i = Math.floor(p), j = Math.min(N - 1, i + 1);
    return lerp(ys[i], ys[j], p - i);
  };
  const cdfAt = (f: number) => {
    const p = Math.max(0, Math.min(N - 1, f * (N - 1)));
    const i = Math.floor(p), j = Math.min(N - 1, i + 1);
    return lerp(s.cdf[i], s.cdf[j], p - i);
  };
  // A smooth curve through the samples (Catmull-Rom as cubic Béziers).
  const curve = useMemo(() => {
    const pts = ys.map((y, i) => [X(i / (N - 1)), Y(y)]);
    let d = `M${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i - 1] ?? pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] ?? p2;
      d += `C${(p1[0] + (p2[0] - p0[0]) / 6).toFixed(1)} ${(p1[1] + (p2[1] - p0[1]) / 6).toFixed(1)} ${(p2[0] - (p3[0] - p1[0]) / 6).toFixed(1)} ${(p2[1] - (p3[1] - p1[1]) / 6).toFixed(1)} ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`;
    }
    return d;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ys]);
  const area = `${curve} L${X(1)} ${Y(0)} L${X(0)} ${Y(0)} Z`;

  const fx = Math.max(0, Math.min(1, a.fx));
  const below = cdfAt(fx);
  const beaten = m.lowerIsBetter ? 1 - below : below;
  const pct = Math.round(beaten * 100 * Math.min(1, Math.max(0, a.drop)));
  const mx = X(fx), my = Y(yAt(fx));
  const dropY = lerp(PAD.t - 30, my, Math.max(0, a.drop));
  const fmtV = (v: number) => (m.step < 1 ? v.toFixed(1) : Math.round(v).toLocaleString("en-US"));
  const isYou = Math.abs(value - m.you) < m.step / 2;
  const word = m.lowerIsBetter ? "Faster than" : "More than";
  const tagText = `${isYou ? "You · " : ""}${fmtV(value)} ${m.unit}`;
  const tagW = Math.round(tagText.length * 6.6 + 22);

  const setFromPointer = (e: RPointerEvent) => {
    const el = svg.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const f = Math.max(0, Math.min(1, (((e.clientX - r.left) / r.width) * W - PAD.l) / PW));
    const v = m.min + f * (m.max - m.min);
    const snapped = Math.round(v / m.step) * m.step;
    setVals((vs) => vs.map((x, i) => (i === mi ? Math.max(m.min, Math.min(m.max, snapped)) : x)));
  };
  const onKey = (e: KeyboardEvent) => {
    const big = (m.max - m.min) / 10;
    const d: Record<string, number> = { ArrowRight: m.step, ArrowUp: m.step, ArrowLeft: -m.step, ArrowDown: -m.step, PageUp: big, PageDown: -big };
    let next: number | null = null;
    if (e.key in d) next = value + d[e.key];
    else if (e.key === "Home") next = m.min;
    else if (e.key === "End") next = m.max;
    if (next === null) return;
    e.preventDefault();
    const v = Math.max(m.min, Math.min(m.max, Math.round(next / m.step) * m.step));
    setVals((vs) => vs.map((x, i) => (i === mi ? v : x)));
  };

  // Round tick values: a 1, 2 or 5 × 10ⁿ step that gives four to six ticks.
  const tickVals = (() => {
    const span = m.max - m.min, raw = span / 5, mag = Math.pow(10, Math.floor(Math.log10(raw)));
    const stepT = [1, 2, 2.5, 5, 10].map((k) => k * mag).find((k) => span / k <= 6) ?? 10 * mag;
    const out: number[] = [];
    for (let v = Math.ceil(m.min / stepT) * stepT; v <= m.max + 1e-9; v += stepT) out.push(v);
    return out;
  })();
  return (
    <section ref={root} className={`pcs pcs--${theme} ${className}`} data-motion={motion} aria-label={title}>
      <div className="pcs__tabs" role="tablist" aria-label="Metric">
        {metrics.map((x, i) => (
          <button key={x.id} type="button" role="tab" id={`${id}-t${i}`} aria-selected={i === mi} aria-controls={`${id}-p`} tabIndex={i === mi ? 0 : -1} className="pcs__tab"
            onClick={() => setMi(i)}
            onKeyDown={(e) => {
              const d = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
              if (!d) return;
              e.preventDefault();
              const n = (mi + d + metrics.length) % metrics.length;
              setMi(n);
              (e.currentTarget.parentElement?.children[n] as HTMLElement | undefined)?.focus();
            }}>
            {x.label}
          </button>
        ))}
      </div>

      <div id={`${id}-p`} role="tabpanel" aria-labelledby={`${id}-t${mi}`}>
        <div className="pcs__head">
          <p className="pcs__big">
            <span className="pcs__word">{isYou ? word : `At ${fmtV(value)} ${m.unit}: ${word.toLowerCase()}`}</span>
            <span className="pcs__pct">{pct}%</span>
            <span className="pcs__word">of {m.people}</span>
          </p>
          {!isYou && (
            <button type="button" className="pcs__reset" onClick={() => setVals((vs) => vs.map((x, i) => (i === mi ? m.you : x)))}>
              Back to you
            </button>
          )}
        </div>

        <svg
          ref={svg}
          viewBox={`0 0 ${W} ${H}`}
          className="pcs__svg"
          role="slider"
          tabIndex={0}
          aria-label={`${m.label}: drag to compare a value`}
          aria-valuemin={m.min}
          aria-valuemax={m.max}
          aria-valuenow={value}
          aria-valuetext={`${fmtV(value)} ${m.unit}, ${word.toLowerCase()} ${Math.round(beaten * 100)}% of ${m.people}`}
          onKeyDown={onKey}
          onPointerDown={(e) => { dragging.current = true; e.currentTarget.setPointerCapture(e.pointerId); setFromPointer(e); }}
          onPointerMove={(e) => { if (dragging.current) setFromPointer(e); }}
          onPointerUp={() => { dragging.current = false; run(); }}
          onPointerCancel={() => { dragging.current = false; }}
        >
          <defs>
            <clipPath id={`${id}-beat`}>
              {m.lowerIsBetter ? <rect x={mx} y={0} width={Math.max(0, X(1) - mx)} height={H} /> : <rect x={X(0)} y={0} width={Math.max(0, mx - X(0))} height={H} />}
            </clipPath>
          </defs>
          {tickVals.map((tv, i) => {
            const f = (tv - m.min) / (m.max - m.min);
            const last = i === tickVals.length - 1;
            return (
              <g key={tv}>
                <line x1={X(f)} x2={X(f)} y1={Y(0)} y2={Y(0) + 5} className="pcs__tick" />
                <text x={X(f)} y={Y(0) + 19} className="pcs__axis" textAnchor={f < 0.02 ? "start" : f > 0.98 ? "end" : "middle"}>
                  {Number.isInteger(tv) ? tv.toLocaleString("en-US") : tv.toFixed(1)}
                  {last ? ` ${m.unit}` : ""}
                </text>
              </g>
            );
          })}
          <path d={area} className="pcs__area" />
          <path d={area} className="pcs__beat" clipPath={`url(#${id}-beat)`} style={{ opacity: Math.min(1, Math.max(0, a.drop)) }} />
          <path d={curve} className="pcs__curve" />
          <line x1={X(0)} x2={X(1)} y1={Y(0)} y2={Y(0)} className="pcs__base" />
          {/* The marker */}
          <line x1={mx} x2={mx} y1={Y(0)} y2={Math.min(Y(0), dropY)} className="pcs__stem" style={{ opacity: Math.min(1, Math.max(0, a.drop)) }} />
          <circle cx={mx} cy={dropY} r={7} className="pcs__dot" style={{ opacity: a.on ? 1 : 0 }} />
          <g transform={`translate(${Math.max(PAD.l + tagW / 2, Math.min(W - PAD.r - tagW / 2, mx))} ${Math.max(18, dropY - 26)})`} className="pcs__tag" style={{ opacity: Math.min(1, Math.max(0, a.drop)) }}>
            <rect x={-tagW / 2} y={-14} width={tagW} height={22} rx={11} />
            <text y={1} textAnchor="middle" dominantBaseline="middle">
              {tagText}
            </text>
          </g>
        </svg>
        <p className="pcs__note">
          {m.lowerIsBetter ? "Shaded: people slower than this." : "Shaded: people below this."} Drag along the curve, or focus it and use ← →.
        </p>
      </div>
    </section>
  );
}
