"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Gravity Grid
 * Every element inside with a `data-mass` attribute is measured and treated as
 * a mass. Grid points are pulled toward the nearest edge of each mass with an
 * exponential falloff (never past it), lines brighten slightly as they bend,
 * and fade to nothing inside the content so text sits on clean ground.
 * It only redraws when layout changes or the (very light) pointer mass moves.
 */

type Props = {
  children?: ReactNode;
  color?: string;
  background?: string;
  spacing?: number;
  /** Overall pull, 0–2. */
  strength?: number;
  /** Mass of the pointer; 0 turns it off. */
  pointer?: number;
  className?: string;
};

type Mass = { x0: number; y0: number; x1: number; y1: number; m: number };

export function GravityGrid({ children, color = "#b9cce4", background = "#0a0c10", spacing = 30, strength = 1, pointer = 0.35, className = "" }: Props) {
  const wrap = useRef<HTMLDivElement>(null);
  const cv = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const box = wrap.current!, canvas = cv.current!, ctx = canvas.getContext("2d")!;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const [r, g, b] = [1, 3, 5].map((i) => parseInt(color.slice(i, i + 2), 16));
    let w = 0, h = 0, masses: Mass[] = [];
    let px = -1e4, py = -1e4, tx = -1e4, ty = -1e4, pm = 0, tpm = 0, raf = 0;

    const measure = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const br = box.getBoundingClientRect();
      w = br.width; h = br.height;
      canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      masses = Array.from(box.querySelectorAll<HTMLElement>("[data-mass]")).map((el) => {
        const e = el.getBoundingClientRect();
        return { x0: e.left - br.left, y0: e.top - br.top, x1: e.right - br.left, y1: e.bottom - br.top, m: parseFloat(el.dataset.mass || "1") || 1 };
      });
      draw();
    };

    // displacement of one grid point, plus how "inside" content it is (0..1)
    const field = (x: number, y: number): [number, number, number, number] => {
      let dx = 0, dy = 0, heat = 0, hide = 0;
      const all = pm > 0.01 ? masses.concat([{ x0: px, y0: py, x1: px, y1: py, m: pm }]) : masses;
      for (const M of all) {
        const pad = M.x0 === M.x1 ? 0 : 10;
        const qx = Math.max(M.x0 - pad, Math.min(x, M.x1 + pad));
        const qy = Math.max(M.y0 - pad, Math.min(y, M.y1 + pad));
        const vx = qx - x, vy = qy - y, d = Math.hypot(vx, vy);
        if (d < 0.001) { hide = Math.max(hide, 1); continue; }
        const size = Math.sqrt(Math.max(1, (M.x1 - M.x0) * (M.y1 - M.y0)));
        const sigma = 40 + size * 0.22;
        const pull = Math.min(d * 0.82, M.m * strength * (14 + size * 0.09) * Math.exp(-d / sigma));
        dx += (vx / d) * pull; dy += (vy / d) * pull;
        heat = Math.max(heat, Math.exp(-d / sigma) * Math.min(1, M.m));
        if (d < 18 && pad) hide = Math.max(hide, 1 - d / 18);
      }
      return [x + dx, y + dy, heat, hide];
    };

    const line = (pts: [number, number, number, number][]) => {
      for (let i = 1; i < pts.length; i++) {
        const a = pts[i - 1], c = pts[i];
        const vis = 1 - Math.max(a[3], c[3]);
        if (vis <= 0.02) continue;
        const alpha = (0.075 + 0.2 * Math.max(a[2], c[2])) * vis;
        ctx.strokeStyle = `rgba(${r},${g},${b},${alpha.toFixed(3)})`;
        ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(c[0], c[1]); ctx.stroke();
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      ctx.lineWidth = 1;
      const ox = ((w % spacing) / 2), oy = ((h % spacing) / 2), step = 6;
      for (let x = ox; x <= w; x += spacing) {
        const pts: [number, number, number, number][] = [];
        for (let y = -step; y <= h + step; y += step) pts.push(field(x, y));
        line(pts);
      }
      for (let y = oy; y <= h; y += spacing) {
        const pts: [number, number, number, number][] = [];
        for (let x = -step; x <= w + step; x += step) pts.push(field(x, y));
        line(pts);
      }
      // intersections: the smallest detail, strongest near mass
      for (let x = ox; x <= w; x += spacing)
        for (let y = oy; y <= h; y += spacing) {
          const [fx, fy, heat, hide] = field(x, y);
          if (hide > 0.5 || heat < 0.08) continue;
          ctx.fillStyle = `rgba(${r},${g},${b},${(0.12 + heat * 0.45).toFixed(3)})`;
          ctx.fillRect(fx - 0.75, fy - 0.75, 1.5, 1.5);
        }
    };

    const tick = () => {
      px += (tx - px) * 0.08; py += (ty - py) * 0.08; pm += (tpm - pm) * 0.06;
      draw();
      if (Math.abs(tx - px) + Math.abs(ty - py) > 0.3 || Math.abs(tpm - pm) > 0.004) raf = requestAnimationFrame(tick);
      else raf = 0;
    };
    const kick = () => { if (!raf) raf = requestAnimationFrame(tick); };
    const move = (e: PointerEvent) => {
      if (reduce || !pointer) return;
      const br = box.getBoundingClientRect();
      tx = e.clientX - br.left; ty = e.clientY - br.top;
      if (tpm === 0) { px = tx; py = ty; }
      tpm = pointer; kick();
    };
    const leave = () => { tpm = 0; kick(); };

    const ro = new ResizeObserver(measure);
    ro.observe(box);
    box.querySelectorAll("[data-mass]").forEach((el) => ro.observe(el));
    box.addEventListener("pointermove", move);
    box.addEventListener("pointerleave", leave);
    document.fonts?.ready.then(measure);
    return () => { ro.disconnect(); cancelAnimationFrame(raf); box.removeEventListener("pointermove", move); box.removeEventListener("pointerleave", leave); };
  }, [color, spacing, strength, pointer]);

  return (
    <div ref={wrap} className={className} style={{ position: "relative", isolation: "isolate", width: "100%", height: "100%", minHeight: 280, background }}>
      <canvas ref={cv} aria-hidden="true" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", zIndex: 0 }} />
      <div style={{ position: "relative", zIndex: 1, height: "100%" }}>{children}</div>
    </div>
  );
}
