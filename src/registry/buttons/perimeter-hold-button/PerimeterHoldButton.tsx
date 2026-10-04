"use client";

import { useCallback, useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import "./perimeter-hold-button.css";

/**
 * Perimeter Hold Button
 * Hold to confirm. While pressed, a line traces the button's outline from the
 * top centre; let go early and it unwinds. Complete the lap and the action
 * fires, the outline flashes, and the label settles into its confirmed state.
 */

type Props = {
  label?: string;
  confirmedLabel?: string;
  /** Hold duration in ms. */
  duration?: number;
  onConfirm: () => void;
  /** ms before resetting after confirming. */
  resetAfter?: number;
  className?: string;
};

function outline(w: number, h: number, r: number) {
  const i = 0.75; // inset so the stroke isn't clipped
  const W = w - i;
  const H = h - i;
  r = Math.min(r, (h - 2 * i) / 2);
  return `M ${w / 2} ${i} H ${W - r} A ${r} ${r} 0 0 1 ${W} ${i + r} V ${H - r} A ${r} ${r} 0 0 1 ${W - r} ${H} H ${i + r} A ${r} ${r} 0 0 1 ${i} ${H - r} V ${i + r} A ${r} ${r} 0 0 1 ${i + r} ${i} Z`;
}

export function PerimeterHoldButton({ label = "Hold to delete", confirmedLabel = "Deleted", duration = 1200, onConfirm, resetAfter = 2200, className = "" }: Props) {
  const ref = useRef<HTMLButtonElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const [d, setD] = useState("");
  const [done, setDone] = useState(false);
  const hintId = useId();
  const st = useRef({ p: 0, holding: false, last: 0, raf: 0 });

  // Build the outline path from the real size so the trace follows the shape exactly.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setD(outline(el.offsetWidth, el.offsetHeight, 14)));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const paint = () => {
    pathRef.current?.style.setProperty("stroke-dashoffset", String(1 - st.current.p));
    ref.current?.style.setProperty("--ph-p", st.current.p.toFixed(3));
  };

  const tick = useCallback(
    (now: number) => {
      const s = st.current;
      const dt = s.last ? now - s.last : 16;
      s.last = now;
      // fill while held, unwind twice as fast when released
      s.p = Math.min(1, Math.max(0, s.p + (s.holding ? dt / duration : (-dt / duration) * 2)));
      paint();
      if (s.p >= 1) {
        s.raf = 0;
        s.holding = false;
        setDone(true);
        navigator.vibrate?.(12);
        onConfirm();
        return;
      }
      s.raf = s.p > 0 || s.holding ? requestAnimationFrame(tick) : 0;
    },
    [duration, onConfirm],
  );

  const start = () => {
    if (done) return;
    const s = st.current;
    s.holding = true;
    s.last = 0;
    if (!s.raf) s.raf = requestAnimationFrame(tick);
  };
  const stop = () => {
    const s = st.current;
    s.holding = false;
    s.last = 0;
    if (!s.raf && s.p > 0) s.raf = requestAnimationFrame(tick);
  };

  useEffect(() => {
    if (!done) return;
    const id = setTimeout(() => {
      st.current.p = 0;
      paint();
      setDone(false);
    }, resetAfter);
    return () => clearTimeout(id);
  }, [done, resetAfter]);

  useEffect(() => () => cancelAnimationFrame(st.current.raf), []);

  const onKeyDown = (e: KeyboardEvent) => {
    if ((e.key === " " || e.key === "Enter") && !e.repeat) {
      e.preventDefault();
      start();
    }
  };
  const onKeyUp = (e: KeyboardEvent) => {
    if (e.key === " " || e.key === "Enter") stop();
  };

  return (
    <button
      ref={ref}
      type="button"
      className={`ph ${done ? "ph--done" : ""} ${className}`}
      aria-describedby={hintId}
      onPointerDown={(e) => {
        e.currentTarget.setPointerCapture(e.pointerId);
        start();
      }}
      onPointerUp={stop}
      onPointerCancel={stop}
      onKeyDown={onKeyDown}
      onKeyUp={onKeyUp}
      onBlur={stop}
      onContextMenu={(e) => e.preventDefault()}
    >
      <svg className="ph__trace" aria-hidden="true">
        <path className="ph__track" d={d} />
        <path ref={pathRef} className="ph__line" d={d} pathLength={1} />
      </svg>
      <span className="ph__labels">
        <span className="ph__label" data-on={!done || undefined}>
          {label}
        </span>
        <span className="ph__label ph__label--done" data-on={done || undefined}>
          <svg viewBox="0 0 20 20" aria-hidden="true">
            <path d="M4.5 10.5 8.2 14 15.5 6.5" pathLength={1} />
          </svg>
          {confirmedLabel}
        </span>
      </span>
      <span id={hintId} className="ph__sr">
        Press and hold to confirm.
      </span>
      <span className="ph__sr" aria-live="assertive">
        {done ? confirmedLabel : ""}
      </span>
    </button>
  );
}
