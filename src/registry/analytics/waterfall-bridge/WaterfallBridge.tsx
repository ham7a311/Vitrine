"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import "./waterfall-bridge.css";

/**
 * Waterfall Bridge
 * How a quarter's revenue became its profit, one step at a time. Revenue
 * stands first; each cost hangs down from where the last step left off and
 * each gain stacks up, joined by a thin connector, until net profit stands
 * at the end. The bars build in sequence the first time you see it; switch
 * quarter and every bar slides to its new height, so you can watch which
 * step moved.
 */

export type Step = { label: string; value: number; kind?: "total" };
type Props = { periods: Record<string, Step[]>; currency?: string; title?: string; theme?: "light" | "dark"; motion?: "full" | "reduced"; className?: string };

const H = 340;
const fmt = (v: number) => `${v < 0 ? "−" : ""}${Math.abs(Math.round(v)).toLocaleString("en-GB")}`;
const k = (v: number) => (v === 0 ? "0" : `${v < 0 ? "−" : ""}${(Math.abs(v) / 1000).toFixed(Math.abs(v) >= 100000 ? 0 : 1)}k`);
function nice(max: number) {
  const raw = max / 5, p = Math.pow(10, Math.floor(Math.log10(raw))), f = raw / p;
  const step = (f <= 1 ? 1 : f <= 2 ? 2 : f <= 2.5 ? 2.5 : f <= 5 ? 5 : 10) * p;
  return { top: Math.ceil(max / step) * step, step };
}
/** Each step's start and end on the running total. */
function bridge(steps: Step[]) {
  let run = 0;
  return steps.map((s) => {
    if (s.kind === "total") { const b = { a: 0, b: s.value }; run = s.value; return b; }
    const b = { a: run, b: run + s.value };
    run += s.value;
    return b;
  });
}

export function WaterfallBridge({ periods, currency = "OMR", title = "Profit bridge", theme = "light", motion = "full", className = "" }: Props) {
  const id = useId();
  const keys = Object.keys(periods);
  const [p, setP] = useState(keys[keys.length - 1]);
  const [W, setW] = useState(820);
  const [seen, setSeen] = useState(false);
  const [hover, setHover] = useState<number | null>(null);
  const [view, setView] = useState<"chart" | "table">("chart");
  const wrapRef = useRef<HTMLDivElement>(null);
  const steps = periods[p];
  const other = periods[keys[(keys.indexOf(p) + keys.length - 1) % keys.length]];
  const target = useMemo(() => bridge(steps), [steps]);
  const [shown, setShown] = useState(target);
  const fromRef = useRef(target);
  const reduced = () => motion === "reduced" || (typeof window !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setW(Math.max(320, Math.round(e.contentRect.width))));
    ro.observe(el);
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setSeen(true); io.disconnect(); } }, { threshold: 0.35 });
    io.observe(el);
    return () => { ro.disconnect(); io.disconnect(); };
  }, []);

  // Switching period: every bar's ends tween to their new place.
  useEffect(() => {
    if (reduced()) { setShown(target); fromRef.current = target; return; }
    const from = fromRef.current, t0 = performance.now();
    let raf = 0;
    const step = (now: number) => {
      const t = Math.min(1, (now - t0) / 640), e = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      const cur = target.map((b, i) => ({ a: from[i].a + (b.a - from[i].a) * e, b: from[i].b + (b.b - from[i].b) * e }));
      setShown(cur); fromRef.current = cur;
      if (t < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target]); // eslint-disable-line react-hooks/exhaustive-deps

  const all = Object.values(periods).flatMap((s) => bridge(s).flatMap((b) => [b.a, b.b]));
  const sc = nice(Math.max(...all) * 1.06);
  const narrow = W < 600;
  // On a narrow chart the step names are angled, so they need more room below.
  const PAD = { t: 28, r: 16, b: narrow ? 74 : 46, l: narrow ? 40 : 54 };
  const iw = W - PAD.l - PAD.r, ih = H - PAD.t - PAD.b;
  const n = steps.length, slot = iw / n, bw = Math.min(64, slot * 0.62);
  const xc = (i: number) => PAD.l + slot * (i + 0.5);
  const y = (v: number) => PAD.t + ih - (v / sc.top) * ih;
  const ticks = Array.from({ length: Math.round(sc.top / sc.step) + 1 }, (_, j) => j * sc.step);
  const net = steps[n - 1].value, rev = steps[0].value, netPrev = other[n - 1].value;
  const margin = net / rev;
  // The step that moved the most between the two periods.
  const swing = steps.map((s, i) => ({ s, d: s.value - other[i].value })).filter((x) => x.s.kind !== "total").sort((a, b) => Math.abs(b.d) - Math.abs(a.d))[0];
  const summary = `${title}, ${p}: revenue ${currency} ${fmt(rev)} to net profit ${currency} ${fmt(net)} (${(margin * 100).toFixed(1)}% margin). ${steps.filter((s) => !s.kind).map((s) => `${s.label} ${fmt(s.value)}`).join(", ")}.`;

  return (
    <section className={`wb wb--${theme} ${className}`} data-motion={motion} data-seen={seen || undefined} aria-labelledby={`${id}-t`}>
      <header className="wb__head">
        <div>
          <h3 id={`${id}-t`} className="wb__title">{title} · {p}</h3>
          <p className="wb__hero">
            <span className="wb__cur">{currency}</span> {fmt(net)} <span className="wb__lab">net profit</span>
            <span className="wb__chg" data-dir={net >= netPrev ? "up" : "down"}>{net >= netPrev ? "▲" : "▼"} {fmt(net - netPrev)} vs {keys[(keys.indexOf(p) + keys.length - 1) % keys.length]}</span>
          </p>
          <p className="wb__insight">{(margin * 100).toFixed(1)}% margin. Biggest swing vs {keys[(keys.indexOf(p) + keys.length - 1) % keys.length]}: <strong>{swing.s.label.toLowerCase()}</strong>, {swing.d >= 0 ? "+" : "−"}{currency} {fmt(Math.abs(swing.d))} to profit.</p>
        </div>
        <div className="wb__ctl">
          <div className="wb__seg" role="radiogroup" aria-label="Quarter">
            {keys.map((kk) => <button key={kk} type="button" role="radio" aria-checked={p === kk} onClick={() => setP(kk)}>{kk}</button>)}
          </div>
          <button type="button" className="wb__view" aria-pressed={view === "table"} onClick={() => setView((v) => (v === "chart" ? "table" : "chart"))}>{view === "chart" ? "Table" : "Chart"}</button>
        </div>
      </header>
      <div className="wb__legend" aria-hidden="true">
        <span><i className="wb__k wb__k--total" />Total</span>
        <span><i className="wb__k wb__k--up" />Adds to profit</span>
        <span><i className="wb__k wb__k--down" />Takes away</span>
      </div>

      <div ref={wrapRef} className="wb__plot" hidden={view === "table"}>
        <svg viewBox={`0 0 ${W} ${H}`} width="100%" height={H} role="img" aria-label={summary} onPointerLeave={() => setHover(null)}>
          {ticks.map((v) => (
            <g key={v}>
              <line x1={PAD.l} x2={W - PAD.r} y1={y(v)} y2={y(v)} className={v === 0 ? "wb__base" : "wb__grid"} />
              <text x={PAD.l - 8} y={y(v)} dy="0.32em" className="wb__yt">{k(v)}</text>
            </g>
          ))}
          {shown.map((b, i) => {
            const s = steps[i];
            const top = Math.max(b.a, b.b), bot = Math.min(b.a, b.b);
            const kind = s.kind === "total" ? "total" : s.value >= 0 ? "up" : "down";
            const h = Math.max(1, y(bot) - y(top));
            const next = shown[i + 1];
            return (
              <g key={s.label} className="wb__step" style={{ ["--i" as string]: i }} data-dim={(hover !== null && hover !== i) || undefined} onPointerEnter={() => setHover(i)}>
                <rect x={xc(i) - slot / 2} y={PAD.t} width={slot} height={ih} fill="transparent" />
                <rect x={xc(i) - bw / 2} y={y(top)} width={bw} height={h} rx="4" className={`wb__bar wb__bar--${kind}`} />
                {/* The connector to the next bar, at the running total. */}
                {next && <line x1={xc(i) + bw / 2} x2={xc(i + 1) - bw / 2} y1={y(b.b)} y2={y(b.b)} className="wb__conn" />}
                <text x={xc(i)} y={kind === "down" ? y(bot) + 15 : y(top) - 7} className="wb__val" data-kind={kind} data-narrow={narrow || undefined}>
                  {kind === "total" ? k(s.value) : `${s.value >= 0 ? "+" : "−"}${k(Math.abs(s.value)).replace("−", "")}`}
                </text>
                <text
                  x={xc(i)}
                  y={H - PAD.b + (narrow ? 12 : 18)}
                  className="wb__xl"
                  data-kind={kind}
                  textAnchor={narrow ? "end" : "middle"}
                  transform={narrow ? `rotate(-40 ${xc(i)} ${H - PAD.b + 12})` : undefined}
                >
                  {s.label}
                </text>
              </g>
            );
          })}
        </svg>
        {hover !== null && (
          <div className="wb__tip" style={{ left: `${(xc(hover) / W) * 100}%`, top: y(Math.max(shown[hover].a, shown[hover].b)) - 10 }} role="status">
            <b>{steps[hover].label}</b>
            <span>{currency} {fmt(steps[hover].value)}{steps[hover].kind === "total" ? "" : ` · ${((Math.abs(steps[hover].value) / rev) * 100).toFixed(1)}% of revenue`}</span>
            <span>{keys[(keys.indexOf(p) + keys.length - 1) % keys.length]}: {fmt(other[hover].value)}</span>
          </div>
        )}
      </div>

      {view === "table" && (
        <div className="wb__table-wrap">
          <table className="wb__table">
            <caption className="wb__sr">{summary}</caption>
            <thead><tr><th scope="col">Step</th>{keys.map((kk) => <th key={kk} scope="col">{kk} ({currency})</th>)}<th scope="col">Change</th></tr></thead>
            <tbody>
              {steps.map((s, i) => (
                <tr key={s.label} data-total={s.kind === "total" || undefined}>
                  <th scope="row">{s.label}</th>
                  {keys.map((kk) => <td key={kk}>{fmt(periods[kk][i].value)}</td>)}
                  <td>{fmt(periods[keys[keys.length - 1]][i].value - periods[keys[0]][i].value)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
