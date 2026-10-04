"use client";

import { useEffect, useRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { bayer } from "../../media/dither-portrait/dither";
import "./dither-button.css";

/**
 * Dither Button
 * A button whose fill is printed in an ordered-dither pattern. At rest a dotted gradient
 * leans in from the left; on hover the threshold sweeps across and the face fills cell by
 * cell; pressing knocks the pixels outward and they settle back into the grid.
 */

type Props = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "color"> & {
  children: ReactNode;
  /** Pixel colour. */
  color?: string;
  /** Label colour once the face is filled. */
  inkOnFill?: string;
  /** CSS px per pixel. */
  cell?: number;
  motion?: "full" | "reduced";
};

export function DitherButton({ children, color = "#7c5cff", inkOnFill = "#ffffff", cell = 3, motion = "full", className = "", style, ...rest }: Props) {
  const btn = useRef<HTMLButtonElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const b = btn.current, cv = canvas.current;
    if (!b || !cv) return;
    const ctx = cv.getContext("2d")!;
    const reduced = motion === "reduced" || matchMedia("(prefers-reduced-motion: reduce)").matches;
    let w = 0, h = 0, cols = 0, rows = 0, dpr = 1, raf = 0, alive = true;
    const st = { p: 0, tp: 0 };
    let ox = new Float32Array(0), oy = new Float32Array(0), vx = new Float32Array(0), vy = new Float32Array(0);

    const size = () => {
      dpr = Math.min(devicePixelRatio || 1, 2);
      w = b.offsetWidth;
      h = b.offsetHeight;
      cv.width = Math.round(w * dpr);
      cv.height = Math.round(h * dpr);
      cols = Math.ceil(w / cell);
      rows = Math.ceil(h / cell);
      ox = new Float32Array(cols * rows);
      oy = new Float32Array(cols * rows);
      vx = new Float32Array(cols * rows);
      vy = new Float32Array(cols * rows);
      draw();
    };
    const draw = () => {
      ctx.clearRect(0, 0, cv.width, cv.height);
      ctx.fillStyle = color;
      const s = cell * dpr;
      for (let y = 0; y < rows; y++)
        for (let x = 0; x < cols; x++) {
          const u = x / Math.max(1, cols - 1);
          // Rest: a dotted gradient from the left. Hover: a front sweeps right, solid behind it.
          const rest = 0.34 * (1 - u) ** 1.6;
          const front = Math.max(0, Math.min(1, (st.p * 1.5 - u) * 2.4));
          const level = Math.max(rest, front);
          if (level <= bayer(x, y)) continue;
          const i = y * cols + x;
          ctx.fillRect((x * cell + ox[i]) * dpr, (y * cell + oy[i]) * dpr, s, s);
        }
    };
    const tick = () => {
      raf = 0;
      if (!alive) return;
      st.p += (st.tp - st.p) * (reduced ? 1 : 0.11);
      if (Math.abs(st.tp - st.p) < 0.002) st.p = st.tp;
      let moving = st.p !== st.tp;
      for (let i = 0; i < ox.length; i++) {
        if (!ox[i] && !oy[i] && !vx[i] && !vy[i]) continue;
        vx[i] = (vx[i] - ox[i] * 0.16) * 0.8;
        vy[i] = (vy[i] - oy[i] * 0.16) * 0.8;
        ox[i] += vx[i];
        oy[i] += vy[i];
        if (Math.abs(ox[i]) + Math.abs(oy[i]) + Math.abs(vx[i]) + Math.abs(vy[i]) < 0.02) ox[i] = oy[i] = vx[i] = vy[i] = 0;
        else moving = true;
      }
      b.style.setProperty("--db-fill", st.p.toFixed(3));
      draw();
      if (moving) raf = requestAnimationFrame(tick);
    };
    const wake = () => {
      if (!raf && alive) raf = requestAnimationFrame(tick);
    };
    const on = () => {
      st.tp = 1;
      wake();
    };
    const off = () => {
      if (b.matches(":focus-visible")) return;
      st.tp = 0;
      wake();
    };
    const press = (e: PointerEvent | KeyboardEvent) => {
      if (reduced) return;
      const r = b.getBoundingClientRect();
      const k = r.width / b.offsetWidth || 1;
      const px = "clientX" in e && e.clientX ? (e.clientX - r.left) / k : w / 2, py = "clientY" in e && e.clientY ? (e.clientY - r.top) / k : h / 2;
      for (let y = 0; y < rows; y++)
        for (let x = 0; x < cols; x++) {
          const dx = x * cell - px, dy = y * cell - py, d = Math.hypot(dx, dy) || 1;
          const f = Math.max(0, 1 - d / 120) * 7;
          const i = y * cols + x;
          vx[i] += (dx / d) * f;
          vy[i] += (dy / d) * f * 0.6;
        }
      wake();
    };
    const onKey = (e: KeyboardEvent) => (e.key === "Enter" || e.key === " ") && press(e);
    b.addEventListener("pointerenter", on);
    b.addEventListener("pointerleave", off);
    b.addEventListener("focus", on);
    b.addEventListener("blur", () => ((st.tp = 0), wake()));
    b.addEventListener("pointerdown", press);
    b.addEventListener("keydown", onKey);
    const ro = new ResizeObserver(size);
    ro.observe(b);
    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      ro.disconnect();
      b.removeEventListener("pointerenter", on);
      b.removeEventListener("pointerleave", off);
      b.removeEventListener("focus", on);
      b.removeEventListener("pointerdown", press);
      b.removeEventListener("keydown", onKey);
    };
  }, [color, cell, motion]);

  return (
    <button ref={btn} type="button" className={`db ${className}`} style={{ ["--db-color" as string]: color, ["--db-ink-fill" as string]: inkOnFill, ...style }} {...rest}>
      <canvas ref={canvas} className="db__pixels" aria-hidden="true" />
      <span className="db__label">{children}</span>
    </button>
  );
}
