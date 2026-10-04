"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Firefly Sync
 * A meadow at dusk. Fireflies drift over the grass, each flashing on its
 * own clock — and, as real fireflies do, each nudges its clock toward the
 * flashes it can see nearby. Over half a minute the meadow falls into step:
 * scattered blinks become waves of light rolling through the grass, then a
 * field that breathes together. The pointer is a lantern; the fireflies
 * near it lose the beat and drift toward its glow, and find it again when
 * it moves on.
 */

type Props = {
  theme?: "dusk" | "midnight";
  /** Fireflies per 10,000 px². */
  density?: number;
  /** Reports the meadow's synchrony (0–1, the Kuramoto order parameter) about twice a second. */
  onSync?: (r: number) => void;
  className?: string;
  children?: ReactNode;
};

const THEMES = {
  dusk: { sky: ["#0b1030", "#2a2a5c", "#7a4a6a", "#d88a5a"], hills: ["#1a1a36", "#11112a"], grass: "#05060d", fly: [222, 255, 120], lamp: [255, 196, 120], stars: 0.25 },
  midnight: { sky: ["#02040b", "#071230", "#0f2346", "#1d3b5c"], hills: ["#0a1426", "#060c1a"], grass: "#020308", fly: [200, 255, 140], lamp: [255, 210, 150], stars: 1 },
};

/** Smooth 2D value noise. */
function noise(seed = 7) {
  const p = new Uint8Array(512);
  const base = Array.from({ length: 256 }, (_, i) => i);
  let s = seed;
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

export function FireflySync({ theme = "dusk", density = 0.9, onSync, className = "", children }: Props) {
  const hostRef = useRef<HTMLDivElement>(null);
  const syncRef = useRef(onSync);
  syncRef.current = onSync;

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
    const n2 = noise(11);
    const TAU = Math.PI * 2;

    // A soft glow sprite (Gaussian, no edge), tinted once.
    const sprite = (rgb: number[], size: number) => {
      const c = document.createElement("canvas");
      c.width = c.height = size;
      const g = c.getContext("2d")!;
      const grad = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
      for (let k = 0; k <= 10; k++) {
        const r = k / 10, a = Math.exp(-4.4 * r * r) * (1 - r ** 4);
        grad.addColorStop(r, `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${a.toFixed(3)})`);
      }
      g.fillStyle = grad;
      g.fillRect(0, 0, size, size);
      return c;
    };
    const glow = sprite(T.fly, 128);
    const lampGlow = sprite(T.lamp, 256);

    let W = 0, H = 0;
    const bg = document.createElement("canvas");
    type Fly = { x: number; y: number; z: number; th: number; w: number; seed: number; vx: number; vy: number };
    let flies: Fly[] = [];
    let blades: { x: number; h: number; lean: number; w: number; ph: number }[] = [];
    let raf = 0, visible = true, last = 0, t = 0, since = 0, lastReport = 0;
    const lamp = { x: -999, y: -999, on: 0, to: 0 };

    const resize = () => {
      const w = host.clientWidth, h = host.clientHeight;
      if (w === W && h === H) return false;
      W = w; H = h;
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      // The still layers — sky, stars, two ridges — drawn once per size.
      bg.width = canvas.width; bg.height = canvas.height;
      const b = bg.getContext("2d")!;
      b.setTransform(dpr, 0, 0, dpr, 0, 0);
      const sky = b.createLinearGradient(0, 0, 0, H);
      T.sky.forEach((c, i) => sky.addColorStop([0, 0.45, 0.72, 0.9][i], c));
      b.fillStyle = sky;
      b.fillRect(0, 0, W, H);
      let s = 5;
      const rnd = () => ((s = (s * 16807) % 2147483647) / 2147483647);
      for (let i = 0; i < (W * H) / 2600 * T.stars; i++) {
        const y = rnd() * H * 0.55;
        b.fillStyle = `rgba(255,255,255,${(0.15 + rnd() * 0.55) * (1 - y / (H * 0.6))})`;
        b.fillRect(rnd() * W, y, rnd() < 0.1 ? 1.4 : 0.8, rnd() < 0.1 ? 1.4 : 0.8);
      }
      T.hills.forEach((c, k) => {
        b.fillStyle = c;
        b.beginPath();
        b.moveTo(0, H);
        for (let x = 0; x <= W + 20; x += 20) {
          const y = H * (0.62 + k * 0.08) - (n2(x * 0.0022 + k * 9, k * 3) * 0.5 + 0.5) * H * (0.16 - k * 0.04);
          b.lineTo(x, y);
        }
        b.lineTo(W, H);
        b.fill();
      });
      // Fireflies over the meadow, mostly low; each with its own clock (~1.5s), at a random phase.
      const n = Math.round(Math.max(36, Math.min(130, ((W * H) / 10000) * density * (coarse ? 0.7 : 1))));
      flies = Array.from({ length: n }, (_, i) => ({
        x: rnd() * W, y: H * (0.55 + rnd() * 0.42), z: 0.35 + rnd() * 0.65,
        th: rnd() * TAU, w: TAU / (1.45 + (rnd() - 0.5) * 0.3), seed: i * 7.3, vx: 0, vy: 0,
      }));
      blades = Array.from({ length: Math.round(W / 3.2) }, () => ({ x: rnd() * W, h: 26 + rnd() ** 1.6 * H * 0.2, lean: (rnd() - 0.5) * 0.5, w: 1.2 + rnd() * 2.6, ph: rnd() * TAU }));
      since = 0;
      return true;
    };

    const flash = (th: number) => {
      // Brief and bright near phase 0, a faint ember the rest of the time.
      let d = th % TAU; if (d < 0) d += TAU;
      d = Math.min(d, TAU - d);
      return 0.05 + Math.exp(-(d * d) / (2 * 0.32 * 0.32));
    };

    const drawFlies = (front: boolean) => {
      ctx.globalCompositeOperation = "lighter";
      for (const f of flies) {
        if ((f.z > 0.72) !== front) continue;
        const b = flash(f.th);
        const r = (10 + 34 * b) * f.z;
        ctx.globalAlpha = Math.min(1, b * (0.35 + f.z * 0.65));
        ctx.drawImage(glow, f.x - r, f.y - r, r * 2, r * 2);
        if (b > 0.3) {
          ctx.globalAlpha = Math.min(1, b);
          ctx.fillStyle = "#fbffe0";
          ctx.fillRect(f.x - 0.8 * f.z, f.y - 0.8 * f.z, 1.6 * f.z, 1.6 * f.z);
        }
      }
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "source-over";
    };

    const drawGrass = () => {
      ctx.fillStyle = T.grass;
      ctx.beginPath();
      for (const g of blades) {
        const sway = Math.sin(t * 1.1 + g.ph + g.x * 0.004) * 0.12 + n2(g.x * 0.01, t * 0.25) * 0.18 + g.lean;
        const tipX = g.x + sway * g.h, tipY = H - g.h;
        ctx.moveTo(g.x - g.w, H);
        ctx.quadraticCurveTo(g.x - g.w * 0.3 + sway * g.h * 0.3, H - g.h * 0.55, tipX, tipY);
        ctx.quadraticCurveTo(g.x + g.w * 0.3 + sway * g.h * 0.3, H - g.h * 0.55, g.x + g.w, H);
      }
      ctx.fill();
      ctx.fillRect(0, H - 6, W, 6);
    };

    const step = (dt: number) => {
      t += dt;
      since += dt;
      lamp.on += (lamp.to - lamp.on) * Math.min(1, dt * 3);
      // Coupling strengthens over the first ~25s, so you watch the meadow find its rhythm.
      const K = 2.4 * Math.min(1, since / 25);
      const R = Math.max(160, W * 0.28), R2 = R * R;
      const dth = new Float32Array(flies.length);
      for (let i = 0; i < flies.length; i++) {
        const a = flies[i];
        let s = 0, c = 0;
        for (let j = 0; j < flies.length; j++) {
          if (i === j) continue;
          const b = flies[j], dx = b.x - a.x, dy = b.y - a.y, d2 = dx * dx + dy * dy;
          if (d2 > R2) continue;
          const wgt = 1 - d2 / R2;
          s += Math.sin(b.th - a.th) * wgt;
          c += wgt;
        }
        dth[i] = a.w + (c ? (K * s) / c : 0);
        // The lantern: nearby fireflies lose the beat (their clocks jitter) and drift toward it.
        if (lamp.on > 0.02) {
          const dx = lamp.x - a.x, dy = lamp.y - a.y, d = Math.hypot(dx, dy);
          const k = Math.exp(-(d * d) / (2 * 150 * 150)) * lamp.on;
          dth[i] += (Math.random() - 0.5) * 26 * k;
          a.vx += (dx / (d + 1)) * 26 * k * dt;
          a.vy += (dy / (d + 1)) * 26 * k * dt;
        }
      }
      for (let i = 0; i < flies.length; i++) {
        const f = flies[i];
        f.th += dth[i] * dt;
        if (f.th > TAU * 4) f.th -= TAU * 4;
        // Wander on a slow noise field, staying over the meadow.
        const ang = n2(f.x * 0.004 + f.seed, f.y * 0.004 + t * 0.12) * TAU * 1.2;
        f.vx += Math.cos(ang) * 14 * dt - f.vx * 0.9 * dt;
        f.vy += Math.sin(ang) * 10 * dt - f.vy * 0.9 * dt + (H * 0.74 - f.y) * 0.02 * dt;
        f.x += f.vx * dt * f.z;
        f.y += f.vy * dt * f.z;
        if (f.x < -20) f.x = W + 20; else if (f.x > W + 20) f.x = -20;
        f.y = Math.max(H * 0.4, Math.min(H - 8, f.y));
      }
    };

    const render = () => {
      ctx.drawImage(bg, 0, 0, W, H);
      drawFlies(false);
      drawGrass();
      if (lamp.on > 0.02) {
        ctx.globalCompositeOperation = "lighter";
        ctx.globalAlpha = 0.32 * lamp.on;
        ctx.drawImage(lampGlow, lamp.x - 120, lamp.y - 120, 240, 240);
        ctx.globalAlpha = 0.85 * lamp.on;
        ctx.drawImage(lampGlow, lamp.x - 14, lamp.y - 14, 28, 28);
        ctx.globalAlpha = 1;
        ctx.globalCompositeOperation = "source-over";
      }
      drawFlies(true);
    };

    const report = (now: number) => {
      if (!syncRef.current || now - lastReport < 500) return;
      lastReport = now;
      let c = 0, s = 0;
      for (const f of flies) { c += Math.cos(f.th); s += Math.sin(f.th); }
      syncRef.current(Math.hypot(c, s) / Math.max(1, flies.length));
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
      report(now);
    };
    const wake = () => { if (!reduced && !raf && visible && !document.hidden) raf = requestAnimationFrame(loop); };

    const onMove = (e: PointerEvent) => {
      const r = host.getBoundingClientRect();
      const x = e.clientX - r.left, y = e.clientY - r.top;
      const inside = x >= 0 && y >= 0 && x <= r.width && y <= r.height;
      if (inside) {
        lamp.x = x;
        lamp.y = y;
      }
      lamp.to = inside ? 1 : 0;
    };
    const onUp = (e: PointerEvent) => { if (e.pointerType === "touch") lamp.to = 0; };

    const still = () => {
      resize();
      // Reduced motion: a settled meadow, mid-flash.
      since = 30;
      for (let k = 0; k < 400; k++) step(0.03);
      render();
    };

    resize();
    if (reduced) still(); else render();
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; wake(); });
    io.observe(host);
    const ro = new ResizeObserver(() => { if (reduced) still(); });
    ro.observe(host);
    document.addEventListener("visibilitychange", wake);
    if (!reduced) {
      wake();
      window.addEventListener("pointermove", onMove, { passive: true });
      window.addEventListener("pointerup", onUp);
    }
    return () => {
      cancelAnimationFrame(raf);
      raf = 0;
      io.disconnect();
      ro.disconnect();
      document.removeEventListener("visibilitychange", wake);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      canvas.remove();
    };
  }, [theme, density]);

  const T = THEMES[theme];
  return (
    <div ref={hostRef} className={`relative isolate overflow-hidden ${className}`} style={{ background: `linear-gradient(${T.sky[0]}, ${T.sky[2]} 72%, ${T.grass})` }}>
      {children && <div className="relative z-[1] h-full">{children}</div>}
    </div>
  );
}
