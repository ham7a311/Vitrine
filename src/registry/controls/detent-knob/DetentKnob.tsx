"use client";

import { useCallback, useEffect, useId, useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent as RPointerEvent, type WheelEvent } from "react";
import "./detent-knob.css";

/**
 * Detent Knob
 * A machined knob you'd find on good studio gear. Turn it by dragging round
 * it (or up and down near the middle), with the wheel, or with the keys; it
 * clicks through detents, giving a tiny tick each time, while a ring of 31
 * lights fills to the value and a small display reads it out. The light on
 * the brushed metal stays put while the knurled body turns under it.
 */

type Props = {
  label?: string;
  unit?: string;
  min?: number;
  max?: number;
  step?: number;
  defaultValue?: number;
  value?: number;
  onChange?: (v: number) => void;
  theme?: "studio" | "bakelite";
  motion?: "full" | "reduced";
  className?: string;
};

const SWEEP = 270; // degrees from min to max
const LEDS = 31;

export function DetentKnob({ label = "Volume", unit = "%", min = 0, max = 100, step = 1, defaultValue = 62, value: controlled, onChange, theme = "studio", motion = "full", className = "" }: Props) {
  const id = useId();
  const [inner, setInner] = useState(defaultValue);
  const value = controlled ?? inner;
  const knobRef = useRef<HTMLDivElement>(null);
  const faceRef = useRef<HTMLDivElement>(null);
  const drag = useRef<{ mode: "turn" | "lift"; a: number; y: number; v: number } | null>(null);
  const lastStep = useRef(Math.round(value / step));

  const clamp = (v: number) => Math.min(max, Math.max(min, v));
  const snap = (v: number) => Math.round(v / step) * step;
  const set = useCallback((raw: number) => {
    const v = clamp(snap(raw));
    if (controlled === undefined) setInner(v);
    onChange?.(v);
    // A detent: a tiny press of the knob each time it clicks to a new step.
    const s = Math.round(v / step);
    if (s !== lastStep.current) {
      lastStep.current = s;
      const rm = motion === "reduced" || matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (!rm) faceRef.current?.animate([{ transform: "scale(0.985)" }, { transform: "scale(1)" }], { duration: 90, easing: "ease-out" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [controlled, onChange, min, max, step, motion]);

  const t = (value - min) / (max - min);
  const angle = -SWEEP / 2 + t * SWEEP;

  const centre = () => {
    const r = knobRef.current!.getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top + r.height / 2, R: r.width / 2 };
  };
  const onDown = (e: RPointerEvent) => {
    if (e.button !== 0) return;
    const c = centre();
    const dx = e.clientX - c.x, dy = e.clientY - c.y;
    // Near the middle you lift it up and down; out on the rim you turn it round.
    const mode = Math.hypot(dx, dy) > c.R * 0.42 ? "turn" : "lift";
    drag.current = { mode, a: Math.atan2(dy, dx), y: e.clientY, v: value };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    knobRef.current?.focus();
    e.preventDefault();
  };
  const onMove = (e: RPointerEvent) => {
    const d = drag.current;
    if (!d) return;
    const range = max - min;
    if (d.mode === "turn") {
      const c = centre();
      const a = Math.atan2(e.clientY - c.y, e.clientX - c.x);
      let da = a - d.a;
      if (da > Math.PI) da -= Math.PI * 2;
      if (da < -Math.PI) da += Math.PI * 2;
      d.a = a;
      d.v = clamp(d.v + ((da * 180) / Math.PI / SWEEP) * range);
    } else {
      d.v = clamp(d.v + ((d.y - e.clientY) / 220) * range);
      d.y = e.clientY;
    }
    set(d.v);
  };
  const onUp = () => { drag.current = null; };
  const onKey = (e: KeyboardEvent) => {
    const big = Math.max(step, (max - min) / 10);
    const map: Record<string, number> = { ArrowUp: step, ArrowRight: step, ArrowDown: -step, ArrowLeft: -step, PageUp: big, PageDown: -big };
    if (e.key in map) { e.preventDefault(); set(value + map[e.key]); }
    else if (e.key === "Home") { e.preventDefault(); set(min); }
    else if (e.key === "End") { e.preventDefault(); set(max); }
  };

  // The wheel turns it only while the pointer is over it; the page doesn't scroll then.
  useEffect(() => {
    const el = knobRef.current;
    if (!el) return;
    const onWheel = (e: globalThis.WheelEvent) => { e.preventDefault(); };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);
  const onWheel = (e: WheelEvent) => set(value + (e.deltaY < 0 ? step : -step) * (e.shiftKey ? 5 : 1));

  const lit = Math.round(t * (LEDS - 1));
  return (
    <div className={`dk dk--${theme} ${className}`} data-motion={motion}>
      <div className="dk__panel">
        <div className="dk__ring" aria-hidden="true">
          {Array.from({ length: LEDS }, (_, i) => {
            const a = -SWEEP / 2 + (i / (LEDS - 1)) * SWEEP;
            return <i key={i} className="dk__led" data-on={i <= lit || undefined} data-head={i === lit || undefined} style={{ ["--a" as string]: `${a}deg`, ["--k" as string]: i / (LEDS - 1) } as CSSProperties} />;
          })}
          <span className="dk__end dk__end--min">{min}</span>
          <span className="dk__end dk__end--max">{max}</span>
        </div>
        <div
          ref={knobRef}
          className="dk__knob"
          role="slider"
          tabIndex={0}
          aria-label={label}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={value}
          aria-valuetext={`${value}${unit}`}
          aria-describedby={`${id}-hint`}
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerUp={onUp}
          onPointerCancel={onUp}
          onKeyDown={onKey}
          onWheel={onWheel}
          onDoubleClick={() => set(defaultValue)}
        >
          <div ref={faceRef} className="dk__face">
            {/* The body turns; the light on it does not. */}
            <div className="dk__turn" style={{ transform: `rotate(${angle}deg)` }}>
              <div className="dk__knurl" />
              <i className="dk__mark" />
            </div>
            <div className="dk__cap" />
          </div>
        </div>
        <div className="dk__lcd" aria-hidden="true">
          <span className="dk__lab">{label}</span>
          <span className="dk__val">{String(value).padStart(3, " ")}<small>{unit}</small></span>
        </div>
      </div>
      <p id={`${id}-hint`} className="dk__hint">Drag round the rim, or up and down · scroll · arrow keys · double-click resets</p>
    </div>
  );
}
