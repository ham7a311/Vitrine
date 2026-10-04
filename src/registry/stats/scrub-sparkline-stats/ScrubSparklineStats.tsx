"use client";

import { useEffect, useId, useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent } from "react";
import "./scrub-sparkline-stats.css";

/**
 * Scrub Sparkline Stats
 * KPI tiles that let you read back through the month. Run a finger or pointer
 * along a sparkline and the big number turns to that day — only the digits
 * that differ roll — while the date and the change on the day before follow.
 * Let go and the cursor springs back to today.
 */

export type Metric = {
  label: string;
  /** One value per day, oldest first. The last one is today. */
  series: number[];
  prefix?: string;
  suffix?: string;
  decimals?: number;
  /** Which direction is good news. Refunds, latency: "down". */
  better?: "up" | "down";
};

type Props = {
  metrics: Metric[];
  /** The date of the last value. */
  end: Date;
  label?: string;
  theme?: "paper" | "night";
  motion?: "full" | "reduced";
  className?: string;
};

const DAY = 86400000;
const fmtDate = (d: Date) => d.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", timeZone: "UTC" });
const fmtShort = (d: Date) => d.toLocaleDateString("en-GB", { day: "numeric", month: "short", timeZone: "UTC" });

/** Reels keyed by place from the right, so a changing digit rolls and the rest hold still. */
function Reels({ text }: { text: string }) {
  const chars = text.split("");
  return (
    <span className="sss__reels" aria-hidden="true">
      {chars.map((c, i) => {
        const key = chars.length - i;
        return /\d/.test(c) ? (
          <span key={key} className="sss__reel">
            <span className="sss__strip" style={{ "--d": Number(c), "--k": i } as CSSProperties}>
              {Array.from({ length: 10 }, (_, k) => <span key={k}>{k}</span>)}
            </span>
          </span>
        ) : (
          <span key={`s${key}`} className="sss__sep">{c}</span>
        );
      })}
    </span>
  );
}

function Tile({ m, end, reduce }: { m: Metric; end: Date; reduce: boolean }) {
  const n = m.series.length;
  const plot = useRef<HTMLDivElement>(null);
  const gid = useId().replace(/:/g, "");
  const raf = useRef(0);
  const pos = useRef({ x: n - 1, v: 0 });
  const [fx, setFx] = useState(n - 1);
  const [held, setHeld] = useState(false);

  useEffect(() => () => { cancelAnimationFrame(raf.current); raf.current = 0; }, []);

  const i = Math.round(fx);
  const value = m.series[i];
  const prev = i > 0 ? m.series[i - 1] : null;
  const d = m.decimals ?? 0;
  const num = (v: number) => v.toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d });
  const date = new Date(end.getTime() - (n - 1 - i) * DAY);
  const change = prev ? (value - prev) / prev : 0;
  const good = change === 0 ? null : (change > 0) === ((m.better ?? "up") === "up");
  const today = i === n - 1;

  // The line: values scaled into a 100 × 40 box with a little headroom.
  const lo = Math.min(...m.series), hi = Math.max(...m.series);
  const y = (v: number) => 36 - ((v - lo) / (hi - lo || 1)) * 30;
  const pts = m.series.map((v, k) => `${((k / (n - 1)) * 100).toFixed(2)},${y(v).toFixed(2)}`);
  const line = `M${pts.join("L")}`;
  const area = `${line}L100,40L0,40Z`;
  const cx = (fx / (n - 1)) * 100;
  const cy = y(m.series[Math.floor(fx)] + (m.series[Math.min(n - 1, Math.floor(fx) + 1)] - m.series[Math.floor(fx)]) * (fx % 1));

  const stop = () => { cancelAnimationFrame(raf.current); raf.current = 0; };
  const goTo = (x: number) => { stop(); pos.current = { x, v: 0 }; setFx(x); };

  // Let go: spring the cursor back to today.
  const home = () => {
    setHeld(false);
    if (reduce) return goTo(n - 1);
    stop();
    let last = 0;
    const tick = (t: number) => {
      const dt = last ? Math.min(0.032, (t - last) / 1000) : 0.016;
      last = t;
      const p = pos.current;
      p.v += ((n - 1 - p.x) * 90 - p.v * 15) * dt;
      p.x += p.v * dt;
      if (Math.abs(n - 1 - p.x) < 0.01 && Math.abs(p.v) < 0.05) { p.x = n - 1; setFx(n - 1); raf.current = 0; return; }
      setFx(Math.min(n - 1, Math.max(0, p.x)));
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
  };

  const scrub = (e: PointerEvent<HTMLDivElement>) => {
    const r = plot.current!.getBoundingClientRect();
    const t = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width));
    setHeld(true);
    goTo(t * (n - 1));
  };

  const onKey = (e: KeyboardEvent) => {
    const to =
      e.key === "ArrowLeft" || e.key === "ArrowDown" ? Math.max(0, i - 1) :
      e.key === "ArrowRight" || e.key === "ArrowUp" ? Math.min(n - 1, i + 1) :
      e.key === "PageDown" ? Math.max(0, i - 7) : e.key === "PageUp" ? Math.min(n - 1, i + 7) :
      e.key === "Home" ? 0 : e.key === "End" ? n - 1 : null;
    if (to === null) return;
    e.preventDefault();
    setHeld(to !== n - 1);
    goTo(to);
  };

  const shown = `${m.prefix ?? ""}${num(value)}${m.suffix ?? ""}`;
  const delta = prev === null ? "First day" : `${change >= 0 ? "+" : "−"}${Math.abs(change * 100).toFixed(1)}% on the day before`;

  return (
    <article className="sss__tile" data-held={held || undefined}>
      <header className="sss__head">
        <h3 className="sss__label">{m.label}</h3>
        <p className="sss__date" aria-hidden="true">{today ? "Today" : fmtDate(date)}</p>
      </header>
      <p className="sss__value">
        {m.prefix && <span className="sss__fix">{m.prefix.trim()}</span>}
        <Reels text={num(value)} />
        {m.suffix && <span className="sss__fix">{m.suffix.trim()}</span>}
        <span className="sss__sr">{shown}</span>
      </p>
      <p className="sss__delta" data-good={good === null ? undefined : String(good)}>
        {prev !== null && change !== 0 && (
          <svg viewBox="0 0 10 10" aria-hidden="true" style={{ transform: change < 0 ? "rotate(180deg)" : undefined }}><path d="M5 2v6M2.5 4.5 5 2l2.5 2.5" /></svg>
        )}
        {delta}
      </p>
      <div
        ref={plot}
        className="sss__plot"
        role="slider"
        tabIndex={0}
        aria-label={`${m.label}, day`}
        aria-valuemin={1}
        aria-valuemax={n}
        aria-valuenow={i + 1}
        aria-valuetext={`${today ? "Today" : fmtDate(date)}: ${shown}, ${delta}`}
        onPointerDown={(e) => { e.currentTarget.setPointerCapture(e.pointerId); scrub(e); }}
        onPointerMove={(e) => { if (e.pointerType === "mouse" || e.currentTarget.hasPointerCapture(e.pointerId)) scrub(e); }}
        onPointerUp={home}
        onPointerLeave={(e) => { if (e.pointerType === "mouse") home(); }}
        onPointerCancel={home}
        onKeyDown={onKey}
        onBlur={() => held && home()}
        style={{ "--cx": `${cx}%`, "--cy": `${(cy / 40) * 100}%` } as CSSProperties}
      >
        <svg className="sss__svg" viewBox="0 0 100 40" preserveAspectRatio="none" aria-hidden="true">
          <path className="sss__line sss__line--dim" d={line} />
        </svg>
        {/* Up to the cursor: the filled area and the full-strength line. */}
        <svg className="sss__svg sss__svg--lit" viewBox="0 0 100 40" preserveAspectRatio="none" aria-hidden="true">
          <defs>
            <linearGradient id={`${gid}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="currentColor" stopOpacity="0.22" />
              <stop offset="1" stopColor="currentColor" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path className="sss__area" d={area} fill={`url(#${gid})`} />
          <path className="sss__line" d={line} />
        </svg>
        <span className="sss__cross" aria-hidden="true" />
        <span className="sss__dot" aria-hidden="true" />
      </div>
      <p className="sss__axis" aria-hidden="true">
        <span>{fmtShort(new Date(end.getTime() - (n - 1) * DAY))}</span>
        <span>{fmtShort(end)}</span>
      </p>
    </article>
  );
}

export function ScrubSparklineStats({ metrics, end, label = "Last 30 days", theme = "paper", motion = "full", className = "" }: Props) {
  const [reduce, setReduce] = useState(motion === "reduced");
  useEffect(() => {
    setReduce(motion === "reduced" || matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, [motion]);
  return (
    <section className={`sss sss--${theme} ${className}`} data-motion={motion} aria-label={label}>
      {metrics.map((m) => <Tile key={m.label} m={m} end={end} reduce={reduce} />)}
    </section>
  );
}
