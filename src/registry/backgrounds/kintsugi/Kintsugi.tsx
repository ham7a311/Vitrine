"use client";

import { useEffect, useRef, type HTMLAttributes, type ReactNode } from "react";
import "./kintsugi.css";

/**
 * Kintsugi
 * A glazed surface mended with gold. Fine seams run out from one point, the way a bowl breaks, and fill with
 * gold from the centre outward; now and then light runs along them. After a while the piece is mended
 * somewhere else. Most of the surface stays flat and dark, so content sits on it easily.
 */

type Palette = "ink" | "celadon" | "oxblood";
type Props = HTMLAttributes<HTMLDivElement> & {
  children?: ReactNode;
  palette?: Palette;
  /** Where the break starts, each 0 to 1 across the section. */
  origin?: [number, number];
  /** Seconds a mend stays before the next one. */
  hold?: number;
  motion?: "full" | "still";
};

/** Gold in shadow, gold, and gold catching the light. */
const GOLD: Record<Palette, [string, string, string]> = {
  ink: ["#8a6a2c", "#d8b468", "#fff1c9"],
  celadon: ["#8f6a22", "#b98a34", "#f6dc9a"],
  oxblood: ["#96702c", "#e0bb72", "#fff3d2"],
};

export type Seam = { points: [number, number][]; from: number; width: number };

/** A small repeatable random source. */
function seeded(seed: number) {
  let s = seed >>> 0;
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
}

/**
 * Break a `w × h` sheet from one point. Each seam is a wandering line; some fork. `from` is how far along the
 * break, in pixels from the origin, the seam begins, so the gold can be poured outward in order.
 */
export function fracture(w: number, h: number, ox: number, oy: number, seed: number): Seam[] {
  const rand = seeded(seed), seams: Seam[] = [];
  const grow = (x: number, y: number, angle: number, from: number, width: number, depth: number) => {
    const points: [number, number][] = [[x, y]], heading = angle;
    let travelled = from;
    for (let i = 0; i < 400 && x > -20 && y > -20 && x < w + 20 && y < h + 20; i++) {
      const step = 16 + rand() * 22;
      // A crack wanders but keeps its heading: it never curls back on itself.
      angle += (rand() - 0.5) * 0.7 + (heading - angle) * 0.22;
      x += Math.cos(angle) * step;
      y += Math.sin(angle) * step;
      travelled += step;
      points.push([x, y]);
      // A fork leaves at a sharp angle and is always finer than the seam it left.
      if (depth < 2 && rand() < 0.06) grow(x, y, angle + (rand() < 0.5 ? -1 : 1) * (0.5 + rand() * 0.7), travelled, width * 0.6, depth + 1);
      // Fine seams give out before the edge.
      if (depth > 0 && rand() < 0.045 * depth) break;
    }
    seams.push({ points, from, width });
  };
  const rays = 4 + Math.floor(rand() * 3), turn = rand() * 6.28;
  for (let i = 0; i < rays; i++) grow(ox, oy, turn + (i / rays) * 6.28 + (rand() - 0.5) * 0.7, 0, 1.4 + rand() * 0.9, 0);
  return seams;
}

export function Kintsugi({ children, palette = "ink", origin = [0.7, 0.4], hold = 16, motion = "full", className = "", ...rest }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const [ox, oy] = origin;

  useEffect(() => {
    const el = ref.current!, cv = canvas.current!, ctx = cv.getContext("2d");
    if (!ctx) return;
    const [deep, gold, bright] = GOLD[palette];
    const still = motion === "still" || matchMedia("(prefers-reduced-motion: reduce)").matches;
    const POUR = 7, FADE = 2.5;
    let w = 1, h = 1, dpr = 1, seams: Seam[] = [], reach = 1, seed = 11, born = performance.now();
    let raf = 0, frame = 0, visible = true, alive = true;

    const mend = () => {
      seams = fracture(w, h, w * ox, h * oy, seed);
      reach = Math.hypot(Math.max(ox, 1 - ox) * w, Math.max(oy, 1 - oy) * h) * 1.25;
    };
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = el.offsetWidth;
      h = el.offsetHeight;
      cv.width = Math.round(w * dpr);
      cv.height = Math.round(h * dpr);
      mend();
      draw(performance.now());
    };
    // One pass over every seam, drawing only the part the gold has reached, between `a` and `b` pixels out.
    const stroke = (a: number, b: number, colour: string, alpha: number, extra: number) => {
      ctx.strokeStyle = colour;
      ctx.globalAlpha = alpha;
      for (const s of seams) {
        let at = s.from, open = false;
        ctx.lineWidth = s.width + extra;
        ctx.beginPath();
        for (let i = 1; i < s.points.length; i++) {
          const [x0, y0] = s.points[i - 1], [x1, y1] = s.points[i], len = Math.hypot(x1 - x0, y1 - y0);
          const lo = Math.max(a, at), hi = Math.min(b, at + len);
          if (hi > lo) {
            const p = (lo - at) / len, q = (hi - at) / len;
            if (!open || p > 0) ctx.moveTo(x0 + (x1 - x0) * p, y0 + (y1 - y0) * p);
            ctx.lineTo(x0 + (x1 - x0) * q, y0 + (y1 - y0) * q);
            open = q === 1;
          } else open = false;
          at += len;
        }
        ctx.stroke();
      }
    };
    const draw = (now: number) => {
      const age = still ? POUR + 1 : (now - born) / 1000;
      const poured = Math.min(1, age / POUR), eased = 1 - Math.pow(1 - poured, 2.2);
      const fade = still ? 1 : Math.min(1, Math.max(0, (POUR + hold + FADE - age) / FADE));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      ctx.lineCap = ctx.lineJoin = "round";
      const far = eased * reach;
      stroke(0, far, gold, 0.13 * fade, 7);
      stroke(0, far, deep, fade, 1.1);
      stroke(0, far, gold, fade, 0);
      // The wet edge of the gold while it pours, then a glint that runs outward every few seconds.
      if (!still && poured < 1) stroke(far - 46, far, bright, 0.9 * fade, 0.3);
      if (!still && poured >= 1) {
        const glint = (((age - POUR) % 6.5) / 2.6) * reach;
        if (glint < reach) stroke(glint - 70, glint, bright, 0.75 * fade, 0.2);
      }
      ctx.globalAlpha = 1;
      if (!still && age > POUR + hold + FADE) { seed += 7; born = now; mend(); }
    };
    const tick = (now: number) => {
      raf = 0;
      if (!alive || !visible || document.hidden) return;
      if (frame++ % 2 === 0) draw(now);
      raf = requestAnimationFrame(tick);
    };
    const wake = () => { if (!still && !raf && alive) raf = requestAnimationFrame(tick); };

    const ro = new ResizeObserver(resize);
    ro.observe(el);
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible) wake(); });
    io.observe(el);
    const onVisible = () => { if (!document.hidden) wake(); };
    document.addEventListener("visibilitychange", onVisible);
    resize();
    wake();
    return () => { alive = false; cancelAnimationFrame(raf); ro.disconnect(); io.disconnect(); document.removeEventListener("visibilitychange", onVisible); };
  }, [palette, ox, oy, hold, motion]);

  return (
    <div ref={ref} className={`kints kints--${palette} ${className}`} {...rest}>
      <canvas ref={canvas} className="kints__seams" aria-hidden="true" />
      {children && <div className="kints__content">{children}</div>}
    </div>
  );
}

export default Kintsugi;
