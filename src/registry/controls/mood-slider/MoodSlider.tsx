"use client";

import { useEffect, useId, useRef, useState, type CSSProperties } from "react";
import "./mood-slider.css";

/**
 * Mood Slider
 * A rating you can feel. Drag along the scale and the face above it
 * changes continuously — brows lifting and settling, eyes narrowing into a
 * grin, the mouth turning from a frown through a shrug to an open smile,
 * cheeks colouring, the face itself warming from grey-blue to sunshine. It
 * tilts with how fast you drag and blinks now and then, and the whole card
 * takes on its mood.
 */

const LABELS = ["Awful", "Bad", "Okay", "Good", "Great"];
type Props = {
  question?: string;
  defaultValue?: number; // 0–100
  onChange?: (v: number, label: string) => void;
  theme?: "paper" | "night";
  motion?: "full" | "reduced";
  className?: string;
};

const mix = (a: number[], b: number[], t: number) => a.map((v, i) => Math.round(v + (b[i] - v) * t));
const hex = (h: string) => { const n = parseInt(h.slice(1), 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; };
/** A colour along a few stops. */
const ramp = (stops: [number, string][], t: number) => {
  for (let i = 1; i < stops.length; i++) if (t <= stops[i][0]) {
    const [a, ca] = stops[i - 1], [b, cb] = stops[i];
    const c = mix(hex(ca), hex(cb), (t - a) / (b - a));
    return `rgb(${c.join(",")})`;
  }
  return stops[stops.length - 1][1];
};
const ss = (a: number, b: number, x: number) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

const FACE: [number, string][] = [[0, "#9fb2cf"], [0.35, "#c9c4b4"], [0.6, "#ffd46f"], [1, "#ffb13d"]];
const PAPER_BG: [number, string][] = [[0, "#e7ecf4"], [0.5, "#f4efe4"], [1, "#fff1d9"]];
const NIGHT_BG: [number, string][] = [[0, "#11151d"], [0.5, "#16151a"], [1, "#1f170e"]];

export function MoodSlider({ question = "How was your stay at Al Bustan?", defaultValue = 62, onChange, theme = "paper", motion = "full", className = "" }: Props) {
  const id = useId();
  const [v, setV] = useState(defaultValue);
  const [blink, setBlink] = useState(false);
  const [sent, setSent] = useState(false);
  const tiltRef = useRef<SVGGElement>(null);
  const spring = useRef({ a: 0, w: 0, raf: 0, last: 0, lastV: defaultValue, lastT: 0 });
  const t = v / 100;
  const label = LABELS[Math.round(t * 4)];

  const reduced = () => motion === "reduced" || matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Blink every few seconds, at random.
  useEffect(() => {
    if (reduced()) return;
    let tm = 0;
    const next = () => { tm = window.setTimeout(() => { setBlink(true); window.setTimeout(() => setBlink(false), 130); next(); }, 2600 + Math.random() * 3200); };
    next();
    return () => clearTimeout(tm);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [motion]);

  // The face leans into the drag and swings back on a spring.
  const kick = (nv: number) => {
    const s = spring.current;
    const now = performance.now();
    const dt = Math.max(16, now - (s.lastT || now - 16));
    s.w += Math.max(-6, Math.min(6, ((nv - s.lastV) / dt) * 3.2)) * 60;
    s.lastV = nv; s.lastT = now;
    if (reduced() || s.raf) return;
    const step = (ts: number) => {
      const d = Math.min(0.032, s.last ? (ts - s.last) / 1000 : 0.016);
      s.last = ts;
      s.w += (-140 * s.a - 11 * s.w) * d;
      s.a += s.w * d;
      tiltRef.current?.setAttribute("transform", `rotate(${(s.a * 0.9).toFixed(2)} 90 100)`);
      if (Math.abs(s.a) > 0.02 || Math.abs(s.w) > 0.05) s.raf = requestAnimationFrame(step);
      else { s.raf = 0; s.last = 0; s.a = 0; tiltRef.current?.setAttribute("transform", "rotate(0 90 100)"); }
    };
    s.raf = requestAnimationFrame(step);
  };
  useEffect(() => () => cancelAnimationFrame(spring.current.raf), []);

  // Geometry, all from t.
  const corner = 128 - (t - 0.5) * 12;
  const lower = 128 + (t - 0.42) * 72;
  const open = ss(0.68, 1, t);
  const upper = lerp(lower, corner + 2, 0.55 + 0.45 * (1 - open));
  const mouth = `M58 ${corner} Q90 ${lower} 122 ${corner} Q90 ${upper} 58 ${corner} Z`;
  const eyeRy = lerp(9, 2.2, ss(0.72, 1, t)) * (blink ? 0.12 : 1);
  const eyeY = 84 + (0.4 - t) * 4;
  // Brows: inner ends lift when sad; when happy they rise and relax, never knitting into a scowl.
  const brow = t < 0.5 ? (0.5 - t) * 30 : -(t - 0.5) * 5;
  const browY = 62 - ss(0.6, 1, t) * 6 + ss(0, 0.3, 0.3 - t) * 2;
  const cheek = ss(0.55, 1, t) * 0.55;
  const tear = 1 - ss(0.04, 0.2, t);
  const face = ramp(FACE, t);
  const bg = ramp(theme === "night" ? NIGHT_BG : PAPER_BG, t);

  return (
    <div className={`ms ms--${theme} ${className}`} data-motion={motion} style={{ ["--bg" as string]: bg, ["--face" as string]: face } as CSSProperties}>
      <p className="ms__q" id={`${id}-q`}>{question}</p>
      <svg className="ms__face" viewBox="0 0 180 190" aria-hidden="true">
        <defs>
          <radialGradient id={`${id}-g`} cx="38%" cy="32%" r="75%">
            <stop offset="0" stopColor="#fff" stopOpacity="0.55" />
            <stop offset="0.5" stopColor="#fff" stopOpacity="0" />
          </radialGradient>
        </defs>
        <ellipse cx="90" cy="180" rx={46 + t * 6} ry="6" className="ms__shadow" />
        <g ref={tiltRef} transform="rotate(0 90 100)">
          <circle cx="90" cy="100" r="74" fill={face} className="ms__head" />
          <circle cx="90" cy="100" r="74" fill={`url(#${id}-g)`} />
          <ellipse cx="54" cy="116" rx="14" ry="8" className="ms__cheek" style={{ opacity: cheek }} />
          <ellipse cx="126" cy="116" rx="14" ry="8" className="ms__cheek" style={{ opacity: cheek }} />
          <rect x="52" y={browY - 2.5} width="26" height="5" rx="2.5" className="ms__ink" transform={`rotate(${-brow} 65 ${browY})`} />
          <rect x="102" y={browY - 2.5} width="26" height="5" rx="2.5" className="ms__ink" transform={`rotate(${brow} 115 ${browY})`} />
          <ellipse cx="66" cy={eyeY} rx="6.5" ry={eyeRy} className="ms__ink" />
          <ellipse cx="114" cy={eyeY} rx="6.5" ry={eyeRy} className="ms__ink" />
          <path d={mouth} className="ms__mouth" />
          <path d={`M62 ${eyeY + 12} q-5 9 0 12 q5 -3 0 -12z`} className="ms__tear" style={{ opacity: tear }} />
        </g>
      </svg>
      <p className="ms__label" aria-hidden="true">{label}</p>
      <div className="ms__track">
        <input
          type="range"
          min={0}
          max={100}
          value={v}
          aria-labelledby={`${id}-q`}
          aria-valuetext={label}
          onChange={(e) => {
            const nv = Number(e.target.value);
            kick(nv);
            setV(nv);
            setSent(false);
            onChange?.(nv, LABELS[Math.round((nv / 100) * 4)]);
          }}
          style={{ ["--t" as string]: t } as CSSProperties}
        />
        <div className="ms__ticks" aria-hidden="true">
          {LABELS.map((l, i) => <span key={l} data-on={Math.round(t * 4) === i || undefined} style={{ left: `${i * 25}%` }}>{l}</span>)}
        </div>
      </div>
      <button type="button" className="ms__send" onClick={() => setSent(true)}>
        {sent ? "Thank you — noted" : `Send “${label}”`}
      </button>
    </div>
  );
}
