"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Loom
 * A curtain of vertical warp threads, swaying on a slow breeze. Move through it
 * and the threads part around your cursor like a hand through a beaded
 * curtain, then drift back into line on their own springs.
 */

type Props = {
  /** Thread colours, cycled across the loom. */
  colors?: string[];
  background?: string;
  /** Distance between threads in px. */
  spacing?: number;
  /** Radius of the parting, in px. */
  reach?: number;
  className?: string;
  children?: ReactNode;
};

const SEGMENTS = 28;

export function Loom({
  colors = ["rgba(239,232,220,0.12)", "rgba(185,204,228,0.2)", "rgba(239,232,220,0.08)", "rgba(185,204,228,0.14)", "rgba(200,185,234,0.3)"],
  background = "#0a080c",
  spacing = 9,
  reach = 130,
  className = "",
  children,
}: Props) {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const canvas = document.createElement("canvas");
    canvas.setAttribute("aria-hidden", "true");
    canvas.style.cssText = "position:absolute;inset:0;width:100%;height:100%;display:block";
    host.prepend(canvas);
    const ctx = canvas.getContext("2d")!;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0, h = 0, count = 0;
    // per-thread, per-point horizontal displacement and velocity
    let off = new Float32Array(0), vel = new Float32Array(0), seeds = new Float32Array(0);
    const mouse = { x: -1e4, y: -1e4, active: false };
    let raf = 0, last = 0, visible = true;
    const t0 = performance.now();

    const resize = () => {
      const r = host.getBoundingClientRect();
      w = Math.max(1, r.width);
      h = Math.max(1, r.height);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      count = Math.ceil(w / spacing) + 2;
      off = new Float32Array(count * (SEGMENTS + 1));
      vel = new Float32Array(count * (SEGMENTS + 1));
      seeds = new Float32Array(count).map((_, i) => Math.sin(i * 12.9898) * 43758.5453 % 1);
    };

    const frame = (now: number) => {
      const t = reduced ? 0 : (now - t0) / 1000;
      ctx.fillStyle = background;
      ctx.fillRect(0, 0, w, h);
      ctx.lineWidth = 1;
      for (let i = 0; i < count; i++) {
        const baseX = (i - 1) * spacing;
        const s = seeds[i];
        ctx.strokeStyle = colors[i % colors.length];
        ctx.beginPath();
        for (let k = 0; k <= SEGMENTS; k++) {
          const y = (k / SEGMENTS) * h;
          const idx = i * (SEGMENTS + 1) + k;
          // breeze: a slow travelling sway that grows toward the bottom (threads hang from the top)
          const hang = k / SEGMENTS;
          const sway = Math.sin(t * 0.6 + baseX * 0.012 + hang * 2.2 + s * 3) * 4 * hang + Math.sin(t * 0.23 + baseX * 0.004) * 6 * hang * hang;
          // parting force
          let target = 0;
          if (mouse.active) {
            const ddx = baseX + off[idx] - mouse.x;
            const ddy = y - mouse.y;
            const d = Math.hypot(ddx, ddy);
            if (d < reach) {
              const f = 1 - d / reach;
              target = Math.sign(ddx || 1) * f * f * 34 * (0.4 + hang * 0.6);
            }
          }
          vel[idx] += (target - off[idx]) * 0.06;
          vel[idx] *= 0.82;
          off[idx] += vel[idx];
          const x = baseX + sway + off[idx];
          if (k === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
    };

    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      if (!visible || document.hidden || now - last < 30) return;
      last = now;
      frame(now);
    };
    const onMove = (e: PointerEvent) => {
      const r = host.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
      mouse.active = mouse.x >= -reach && mouse.y >= -reach && mouse.x <= r.width + reach && mouse.y <= r.height + reach;
    };

    resize();
    frame(performance.now());
    const ro = new ResizeObserver(() => {
      resize();
      frame(performance.now());
    });
    ro.observe(host);
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(host);
    if (!reduced) {
      raf = requestAnimationFrame(loop);
      window.addEventListener("pointermove", onMove, { passive: true });
    }
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
      canvas.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [colors.join(), background, spacing, reach]);

  return (
    <div ref={hostRef} className={`relative isolate overflow-hidden ${className}`} style={{ background }}>
      {children && <div className="relative z-[1] h-full">{children}</div>}
    </div>
  );
}
