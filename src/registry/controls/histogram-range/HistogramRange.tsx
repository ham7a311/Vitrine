"use client";

import { useMemo, useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent } from "react";
import "./histogram-range.css";

/**
 * Histogram Range
 * Two thumbs over a histogram. You're never choosing numbers blind: the bars
 * inside the range brighten, the ones outside fall back, and the count of
 * matching items is live. Each thumb is a proper slider with keyboard support.
 */

type Props = { values: number[]; min?: number; max?: number; bins?: number; unit?: string; label?: string; accent?: string; className?: string };

export function HistogramRange({ values, min = 0, max = 1000, bins = 36, unit = "$", label = "Price", accent = "#b9cce4", className = "" }: Props) {
  const [lo, setLo] = useState(Math.round(max * 0.18));
  const [hi, setHi] = useState(Math.round(max * 0.62));
  const track = useRef<HTMLDivElement>(null);
  const drag = useRef<"lo" | "hi" | null>(null);

  const hist = useMemo(() => {
    const h = Array(bins).fill(0);
    values.forEach((v) => { const i = Math.min(bins - 1, Math.max(0, Math.floor(((v - min) / (max - min)) * bins))); h[i]++; });
    const peak = Math.max(...h, 1);
    return h.map((c) => c / peak);
  }, [values, bins, min, max]);
  const count = useMemo(() => values.filter((v) => v >= lo && v <= hi).length, [values, lo, hi]);

  const toVal = (x: number) => {
    const r = track.current!.getBoundingClientRect();
    return Math.round(min + Math.max(0, Math.min(1, (x - r.left) / r.width)) * (max - min));
  };
  const down = (e: PointerEvent<HTMLDivElement>) => {
    const v = toVal(e.clientX);
    drag.current = Math.abs(v - lo) <= Math.abs(v - hi) ? "lo" : "hi";
    e.currentTarget.setPointerCapture(e.pointerId);
    move(e);
  };
  const move = (e: PointerEvent<HTMLDivElement>) => {
    if (!drag.current) return;
    const v = toVal(e.clientX);
    if (drag.current === "lo") setLo(Math.min(v, hi - 10));
    else setHi(Math.max(v, lo + 10));
  };
  const key = (which: "lo" | "hi") => (e: KeyboardEvent) => {
    const step = e.shiftKey ? 50 : 10;
    const d = e.key === "ArrowRight" || e.key === "ArrowUp" ? step : e.key === "ArrowLeft" || e.key === "ArrowDown" ? -step : 0;
    if (!d) return;
    e.preventDefault();
    if (which === "lo") setLo((v) => Math.max(min, Math.min(hi - 10, v + d)));
    else setHi((v) => Math.min(max, Math.max(lo + 10, v + d)));
  };

  const pl = (lo - min) / (max - min), ph = (hi - min) / (max - min);

  return (
    <div className={`histogram-range ${className}`} style={{ "--hr-accent": accent, "--lo": pl, "--hi": ph } as CSSProperties}>
      <div className="histogram-range__head">
        <span className="histogram-range__label">{label}</span>
        <span className="histogram-range__count" aria-live="polite"><b>{count}</b> results</span>
      </div>

      <div className="histogram-range__bars" aria-hidden="true">
        {hist.map((h, i) => {
          const c = (i + 0.5) / bins;
          return <span key={i} data-in={(c >= pl && c <= ph) || undefined} style={{ height: `${8 + h * 92}%` }} />;
        })}
      </div>

      <div ref={track} className="histogram-range__track" onPointerDown={down} onPointerMove={move} onPointerUp={() => (drag.current = null)}>
        <span className="histogram-range__rail" />
        <span className="histogram-range__fill" />
        {(["lo", "hi"] as const).map((w) => (
          <span
            key={w}
            className="histogram-range__thumb"
            style={{ left: `${(w === "lo" ? pl : ph) * 100}%` }}
            role="slider"
            tabIndex={0}
            aria-label={w === "lo" ? `Minimum ${label.toLowerCase()}` : `Maximum ${label.toLowerCase()}`}
            aria-valuemin={w === "lo" ? min : lo + 10}
            aria-valuemax={w === "lo" ? hi - 10 : max}
            aria-valuenow={w === "lo" ? lo : hi}
            aria-valuetext={`${unit}${w === "lo" ? lo : hi}`}
            onKeyDown={key(w)}
          />
        ))}
      </div>

      <div className="histogram-range__values">
        <span>{unit}{lo.toLocaleString("en-US")}</span>
        <span className="histogram-range__dash" aria-hidden="true" />
        <span>{unit}{hi.toLocaleString("en-US")}{hi === max ? "+" : ""}</span>
      </div>
    </div>
  );
}
