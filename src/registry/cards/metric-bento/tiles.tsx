"use client";
import { useEffect, useId, useRef, useState } from "react";
import { conversions, delta, level, money, slices, spark, weeks } from "./metrics";

const calm = () => typeof matchMedia !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches;
const pct = (n: number) => `${n > 0 ? "+" : ""}${n.toFixed(1)}%`;

/** A headline figure with its change and a trend you can scrub. */
export function KpiTrend({ label, values, labels, format = money }: { label: string; values: number[]; labels: string[]; format?: (n: number) => string }) {
  const W = 600, H = 120;
  const { line, area, pts } = spark(values, W, H);
  const [at, setAt] = useState<number | null>(null);
  const gid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const last = values[values.length - 1], d = delta(values[0], last);
  const i = at ?? values.length - 1;
  const pick = (e: React.PointerEvent<SVGSVGElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    setAt(Math.max(0, Math.min(values.length - 1, Math.round(((e.clientX - r.left) / r.width) * (values.length - 1)))));
  };
  const key = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") { e.preventDefault(); setAt(Math.max(0, i - 1)); }
    if (e.key === "ArrowRight") { e.preventDefault(); setAt(Math.min(values.length - 1, i + 1)); }
    if (e.key === "Escape") setAt(null);
  };
  return (
    <div className="mxv-kpi">
      <div className="mxv-kpi__top">
        <p className="mxv-kpi__fig">{format(values[i])}</p>
        <p className={`mxv-chip ${d >= 0 ? "mxv-chip--up" : "mxv-chip--down"}`}>
          <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true"><path d={d >= 0 ? "M5 1.5 9 7H1Z" : "M5 8.5 9 3H1Z"} fill="currentColor" /></svg>
          {pct(d)}<span className="mxv-sr"> {d >= 0 ? "up" : "down"} since {labels[0]}</span>
        </p>
      </div>
      <p className="mxv-kpi__sub" aria-live="polite">{at === null ? `Latest, ${labels[labels.length - 1]}` : labels[at]}</p>
      <svg className="mxv-kpi__chart" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" tabIndex={0} role="img"
        aria-label={`${label} from ${format(values[0])} in ${labels[0]} to ${format(last)} in ${labels[labels.length - 1]}. Use the arrow keys to read each point.`}
        onPointerMove={pick} onPointerLeave={() => setAt(null)} onKeyDown={key} onBlur={() => setAt(null)}>
        <defs><linearGradient id={`g${gid}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="var(--mx-s1)" stopOpacity=".28" /><stop offset="1" stopColor="var(--mx-s1)" stopOpacity="0" /></linearGradient></defs>
        <path d={area} fill={`url(#g${gid})`} />
        <path d={line} fill="none" stroke="var(--mx-s1)" strokeWidth="2" vectorEffect="non-scaling-stroke" strokeLinejoin="round" />
        {at !== null && <line x1={pts[at][0]} x2={pts[at][0]} y1="0" y2={H} stroke="var(--mx-ink)" strokeOpacity=".3" strokeDasharray="3 3" vectorEffect="non-scaling-stroke" />}
      </svg>
      {at !== null && <span className="mxv-kpi__dot" aria-hidden="true" style={{ left: `${(pts[at][0] / W) * 100}%`, top: `${(pts[at][1] / H) * 100}%` }} />}
    </div>
  );
}

/** Requests per minute, ticking while it's on screen, over a moving strip of bars. */
export function LiveCounter({ base = 1840, spread = 220 }: { base?: number; spread?: number }) {
  const [bars, setBars] = useState(() => Array.from({ length: 28 }, (_, i) => base + Math.round(Math.sin(i * 0.7) * spread * 0.6)));
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || calm()) return;
    let id = 0, on = true;
    const run = () => { clearInterval(id); if (on && !document.hidden) id = window.setInterval(() => setBars((b) => [...b.slice(1), Math.max(0, Math.round(b[b.length - 1] + (Math.random() - 0.5) * spread * 0.7 + (base - b[b.length - 1]) * 0.2))]), 1200); };
    const io = typeof IntersectionObserver !== "undefined" ? new IntersectionObserver(([e]) => { on = e.isIntersecting; run(); }) : null;
    io?.observe(el); run();
    document.addEventListener("visibilitychange", run);
    return () => { clearInterval(id); io?.disconnect(); document.removeEventListener("visibilitychange", run); };
  }, [base, spread]);
  const now = bars[bars.length - 1], max = Math.max(...bars);
  return (
    <div ref={ref} className="mxv-live">
      <p className="mxv-live__fig"><span className="mxv-live__pulse" aria-hidden="true" />{now.toLocaleString("en-US")}<small>/min</small></p>
      <div className="mxv-live__bars" aria-hidden="true">{bars.map((b, i) => <i key={i} style={{ height: `${Math.max(6, (b / max) * 100)}%` }} />)}</div>
      <p className="mxv-sr" aria-live="off">About {Math.round(now / 10) * 10} requests a minute.</p>
    </div>
  );
}

/** Share of plans as a ring with a labelled legend. */
export function PlanMix({ items }: { items: { label: string; value: number }[] }) {
  const [hot, setHot] = useState<number | null>(null);
  const S = slices(items.map((x) => x.value));
  const total = items.reduce((a, b) => a + b.value, 0);
  const arc = (a0: number, a1: number, r: number) => {
    const p = (a: number) => [50 + r * Math.sin(a), 50 - r * Math.cos(a)];
    const [x0, y0] = p(a0), [x1, y1] = p(a1);
    return `M${x0.toFixed(2)} ${y0.toFixed(2)} A${r} ${r} 0 ${a1 - a0 > Math.PI ? 1 : 0} 1 ${x1.toFixed(2)} ${y1.toFixed(2)}`;
  };
  return (
    <div className="mxv-mix">
      <svg viewBox="0 0 100 100" className="mxv-mix__ring" role="img" aria-label={items.map((x, i) => `${x.label} ${Math.round(S[i].share * 100)}%`).join(", ")}>
        {S.map((s, i) => <path key={i} d={arc(s.start, s.end, 40)} fill="none" stroke={`var(--mx-s${i + 1})`} strokeWidth={hot === i ? 13 : 10} strokeLinecap="butt" opacity={hot === null || hot === i ? 1 : 0.35} onPointerEnter={() => setHot(i)} onPointerLeave={() => setHot(null)} style={{ transition: "stroke-width 160ms, opacity 160ms" }} />)}
        <text x="50" y="49" textAnchor="middle" className="mxv-mix__total">{total.toLocaleString("en-US")}</text>
        <text x="50" y="61" textAnchor="middle" className="mxv-mix__unit">teams</text>
      </svg>
      <ul className="mxv-mix__legend">
        {items.map((x, i) => (
          <li key={x.label} className={hot === i ? "on" : ""} onPointerEnter={() => setHot(i)} onPointerLeave={() => setHot(null)}>
            <i style={{ background: `var(--mx-s${i + 1})` }} aria-hidden="true" />{x.label}<b>{Math.round(S[i].share * 100)}%</b>
          </li>
        ))}
      </ul>
    </div>
  );
}

const WD = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const MO = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
/** Twelve weeks of daily counts as a heat calendar, one hue from light to dark. */
export function HeatCalendar({ start, counts, unit = "deploys" }: { start: Date; counts: number[]; unit?: string }) {
  const days = counts.map((c, i) => { const d = new Date(start); d.setDate(d.getDate() + i); return { d, c }; });
  const cols = weeks(days, start.getDay());
  const max = Math.max(...counts);
  const [tip, setTip] = useState<{ text: string; x: number; y: number } | null>(null);
  const total = counts.reduce((a, b) => a + b, 0);
  return (
    <div className="mxv-heat" onPointerLeave={() => setTip(null)}>
      <div className="mxv-heat__wrap">
        <div className="mxv-heat__days" aria-hidden="true">{WD.map((w, i) => <span key={w}>{i % 2 ? "" : w}</span>)}</div>
        <div className="mxv-heat__grid" role="img" aria-label={`${total} ${unit} over ${cols.length} weeks; busiest day ${max}.`}>
          {cols.map((col, ci) => (
            <div key={ci} className="mxv-heat__col">
              {col.map((cell, ri) => cell ? (
                <span key={ri} className={`mxv-heat__cell l${level(cell.c, max)}`}
                  onPointerEnter={(e) => { const box = (e.currentTarget.parentElement!.parentElement as HTMLElement).getBoundingClientRect(), r = e.currentTarget.getBoundingClientRect(); setTip({ text: `${WD[(cell.d.getDay() + 6) % 7]}, ${MO[cell.d.getMonth()]} ${cell.d.getDate()} · ${cell.c} ${unit}`, x: r.left - box.left + r.width / 2, y: r.top - box.top }); }} />
              ) : <span key={ri} className="mxv-heat__cell mxv-heat__cell--none" />)}
            </div>
          ))}
          {tip && <span className="mxv-tip" style={{ left: tip.x, top: tip.y }}>{tip.text}</span>}
        </div>
      </div>
      <p className="mxv-heat__key" aria-hidden="true">Less{[0, 1, 2, 3, 4].map((l) => <span key={l} className={`mxv-heat__cell l${l}`} />)}More</p>
    </div>
  );
}

/** Ranked bars with labels and values. */
export function BarList({ rows, unit = "" }: { rows: { label: string; value: number; mark?: string }[]; unit?: string }) {
  const max = Math.max(...rows.map((r) => r.value));
  return (
    <ul className="mxv-bars">
      {rows.map((r) => (
        <li key={r.label} title={`${r.label}: ${r.value.toLocaleString("en-US")}${unit}`}>
          <span className="mxv-bars__fill" style={{ width: `${(r.value / max) * 100}%` }} aria-hidden="true" />
          <span className="mxv-bars__label">{r.mark && <span aria-hidden="true">{r.mark}</span>}{r.label}</span>
          <b>{r.value.toLocaleString("en-US")}{unit}</b>
        </li>
      ))}
    </ul>
  );
}

/** A funnel of steps with the conversion between each. */
export function Funnel({ steps }: { steps: { label: string; value: number }[] }) {
  const max = steps[0]?.value || 1;
  const conv = conversions(steps.map((s) => s.value));
  return (
    <ol className="mxv-funnel">
      {steps.map((s, i) => (
        <li key={s.label}>
          <div className="mxv-funnel__head"><span>{s.label}</span><b>{s.value.toLocaleString("en-US")}</b></div>
          <div className="mxv-funnel__track" aria-hidden="true"><i style={{ height: `${(s.value / max) * 100}%` }} /></div>
          {i > 0 && <span className="mxv-funnel__conv">{conv[i - 1]}% from {steps[i - 1].label.toLowerCase()}</span>}
        </li>
      ))}
    </ol>
  );
}
