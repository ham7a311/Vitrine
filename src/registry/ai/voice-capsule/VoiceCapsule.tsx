"use client";

import { useEffect, useRef, useState, type CSSProperties, type PointerEvent } from "react";
import "./voice-capsule.css";

/**
 * Voice Capsule
 * Press and hold. The button grows into a capsule that holds the recording:
 * a waveform of recent levels and a timer. Dragging left past the threshold
 * arms "cancel" (the capsule warms toward rose in proportion); releasing there
 * discards it with a shake, releasing anywhere else keeps it as a small
 * voice-note pill. Space/Enter held works like the pointer; Escape cancels.
 * Levels are synthetic here — swap `level()` for an AnalyserNode reading.
 */

type Props = { theme?: "paper" | "night"; className?: string };
type State = "idle" | "rec" | "arming" | "sent" | "cancel";

const BARS = 28;
const ARM = 90; // px of leftward drag that arms cancel

// speech-like: syllable bursts under a slow phrase envelope
function level(t: number) {
  const phrase = 0.5 + 0.5 * Math.sin(t / 900);
  const syl = Math.max(0, Math.sin(t / 95) * Math.sin(t / 37 + 1.3));
  return Math.min(1, 0.08 + phrase * syl * 0.95 + Math.random() * 0.08);
}

export function VoiceCapsule({ theme = "paper", className = "" }: Props) {
  const [state, setState] = useState<State>("idle");
  const [secs, setSecs] = useState(0);
  const [notes, setNotes] = useState<number[]>([]);
  const [dx, setDx] = useState(0);
  const bars = useRef<(HTMLSpanElement | null)[]>([]);
  const start = useRef<{ x: number; t: number } | null>(null);
  const armed = useRef(false);
  const raf = useRef(0);
  const levels = useRef<number[]>(Array(BARS).fill(0.08));

  const loop = () => {
    const t = performance.now();
    levels.current.push(level(t));
    levels.current.shift();
    bars.current.forEach((b, i) => b?.style.setProperty("--h", levels.current[i].toFixed(3)));
    if (start.current) setSecs((t - start.current.t) / 1000);
    raf.current = requestAnimationFrame(loop);
  };

  const begin = (x: number) => {
    start.current = { x, t: performance.now() };
    armed.current = false;
    setDx(0);
    setSecs(0);
    setState("rec");
    navigator.vibrate?.(10);
    cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(loop);
  };

  const finish = (cancel: boolean) => {
    cancelAnimationFrame(raf.current);
    const d = start.current ? (performance.now() - start.current.t) / 1000 : 0;
    start.current = null;
    setDx(0);
    if (cancel || d < 0.4) {
      setState("cancel");
      setTimeout(() => setState("idle"), 520);
      return;
    }
    setNotes((n) => [...n, d].slice(-3));
    setState("sent");
    setTimeout(() => setState("idle"), 700);
  };

  useEffect(() => () => cancelAnimationFrame(raf.current), []);

  const down = (e: PointerEvent<HTMLButtonElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    begin(e.clientX);
  };
  const move = (e: PointerEvent) => {
    if (!start.current) return;
    const d = Math.min(0, e.clientX - start.current.x);
    armed.current = d < -ARM;
    setDx(d);
    setState(armed.current ? "arming" : "rec");
  };
  const up = () => {
    if (start.current) finish(armed.current);
  };

  const mm = Math.floor(secs / 60);
  const ss = Math.floor(secs % 60);
  const recording = state === "rec" || state === "arming";

  return (
    <div className={`voice-capsule voice-capsule--${theme} ${className}`}>
      <ul className="voice-capsule__notes" aria-label="Voice notes">
        {notes.map((d, i) => (
          <li key={i}>
            <span aria-hidden="true">▶</span>
            Voice note · {`0:${String(Math.round(d)).padStart(2, "0")}`}
          </li>
        ))}
      </ul>

      <div className="voice-capsule__dock" data-state={state} style={{ "--dx": `${dx}px`, "--arm": Math.min(1, -dx / ARM) } as CSSProperties}>
        <div className="voice-capsule__capsule" aria-hidden="true">
          <span className="voice-capsule__rec" />
          <span className="voice-capsule__time">{`${mm}:${String(ss).padStart(2, "0")}`}</span>
          <span className="voice-capsule__hint">
            <span>‹</span> Slide to cancel
          </span>
          <span className="voice-capsule__wave">
            {Array.from({ length: BARS }, (_, i) => (
              <span key={i} ref={(el) => void (bars.current[i] = el)} />
            ))}
          </span>
        </div>
        <button
          type="button"
          className="voice-capsule__mic"
          aria-label={recording ? "Recording — release to send, Escape to cancel" : "Hold to record a voice note"}
          onPointerDown={down}
          onPointerMove={move}
          onPointerUp={up}
          onPointerCancel={() => start.current && finish(true)}
          onContextMenu={(e) => e.preventDefault()}
          onKeyDown={(e) => {
            if ((e.key === " " || e.key === "Enter") && !e.repeat && !start.current) {
              e.preventDefault();
              begin(0);
            }
            if (e.key === "Escape" && start.current) finish(true);
          }}
          onKeyUp={(e) => {
            if ((e.key === " " || e.key === "Enter") && start.current) finish(false);
          }}
        >
          <svg className="voice-capsule__glyph" viewBox="0 0 20 20" aria-hidden="true">
            <rect x="7.5" y="2.5" width="5" height="9.5" rx="2.5" />
            <path d="M4.5 9.5a5.5 5.5 0 0 0 11 0M10 15v2.5" />
          </svg>
          <svg className="voice-capsule__bin" viewBox="0 0 20 20" aria-hidden="true">
            <path d="M4.5 6h11M8 6V4.5h4V6M6 6l.7 9.5c.1.8.7 1.5 1.5 1.5h3.6c.8 0 1.4-.7 1.5-1.5L14 6" />
          </svg>
        </button>
      </div>
      <p className="voice-capsule__sr" aria-live="assertive">
        {state === "sent" ? "Voice note added" : state === "cancel" ? "Recording discarded" : state === "rec" ? "Recording" : ""}
      </p>
    </div>
  );
}
