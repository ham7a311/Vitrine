"use client";
import { useEffect, useRef, useState } from "react";
import { compact, countAt, uptimeDays } from "./mono";

const still = () => typeof matchMedia !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Runs `fn` once when the element first scrolls into view. */
function useOnView<T extends Element>(fn: () => void | (() => void)) {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let undo: void | (() => void);
    if (typeof IntersectionObserver === "undefined") { undo = fn(); return () => undo?.(); }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { io.disconnect(); undo = fn(); } }, { threshold: 0.3 });
    io.observe(el);
    return () => { io.disconnect(); undo?.(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return ref;
}

/** A huge figure that counts up once, over a baseline of dots. */
export function Numeral({ value, unit, caption, series }: { value: number; unit?: string; caption: string; series: number[] }) {
  const [shown, setShown] = useState(0);
  const ref = useOnView<HTMLDivElement>(() => {
    if (still()) { setShown(value); return; }
    let raf = 0; const t0 = performance.now();
    const tick = (now: number) => { const v = countAt(now - t0, value); setShown(v); if (v < value) raf = requestAnimationFrame(tick); };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  });
  const max = Math.max(...series);
  return (
    <div ref={ref} className="mtile-num">
      <p className="mtile-num__fig"><span aria-hidden="true">{compact(shown)}</span><span className="mtile-sr">{compact(value)}</span>{unit && <small>{unit}</small>}</p>
      <p className="mtile-num__cap">{caption}</p>
      <div className="mtile-num__dots" aria-hidden="true">
        {series.map((v, i) => (
          <span key={i}>{Array.from({ length: Math.max(1, Math.round((v / max) * 6)) }, (_, k) => <i key={k} />)}</span>
        ))}
      </div>
    </div>
  );
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
/** Ninety days as columns of dots; point at a day to read it. */
export function Uptime({ end = new Date(2026, 9, 12), days = 90 }: { end?: Date; days?: number }) {
  const states = uptimeDays(days);
  const [at, setAt] = useState<number | null>(null);
  const label = (i: number) => {
    const d = new Date(end); d.setDate(d.getDate() - (days - 1 - i));
    return `${MONTHS[d.getMonth()]} ${d.getDate()} — ${["100%", "99.4%", "96.1%"][states[i]]}`;
  };
  const ok = states.filter((s) => s === 0).length;
  return (
    <div className="mtile-up" onPointerLeave={() => setAt(null)}>
      <p className="mtile-up__read" aria-live="polite">{at === null ? `${days} days · ${((ok / days) * 0.6 + 99.4).toFixed(2)}%` : label(at)}</p>
      <div className="mtile-up__cols" role="img" aria-label={`Uptime over ${days} days: ${ok} clear days, ${days - ok} with incidents`}>
        {states.map((s, i) => (
          <span key={i} className={`mtile-up__day mtile-up__day--${s} ${at === i ? "mtile-up__day--at" : ""}`} onPointerEnter={() => setAt(i)}>
            <i /><i /><i />
          </span>
        ))}
      </div>
    </div>
  );
}

/** A type specimen that steps through its weights. */
export function Specimen({ glyphs = "Aa", weights = [400, 500, 600, 700] }: { glyphs?: string; weights?: number[] }) {
  const [w, setW] = useState(weights.length - 1);
  useEffect(() => {
    if (still()) return;
    const id = window.setInterval(() => setW((i) => (i + 1) % weights.length), 1600);
    return () => clearInterval(id);
  }, [weights.length]);
  return (
    <div className="mtile-spec">
      <p className="mtile-spec__glyph" style={{ fontWeight: weights[w] }} aria-hidden="true">{glyphs}</p>
      <p className="mtile-spec__scale" aria-hidden="true">{weights.map((x, i) => <span key={x} className={i === w ? "on" : ""}>{x}</span>)}</p>
    </div>
  );
}

/** Two keys pressed in turn. */
export function Shortcut({ keys = ["⌘", "K"] }: { keys?: string[] }) {
  return (
    <div className="mtile-keys" aria-hidden="true">
      {keys.map((k, i) => <kbd key={k} style={{ animationDelay: `${i * 240}ms` }}>{k}</kbd>)}
    </div>
  );
}

/** A running changelog that scrolls slowly and stops while you read. */
export function Ticker({ lines }: { lines: { tag: string; text: string }[] }) {
  return (
    <div className="mtile-tick">
      <ul className="mtile-tick__list">
        {[...lines, ...lines].map((l, i) => (
          <li key={i} aria-hidden={i >= lines.length || undefined}><code>{l.tag}</code><span>{l.text}</span></li>
        ))}
      </ul>
    </div>
  );
}

/** A real switch, square to match the grid. */
export function Toggle({ label, initial = true }: { label: string; initial?: boolean }) {
  const [on, setOn] = useState(initial);
  return (
    <div className="mtile-tog">
      <button type="button" role="switch" aria-checked={on} aria-label={label} className="mtile-tog__switch" onClick={() => setOn((v) => !v)}><i /></button>
      <span className="mtile-tog__state" aria-hidden="true">{on ? "ON" : "OFF"}</span>
    </div>
  );
}
