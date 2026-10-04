"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Bokeh City
 * A city at night seen through a fast lens wide open: every light is a
 * soft disc with the slightly brighter rim real bokeh has, in three depths
 * that drift past each other as the pointer moves, twinkling as windows
 * come and go. Along the bottom, traffic passes as long defocused streaks
 * — red going one way, white coming the other.
 */

type Props = {
  theme?: "muscat" | "rain";
  className?: string;
  children?: ReactNode;
};

const THEMES = {
  muscat: {
    sky: ["#04050b", "#0a0d1c", "#1a1426"],
    lights: ["#ff9f2e", "#ffc35c", "#ffe7b8", "#ff6a2a", "#2fd3c0", "#6aa5ff"],
    weights: [5, 4, 3, 2, 1.4, 0.8],
    tail: "#ff3b3b",
    head: "#fff4dc",
    rain: 0,
  },
  rain: {
    sky: ["#03060b", "#061424", "#0c2236"],
    lights: ["#4fa8ff", "#8fd0ff", "#dff2ff", "#2f6bff", "#3ee8d4", "#ffa04a"],
    weights: [5, 4, 3, 2, 1.6, 0.7],
    tail: "#ff4d6a",
    head: "#e6f3ff",
    rain: 1,
  },
};

const rgb = (hex: string) => { const n = parseInt(hex.slice(1), 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; };

/** A bokeh disc: an even fill, a slightly brighter rim, and a soft (not sharp) edge. */
function disc(hex: string, size = 128) {
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const g = c.getContext("2d")!;
  const [r, gr, b] = rgb(hex);
  const grad = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  [[0, 0.5], [0.6, 0.56], [0.82, 0.74], [0.9, 0.82], [0.95, 0.42], [1, 0]].forEach(([s, a]) => grad.addColorStop(s, `rgba(${r},${gr},${b},${a})`));
  g.fillStyle = grad;
  g.fillRect(0, 0, size, size);
  return c;
}
/** A long soft capsule for a passing car's light. */
function streak(hex: string) {
  const c = document.createElement("canvas");
  c.width = 256; c.height = 32;
  const g = c.getContext("2d")!;
  const [r, gr, b] = rgb(hex);
  const h = g.createLinearGradient(0, 0, 256, 0);
  h.addColorStop(0, `rgba(${r},${gr},${b},0)`);
  h.addColorStop(0.3, `rgba(${r},${gr},${b},0.8)`);
  h.addColorStop(0.85, `rgba(${r},${gr},${b},1)`);
  h.addColorStop(1, `rgba(${r},${gr},${b},0)`);
  g.fillStyle = h;
  g.fillRect(0, 0, 256, 32);
  g.globalCompositeOperation = "destination-in";
  const v = g.createLinearGradient(0, 0, 0, 32);
  v.addColorStop(0, "rgba(0,0,0,0)");
  v.addColorStop(0.5, "rgba(0,0,0,1)");
  v.addColorStop(1, "rgba(0,0,0,0)");
  g.fillStyle = v;
  g.fillRect(0, 0, 256, 32);
  return c;
}

export function BokehCity({ theme = "muscat", className = "", children }: Props) {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const T = THEMES[theme];
    const canvas = document.createElement("canvas");
    canvas.setAttribute("aria-hidden", "true");
    canvas.style.cssText = "position:absolute;inset:0;width:100%;height:100%;display:block";
    host.prepend(canvas);
    const ctx = canvas.getContext("2d");
    if (!ctx) return () => canvas.remove();
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarse = !matchMedia("(hover: hover) and (pointer: fine)").matches;
    const dpr = Math.min(devicePixelRatio, coarse ? 1.5 : 2);
    const sprites = T.lights.map((c) => disc(c));
    // A wide, edgeless glow laid under the small far lights, so they bloom like real point lights.
    const halos = T.lights.map((c) => {
      const cv = document.createElement("canvas");
      cv.width = cv.height = 96;
      const g = cv.getContext("2d")!;
      const [r, gr, b] = rgb(c);
      const grad = g.createRadialGradient(48, 48, 0, 48, 48, 48);
      for (let k = 0; k <= 8; k++) { const q = k / 8; grad.addColorStop(q, `rgba(${r},${gr},${b},${(Math.exp(-4.4 * q * q) * (1 - q ** 4) * 0.5).toFixed(3)})`); }
      g.fillStyle = grad;
      g.fillRect(0, 0, 96, 96);
      return cv;
    });
    const tail = streak(T.tail), head = streak(T.head);
    const wsum = T.weights.reduce((a, b) => a + b, 0);
    const pick = () => { let r = Math.random() * wsum; for (let i = 0; i < T.weights.length; i++) { r -= T.weights[i]; if (r <= 0) return i; } return 0; };

    type B = { x: number; y: number; r: number; z: number; c: number; a: number; ph: number; tw: number; vx: number };
    type Car = { x: number; y: number; v: number; len: number; head: boolean; a: number };
    let W = 0, H = 0, bs: B[] = [], cars: Car[] = [], drops: { x: number; y: number; l: number; v: number }[] = [];
    let raf = 0, visible = true, last = 0, t = 0;
    const par = { x: 0, y: 0, tx: 0, ty: 0 };

    const resize = () => {
      const w = host.clientWidth, h = host.clientHeight;
      if (w === W && h === H) return;
      W = w; H = h;
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = Math.round(Math.max(50, Math.min(170, (W * H) / 8000)));
      // Far lights are small and many; near ones few and big. Lights gather toward the lower middle, like a skyline.
      bs = Array.from({ length: n }, () => {
        const z = Math.random() < 0.55 ? 0 : Math.random() < 0.65 ? 1 : 2;
        const base = [7, 18, 40][z], spread = [9, 20, 46][z];
        const y = H * (0.25 + Math.pow(Math.random(), 0.7) * 0.6);
        return { x: Math.random() * W * 1.1 - W * 0.05, y, r: base + Math.random() * spread, z, c: pick(), a: [0.78, 0.46, 0.24][z] * (0.6 + Math.random() * 0.55), ph: Math.random() * 6.28, tw: 0.2 + Math.random() * 0.9, vx: (Math.random() - 0.5) * [1.5, 3, 6][z] };
      });
      cars = Array.from({ length: Math.round(W / 140) }, () => spawnCar(true));
      drops = T.rain ? Array.from({ length: Math.round((W * H) / 9000) }, () => ({ x: Math.random() * W, y: Math.random() * H, l: 10 + Math.random() * 22, v: 380 + Math.random() * 300 })) : [];
    };
    const spawnCar = (anywhere = false): Car => {
      const headlight = Math.random() < 0.45;
      const lane = headlight ? 0.885 : 0.925;
      const v = (headlight ? -1 : 1) * (90 + Math.random() * 120);
      const x = anywhere ? Math.random() * W : headlight ? W + 200 : -260;
      return { x, y: H * lane + (Math.random() - 0.5) * 10, v, len: 120 + Math.random() * 160, head: headlight, a: 0.3 + Math.random() * 0.3 };
    };

    const render = () => {
      const g = ctx.createLinearGradient(0, 0, 0, H);
      g.addColorStop(0, T.sky[0]); g.addColorStop(0.6, T.sky[1]); g.addColorStop(1, T.sky[2]);
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);
      ctx.globalCompositeOperation = "lighter";
      // Far to near, each depth shifted by the pointer by a different amount.
      for (let z = 0; z < 3; z++) {
        const k = [0.012, 0.035, 0.08][z];
        const ox = par.x * W * k, oy = par.y * H * k * 0.6;
        for (const b of bs) {
          if (b.z !== z) continue;
          const tw = 0.75 + 0.25 * Math.sin(t * b.tw + b.ph);
          ctx.globalAlpha = b.a * tw;
          const r = b.r;
          if (z === 0) ctx.drawImage(halos[b.c], b.x + ox - r * 3, b.y + oy - r * 3, r * 6, r * 6);
          ctx.drawImage(sprites[b.c], b.x + ox - r, b.y + oy - r, r * 2, r * 2);
        }
      }
      // Traffic: long soft streaks on the road.
      for (const c of cars) {
        ctx.globalAlpha = c.a;
        const img = c.head ? head : tail;
        const ox = par.x * W * 0.1;
        if (c.head) { ctx.save(); ctx.translate(c.x + ox + c.len, c.y); ctx.scale(-1, 1); ctx.drawImage(img, 0, -14, c.len, 28); ctx.restore(); }
        else ctx.drawImage(img, c.x + ox, c.y - 12, c.len, 24);
      }
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "source-over";
      if (drops.length) {
        ctx.strokeStyle = "rgba(190,220,255,0.12)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        for (const d of drops) { ctx.moveTo(d.x, d.y); ctx.lineTo(d.x - d.l * 0.18, d.y + d.l); }
        ctx.stroke();
      }
      // A soft vignette, as through a lens.
      const v = ctx.createRadialGradient(W / 2, H * 0.55, Math.min(W, H) * 0.3, W / 2, H * 0.55, Math.max(W, H) * 0.8);
      v.addColorStop(0, "rgba(0,0,0,0)");
      v.addColorStop(1, "rgba(0,0,0,0.55)");
      ctx.fillStyle = v;
      ctx.fillRect(0, 0, W, H);
    };

    const step = (dt: number) => {
      t += dt;
      par.x += (par.tx - par.x) * Math.min(1, dt * 2.5);
      par.y += (par.ty - par.y) * Math.min(1, dt * 2.5);
      for (const b of bs) {
        b.x += b.vx * dt;
        if (b.x < -W * 0.1) b.x += W * 1.2; else if (b.x > W * 1.1) b.x -= W * 1.2;
      }
      cars.forEach((c, i) => {
        c.x += c.v * dt;
        if ((c.v > 0 && c.x > W + 60) || (c.v < 0 && c.x + c.len < -60)) cars[i] = spawnCar();
      });
      for (const d of drops) { d.y += d.v * dt; d.x -= d.v * 0.18 * dt; if (d.y > H) { d.y = -d.l; d.x = Math.random() * W * 1.1; } }
    };

    const loop = (now: number) => {
      if (!visible || document.hidden) { raf = 0; last = 0; return; }
      raf = requestAnimationFrame(loop);
      if (coarse && now - last < 30) return;
      const dt = Math.min(0.05, last ? (now - last) / 1000 : 0.016);
      last = now;
      resize();
      step(dt);
      render();
    };
    const wake = () => { if (!reduced && !raf && visible && !document.hidden) raf = requestAnimationFrame(loop); };
    const onMove = (e: PointerEvent) => {
      const r = host.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
      const inside = x >= 0 && y >= 0 && x <= 1 && y <= 1;
      par.tx = inside ? -(x - 0.5) * 2 : 0;
      par.ty = inside ? -(y - 0.5) * 2 : 0;
    };

    resize();
    render();
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; wake(); });
    io.observe(host);
    const ro = new ResizeObserver(() => { if (reduced) { resize(); render(); } });
    ro.observe(host);
    document.addEventListener("visibilitychange", wake);
    if (!reduced) { wake(); window.addEventListener("pointermove", onMove, { passive: true }); }
    return () => {
      cancelAnimationFrame(raf);
      raf = 0;
      io.disconnect();
      ro.disconnect();
      document.removeEventListener("visibilitychange", wake);
      window.removeEventListener("pointermove", onMove);
      canvas.remove();
    };
  }, [theme]);

  const T = THEMES[theme];
  return (
    <div ref={hostRef} className={`relative isolate overflow-hidden ${className}`} style={{ background: `linear-gradient(${T.sky[0]}, ${T.sky[1]} 60%, ${T.sky[2]})` }}>
      {children && <div className="relative z-[1] h-full">{children}</div>}
    </div>
  );
}
