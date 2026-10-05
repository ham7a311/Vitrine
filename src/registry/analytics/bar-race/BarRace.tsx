"use client";

import { useEffect, useId, useRef, useState } from "react";
import "./bar-race.css";

/**
 * Bar Race
 * A year of bookings as a race. Each month the destinations re-sort by how
 * many trips they sold; press play and the bars grow, overtake and slide
 * past each other in real time, values counting as they go, with the month
 * watermarked behind. Colour is the region, which never changes; the name
 * on every bar does the identifying.
 */

export type Racer = { name: string; region: 0 | 1 | 2; values: number[] }; // cumulative or monthly — shown as given
type Props = { racers: Racer[]; months: string[]; regions: [string, string, string]; show?: number; title?: string; theme?: "light" | "dark"; motion?: "full" | "reduced"; className?: string };

const ROW = 38, GAP = 8;

export function BarRace({ racers, months, regions, show = 8, title = "Bookings by destination", theme = "light", motion = "full", className = "" }: Props) {
  const id = useId();
  const last = months.length - 1;
  const [t, setT] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [view, setView] = useState<"chart" | "table">("chart");
  const tRef = useRef(0);
  tRef.current = t;
  const wrapRef = useRef<HTMLDivElement>(null);
  const started = useRef(false);
  const reduced = () => motion === "reduced" || (typeof window !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches);

  // Start playing the first time it scrolls into view.
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) { started.current = true; if (reduced()) setT(last); else setPlaying(true); }
    }, { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!playing) return;
    if (tRef.current >= last) setT(0);
    let raf = 0, prev = performance.now();
    const step = (now: number) => {
      const dt = Math.min(0.05, (now - prev) / 1000);
      prev = now;
      if (document.hidden) { raf = requestAnimationFrame(step); return; }
      const next = Math.min(last, tRef.current + dt / 1.15);
      setT(next);
      if (next >= last) { setPlaying(false); return; }
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [playing]); // eslint-disable-line react-hooks/exhaustive-deps

  // Values eased between months; ranks from the eased values, then each bar's
  // row eased toward its rank so overtakes slide rather than snap.
  const i = Math.min(last - 1, Math.floor(t)), f = t - i;
  const ease = f * f * (3 - 2 * f);
  const vals = racers.map((r) => (last === 0 ? r.values[0] : r.values[i] + (r.values[i + 1] - r.values[i]) * ease));
  const order = vals.map((v, k) => ({ v, k })).sort((a, b) => b.v - a.v);
  const rank = new Array(racers.length);
  order.forEach((o, r) => (rank[o.k] = r));
  const rowPos = useRef<number[]>(racers.map((_, k) => k));
  const smoothed = racers.map((_, k) => {
    const p = rowPos.current[k];
    const target = rank[k];
    const nv = reduced() ? target : p + (target - p) * 0.22;
    return Math.abs(nv - target) < 0.002 ? target : nv;
  });
  rowPos.current = smoothed;
  const max = Math.max(...vals) * 1.04;
  const month = months[Math.round(t)];
  const leader = racers[order[0].k];
  const H = show * (ROW + GAP);
  const summary = `${title}, ${months[0]}–${months[last]}. In ${month}, ${leader.name} leads with ${Math.round(order[0].v).toLocaleString("en-GB")} bookings.`;
  const scale = (() => {
    const raw = max / 5, p = Math.pow(10, Math.floor(Math.log10(raw))), m = raw / p;
    const s = (m <= 1 ? 1 : m <= 2 ? 2 : m <= 5 ? 5 : 10) * p;
    return Array.from({ length: Math.floor(max / s) + 1 }, (_, k) => k * s);
  })();

  return (
    <section className={`bar-race bar-race--${theme} ${className}`} data-motion={motion} aria-labelledby={`${id}-t`}>
      <header className="bar-race__head">
        <div>
          <h3 id={`${id}-t`} className="bar-race__title">{title}</h3>
          <p className="bar-race__insight"><strong>{leader.name}</strong> leads in {month} — {Math.round(order[0].v).toLocaleString("en-GB")} bookings.</p>
        </div>
        <button type="button" className="bar-race__view" aria-pressed={view === "table"} onClick={() => setView((v) => (v === "chart" ? "table" : "chart"))}>{view === "chart" ? "Table" : "Chart"}</button>
      </header>
      <div className="bar-race__legend" aria-hidden="true">
        {regions.map((g, k) => <span key={g}><i style={{ background: `var(--s${k + 1})` }} />{g}</span>)}
      </div>

      <div ref={wrapRef} className="bar-race__plot" hidden={view === "table"} role="img" aria-label={summary}>
        <div className="bar-race__month" aria-hidden="true">{month}</div>
        <div className="bar-race__axis" aria-hidden="true">
          {scale.map((v) => (
            <span key={v} style={{ left: `${(v / max) * 100}%` }}><i />{v >= 1000 ? `${v / 1000}k` : v}</span>
          ))}
        </div>
        <div className="bar-race__rows" style={{ height: H }} aria-hidden="true">
          {racers.map((r, k) => {
            const row = smoothed[k];
            if (row > show + 0.5) return null;
            const w = (vals[k] / max) * 100;
            return (
              <div key={r.name} className="bar-race__row" style={{ transform: `translateY(${row * (ROW + GAP)}px)`, opacity: Math.max(0, Math.min(1, show + 0.5 - row)) }}>
                <div className="bar-race__bar" style={{ width: `${w}%`, background: `var(--s${r.region + 1})` }}>
                  <span className="bar-race__name" data-out={w < 26 || undefined}>{r.name}</span>
                </div>
                <span className="bar-race__val" style={{ left: `${w}%` }}>{Math.round(vals[k]).toLocaleString("en-GB")}</span>
              </div>
            );
          })}
        </div>
      </div>

      {view === "table" && (
        <div className="bar-race__table-wrap">
          <table className="bar-race__table">
            <caption className="bar-race__sr">{summary}</caption>
            <thead><tr><th scope="col">Destination</th>{months.map((m) => <th key={m} scope="col">{m}</th>)}</tr></thead>
            <tbody>{racers.map((r) => <tr key={r.name}><th scope="row">{r.name}</th>{r.values.map((v, k) => <td key={k}>{Math.round(v).toLocaleString("en-GB")}</td>)}</tr>)}</tbody>
          </table>
        </div>
      )}

      <div className="bar-race__time">
        <button type="button" className="bar-race__play" onClick={() => setPlaying((p) => !p)} aria-label={playing ? "Pause" : t >= last ? "Replay the year" : "Play"}>
          {playing ? <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M6 4h3v12H6zM11 4h3v12h-3z" /></svg> : <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M6.5 4.2v11.6L16 10z" /></svg>}
        </button>
        <input
          type="range"
          min={0}
          max={last}
          step={0.01}
          value={t}
          aria-label="Month"
          aria-valuetext={month}
          onChange={(e) => { setPlaying(false); setT(Number(e.target.value)); }}
          onPointerUp={() => setT((v) => Math.round(v))}
          onKeyDown={(e) => {
            if (e.key === "ArrowRight" || e.key === "ArrowUp") { e.preventDefault(); setPlaying(false); setT((v) => Math.min(last, Math.floor(v + 1e-6) + 1)); }
            if (e.key === "ArrowLeft" || e.key === "ArrowDown") { e.preventDefault(); setPlaying(false); setT((v) => Math.max(0, Math.ceil(v - 1e-6) - 1)); }
          }}
        />
        <span className="bar-race__now" aria-hidden="true">{month}</span>
      </div>
    </section>
  );
}
