"use client";

import { useMemo, useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent } from "react";
import "./uptime-ribbon.css";

/**
 * Uptime Ribbon
 * Each bar is a day, coloured by how it went. Scrubbing lifts the bars around
 * the pointer (a smooth bump, not a single highlight) and a tooltip follows
 * with the date, uptime and any incident. The whole ribbon is one focusable
 * control; ←/→ move day by day.
 */

export type Day = { date: string; uptime: number; incident?: string };
export type Service = { name: string; days: Day[] };

type Props = { services: Service[]; className?: string };

const level = (u: number) => (u >= 99.95 ? "ok" : u >= 99 ? "minor" : "major");

function Ribbon({ s }: { s: Service }) {
  const [at, setAt] = useState<number | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const avg = useMemo(() => s.days.reduce((a, d) => a + d.uptime, 0) / s.days.length, [s.days]);
  const n = s.days.length;

  const move = (e: PointerEvent) => {
    const r = ref.current!.getBoundingClientRect();
    setAt(Math.max(0, Math.min(n - 1, Math.floor(((e.clientX - r.left) / r.width) * n))));
  };
  const key = (e: KeyboardEvent) => {
    if (e.key === "ArrowRight") { e.preventDefault(); setAt((a) => Math.min(n - 1, (a ?? n - 1) + 1)); }
    if (e.key === "ArrowLeft") { e.preventDefault(); setAt((a) => Math.max(0, (a ?? n) - 1)); }
    if (e.key === "End") setAt(n - 1);
    if (e.key === "Home") setAt(0);
  };

  const d = at !== null ? s.days[at] : null;
  const worst = s.days.some((x) => level(x.uptime) === "major") ? "major" : s.days.some((x) => level(x.uptime) === "minor") ? "minor" : "ok";

  return (
    <div className="uptime-ribbon__service">
      <div className="uptime-ribbon__head">
        <span className="uptime-ribbon__name"><i data-level={level(s.days[n - 1].uptime)} />{s.name}</span>
        <span className="uptime-ribbon__avg" data-level={worst}>{avg.toFixed(2)}% uptime</span>
      </div>
      <div
        ref={ref}
        className="uptime-ribbon__bars"
        tabIndex={0}
        role="group"
        aria-label={`${s.name}: ${avg.toFixed(2)}% over ${n} days. Use arrow keys to inspect days.`}
        onPointerMove={move}
        onPointerDown={move}
        onPointerLeave={() => setAt(null)}
        onKeyDown={key}
        onBlur={() => setAt(null)}
        style={{ "--n": n } as CSSProperties}
      >
        {s.days.map((day, i) => {
          const dist = at === null ? 99 : Math.abs(i - at);
          const lift = Math.max(0, 1 - dist / 4);
          return <span key={i} data-level={level(day.uptime)} data-at={i === at || undefined} style={{ "--lift": lift * lift } as CSSProperties} />;
        })}
        {d && at !== null && (
          <div className="uptime-ribbon__tip" style={{ "--x": `${((at + 0.5) / n) * 100}%` } as CSSProperties} role="status">
            <b>{d.date}</b>
            <span data-level={level(d.uptime)}>{d.uptime.toFixed(2)}% uptime</span>
            {d.incident && <em>{d.incident}</em>}
          </div>
        )}
      </div>
      <div className="uptime-ribbon__axis" aria-hidden="true"><span>{n} days ago</span><span>Today</span></div>
    </div>
  );
}

export function UptimeRibbon({ services, className = "" }: Props) {
  return (
    <section className={`uptime-ribbon ${className}`} aria-label="System status">
      {services.map((s) => <Ribbon key={s.name} s={s} />)}
    </section>
  );
}
