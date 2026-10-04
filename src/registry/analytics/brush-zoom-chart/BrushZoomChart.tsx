"use client";

import { useEffect, useId, useMemo, useRef, useState, type KeyboardEvent, type PointerEvent as RPointerEvent } from "react";
import "./brush-zoom-chart.css";

/**
 * Brush Zoom
 * Two years of daily searches, read at any magnification. The strip along
 * the bottom shows everything; drag the window across it, or pull its
 * handles, and the chart above eases to just those days — its axis
 * re-fitting as it goes. Pins mark the days that explain the shape: an
 * app launch, a TV spot, Khareef opening. Click a pin to jump to it.
 */

export type Day = { date: Date; value: number };
export type Pin = { date: Date; label: string };
type Props = { days: Day[]; pins: Pin[]; title?: string; theme?: "light" | "dark"; motion?: "full" | "reduced"; className?: string };

const H = 260, OH = 64, PAD = { t: 22, r: 16, b: 26, l: 46 };
const DAY = 86400000;
const dFmt = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric" });
const mFmt = new Intl.DateTimeFormat("en-GB", { month: "short" });
const shortFmt = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short" });
const k = (v: number) => (v >= 1000 ? `${(v / 1000).toFixed(v >= 10000 ? 0 : 1)}k` : `${Math.round(v)}`);
function nice(max: number) {
  const raw = max / 4, p = Math.pow(10, Math.floor(Math.log10(raw))), f = raw / p;
  const step = (f <= 1 ? 1 : f <= 2 ? 2 : f <= 2.5 ? 2.5 : f <= 5 ? 5 : 10) * p;
  return { top: Math.ceil(max / step) * step, step };
}

export function BrushZoomChart({ days, pins, title = "Daily searches", theme = "light", motion = "full", className = "" }: Props) {
  const id = useId();
  const wrapRef = useRef<HTMLDivElement>(null);
  const overRef = useRef<SVGSVGElement>(null);
  const mainRef = useRef<SVGSVGElement>(null);
  const [W, setW] = useState(820);
  const n = days.length;
  // The brushed window in day indices (target), and the eased view that follows it.
  const [win, setWin] = useState<[number, number]>([n - 120, n - 1]);
  const [view, setView] = useState<[number, number]>([n - 120, n - 1]);
  const viewRef = useRef(view);
  const [hover, setHover] = useState<number | null>(null);
  const [tableOpen, setTableOpen] = useState(false);
  const drag = useRef<{ mode: "move" | "a" | "b" | "new"; x: number; w: [number, number] } | null>(null);
  const reduced = () => motion === "reduced" || (typeof window !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setW(Math.max(320, Math.round(e.contentRect.width))));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // The detail view eases toward the window (and its y-scale with it).
  useEffect(() => {
    if (reduced()) { setView(win); viewRef.current = win; return; }
    let raf = 0, last = performance.now();
    const step = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const [a, b] = viewRef.current, kx = 1 - Math.exp(-dt * 14);
      const next: [number, number] = [a + (win[0] - a) * kx, b + (win[1] - b) * kx];
      viewRef.current = next;
      setView(next);
      if (Math.abs(next[0] - win[0]) + Math.abs(next[1] - win[1]) > 0.02) raf = requestAnimationFrame(step);
      else { viewRef.current = win; setView(win); }
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [win]); // eslint-disable-line react-hooks/exhaustive-deps

  const iw = W - PAD.l - PAD.r, ih = H - PAD.t - PAD.b;
  const allMax = useMemo(() => Math.max(...days.map((d) => d.value)), [days]);
  // Smoothed 7-day average, drawn over the daily line.
  const avg = useMemo(() => days.map((_, i) => { let s = 0, c = 0; for (let j = Math.max(0, i - 3); j <= Math.min(n - 1, i + 3); j++) { s += days[j].value; c++; } return s / c; }), [days, n]);

  // Detail scales.
  const [v0, v1] = view;
  const i0 = Math.max(0, Math.floor(v0)), i1 = Math.min(n - 1, Math.ceil(v1));
  const vmax = nice(Math.max(...days.slice(i0, i1 + 1).map((d) => d.value)) * 1.1);
  const x = (i: number) => PAD.l + ((i - v0) / Math.max(1e-6, v1 - v0)) * iw;
  const y = (v: number) => PAD.t + ih - (v / vmax.top) * ih;
  const daily = days.slice(i0, i1 + 1).map((d, j) => `${j ? "L" : "M"}${x(i0 + j).toFixed(1)} ${y(d.value).toFixed(1)}`).join(" ");
  const smooth = avg.slice(i0, i1 + 1).map((v, j) => `${j ? "L" : "M"}${x(i0 + j).toFixed(1)} ${y(v).toFixed(1)}`).join(" ");
  const area = `${daily} L${x(i1).toFixed(1)} ${PAD.t + ih} L${x(i0).toFixed(1)} ${PAD.t + ih} Z`;
  const ticks = Array.from({ length: Math.round(vmax.top / vmax.step) + 1 }, (_, j) => j * vmax.step);
  const span = v1 - v0;
  // Date ticks: months when wide, weeks when narrow.
  const dTicks = (() => {
    const out: number[] = [];
    for (let i = i0; i <= i1; i++) {
      const d = days[i].date;
      if (span > 100 ? d.getDate() === 1 : span > 30 ? d.getDay() === 0 && d.getDate() <= 7 * 5 && (i - i0) % 14 < 7 : d.getDay() === 0) out.push(i);
    }
    return out.filter((_, j, a) => a.length < 9 || j % 2 === 0);
  })();

  // Overview scales.
  const ox = (i: number) => PAD.l + (i / (n - 1)) * iw;
  const oy = (v: number) => 6 + (OH - 12) - (v / allMax) * (OH - 12);
  const oPath = avg.map((v, i) => `${i ? "L" : "M"}${ox(i).toFixed(1)} ${oy(v).toFixed(1)}`).join(" ");
  const toIdx = (clientX: number) => {
    const r = overRef.current!.getBoundingClientRect();
    return Math.max(0, Math.min(n - 1, (((clientX - r.left) / r.width) * W - PAD.l) / iw * (n - 1)));
  };
  const MIN = 7;
  const clampWin = (a: number, b: number, mode: string): [number, number] => {
    if (mode === "move") { const w = b - a; a = Math.max(0, Math.min(n - 1 - w, a)); return [a, a + w]; }
    if (b - a < MIN) { if (mode === "a") a = b - MIN; else b = a + MIN; }
    a = Math.max(0, a); b = Math.min(n - 1, b);
    return [a, b];
  };
  const onDown = (e: RPointerEvent) => {
    const idx = toIdx(e.clientX);
    const target = (e.target as Element).closest("[data-h]")?.getAttribute("data-h");
    const mode = target === "a" ? "a" : target === "b" ? "b" : idx >= win[0] && idx <= win[1] ? "move" : "new";
    drag.current = { mode, x: idx, w: win };
    (e.currentTarget as Element).setPointerCapture(e.pointerId);
    if (mode === "new") setWin(clampWin(idx, idx + MIN, "b"));
    e.preventDefault();
  };
  const onMove = (e: RPointerEvent) => {
    const d = drag.current;
    if (!d) return;
    const idx = toIdx(e.clientX), dx = idx - d.x;
    if (d.mode === "move") setWin(clampWin(d.w[0] + dx, d.w[1] + dx, "move"));
    else if (d.mode === "a") setWin(clampWin(Math.min(idx, d.w[1] - MIN), d.w[1], "a"));
    else if (d.mode === "b") setWin(clampWin(d.w[0], Math.max(idx, d.w[0] + MIN), "b"));
    else setWin(clampWin(Math.min(d.x, idx), Math.max(d.x, idx), "b"));
  };
  const onUp = () => {
    if (!drag.current) return;
    drag.current = null;
    setWin(([a, b]) => [Math.round(a), Math.round(b)]);
  };
  const onKey = (e: KeyboardEvent) => {
    const w = win[1] - win[0], st = e.shiftKey ? 30 : 7;
    if (e.key === "ArrowLeft") { e.preventDefault(); setWin(clampWin(win[0] - st, win[1] - st, "move")); }
    if (e.key === "ArrowRight") { e.preventDefault(); setWin(clampWin(win[0] + st, win[1] + st, "move")); }
    if (e.key === "ArrowUp" || e.key === "+" || e.key === "=") { e.preventDefault(); const c = (win[0] + win[1]) / 2, nw = Math.max(MIN, w * 0.7); setWin(clampWin(c - nw / 2, c + nw / 2, "b")); }
    if (e.key === "ArrowDown" || e.key === "-") { e.preventDefault(); const c = (win[0] + win[1]) / 2, nw = Math.min(n - 1, w / 0.7); setWin(clampWin(Math.max(0, c - nw / 2), Math.min(n - 1, c + nw / 2), "b")); }
    if (e.key === "Home") { e.preventDefault(); setWin(clampWin(0, w, "move")); }
    if (e.key === "End") { e.preventDefault(); setWin(clampWin(n - 1 - w, n - 1, "move")); }
  };
  const presets: [string, number][] = [["2W", 14], ["3M", 91], ["6M", 182], ["All", n - 1]];
  const pinIdx = pins.map((p) => ({ ...p, i: Math.round((+p.date - +days[0].date) / DAY) })).filter((p) => p.i >= 0 && p.i < n);
  const jump = (i: number) => { const w = Math.max(28, Math.min(60, win[1] - win[0])); setWin(clampWin(Math.round(i - w / 2), Math.round(i + w / 2), "b")); };

  const pickMain = (e: RPointerEvent) => {
    const r = mainRef.current!.getBoundingClientRect();
    const px = ((e.clientX - r.left) / r.width) * W;
    const i = Math.round(v0 + ((px - PAD.l) / iw) * (v1 - v0));
    setHover(i >= i0 && i <= i1 ? i : null);
  };
  const hp = hover !== null ? days[hover] : null;
  const total = days.slice(Math.round(win[0]), Math.round(win[1]) + 1).reduce((s, d) => s + d.value, 0);
  const winDays = Math.round(win[1]) - Math.round(win[0]) + 1;
  const summary = `${title} from ${dFmt.format(days[Math.round(win[0])].date)} to ${dFmt.format(days[Math.round(win[1])].date)}: ${Math.round(total).toLocaleString("en-GB")} searches over ${winDays} days, an average of ${Math.round(total / winDays).toLocaleString("en-GB")} a day.`;

  return (
    <section className={`bz bz--${theme} ${className}`} data-motion={motion} aria-labelledby={`${id}-t`}>
      <header className="bz__head">
        <div>
          <h3 id={`${id}-t`} className="bz__title">{title}</h3>
          <p className="bz__range">
            <span>{(days[Math.round(win[0])].date.getFullYear() === days[Math.round(win[1])].date.getFullYear() ? shortFmt : dFmt).format(days[Math.round(win[0])].date)} – {dFmt.format(days[Math.round(win[1])].date)}</span>
            <span className="bz__stat"><b>{Math.round(total / winDays).toLocaleString("en-GB")}</b> a day · {winDays} days</span>
          </p>
        </div>
        <div className="bz__ctl">
          <div className="bz__seg" role="group" aria-label="Window size">
            {presets.map(([l, d]) => (
              <button key={l} type="button" aria-pressed={Math.abs(win[1] - win[0] - d) < 1} onClick={() => setWin(clampWin(n - 1 - d, n - 1, "b"))}>{l}</button>
            ))}
          </div>
          <button type="button" className="bz__view" aria-pressed={tableOpen} onClick={() => setTableOpen((t) => !t)}>{tableOpen ? "Chart" : "Table"}</button>
        </div>
      </header>

      <div ref={wrapRef} className="bz__plot" hidden={tableOpen}>
        <div className="bz__legend" aria-hidden="true">
          <span><i className="bz__k bz__k--d" />Daily</span>
          <span><i className="bz__k bz__k--a" />7-day average</span>
          <span><i className="bz__k bz__k--p" />Event</span>
        </div>
        <svg ref={mainRef} viewBox={`0 0 ${W} ${H}`} width="100%" height={H} role="img" aria-label={summary} onPointerMove={pickMain} onPointerLeave={() => setHover(null)}>
          <defs>
            <clipPath id={`${id}-c`}><rect x={PAD.l} y={0} width={iw} height={H} /></clipPath>
            <linearGradient id={`${id}-g`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" className="bz__ga" /><stop offset="1" className="bz__gb" /></linearGradient>
          </defs>
          {ticks.map((v) => (
            <g key={v}>
              <line x1={PAD.l} x2={W - PAD.r} y1={y(v)} y2={y(v)} className={v === 0 ? "bz__base" : "bz__grid"} />
              <text x={PAD.l - 8} y={y(v)} dy="0.32em" className="bz__yt">{k(v)}</text>
            </g>
          ))}
          {dTicks.map((i) => <text key={i} x={x(i)} y={H - 8} className="bz__xt">{span > 100 ? mFmt.format(days[i].date) : shortFmt.format(days[i].date)}</text>)}
          <g clipPath={`url(#${id}-c)`}>
            <path d={area} fill={`url(#${id}-g)`} />
            <path d={daily} className="bz__daily" />
            <path d={smooth} className="bz__avg" />
            {(() => {
              // Pins close to the previous one drop to a second row so their labels never collide.
              let lastX = -1e9, row = 0;
              return pinIdx.filter((p) => p.i >= i0 && p.i <= i1).map((p) => {
                const px = x(p.i);
                row = px - lastX < p.label.length * 6.8 + 24 ? (row + 1) % 2 : 0;
                lastX = px;
                const py = PAD.t + 8 + row * 18, right = px > W - 160;
                return (
                  <g key={p.label} className="bz__pin">
                    <line x1={px} x2={px} y1={py} y2={PAD.t + ih} />
                    <circle cx={px} cy={py} r="4" />
                    <text x={px + (right ? -8 : 8)} y={py + 4} textAnchor={right ? "end" : "start"}>{p.label}</text>
                  </g>
                );
              });
            })()}
            {hp && hover !== null && (
              <g aria-hidden="true">
                <line x1={x(hover)} x2={x(hover)} y1={PAD.t} y2={PAD.t + ih} className="bz__cross" />
                <circle cx={x(hover)} cy={y(hp.value)} r="4.5" className="bz__dot" />
              </g>
            )}
          </g>
        </svg>
        {hp && hover !== null && (
          <div className="bz__tip" style={{ left: `${(x(hover) / W) * 100}%`, top: y(hp.value) + 28 }} data-side={x(hover) > W * 0.7 ? "left" : "right"} role="status">
            <span>{dFmt.format(hp.date)}</span>
            <b>{Math.round(hp.value).toLocaleString("en-GB")} searches</b>
            <span>7-day avg {Math.round(avg[hover]).toLocaleString("en-GB")}</span>
          </div>
        )}

        {/* The overview and its brush. */}
        <svg
          ref={overRef}
          className="bz__over"
          viewBox={`0 0 ${W} ${OH}`}
          width="100%"
          height={OH}
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerUp={onUp}
          onPointerCancel={onUp}
          aria-hidden="true"
        >
          <path d={`${oPath} L${ox(n - 1)} ${OH - 6} L${ox(0)} ${OH - 6} Z`} className="bz__o-area" />
          <path d={oPath} className="bz__o-line" />
          {days.map((d, i) => d.date.getDate() === 1 && d.date.getMonth() % (W < 560 ? 6 : 3) === 0 && <text key={i} x={ox(i) + 3} y={OH - 9} className="bz__o-t">{mFmt.format(d.date)} {String(d.date.getFullYear()).slice(2)}</text>)}
          {pinIdx.map((p) => <circle key={p.label} cx={ox(p.i)} cy={8} r="3" className="bz__o-pin" onPointerDown={(e) => { e.stopPropagation(); jump(p.i); }} />)}
          <rect x={PAD.l} y={0} width={Math.max(0, ox(win[0]) - PAD.l)} height={OH} className="bz__o-shade" />
          <rect x={ox(win[1])} y={0} width={Math.max(0, PAD.l + iw - ox(win[1]))} height={OH} className="bz__o-shade" />
          <rect x={ox(win[0])} y={1} width={Math.max(2, ox(win[1]) - ox(win[0]))} height={OH - 2} rx="6" className="bz__o-win" />
          {(["a", "b"] as const).map((h) => (
            <g key={h} data-h={h} className="bz__o-handle" transform={`translate(${ox(h === "a" ? win[0] : win[1])} ${OH / 2})`}>
              <rect x={-9} y={-OH / 2} width={18} height={OH} fill="transparent" />
              <rect x={-4} y={-14} width={8} height={28} rx="4" />
              <line x1={-1.2} x2={-1.2} y1={-5} y2={5} /><line x1={1.2} x2={1.2} y1={-5} y2={5} />
            </g>
          ))}
        </svg>
        <div
          className="bz__brush-kb"
          role="slider"
          tabIndex={0}
          aria-label="Visible date range — arrows move it, up and down zoom"
          aria-valuemin={0}
          aria-valuemax={n - 1}
          aria-valuenow={Math.round(win[0])}
          aria-valuetext={`${dFmt.format(days[Math.round(win[0])].date)} to ${dFmt.format(days[Math.round(win[1])].date)}`}
          onKeyDown={onKey}
        >
          <span>Drag the window or its edges · ← → move · ↑ ↓ zoom</span>
        </div>
        <div className="bz__pins">
          {pinIdx.map((p) => <button key={p.label} type="button" onClick={() => jump(p.i)}><i />{p.label} · {shortFmt.format(p.date)}</button>)}
        </div>
      </div>

      {tableOpen && (
        <div className="bz__table-wrap">
          <table className="bz__table">
            <caption>{summary}</caption>
            <thead><tr><th scope="col">Date</th><th scope="col">Searches</th><th scope="col">7-day average</th></tr></thead>
            <tbody>{days.slice(Math.round(win[0]), Math.round(win[1]) + 1).map((d, j) => <tr key={j}><th scope="row">{dFmt.format(d.date)}</th><td>{Math.round(d.value).toLocaleString("en-GB")}</td><td>{Math.round(avg[Math.round(win[0]) + j]).toLocaleString("en-GB")}</td></tr>)}</tbody>
          </table>
        </div>
      )}
    </section>
  );
}
