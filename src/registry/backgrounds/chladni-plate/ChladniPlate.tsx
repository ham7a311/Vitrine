"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { FIGURES, Sand, ease, mix, plate, seeded, type Mode } from "./chladni";
import "./chladni-plate.css";

/**
 * Chladni Plate
 * Sand on a plate that is being played like an instrument. Where the plate moves, grains are thrown about;
 * where it stands still, they collect, and the lines they draw are the shape of the note. Every few seconds
 * the note glides to another and the figure re-forms. Moving the pointer across it bows the plate there.
 */

type Props = {
  /** The notes it moves through, in order. */
  figures?: Mode[];
  grain?: string;
  ground?: string;
  /** Grains per 1,000 square pixels. */
  density?: number;
  /** Seconds a figure rests before the note moves on. */
  hold?: number;
  /** One side of the plate, as a share of the frame's shorter side. */
  scale?: number;
  /** Thins the sand where content sits, so text stays easy to read. */
  calm?: "none" | "left" | "center" | "right";
  interactive?: boolean;
  motion?: "full" | "reduced";
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
};

const GLIDE = 3.4;

export function ChladniPlate({ figures = FIGURES, grain = "#efe4c4", ground = "#0c0b08", density = 13, hold = 7, scale = 1.08, calm = "none", interactive = true, motion = "full", className = "", style, children }: Props) {
  const host = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const el = host.current!, cv = canvas.current!, ctx = cv.getContext("2d");
    if (!ctx || !figures.length) return;
    const reduced = motion === "reduced" || matchMedia("(prefers-reduced-motion: reduce)").matches;
    let W = 0, H = 0, dpr = 1, side = 1, sand: Sand | null = null;
    let raf = 0, alive = true, visible = true, started = 0, last = 0;

    const draw = () => {
      if (!sand) return;
      ctx.clearRect(0, 0, cv.width, cv.height);
      ctx.fillStyle = grain;
      ctx.globalAlpha = 0.84;
      const s = Math.max(1, 1.3 * dpr), big = s * 1.55;
      for (let i = 0; i < sand.count; i++) {
        const r = i % 9 === 0 ? big : s;
        ctx.fillRect(sand.x[i] * dpr - r / 2, sand.y[i] * dpr - r / 2, r, r);
      }
    };

    /** Where the note is at time t: resting on a figure, or gliding to the next. */
    const note = (t: number) => {
      const span = hold + GLIDE, k = Math.floor(t / span), into = t - k * span;
      const a = figures[k % figures.length], b = figures[(k + 1) % figures.length];
      const g = into <= hold ? 0 : (into - hold) / GLIDE;
      return { mode: mix(a, b, ease(g)), glide: g };
    };

    const size = () => {
      const r = el.getBoundingClientRect();
      const w = Math.max(1, Math.round(el.offsetWidth)), h = Math.max(1, Math.round(el.offsetHeight));
      if (w === W && h === H) return;
      W = w; H = h;
      // Big frames get a lower pixel ratio: the picture is grain, and grain doesn't need retina.
      dpr = Math.min(window.devicePixelRatio || 1, W * H > 900_000 ? 1.5 : 2) * (r.width / w || 1);
      cv.width = Math.round(W * dpr);
      cv.height = Math.round(H * dpr);
      side = Math.min(W, H) * scale;
      const count = Math.round(Math.min(reduced ? 6000 : 16000, Math.max(900, (W * H * density) / 1000)));
      if (!sand || sand.count !== count) sand = new Sand(count, W, H, reduced ? seeded(7) : Math.random);
      else sand.resize(W, H);
      if (reduced) {
        // No animation: settle the first figure out of sight and show it finished.
        sand.scatter();
        const f = plate(figures[0], side, (W - side) / 2, (H - side) / 2);
        for (let i = 0; i < 170; i++) sand.step(f, { shake: i < 120 ? 2.6 : 1 });
      }
      draw();
    };

    const tick = (now: number) => {
      raf = 0;
      if (!alive || !visible || document.hidden || !sand) return;
      if (!started) started = now;
      // After a pause, carry on from where the note was rather than jumping ahead.
      if (last && now - last > 400) started += now - last;
      last = now;
      const { mode, glide } = note((now - started) / 1000);
      const moving = glide > 0 ? Math.sin(Math.PI * glide) : 0;
      sand.step(plate(mode, side, (W - side) / 2, (H - side) / 2), { shake: 2.6 + moving * 3.2, drift: 1.5 + moving * 0.6 });
      draw();
      raf = requestAnimationFrame(tick);
    };
    const wake = () => {
      if (!reduced && !raf && alive) raf = requestAnimationFrame(tick);
    };

    const onMove = (e: PointerEvent) => {
      if (!sand || reduced) return;
      const r = el.getBoundingClientRect(), k = r.width / el.offsetWidth || 1;
      sand.kick((e.clientX - r.left) / k, (e.clientY - r.top) / k, Math.min(W, H) * 0.16, 1.5);
    };
    if (interactive) el.addEventListener("pointermove", onMove);
    const ro = new ResizeObserver(() => { size(); wake(); });
    ro.observe(el);
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible) wake(); });
    io.observe(el);
    const onVis = () => !document.hidden && wake();
    document.addEventListener("visibilitychange", onVis);
    size();
    wake();
    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      el.removeEventListener("pointermove", onMove);
    };
  }, [figures, grain, density, hold, scale, interactive, motion]);

  return (
    <div ref={host} className={`chl chl--calm-${calm} ${className}`} style={{ background: ground, ...style }}>
      <canvas ref={canvas} className="chl__sand" aria-hidden="true" />
      {children && <div className="chl__content">{children}</div>}
    </div>
  );
}

export default ChladniPlate;
