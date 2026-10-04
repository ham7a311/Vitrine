"use client";

import { useEffect, useId, useRef, useState, type KeyboardEvent, type PointerEvent as RPointerEvent } from "react";
import "./hour-dial-stats.css";

/**
 * Hour Dial Stats
 * A day of footfall on a 24-hour clock face: one bar per hour, radiating
 * from the centre, with sunrise and sunset marked on the rim and the busiest
 * stretch washed in softly. Turn the hand — drag it, or use the arrow keys —
 * and the centre reads that hour. Switch between weekdays and the weekend
 * and the bars grow and shrink into the other day's shape.
 */

type Props = {
  /** Series keyed by day type, 24 values each (midnight first). */
  days: Record<string, number[]>;
  /** Initial hour, 0–23. */
  hour?: number;
  sunrise?: number;
  sunset?: number;
  unit?: string;
  title?: string;
  theme?: "paper" | "night";
  motion?: "full" | "reduced";
  className?: string;
};

const C = 180;
const R0 = 62; // inner radius: where bars start
const R1 = 132; // longest bar ends here, clear of the hour labels
const RIM = 162;

const pad = (h: number) => `${String(h).padStart(2, "0")}:00`;
const polar = (deg: number, r: number) => {
  const a = ((deg - 90) * Math.PI) / 180;
  return { x: C + Math.cos(a) * r, y: C + Math.sin(a) * r };
};

export function HourDialStats({ days, hour = 19, sunrise = 5.9, sunset = 17.75, unit = "guests", title = "Footfall by hour", theme = "paper", motion = "full", className = "" }: Props) {
  const keys = Object.keys(days);
  const [day, setDay] = useState(keys[0]);
  const [h, setH] = useState(hour);
  const handRef = useRef<SVGGElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const ang = useRef({ v: hour * 15, vel: 0, raf: 0, last: 0 });
  const dragging = useRef(false);
  const id = useId().replace(/:/g, "");

  const data = days[day];
  const max = Math.max(...keys.flatMap((k) => days[k]));
  const open = data.filter((v) => v > 0);
  const mean = open.reduce((s, v) => s + v, 0) / Math.max(1, open.length);
  const v = data[h];
  const mood = v === 0 ? "Closed" : v >= mean * 1.45 ? "Peak" : v >= mean * 1.1 ? "Busy" : v >= mean * 0.6 ? "Steady" : "Quiet";

  // The busiest stretch: the longest run of hours at 75% of the day's best or more.
  const best = Math.max(...data);
  let run = { s: 0, e: -1 }, cur = { s: -1, e: -1 };
  data.forEach((x, i) => {
    if (x >= best * 0.75) { if (cur.s < 0) cur = { s: i, e: i }; else cur.e = i; if (cur.e - cur.s > run.e - run.s) run = { ...cur }; }
    else cur = { s: -1, e: -1 };
  });

  // The hand turns on a spring, always the short way round.
  useEffect(() => {
    const st = ang.current;
    const still = motion === "reduced" || matchMedia("(prefers-reduced-motion: reduce)").matches;
    let to = h * 15;
    const d = ((to - st.v + 540) % 360) - 180;
    to = st.v + d;
    const step = (now: number) => {
      const dt = Math.min(0.032, st.last ? (now - st.last) / 1000 : 0.016);
      st.last = now;
      if (still || dragging.current) { st.v = to; st.vel = 0; }
      else {
        const k = 240, c = 2 * 0.78 * Math.sqrt(k);
        st.vel += ((to - st.v) * k - st.vel * c) * dt;
        st.v += st.vel * dt;
      }
      handRef.current?.setAttribute("transform", `rotate(${st.v.toFixed(2)} ${C} ${C})`);
      if (Math.abs(to - st.v) > 0.05 || Math.abs(st.vel) > 0.1) st.raf = requestAnimationFrame(step);
      else { st.v = to; st.raf = 0; st.last = 0; handRef.current?.setAttribute("transform", `rotate(${to} ${C} ${C})`); }
    };
    cancelAnimationFrame(st.raf);
    st.raf = requestAnimationFrame(step);
    return () => { cancelAnimationFrame(st.raf); st.raf = 0; };
  }, [h, motion]);

  const fromPointer = (e: RPointerEvent) => {
    const svg = svgRef.current;
    if (!svg) return;
    const r = svg.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) * 360 - C, y = ((e.clientY - r.top) / r.height) * 360 - C;
    if (Math.hypot(x, y) < 24) return;
    const deg = ((Math.atan2(y, x) * 180) / Math.PI + 90 + 360) % 360;
    setH(Math.round(deg / 15) % 24);
  };
  const onKey = (e: KeyboardEvent) => {
    const map: Record<string, number> = { ArrowRight: 1, ArrowUp: 1, ArrowLeft: -1, ArrowDown: -1, PageUp: 3, PageDown: -3 };
    if (e.key in map) setH((x) => (x + map[e.key] + 24) % 24);
    else if (e.key === "Home") setH(0);
    else if (e.key === "End") setH(23);
    else return;
    e.preventDefault();
  };

  const arc = (a: number, b: number, r: number) => {
    const p = polar(a, r), q = polar(b, r);
    return `M${p.x} ${p.y} A${r} ${r} 0 ${b - a > 180 ? 1 : 0} 1 ${q.x} ${q.y}`;
  };
  /** A filled ring sector — the busiest stretch's wash. */
  const sector = (a: number, b: number, r0: number, r1: number) => {
    const p0 = polar(a, r1), p1 = polar(b, r1), q1 = polar(b, r0), q0 = polar(a, r0);
    const big = b - a > 180 ? 1 : 0;
    return `M${p0.x} ${p0.y} A${r1} ${r1} 0 ${big} 1 ${p1.x} ${p1.y} L${q1.x} ${q1.y} A${r0} ${r0} 0 ${big} 0 ${q0.x} ${q0.y}Z`;
  };
  const sun = (t: number) => polar(t * 15, RIM + 3);

  return (
    <section className={`hd hd--${theme} ${className}`} data-motion={motion} aria-label={title}>
      <div className="hd__head">
        <div className="hd__days" role="radiogroup" aria-label="Day">
          {keys.map((k) => (
            <button key={k} type="button" role="radio" aria-checked={k === day} className="hd__day" onClick={() => setDay(k)}>
              {k}
            </button>
          ))}
        </div>
        <p className="hd__peak">
          Busiest {pad(run.s)}–{pad((run.e + 1) % 24)}
        </p>
      </div>

      <div className="hd__dial">
        <svg
          ref={svgRef}
          viewBox="0 0 360 360"
          className="hd__svg"
          role="slider"
          tabIndex={0}
          aria-label={`Hour, ${day.toLowerCase()}`}
          aria-valuemin={0}
          aria-valuemax={23}
          aria-valuenow={h}
          aria-valuetext={`${pad(h)}, ${v} ${unit}, ${mood.toLowerCase()}`}
          onKeyDown={onKey}
          onPointerDown={(e) => { dragging.current = true; (e.currentTarget as Element).setPointerCapture(e.pointerId); fromPointer(e); }}
          onPointerMove={(e) => { if (dragging.current) fromPointer(e); }}
          onPointerUp={() => { dragging.current = false; }}
          onPointerCancel={() => { dragging.current = false; }}
        >
          <defs>
            <radialGradient id={`${id}-face`}>
              <stop offset="0" stopColor="var(--hd-face-1)" />
              <stop offset="1" stopColor="var(--hd-face-2)" />
            </radialGradient>
          </defs>
          <circle cx={C} cy={C} r={RIM + 12} fill={`url(#${id}-face)`} />
          {/* Night and day: the hours between sunset and sunrise sit in a slightly deeper ring. */}
          <path d={arc(sunset * 15, sunrise * 15 + 360, RIM)} className="hd__night" />
          <path d={sector(run.s * 15 - 7.5, run.e * 15 + 7.5, R0 + 2, R1 + 8)} className="hd__wash" />
          {/* Hour ticks and labels */}
          {Array.from({ length: 24 }, (_, i) => {
            const a = polar(i * 15, RIM - 4), b = polar(i * 15, RIM + (i % 6 ? 1 : 4));
            return <line key={i} x1={a.x} y1={a.y} x2={b.x} y2={b.y} className="hd__tick" data-major={i % 6 === 0 || undefined} />;
          })}
          {[0, 6, 12, 18].map((i) => {
            const p = polar(i * 15, RIM - 15);
            return (
              <text key={i} x={p.x} y={p.y} className="hd__hour" textAnchor="middle" dominantBaseline="central">
                {String(i).padStart(2, "0")}
              </text>
            );
          })}
          {/* The bars: one per hour, scaled from the inner ring. */}
          {data.map((x, i) => (
            <g key={i} transform={`rotate(${i * 15} ${C} ${C})`}>
              <rect
                x={C - 4.5}
                y={C - R1}
                width={9}
                height={R1 - R0}
                rx={4.5}
                className="hd__bar"
                data-on={i === h || undefined}
                style={{ transform: `scaleY(${Math.max(0.02, x / max)})` }}
              />
            </g>
          ))}
          {/* Sunrise and sunset on the rim */}
          {[{ t: sunrise, k: "rise" }, { t: sunset, k: "set" }].map((s) => {
            const p = sun(s.t);
            return (
              <g key={s.k} className="hd__sun" data-k={s.k}>
                <circle cx={p.x} cy={p.y} r={4.2} />
              </g>
            );
          })}
          {/* The hand */}
          <g ref={handRef} transform={`rotate(${hour * 15} ${C} ${C})`} className="hd__hand">
            <line x1={C} y1={C - R0 + 6} x2={C} y2={C - RIM + 2} />
            <circle cx={C} cy={C - RIM + 2} r={7} />
          </g>
          <circle cx={C} cy={C} r={R0 - 6} className="hd__hub" />
        </svg>
        <div className="hd__read" aria-hidden="true">
          <span className="hd__time">{pad(h)}</span>
          <span className="hd__val">
            {v} <small>{unit}</small>
          </span>
          <span className="hd__mood" data-mood={mood}>{mood}</span>
        </div>
      </div>

      <p className="hd__legend">
        <span><i className="hd__sw hd__sw--rise" aria-hidden="true" /> Sunrise {Math.floor(sunrise)}:{String(Math.round((sunrise % 1) * 60)).padStart(2, "0")}</span>
        <span><i className="hd__sw hd__sw--set" aria-hidden="true" /> Sunset {Math.floor(sunset)}:{String(Math.round((sunset % 1) * 60)).padStart(2, "0")}</span>
        <span>Drag the hand or use ← →</span>
      </p>

      {/* Tables ignore overflow, so the hidden table sits inside a hidden box. */}
      <div className="hd__sr">
      <table>
        <caption>{title}, {unit} per hour</caption>
        <thead>
          <tr>
            <th scope="col">Hour</th>
            {keys.map((k) => <th key={k} scope="col">{k}</th>)}
          </tr>
        </thead>
        <tbody>
          {data.map((_, i) => (
            <tr key={i}>
              <th scope="row">{pad(i)}</th>
              {keys.map((k) => <td key={k}>{days[k][i]}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </section>
  );
}
