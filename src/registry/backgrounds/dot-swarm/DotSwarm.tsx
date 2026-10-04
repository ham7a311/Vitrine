"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import "./dot-swarm.css";

/**
 * Dot Swarm
 * One set of dots, many shapes. Every outline is sampled to the same number of points, and a
 * change of shape only moves each dot's home — paired by angle round the middle, so the swarm
 * sweeps round into the new outline instead of crossing itself. The pointer pushes dots
 * away; a press sends a shockwave and moves on to the next shape.
 */

type Pt = [number, number];
const COUNT = 720;

/** Outlines in a −1…1 box. */
const OMAN: Pt[] = [[56.0, 24.9], [56.4, 24.4], [57.2, 23.9], [58.6, 23.6], [59.4, 22.6], [59.8, 22.4], [59.3, 21.4], [58.5, 20.4], [57.8, 20.2], [57.7, 19.0], [56.8, 18.6], [56.3, 17.9], [55.4, 17.8], [54.7, 17.0], [53.1, 16.6], [52.0, 19.0], [55.0, 20.0], [55.6, 22.0], [55.2, 22.7], [55.8, 24.2]].map(([lo, la]) => [(lo - 55.9) / 4.6, -(la - 20.75) / 4.6]);
const star = (n: number, r0: number, r1: number): Pt[] => Array.from({ length: n * 2 }, (_, i) => {
  const a = (i / (n * 2)) * Math.PI * 2 - Math.PI / 2, r = i % 2 ? r1 : r0;
  return [Math.cos(a) * r, Math.sin(a) * r];
});
const heart: Pt[] = Array.from({ length: 120 }, (_, i) => {
  const t = (i / 120) * Math.PI * 2;
  return [(16 * Math.sin(t) ** 3) / 17, -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)) / 17 - 0.05];
});
const circle: Pt[] = Array.from({ length: 120 }, (_, i) => [Math.cos((i / 120) * Math.PI * 2) * 0.9, Math.sin((i / 120) * Math.PI * 2) * 0.9]);
const vee: Pt[] = [[-0.86, -0.82], [-0.42, -0.82], [0.02, 0.38], [0.44, -0.82], [0.86, -0.82], [0.16, 0.86], [-0.14, 0.86]];

export const SHAPES: { name: string; outline: Pt[] }[] = [
  { name: "Circle", outline: circle },
  { name: "Star", outline: star(5, 0.95, 0.42) },
  { name: "Oman", outline: OMAN },
  { name: "Heart", outline: heart },
  { name: "Vitrine", outline: vee },
];

/** Evenly spaced points along a closed outline, sorted by angle around its centroid. */
function sample(outline: Pt[], n: number): Pt[] {
  const seg = outline.map((p, i) => {
    const q = outline[(i + 1) % outline.length];
    return Math.hypot(q[0] - p[0], q[1] - p[1]);
  });
  const total = seg.reduce((a, b) => a + b, 0);
  const pts: Pt[] = [];
  let i = 0, acc = 0;
  for (let k = 0; k < n; k++) {
    const target = (k / n) * total;
    while (acc + seg[i] < target) acc += seg[i++];
    const t = (target - acc) / seg[i], p = outline[i], q = outline[(i + 1) % outline.length];
    pts.push([p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t]);
  }
  const cx = pts.reduce((a, p) => a + p[0], 0) / n, cy = pts.reduce((a, p) => a + p[1], 0) / n;
  return pts.map((p) => [p[0] - cx, p[1] - cy] as Pt).sort((a, b) => Math.atan2(a[1], a[0]) - Math.atan2(b[1], b[0]));
}

type Props = {
  dot?: string;
  ground?: string;
  /** Seconds between shapes when nobody is touching it; 0 to only change on press. */
  autoplay?: number;
  motion?: "full" | "reduced";
  className?: string;
  style?: CSSProperties;
};

export function DotSwarm({ dot = "#f2efe9", ground = "#0b0b0c", autoplay = 7, motion = "full", className = "", style }: Props) {
  const host = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const [shape, setShape] = useState(0);
  const next = useRef<() => void>(() => {});

  useEffect(() => {
    const el = host.current, cv = canvas.current;
    if (!el || !cv) return;
    const ctx = cv.getContext("2d")!;
    const reduced = motion === "reduced" || matchMedia("(prefers-reduced-motion: reduce)").matches;
    // Three nested copies of each outline (360 + 230 + 130 dots), each sorted by angle,
    // so the swarm reads as layered rings of distinct dots rather than one solid line.
    const LAYERS: [number, number][] = [[1, 360], [0.72, 230], [0.44, 130]];
    const homes = SHAPES.map((s) => LAYERS.flatMap(([k, n]) => sample(s.outline, n).map(([x, y]) => [x * k, y * k] as Pt)));
    const px = new Float32Array(COUNT), py = new Float32Array(COUNT), vx = new Float32Array(COUNT), vy = new Float32Array(COUNT), hx = new Float32Array(COUNT), hy = new Float32Array(COUNT);
    let W = 0, H = 0, dpr = 1, raf = 0, alive = true, visible = true, current = 0, idleAt = performance.now();
    const ptr = { x: -9999, y: -9999, on: false, moved: 0 };

    const place = (k: number) => {
      const R = Math.min(W, H) * 0.36, cx = W / 2, cy = H / 2;
      const h = homes[k];
      for (let i = 0; i < COUNT; i++) {
        hx[i] = cx + h[i][0] * R;
        hy[i] = cy + h[i][1] * R;
      }
    };
    const size = () => {
      dpr = Math.min(devicePixelRatio || 1, 2);
      W = el.clientWidth;
      H = el.clientHeight;
      cv.width = Math.round(W * dpr);
      cv.height = Math.round(H * dpr);
      place(current);
    };
    size();
    // Start scattered, so the first frame is the swarm arriving.
    for (let i = 0; i < COUNT; i++) {
      const a = Math.random() * Math.PI * 2, r = Math.max(W, H) * (0.5 + Math.random() * 0.4);
      px[i] = reduced ? hx[i] : W / 2 + Math.cos(a) * r;
      py[i] = reduced ? hy[i] : H / 2 + Math.sin(a) * r;
    }

    const draw = () => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = dot;
      const r = Math.max(1.2, Math.min(W, H) / 380);
      ctx.beginPath();
      for (let i = 0; i < COUNT; i++) {
        const sp = Math.hypot(vx[i], vy[i]);
        // A moving dot is drawn long along its path: stretch s, squeeze 1/√s.
        const s = Math.min(4, 1 + sp * 0.18);
        ctx.moveTo(px[i] + r * s, py[i]);
        ctx.ellipse(px[i], py[i], r * s, r / Math.sqrt(s), Math.atan2(vy[i], vx[i]), 0, Math.PI * 2);
      }
      ctx.fill();
    };

    const tick = (now: number) => {
      raf = 0;
      if (!alive || !visible || document.hidden) return;
      const reach = Math.min(W, H) * 0.18;
      let energy = 0;
      for (let i = 0; i < COUNT; i++) {
        if (ptr.on) {
          const dx = px[i] - ptr.x, dy = py[i] - ptr.y, d = Math.hypot(dx, dy);
          if (d < reach && d > 0.01) {
            const f = (1 - d / reach) ** 2 * 3.2;
            vx[i] += (dx / d) * f;
            vy[i] += (dy / d) * f;
          }
        }
        vx[i] = (vx[i] + (hx[i] - px[i]) * 0.05) * 0.84;
        vy[i] = (vy[i] + (hy[i] - py[i]) * 0.05) * 0.84;
        px[i] += vx[i];
        py[i] += vy[i];
        energy += Math.abs(vx[i]) + Math.abs(vy[i]) + Math.abs(hx[i] - px[i]) * 0.02;
      }
      draw();
      if (energy > COUNT * 0.01 || (ptr.on && now - ptr.moved < 1000)) raf = requestAnimationFrame(tick);
      else schedule();
    };
    // Once the swarm settles the loop sleeps; a timer wakes it for the next autoplay shape.
    let timer: ReturnType<typeof setTimeout> | undefined;
    const schedule = () => {
      clearTimeout(timer);
      if (!autoplay || reduced) return;
      timer = setTimeout(() => {
        if (!alive || ptr.on) return schedule();
        if (performance.now() - idleAt < autoplay * 1000 - 50) return schedule();
        idleAt = performance.now();
        go(1, false);
      }, Math.max(200, autoplay * 1000 - (performance.now() - idleAt)));
    };
    const wake = () => {
      if (reduced) return draw();
      if (!raf && alive) raf = requestAnimationFrame(tick);
    };
    const go = (dir: number, wave: boolean, wx = W / 2, wy = H / 2) => {
      current = (current + dir + SHAPES.length) % SHAPES.length;
      setShape(current);
      if (wave && !reduced) {
        for (let i = 0; i < COUNT; i++) {
          const dx = px[i] - wx, dy = py[i] - wy, d = Math.hypot(dx, dy);
          if (d < 200 && d > 0.01) {
            vx[i] += (dx / d) * (1 - d / 200) * 30;
            vy[i] += (dy / d) * (1 - d / 200) * 30;
          }
        }
      }
      place(current);
      if (reduced) for (let i = 0; i < COUNT; i++) ((px[i] = hx[i]), (py[i] = hy[i]));
      wake();
    };
    next.current = () => {
      idleAt = performance.now();
      go(1, true);
    };

    const at = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const k = r.width / el.offsetWidth || 1;
      return [(e.clientX - r.left) / k, (e.clientY - r.top) / k];
    };
    const onMove = (e: PointerEvent) => {
      [ptr.x, ptr.y] = at(e);
      ptr.on = true;
      ptr.moved = performance.now();
      idleAt = performance.now();
      wake();
    };
    const onLeave = () => {
      ptr.on = false;
      wake();
    };
    const onDown = (e: PointerEvent) => {
      if ((e.target as HTMLElement).closest("button")) return;
      const [x, y] = at(e);
      idleAt = performance.now();
      go(1, true, x, y);
    };
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    el.addEventListener("pointerdown", onDown);
    const ro = new ResizeObserver(() => {
      size();
      if (reduced) for (let i = 0; i < COUNT; i++) ((px[i] = hx[i]), (py[i] = hy[i]));
      wake();
      draw();
    });
    ro.observe(el);
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible) wake();
    });
    io.observe(el);
    const onVis = () => !document.hidden && wake();
    document.addEventListener("visibilitychange", onVis);
    wake();
    draw();
    return () => {
      alive = false;
      clearTimeout(timer);
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
      el.removeEventListener("pointerdown", onDown);
    };
  }, [dot, autoplay, motion]);

  return (
    <div ref={host} className={`dsw ${className}`} style={{ background: ground, color: dot, ...style }}>
      <canvas ref={canvas} className="dsw__canvas" role="img" aria-label={`A swarm of dots forming a ${SHAPES[shape].name.toLowerCase()} outline`} />
      <div className="dsw__bar">
        <span className="dsw__name" aria-live="polite">
          {String(shape + 1).padStart(2, "0")} · {SHAPES[shape].name}
        </span>
        <button type="button" className="dsw__next" onClick={() => next.current()}>
          Next shape →
        </button>
      </div>
    </div>
  );
}
