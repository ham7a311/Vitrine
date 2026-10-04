"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Wind Map
 * A night weather chart drawn by the wind itself: thousands of particles
 * ride a slowly turning flow field, each leaving a hairline trail that fades
 * behind it, coloured by how fast it's going. The pointer is a small
 * low-pressure system — the wind bends round it and spirals in.
 */

type Props = {
  /** Background, then slow → fast trail colours (hex). */
  colors?: [string, string, string, string];
  /** Particles per 10,000 px². */
  density?: number;
  className?: string;
  children?: ReactNode;
};

const rgb = (hex: string) => {
  const n = parseInt(hex.replace("#", ""), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};
const mix = (a: number[], b: number[], t: number) => a.map((v, i) => Math.round(v + (b[i] - v) * t));

/** Smooth 2D value noise. */
function noise() {
  const p = new Uint8Array(512);
  const base = Array.from({ length: 256 }, (_, i) => i);
  let s = 1013;
  for (let i = 255; i > 0; i--) { s = (s * 16807) % 2147483647; const j = s % (i + 1); [base[i], base[j]] = [base[j], base[i]]; }
  for (let i = 0; i < 512; i++) p[i] = base[i & 255];
  const g = (h: number) => (h / 255) * 2 - 1;
  const f = (t: number) => t * t * (3 - 2 * t);
  return (x: number, y: number) => {
    const X = Math.floor(x) & 255, Y = Math.floor(y) & 255, xf = x - Math.floor(x), yf = y - Math.floor(y);
    const a = g(p[p[X] + Y]), b = g(p[p[X + 1] + Y]), c = g(p[p[X] + Y + 1]), d = g(p[p[X + 1] + Y + 1]);
    const u = f(xf), v = f(yf);
    return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
  };
}

export function WindMap({ colors = ["#070a10", "#2b3d5c", "#7d9cc8", "#f0d9b5"], density = 11, className = "", children }: Props) {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const canvas = document.createElement("canvas");
    canvas.setAttribute("aria-hidden", "true");
    canvas.style.cssText = "position:absolute;inset:0;width:100%;height:100%;display:block";
    host.prepend(canvas);
    const ctx = canvas.getContext("2d");
    if (!ctx) return () => canvas.remove();

    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarse = !matchMedia("(hover: hover) and (pointer: fine)").matches;
    const dpr = Math.min(devicePixelRatio, coarse ? 1.5 : 2);
    const n2 = noise();
    const bg = rgb(colors[0]);
    // Four speed buckets, so each frame is four stroke calls rather than thousands.
    const ramp = [0, 0.33, 0.66, 1].map((t) => {
      const c = t < 0.5 ? mix(rgb(colors[1]), rgb(colors[2]), t * 2) : mix(rgb(colors[2]), rgb(colors[3]), (t - 0.5) * 2);
      return `rgba(${c[0]},${c[1]},${c[2]},${0.62 + t * 0.38})`;
    });
    let W = 0, H = 0;
    let px = new Float32Array(0), py = new Float32Array(0), life = new Float32Array(0);
    let raf = 0, visible = true, t = 0, last = 0;
    const ptr = { x: 0, y: 0, s: 0, ts: 0 };

    const seed = (i: number) => { px[i] = Math.random() * W; py[i] = Math.random() * H; life[i] = 40 + Math.random() * 160; };
    const resize = () => {
      const w = host.clientWidth, h = host.clientHeight;
      if (w === W && h === H) return;
      W = w; H = h;
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.fillStyle = colors[0];
      ctx.fillRect(0, 0, W, H);
      const n = Math.round(((W * H) / 10000) * density * (coarse ? 0.6 : 1));
      px = new Float32Array(n); py = new Float32Array(n); life = new Float32Array(n);
      for (let i = 0; i < n; i++) seed(i);
    };

    /** The wind at a point: the angle of a slowly evolving noise field, plus a vortex round the pointer. */
    const wind = (x: number, y: number) => {
      const s = 0.0016;
      const a = n2(x * s + t * 0.02, y * s - t * 0.015) * Math.PI * 2.2 + n2(x * s * 2.7 + 40, y * s * 2.7) * 0.8;
      const m = 0.7 + 0.6 * (n2(x * s * 0.6 - 30, y * s * 0.6 + t * 0.01) + 1) * 0.5;
      let vx = Math.cos(a) * m, vy = Math.sin(a) * m;
      if (ptr.s > 0.01) {
        const dx = x - ptr.x, dy = y - ptr.y, d2 = dx * dx + dy * dy, r = 210;
        const k = ptr.s * Math.exp(-d2 / (r * r)) * 2.2;
        const d = Math.sqrt(d2) + 1;
        vx += (-dy / d - (dx / d) * 0.22) * k; // round, and a little inward
        vy += (dx / d - (dy / d) * 0.22) * k;
      }
      return [vx, vy];
    };

    const frame = (steps: number) => {
      // Fade the old trails toward the background.
      ctx.fillStyle = `rgba(${bg[0]},${bg[1]},${bg[2]},${steps > 1 ? 0.02 : 0.06})`;
      ctx.fillRect(0, 0, W, H);
      ctx.lineWidth = 1;
      ctx.lineCap = "round";
      const paths = ramp.map(() => new Path2D());
      for (let i = 0; i < px.length; i++) {
        let x = px[i], y = py[i];
        const [vx, vy] = wind(x, y);
        const sp = Math.hypot(vx, vy);
        const nx = x + vx * 1.6, ny = y + vy * 1.6;
        const b = Math.max(0, Math.min(3, Math.floor(((sp - 0.65) / 0.75) * 4)));
        paths[b].moveTo(x, y);
        paths[b].lineTo(nx, ny);
        x = nx; y = ny;
        if (--life[i] <= 0 || x < -4 || y < -4 || x > W + 4 || y > H + 4) seed(i);
        else { px[i] = x; py[i] = y; }
      }
      paths.forEach((p, i) => { ctx.strokeStyle = ramp[i]; ctx.stroke(p); });
    };

    const loop = (now: number) => {
      if (!visible || document.hidden) { raf = 0; return; }
      raf = requestAnimationFrame(loop);
      if (coarse && now - last < 30) return;
      last = now;
      resize();
      ptr.s += (ptr.ts - ptr.s) * 0.04;
      t += 0.016;
      frame(1);
    };
    const wake = () => { if (!reduced && !raf && visible && !document.hidden) raf = requestAnimationFrame(loop); };
    const onMove = (e: PointerEvent) => {
      const r = host.getBoundingClientRect();
      const x = e.clientX - r.left, y = e.clientY - r.top;
      const inside = x >= 0 && y >= 0 && x <= r.width && y <= r.height;
      if (inside) { ptr.x += (x - ptr.x) * (ptr.s < 0.05 ? 1 : 0.35); ptr.y += (y - ptr.y) * (ptr.s < 0.05 ? 1 : 0.35); }
      ptr.ts = inside ? 1 : 0;
    };

    resize();
    if (reduced) {
      // A still chart: let the trails build up for a while, all at once.
      for (let k = 0; k < 90; k++) frame(2);
    }
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; wake(); });
    io.observe(host);
    const ro = new ResizeObserver(() => { if (reduced) { resize(); for (let k = 0; k < 90; k++) frame(2); } });
    ro.observe(host);
    document.addEventListener("visibilitychange", wake);
    if (!reduced) {
      wake();
      if (!coarse) window.addEventListener("pointermove", onMove, { passive: true });
    }
    return () => {
      cancelAnimationFrame(raf);
      raf = 0;
      io.disconnect();
      ro.disconnect();
      document.removeEventListener("visibilitychange", wake);
      window.removeEventListener("pointermove", onMove);
      canvas.remove();
    };
  }, [colors, density]);

  return (
    <div ref={hostRef} className={`relative isolate overflow-hidden ${className}`} style={{ background: colors[0] }}>
      {children && <div className="relative z-[1] h-full">{children}</div>}
    </div>
  );
}
