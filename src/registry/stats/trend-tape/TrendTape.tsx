"use client";
import { useEffect, useId, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import { SCENARIOS, STEADY, band, mulberry32, nextValue, project, rate, roughSeconds, secondsTo, type Scenario } from "./tape";
import "./trend-tape.css";

/**
 * Trend Tape
 * A glass-cockpit speed tape for a live number. The scale slides behind a fixed pointer, coloured bands
 * mark caution and limit, and a trend vector grows from the pointer to where the value will be in ten
 * seconds at its current rate — so you see where it's heading, not just where it is. Set a target bug
 * by dragging it or with the arrow keys. When the value is steady, the vector disappears.
 */

export type TrendTapeProps = {
  label?: string;
  unit?: string;
  min?: number;
  max?: number;
  caution?: number;
  limit?: number;
  start?: number;
  defaultTarget?: number;
  defaultScenario?: Scenario;
  horizon?: number;
  theme?: "dark" | "light";
  className?: string;
};

const PPU = 0.9; // pixels per unit on the tape
const TAPE_H = 320;
const MID = TAPE_H / 2;

const I = {
  play: <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M5 3.5v9l7.5-4.5z" /></svg>,
  pause: <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M5.5 3.5v9m5-9v9" /></svg>,
};

export function TrendTape({
  label = "Export queue",
  unit = "jobs",
  min = 0,
  max = 800,
  caution = 450,
  limit = 600,
  start = 380,
  defaultTarget = 250,
  defaultScenario = "surge",
  horizon = 10,
  theme = "dark",
  className = "",
}: TrendTapeProps) {
  const uid = useId();
  const [samples, setSamples] = useState<number[]>([start]);
  const [scenario, setScenario] = useState<Scenario>(defaultScenario);
  const [live, setLive] = useState(true);
  const [target, setTarget] = useState(defaultTarget);
  const [say, setSay] = useState("");
  const rng = useRef(mulberry32(42));
  const drag = useRef<{ y: number; t: number } | null>(null);
  const lastBand = useRef(band(start, caution, limit));
  const warned = useRef(false);

  const v = samples[samples.length - 1];
  const r = rate(samples);
  const steady = Math.abs(r) < STEADY;
  const ahead = project(v, steady ? 0 : r, horizon);
  const b = band(v, caution, limit);
  const willCross = !steady && v < limit && ahead >= limit;
  const toLimit = secondsTo(v, r, limit);
  const toTarget = secondsTo(v, r, target);

  /* The feed: one sample a second while live. */
  useEffect(() => {
    if (!live) return;
    const drift = SCENARIOS.find((s) => s.id === scenario)!.drift;
    const id = window.setInterval(() => {
      setSamples((s) => [...s.slice(-59), nextValue(s[s.length - 1], drift, rng.current, min, max)]);
    }, 1000);
    return () => window.clearInterval(id);
  }, [live, scenario, min, max]);

  /* Speak only when something worth knowing changes. */
  useEffect(() => {
    if (b !== lastBand.current) {
      lastBand.current = b;
      setSay(b === "over" ? `${label} is over the limit: ${v} ${unit}.` : b === "caution" ? `${label} entered the caution band: ${v} ${unit}.` : `${label} back in the normal range.`);
    } else if (willCross && !warned.current) {
      warned.current = true;
      setSay(`${label} will reach the limit in about ${roughSeconds(toLimit ?? horizon)} at this rate.`);
    }
    if (!willCross) warned.current = false;
  }, [b, willCross, v, label, unit, toLimit, horizon]);

  const y = (val: number) => (max - val) * PPU; // position on the scale strip
  const offset = MID - y(v); // strip translation that puts v under the pointer
  const ticks: number[] = [];
  for (let t = min; t <= max; t += 25) ticks.push(t);

  const setT = (n: number) => setTarget(Math.max(min, Math.min(max, Math.round(n / 5) * 5)));
  const onBugKey = (e: KeyboardEvent) => {
    const step = e.shiftKey ? 50 : 10;
    const map: Record<string, number> = { ArrowUp: step, ArrowRight: step, ArrowDown: -step, ArrowLeft: -step, PageUp: 100, PageDown: -100 };
    if (e.key in map) { e.preventDefault(); setT(target + map[e.key]); }
    if (e.key === "Home") { e.preventDefault(); setT(min); }
    if (e.key === "End") { e.preventDefault(); setT(max); }
  };
  const onDown = (e: PointerEvent<HTMLElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    drag.current = { y: e.clientY, t: target };
  };
  const onMove = (e: PointerEvent<HTMLElement>) => {
    if (!drag.current) return;
    setT(drag.current.t - (e.clientY - drag.current.y) / PPU);
  };
  const onUp = () => {
    if (drag.current) setSay(`Target set to ${target} ${unit}.`);
    drag.current = null;
  };

  const vecLen = steady ? 0 : Math.max(-MID + 24, Math.min(MID - 24, (ahead - v) * PPU));
  const trendWord = steady ? "steady" : r > 0 ? "rising" : "falling";
  const rateText = steady ? "steady" : `${trendWord} ${Math.abs(r).toFixed(1)}/s`;

  return (
    <div className={`trtp trtp--${theme} ${className}`} data-band={b} data-warn={willCross || undefined}>
      <div className="trtp__card">
        <div
          className="trtp__tape"
          role="meter"
          aria-labelledby={`${uid}-l`}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={v}
          aria-valuetext={`${v} ${unit}, ${rateText}${willCross && toLimit ? `, limit in ${roughSeconds(toLimit)}` : ""}`}
          style={{ height: TAPE_H }}
        >
          <div className="trtp__strip" style={{ transform: `translateY(${offset}px)`, height: (max - min) * PPU }}>
            <i className="trtp__band" data-b="caution" style={{ top: y(limit), height: (limit - caution) * PPU }} />
            <i className="trtp__band" data-b="over" style={{ top: 0, height: y(limit) }} />
            {ticks.map((t) => (
              <span key={t} className="trtp__tick" data-major={t % 100 === 0 || undefined} style={{ top: y(t) }}>
                {t % 100 === 0 && <b>{t}</b>}
              </span>
            ))}
            <span
              className="trtp__bug"
              role="slider"
              tabIndex={0}
              aria-label={`Target for ${label}`}
              aria-valuemin={min}
              aria-valuemax={max}
              aria-valuenow={target}
              aria-valuetext={`${target} ${unit}`}
              style={{ top: y(target) }}
              onKeyDown={onBugKey}
              onPointerDown={onDown}
              onPointerMove={onMove}
              onPointerUp={onUp}
              onPointerCancel={onUp}
            >
              <svg viewBox="0 0 14 18" aria-hidden="true"><path d="M1 1h12v16H1zM1 9h6" /></svg>
            </span>
          </div>

          {/* fixed: the trend vector and the pointer */}
          <i className="trtp__vector" aria-hidden="true" style={{ top: vecLen > 0 ? MID - vecLen : MID + 16, height: Math.max(0, Math.abs(vecLen) - 16) }} data-dir={vecLen > 0 ? "up" : "down"} data-hide={steady || undefined} />
          <div className="trtp__pointer" aria-hidden="true" style={{ top: MID }}>
            <span key={v}>{v}</span>
          </div>
        </div>

        <div className="trtp__read">
          <span className="trtp__label" id={`${uid}-l`}>{label}</span>
          <p className="trtp__value">
            <b>{v}</b> {unit}
          </p>
          <p className="trtp__rate" data-dir={steady ? "flat" : r > 0 ? "up" : "down"}>
            <i aria-hidden="true" />
            {rateText}
            {!steady && <span> · in {horizon} s ≈ {Math.round(Math.max(min, Math.min(max, ahead)))}</span>}
          </p>

          <dl className="trtp__facts">
            <div data-k="limit">
              <dt>Limit</dt>
              <dd>
                {limit}
                <span>{b === "over" ? "over now" : toLimit != null ? `reached in ${roughSeconds(toLimit)}` : "not heading there"}</span>
              </dd>
            </div>
            <div data-k="caution">
              <dt>Caution</dt>
              <dd>{caution}<span>{b === "ok" ? `${caution - v} below` : "inside the band"}</span></dd>
            </div>
            <div data-k="target">
              <dt>Target</dt>
              <dd>
                {target}
                <span>{v === target ? "on target" : toTarget != null ? `reached in ${roughSeconds(toTarget)}` : "drifting away"}</span>
              </dd>
            </div>
          </dl>

          <div className="trtp__ctl">
            <div className="trtp__scen" role="radiogroup" aria-label="Demo feed">
              {SCENARIOS.map((s) => (
                <button key={s.id} type="button" role="radio" aria-checked={scenario === s.id} onClick={() => { setScenario(s.id); setSay(`Feed: ${s.name}.`); }}>
                  {s.name}
                </button>
              ))}
            </div>
            <button type="button" className="trtp__live" aria-pressed={live} onClick={() => { setLive((l) => !l); setSay(live ? "Feed paused." : "Feed live."); }}>
              {live ? I.pause : I.play}
              {live ? "Live" : "Paused"}
            </button>
          </div>
          <p className="trtp__hint">Drag the target bug on the tape, or focus it and use the arrow keys.</p>
        </div>
      </div>
      <p className="trtp__sr" role="status" aria-live="polite">{say}</p>
    </div>
  );
}
