"use client";

import { useEffect, useRef, type HTMLAttributes, type ReactNode } from "react";
import "./komorebi.css";

/**
 * Komorebi
 * Sunlight through leaves, on a wall. Soft discs of light, each one a blurred image of the sun through a gap
 * in the canopy, sway together as the branches move and wink out as leaves cross them. Low contrast and warm,
 * so text sits on it without a scrim; one side is kept calmer for a headline.
 */

type Palette = "plaster" | "clay" | "moon";
type Props = HTMLAttributes<HTMLDivElement> & {
  children?: ReactNode;
  palette?: Palette;
  /** The side kept mostly in shade, for content. */
  calm?: "left" | "right" | "none";
  /** How hard the wind blows, 0 to 2. */
  wind?: number;
  motion?: "full" | "still";
};

/** The wall in shade, the wall in sun, and the shadow of a leaf. */
const PALETTES: Record<Palette, [string, string, string]> = {
  plaster: ["#e4dccd", "#fffaf0", "#cfc5b2"],
  clay: ["#cf9c7f", "#f9d9b6", "#b98267"],
  moon: ["#141b24", "#3d5066", "#0d131b"],
};

/** A small repeatable random source, so the same wall is drawn on every visit. */
function seeded(seed: number) {
  let s = seed >>> 0;
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
}

export function Komorebi({ children, palette = "plaster", calm = "left", wind = 1, motion = "full", className = "", ...rest }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const el = ref.current!, cv = canvas.current!, ctx = cv.getContext("2d");
    if (!ctx) return;
    const [shade, sun, leaf] = PALETTES[palette];
    const still = motion === "still" || matchMedia("(prefers-reduced-motion: reduce)").matches;
    const rand = seeded(7);
    // Gaps in the canopy come in clusters, one per branch; a branch moves as one.
    const branches = Array.from({ length: 7 }, () => ({ x: rand(), y: rand(), phase: rand() * 6.28, speed: 0.5 + rand() * 0.5 }));
    const spot = (spread: number, big: number) => {
      const b = Math.floor(rand() * branches.length);
      return { b, dx: (rand() - 0.5) * spread, dy: (rand() - 0.5) * spread, r: 0.018 + rand() * big, phase: rand() * 6.28, blink: 0.25 + rand() * 0.6 };
    };
    const lights = Array.from({ length: 110 }, () => spot(0.46, 0.05));
    const leaves = Array.from({ length: 54 }, () => spot(0.6, 0.04));
    let w = 1, h = 1, raf = 0, frame = 0, visible = true, alive = true;

    const resize = () => {
      // A fifth of the size is plenty: the picture is blurred on the way up.
      w = cv.width = Math.max(40, Math.round(el.offsetWidth / 5));
      h = cv.height = Math.max(30, Math.round(el.offsetHeight / 5));
      draw(performance.now());
    };
    const disc = (x: number, y: number, r: number, colour: string, alpha: number) => {
      if (alpha <= 0.01) return;
      const g = ctx.createRadialGradient(x, y, 0, x, y, r);
      g.addColorStop(0, colour);
      g.addColorStop(0.4, colour);
      // Fade to the same colour at no opacity: fading to plain "transparent" passes through grey and rings every disc.
      g.addColorStop(1, `${colour}00`);
      ctx.globalAlpha = alpha;
      ctx.fillStyle = g;
      // The sun's image on a wall is a little taller than wide.
      ctx.beginPath();
      ctx.ellipse(x, y, r, r * 1.25, -0.5, 0, 6.2832);
      ctx.fill();
    };
    const draw = (now: number) => {
      const t = still ? 12 : now / 1000, scale = Math.max(w, h);
      ctx.globalAlpha = 1;
      ctx.fillStyle = shade;
      ctx.fillRect(0, 0, w, h);
      const at = (s: (typeof lights)[number], lag: number) => {
        const b = branches[s.b];
        // A slow sway for the branch, a quicker tremble for the leaf.
        const sway = Math.sin(t * 0.32 * b.speed + b.phase) * 0.022 + Math.sin(t * 0.83 * b.speed + b.phase * 2 + lag) * 0.009;
        const tremble = Math.sin(t * 1.9 + s.phase) * 0.004;
        return [(b.x + s.dx + (sway + tremble) * wind) * w, (b.y + s.dy + sway * 0.4 * wind + Math.cos(t * 1.4 + s.phase) * 0.003 * wind) * h];
      };
      // Keep one side mostly in shade.
      const keep = (x: number) => (calm === "none" ? 1 : Math.min(1, Math.max(0.12, ((calm === "left" ? x / w : 1 - x / w) - 0.18) * 2.4)));
      for (const s of lights) {
        const [x, y] = at(s, 0);
        const open = Math.min(1, Math.max(0, Math.sin(t * 0.21 * s.blink + s.phase) * 0.8 + 0.55));
        disc(x, y, s.r * scale, sun, 0.62 * open * keep(x));
      }
      for (const s of leaves) {
        const [x, y] = at(s, 1.3);
        disc(x, y, s.r * scale * 0.6, leaf, 0.22 * keep(x));
      }
    };
    const tick = (now: number) => {
      raf = 0;
      if (!alive || !visible || document.hidden) return;
      // Slow movement: every other frame is enough.
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
  }, [palette, calm, wind, motion]);

  return (
    <div ref={ref} className={`komo komo--${palette} ${className}`} {...rest}>
      <canvas ref={canvas} className="komo__light" aria-hidden="true" />
      {children && <div className="komo__content">{children}</div>}
    </div>
  );
}

export default Komorebi;
