"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import "./then-now-stats.css";

/**
 * Then / Now Stats
 * A number means more next to what it used to be. Each stat shows the
 * previous value as a faint ghost, then — when scrolled into view — counts
 * up (or down) from it to the current value while a bracket draws between the
 * two with the delta. Good changes use the accent, bad ones rose.
 */

export type Stat = { label: string; then: number; now: number; unit?: string; period: string; better?: "up" | "down"; decimals?: number };

type Props = { stats: Stat[]; accent?: string; className?: string };

function fmt(v: number, d = 0) {
  return v.toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d });
}

function Counter({ s, go }: { s: Stat; go: boolean }) {
  const [v, setV] = useState(s.then);
  useEffect(() => {
    if (!go) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { setV(s.now); return; }
    let raf = 0;
    const t0 = performance.now(), dur = 1400;
    const tick = (t: number) => {
      const k = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - k, 4);
      setV(s.then + (s.now - s.then) * e);
      if (k < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [go, s.then, s.now]);
  return <>{fmt(v, s.decimals)}</>;
}

export function ThenNowStats({ stats, accent = "#8fe388", className = "" }: Props) {
  const ref = useRef<HTMLDListElement>(null);
  const [go, setGo] = useState(false);
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => e.isIntersecting && (setGo(true), io.disconnect()), { threshold: 0.4 });
    io.observe(ref.current!);
    return () => io.disconnect();
  }, []);

  return (
    <dl ref={ref} className={`then-now-stats ${className}`} data-go={go || undefined} style={{ "--tn-accent": accent } as CSSProperties}>
      {stats.map((s, i) => {
        const diff = s.now - s.then;
        const pct = s.then ? (diff / Math.abs(s.then)) * 100 : 0;
        const good = (s.better ?? "up") === "up" ? diff >= 0 : diff <= 0;
        return (
          <div key={s.label} className="then-now-stats__item" data-good={good || undefined} style={{ "--i": i } as CSSProperties}>
            <dt>{s.label}</dt>
            <dd>
              <span className="then-now-stats__now">
                <Counter s={s} go={go} />
                {s.unit && <small>{s.unit}</small>}
              </span>
              <span className="then-now-stats__rail" aria-hidden="true">
                <span className="then-now-stats__then">{fmt(s.then, s.decimals)}{s.unit}</span>
                <svg viewBox="0 0 100 12" preserveAspectRatio="none"><path d="M1 11V4h98v7" pathLength={1} /></svg>
                <span className="then-now-stats__delta">{diff >= 0 ? "▲" : "▼"} {fmt(Math.abs(pct), 1)}%</span>
              </span>
              <span className="then-now-stats__period">{s.period}</span>
              <span className="then-now-stats__sr">{`${s.label}: ${fmt(s.now, s.decimals)}${s.unit ?? ""}, ${diff >= 0 ? "up" : "down"} ${fmt(Math.abs(pct), 1)} percent from ${fmt(s.then, s.decimals)}${s.unit ?? ""} ${s.period}`}</span>
            </dd>
          </div>
        );
      })}
    </dl>
  );
}
