"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { ease, inked, solidTo } from "./dither";
import "./dither-fill.css";

/**
 * Dither Fill
 * A highlight printed in pixels: the fill arrives as a 4×4 ordered dither —
 * a speckled front that sweeps across and darkens to solid behind it — and the
 * far end stays dithered, fading out like an old screen print. The letters
 * turn to the ink colour exactly where the fill under them is solid. Point at
 * it to run the sweep again.
 */

type Props = {
  children: ReactNode;
  color?: string;
  /** Pixel size in CSS pixels. */
  cell?: number;
  /** Sweep length (ms). */
  duration?: number;
  /** Wait before printing (ms). */
  delay?: number;
  theme?: "night" | "paper";
  className?: string;
};

export function DitherFill({ children, color, cell = 3, duration = 1100, delay = 150, theme = "night", className = "" }: Props) {
  const root = useRef<HTMLSpanElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const progress = useRef(0);
  const frame = useRef(0);
  const shown = useRef(false);

  const draw = useCallback(() => {
    const c = canvas.current, el = root.current;
    if (!c || !el) return;
    const dpr = Math.min(3, window.devicePixelRatio || 1);
    const w = c.clientWidth, h = c.clientHeight;
    if (c.width !== Math.round(w * dpr) || c.height !== Math.round(h * dpr)) { c.width = Math.round(w * dpr); c.height = Math.round(h * dpr); }
    const ctx = c.getContext("2d");
    if (!ctx) return;
    // The inked copy of the words is uncovered exactly as far as the fill is solid.
    el.style.setProperty("--solid", `${(solidTo(progress.current) * 100).toFixed(2)}%`);
    ctx.clearRect(0, 0, c.width, c.height);
    ctx.fillStyle = window.getComputedStyle(el).getPropertyValue("--dither").trim() || "#7cff8a";
    // Whole device pixels per cell, so every cell is crisp.
    const s = Math.max(1, Math.round(cell * dpr));
    const cols = Math.ceil(c.width / s), rows = Math.ceil(c.height / s);
    for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) if (inked(i, j, cols, progress.current)) ctx.fillRect(i * s, j * s, s, s);
  }, [cell]);

  const run = useCallback((wait: number) => {
    cancelAnimationFrame(frame.current);
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) { progress.current = 1; draw(); return; }
    const start = performance.now() + wait;
    const tick = (now: number) => {
      progress.current = ease((now - start) / duration);
      draw();
      if (now - start < duration) frame.current = requestAnimationFrame(tick);
    };
    frame.current = requestAnimationFrame(tick);
  }, [draw, duration]);

  useLayoutEffect(() => {
    const c = canvas.current;
    if (!c) return;
    const ro = new ResizeObserver(draw);
    ro.observe(c);
    return () => ro.disconnect();
  }, [draw]);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      shown.current = true;
      run(delay);
    }, { threshold: 0.8 });
    io.observe(el);
    return () => { io.disconnect(); cancelAnimationFrame(frame.current); };
  }, [delay, run]);

  return (
    <span
      ref={root}
      className={`dithfill dithfill--${theme} ${className}`}
      style={color ? ({ ["--dither" as string]: color } as CSSProperties) : undefined}
      onPointerEnter={() => { if (shown.current && progress.current >= 1) run(0); }}
    >
      <canvas ref={canvas} className="dithfill__canvas" aria-hidden="true" />
      <span className="dithfill__text">{children}</span>
      <span className="dithfill__ink" aria-hidden="true">{children}</span>
    </span>
  );
}

export default DitherFill;
