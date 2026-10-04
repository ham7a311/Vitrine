"use client";

import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import "./preset-keys.css";

/**
 * Preset Keys
 * The station buttons on an old radio, as a radio group. Press one and it
 * goes down and stays down with a solid clack, the one that was down
 * springs back up, and the needle sweeps across the dial to the station —
 * the glow behind the scale dimming while it travels and coming up warm
 * once it's tuned.
 */

export type Station = { name: string; short: string; mhz: number };
type Props = {
  stations: Station[];
  defaultIndex?: number;
  band?: [number, number];
  onChange?: (s: Station) => void;
  theme?: "walnut" | "hifi";
  motion?: "full" | "reduced";
  className?: string;
};

export function PresetKeys({ stations, defaultIndex = 0, band = [88, 108], onChange, theme = "walnut", motion = "full", className = "" }: Props) {
  const id = useId();
  const [sel, setSel] = useState(defaultIndex);
  const [tuning, setTuning] = useState(false);
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const timer = useRef(0);
  const st = stations[sel];
  const pos = (st.mhz - band[0]) / (band[1] - band[0]);

  const choose = (i: number) => {
    if (i === sel) return;
    setSel(i);
    onChange?.(stations[i]);
    const rm = motion === "reduced" || matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (rm) return;
    // While the needle travels the glow dims; it comes back once the station is in.
    setTuning(true);
    clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setTuning(false), 760);
  };
  useEffect(() => () => clearTimeout(timer.current), []);

  const onKey = (e: KeyboardEvent, i: number) => {
    const n = stations.length;
    let to = -1;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") to = (i + 1) % n;
    else if (e.key === "ArrowLeft" || e.key === "ArrowUp") to = (i - 1 + n) % n;
    else if (e.key === "Home") to = 0;
    else if (e.key === "End") to = n - 1;
    if (to < 0) return;
    e.preventDefault();
    choose(to);
    refs.current[to]?.focus();
  };

  const ticks: number[] = [];
  for (let f = band[0]; f <= band[1] + 1e-6; f += 0.5) ticks.push(f);

  return (
    <div className={`pk pk--${theme} ${className}`} data-motion={motion} data-tuning={tuning || undefined}>
      <div className="pk__cabinet">
        <div className="pk__grille" aria-hidden="true" />
        <div className="pk__dial" aria-hidden="true">
          <div className="pk__glow" />
          <div className="pk__scale">
            {ticks.map((f) => {
              const major = Math.abs(f % 2) < 1e-6;
              return <i key={f} className="pk__tick" data-major={major || undefined} style={{ left: `${((f - band[0]) / (band[1] - band[0])) * 100}%` }}>{major && <b data-odd={Math.round(f - band[0]) % 4 ? "" : undefined}>{f}</b>}</i>;
            })}
            <span className="pk__band">FM · MHz</span>
            {stations.map((s) => (
              <span key={s.short} className="pk__mark" style={{ left: `${((s.mhz - band[0]) / (band[1] - band[0])) * 100}%` }}>{s.short}</span>
            ))}
            <div className="pk__needle" style={{ left: `${pos * 100}%` }} />
          </div>
        </div>
        <div className="pk__window">
          <span className="pk__now" aria-live="polite">{tuning ? "· · ·" : st.name}</span>
          <span className="pk__freq">{st.mhz.toFixed(1)}</span>
        </div>
        <div className="pk__keys" role="radiogroup" aria-labelledby={`${id}-l`}>
          <span id={`${id}-l`} className="pk__sr">Station presets</span>
          {stations.map((s, i) => (
            <button
              key={s.short}
              ref={(el) => { refs.current[i] = el; }}
              type="button"
              role="radio"
              aria-checked={i === sel}
              aria-label={`${s.name}, ${s.mhz.toFixed(1)} megahertz`}
              tabIndex={i === sel ? 0 : -1}
              className="pk__key"
              onClick={() => choose(i)}
              onKeyDown={(e) => onKey(e, i)}
            >
              <span className="pk__cap">
                <span className="pk__num">{i + 1}</span>
                <span className="pk__short">{s.short}</span>
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
