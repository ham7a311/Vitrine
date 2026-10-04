"use client";

import { useEffect, useId, useRef, useState, type CSSProperties } from "react";
import "./thinking-trace.css";

/**
 * Thinking Trace
 * A loader that is also a log. The live step's text carries its own shimmer
 * (a moving gradient clipped to the letters) and a mono timer; finished steps
 * collect underneath in a disclosure, each with how long it took. When the
 * work ends the line settles into "Thought for 12s".
 */

export type Step = { label: string; ms: number };

type Props = { steps: Step[]; loop?: boolean; theme?: "paper" | "night"; className?: string };

const fmt = (ms: number) => (ms < 1000 ? `${ms}ms` : `${(ms / 1000).toFixed(1)}s`);

export function ThinkingTrace({ steps, loop = true, theme = "paper", className = "" }: Props) {
  const uid = useId();
  const [at, setAt] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [open, setOpen] = useState(false);
  const [run, setRun] = useState(0);
  const t0 = useRef(0), stepStart = useRef(0);
  const done = at >= steps.length;
  const total = steps.reduce((a, s) => a + s.ms, 0);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setAt(0); setElapsed(0);
    t0.current = performance.now(); stepStart.current = t0.current;
    let i = 0, raf = 0;
    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      setElapsed(now - t0.current);
      if (i < steps.length && now - stepStart.current >= steps[i].ms) { i++; stepStart.current = now; setAt(i); }
      if (i >= steps.length) cancelAnimationFrame(raf);
    };
    if (reduce) { setAt(steps.length); setElapsed(total); } else raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [run, steps, total]);

  useEffect(() => {
    if (!done || !loop) return;
    const t = setTimeout(() => setRun((r) => r + 1), 4200);
    return () => clearTimeout(t);
  }, [done, loop]);

  const secs = Math.round((done ? total : elapsed) / 1000);

  return (
    <div className={`thinking-trace thinking-trace--${theme} ${className}`} data-done={done || undefined}>
      <button type="button" className="thinking-trace__head" aria-expanded={open} aria-controls={`${uid}-log`} onClick={() => setOpen((o) => !o)}>
        <span className="thinking-trace__orb" aria-hidden="true" />
        <span key={done ? "done" : at} className="thinking-trace__now">
          {done ? `Thought for ${secs}s` : steps[at].label}
        </span>
        {!done && <span className="thinking-trace__timer">{(elapsed / 1000).toFixed(1)}s</span>}
        <svg className="thinking-trace__chev" viewBox="0 0 16 16" aria-hidden="true"><path d="M6 4l4 4-4 4" /></svg>
      </button>

      <div id={`${uid}-log`} className="thinking-trace__log" data-open={open || undefined}>
        <ol>
          {steps.slice(0, at).map((s, i) => (
            <li key={i} style={{ "--i": i } as CSSProperties}>
              <span className="thinking-trace__dot" aria-hidden="true" />
              <span className="thinking-trace__label">{s.label}</span>
              <span className="thinking-trace__ms">{fmt(s.ms)}</span>
            </li>
          ))}
          {!done && (
            <li className="thinking-trace__pending"><span className="thinking-trace__dot" aria-hidden="true" /><span className="thinking-trace__label">{steps[at].label}</span><span className="thinking-trace__ms">…</span></li>
          )}
        </ol>
      </div>
      <p className="thinking-trace__sr" aria-live="polite">{done ? `Finished thinking in ${secs} seconds` : steps[at].label}</p>
    </div>
  );
}
