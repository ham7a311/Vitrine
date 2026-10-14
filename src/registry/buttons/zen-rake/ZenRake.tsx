"use client";
import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { bend, groove, raked, type Pt } from "./rake";
import { length, nearest, pointAt } from "./perimeter";
import "./zen-rake.css";

export type Sand = "sand" | "ash";

export type ZenRakeProps = {
  children: ReactNode;
  sand?: Sand;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  type?: "button" | "submit";
  motion?: "full" | "reduced";
  className?: string;
};

const PAD = 64, LINES = [11, 19, 27, 35, 43, 51];
const SHADE: Record<Sand, { dark: string; light: string; pebble: [string, string] }> = {
  sand: { dark: "rgba(110, 84, 40, 0.32)", light: "rgba(255, 252, 240, 0.85)", pebble: ["#8a857c", "#5d5952"] },
  ash: { dark: "rgba(0, 0, 0, 0.55)", light: "rgba(255, 255, 255, 0.16)", pebble: ["#d9d4ca", "#9d988e"] },
};

/**
 * Zen Rake
 * The button is a stone set in a raked gravel garden. Point at it and the rake draws grooves round
 * it, spreading both ways from where you came in; the lines part a little round the pointer, and a
 * press sets a pebble down that the grooves swerve round. Leave and the gravel smooths over.
 */
export function ZenRake({ children, sand = "sand", onClick, type = "button", motion = "full", className = "" }: ZenRakeProps) {
  const btn = useRef<HTMLButtonElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const api = useRef<{ on: (v: boolean, x?: number, y?: number) => void; point: (x: number, y: number) => void; pebble: (x: number, y: number) => void } | null>(null);

  useEffect(() => {
    const el = btn.current, cv = canvas.current, ctx = cv?.getContext("2d");
    if (!el || !cv || !ctx) return;
    const S = SHADE[sand];
    const still = motion === "reduced" || matchMedia("(prefers-reduced-motion: reduce)").matches;
    let w = 0, h = 0, r = 0, L = 0, lines: Pt[][] = [], raf = 0, last = 0;
    let progress = 0, alpha = 0, on = false, s0 = 0;
    let push: { x: number; y: number } | null = null, pebbles: { x: number; y: number; t: number }[] = [];

    const size = () => {
      w = el.offsetWidth; h = el.offsetHeight; r = h / 2; L = length(w, h, r);
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      cv.style.width = `${w + PAD * 2}px`; cv.style.height = `${h + PAD * 2}px`;
      cv.width = Math.round((w + PAD * 2) * dpr); cv.height = Math.round((h + PAD * 2) * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, PAD * dpr, PAD * dpr);
      lines = LINES.map((d) => groove(w, h, r, d, 200));
    };

    const draw = () => {
      ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, cv.width, cv.height); ctx.restore();
      if (alpha <= 0.001) return;
      const shift = (p: { x: number; y: number }) => {
        let q = p;
        if (push) q = bend(q, push, 26, 5);
        for (const b of pebbles) q = bend(q, b, 20, 9 * Math.min(1, b.t * 4));
        return q;
      };
      ctx.lineCap = "round"; ctx.lineJoin = "round";
      for (const pts of lines) {
        const shown = pts.map((p) => (raked(p.s, s0, L, progress) ? shift(p) : null));
        // a groove is a shadowed trough beside a lit ridge
        for (const [style, wdt, ox, oy] of [[S.dark, 2.4, 0.7, 0.9], [S.light, 1.3, -0.6, -0.7]] as const) {
          ctx.strokeStyle = style; ctx.lineWidth = wdt; ctx.globalAlpha = alpha;
          ctx.beginPath();
          let pen = false;
          for (const q of shown) {
            if (!q) { pen = false; continue; }
            if (pen) ctx.lineTo(q.x + ox, q.y + oy); else { ctx.moveTo(q.x + ox, q.y + oy); pen = true; }
          }
          ctx.stroke();
        }
      }
      ctx.globalAlpha = alpha;
      for (const b of pebbles) {
        const k = Math.min(1, b.t * 5), g = ctx.createRadialGradient(b.x - 2, b.y - 3, 1, b.x, b.y, 8);
        g.addColorStop(0, S.pebble[0]); g.addColorStop(1, S.pebble[1]);
        ctx.fillStyle = "rgba(0,0,0,0.25)"; ctx.beginPath(); ctx.ellipse(b.x + 1.5, b.y + 2.5, 7.5 * k, 5.5 * k, 0.3, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(b.x, b.y, 7.5 * k, 5.6 * k, 0.3, 0, Math.PI * 2); ctx.fill();
      }
      ctx.globalAlpha = 1;
    };

    const tick = (now: number) => {
      raf = 0;
      const dt = last ? Math.min(0.05, (now - last) / 1000) : 1 / 60; last = now;
      if (on) { progress = Math.min(1, progress + dt * 1.15); alpha = Math.min(1, alpha + dt * 6); }
      else { alpha = Math.max(0, alpha - dt * 0.9); if (alpha === 0) { progress = 0; pebbles = []; } }
      for (const b of pebbles) b.t += dt;
      draw();
      if ((on && progress < 1) || (!on && alpha > 0) || pebbles.some((b) => b.t < 0.3)) raf = requestAnimationFrame(tick);
    };
    const run = () => { if (!raf) { last = 0; raf = requestAnimationFrame(tick); } };

    const ro = new ResizeObserver(() => { size(); draw(); });
    ro.observe(el);
    size();
    api.current = {
      on: (v, x, y) => {
        if (v && x !== undefined && y !== undefined && alpha < 0.05) s0 = nearest(w, h, r, x, y);
        on = v;
        if (still) { progress = v ? 1 : 0; alpha = v ? 1 : 0; if (!v) pebbles = []; draw(); return; }
        run();
      },
      point: (x, y) => {
        // the lines part round the point of the edge nearest the pointer, a little way out
        const p = pointAt(w, h, r, nearest(w, h, r, x, y));
        push = { x: p.x + p.nx * 14, y: p.y + p.ny * 14 };
        if (!still) { draw(); }
      },
      pebble: (x, y) => {
        const p = pointAt(w, h, r, nearest(w, h, r, x, y));
        pebbles = [...pebbles.slice(-2), { x: p.x + p.nx * 30, y: p.y + p.ny * 30, t: still ? 1 : 0 }];
        if (still) draw(); else run();
      },
    };
    return () => { cancelAnimationFrame(raf); ro.disconnect(); api.current = null; };
  }, [sand, motion]);

  const local = (e: React.PointerEvent<HTMLButtonElement>) => { const b = e.currentTarget.getBoundingClientRect(); return { x: e.clientX - b.left, y: e.clientY - b.top }; };
  return (
    <span className={`zrake zrake--${sand} ${className}`} style={{ ["--zr-pad" as string]: `${PAD}px` } as CSSProperties}>
      <canvas ref={canvas} className="zrake__garden" aria-hidden="true" />
      <button ref={btn} type={type} className="zrake__btn" onClick={onClick}
        onPointerEnter={(e) => { if (e.pointerType === "mouse") { const p = local(e); api.current?.on(true, p.x, p.y); api.current?.point(p.x, p.y); } }}
        onPointerMove={(e) => { if (e.pointerType === "mouse") { const p = local(e); api.current?.point(p.x, p.y); } }}
        onPointerLeave={(e) => { if (e.pointerType === "mouse") api.current?.on(false); }}
        onPointerDown={(e) => { const p = local(e); if (e.pointerType !== "mouse") { api.current?.on(true, p.x, p.y); window.setTimeout(() => api.current?.on(false), 2600); } api.current?.pebble(p.x, p.y); }}
        onFocus={(e) => { if (e.currentTarget.matches(":focus-visible")) api.current?.on(true, e.currentTarget.offsetWidth / 2, 0); }}
        onBlur={() => api.current?.on(false)}>
        {children}
      </button>
    </span>
  );
}

export default ZenRake;
