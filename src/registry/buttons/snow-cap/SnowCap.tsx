"use client";
import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { COL, deposit, limits, seeded, settle, surface } from "./snow";
import "./snow-cap.css";

export type Weather = "snow" | "sugar";

export type SnowCapProps = {
  children: ReactNode;
  weather?: Weather;
  /** Button colours. */
  tone?: { face: string; label: string };
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  type?: "button" | "submit";
  motion?: "full" | "reduced";
  className?: string;
};

const TOP = 70, SIDE = 18, FOOT = 36; // room in the overlay above, beside and below the button
const LOOK: Record<Weather, { snow: string; shade: string; rate: number; size: [number, number]; fall: [number, number]; max: number }> = {
  snow: { snow: "#ffffff", shade: "#c9dcf2", rate: 46, size: [1.2, 2.8], fall: [26, 48], max: 13 },
  sugar: { snow: "#fffaf0", shade: "#eadcc6", rate: 150, size: [0.6, 1.3], fall: [60, 95], max: 8 },
};

type Flake = { x: number; y: number; r: number; vy: number; ph: number; land: boolean };
type Icicle = { x: number; len: number; max: number; w: number; drip: number };
type Drop = { x: number; y: number; vy: number; vx: number; r: number; life: number };

/**
 * Snow Cap
 * Point at the button and it starts to snow over it: flakes drift down and settle into a soft drift
 * along the top, deepest on the flat and sliding off the rounded shoulders, while icicles grow
 * from the bottom edge. Move away and it all melts and drips off.
 */
export function SnowCap({ children, weather = "snow", tone = { face: "#1c2b4a", label: "#f4f8ff" }, onClick, type = "button", motion = "full", className = "" }: SnowCapProps) {
  const btn = useRef<HTMLButtonElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const api = useRef<{ on: (v: boolean) => void; shake: () => void } | null>(null);

  useEffect(() => {
    const el = btn.current, cv = canvas.current, ctx = cv?.getContext("2d");
    if (!el || !cv || !ctx) return;
    const L = LOOK[weather], rand = seeded(7);
    const still = motion === "reduced" || matchMedia("(prefers-reduced-motion: reduce)").matches;
    let w = 0, h = 0, r = 0, cap: number[] = [], lim: number[] = [], flakes: Flake[] = [], icicles: Icicle[] = [], drops: Drop[] = [];
    let on = false, raf = 0, last = 0, spawn = 0, dust: { x: number; y: number }[] = [];

    const size = () => {
      w = el.offsetWidth; h = el.offsetHeight; r = h / 2;
      const dpr = Math.min(devicePixelRatio || 1, 2), cw = w + SIDE * 2, ch = h + TOP + FOOT;
      cv.style.width = `${cw}px`; cv.style.height = `${ch}px`;
      cv.width = Math.round(cw * dpr); cv.height = Math.round(ch * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, SIDE * dpr, TOP * dpr); // draw in button coordinates
      lim = limits(w, r, L.max);
      cap = lim.map((m, i) => Math.min(m, cap[i] ?? 0));
    };

    const drawCap = () => {
      const n = cap.length;
      if (!cap.some((c) => c > 0.3)) return;
      ctx.beginPath();
      ctx.moveTo(0, surface(w, r, 0));
      for (let i = 0; i < n; i++) { const x = (i + 0.5) * COL; ctx.lineTo(x, surface(w, r, x) - cap[i]); }
      ctx.lineTo(w, surface(w, r, w));
      for (let i = n - 1; i >= 0; i--) { const x = (i + 0.5) * COL; ctx.lineTo(x, surface(w, r, x) + Math.min(2.5, cap[i])); }
      ctx.closePath();
      const g = ctx.createLinearGradient(0, -L.max, 0, 4);
      g.addColorStop(0, L.snow); g.addColorStop(0.7, L.snow); g.addColorStop(1, L.shade);
      ctx.fillStyle = g;
      ctx.shadowColor = "rgba(0,0,0,0.28)"; ctx.shadowBlur = 6; ctx.shadowOffsetY = 2;
      ctx.fill();
      ctx.shadowBlur = 0; ctx.shadowOffsetY = 0;
      // sugar shows its grain; snow catches a few glints
      if (weather === "sugar") {
        ctx.fillStyle = L.shade;
        for (let i = 0; i < n; i += 2) if (cap[i] > 1.5) { const x = (i + 0.5) * COL; ctx.fillRect(x + ((i * 37) % 5) - 2, surface(w, r, x) - cap[i] * (((i * 53) % 10) / 10), 0.9, 0.9); }
      } else {
        ctx.fillStyle = "#fff";
        for (let i = 3; i < n; i += 11) if (cap[i] > 4) { const x = (i + 0.5) * COL, tw = 0.5 + 0.5 * Math.sin(last / 300 + i); ctx.globalAlpha = tw; ctx.fillRect(x - 0.6, surface(w, r, x) - cap[i] + 1.4, 1.2, 1.2); }
        ctx.globalAlpha = 1;
      }
    };

    const drawIcicle = (c: Icicle) => {
      if (c.len < 0.5) return;
      const g = ctx.createLinearGradient(0, h, 0, h + c.len);
      g.addColorStop(0, "rgba(255,255,255,0.95)"); g.addColorStop(1, "rgba(200,225,255,0.55)");
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.moveTo(c.x - c.w, h - 1);
      ctx.quadraticCurveTo(c.x - c.w * 0.4, h + c.len * 0.5, c.x, h + c.len);
      ctx.quadraticCurveTo(c.x + c.w * 0.4, h + c.len * 0.5, c.x + c.w, h - 1); ctx.fill();
      ctx.fillStyle = "rgba(255,255,255,0.9)"; ctx.fillRect(c.x - c.w * 0.45, h, 0.8, c.len * 0.5);
    };

    const draw = () => {
      ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, cv.width, cv.height); ctx.restore();
      for (const c of icicles) drawIcicle(c);
      drawCap();
      ctx.fillStyle = weather === "sugar" ? "rgba(255,250,240,0.55)" : "rgba(255,255,255,0.5)";
      for (const d of dust) ctx.fillRect(d.x, d.y, 1, 1);
      for (const f of flakes) {
        ctx.globalAlpha = f.y < -TOP + 14 ? (f.y + TOP) / 14 : 0.92;
        ctx.fillStyle = L.snow; ctx.beginPath(); ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2); ctx.fill();
      }
      ctx.globalAlpha = 1;
      ctx.fillStyle = weather === "sugar" ? L.snow : "rgba(215,235,255,0.9)";
      for (const d of drops) { ctx.globalAlpha = Math.min(1, d.life * 3); ctx.beginPath(); ctx.ellipse(d.x, d.y, d.r * 0.8, d.r * 1.2, 0, 0, Math.PI * 2); ctx.fill(); }
      ctx.globalAlpha = 1;
    };

    const tick = (now: number) => {
      raf = 0;
      const dt = last ? Math.min(0.05, (now - last) / 1000) : 1 / 60;
      last = now;
      if (on) {
        spawn += dt * L.rate;
        while (spawn >= 1) {
          spawn -= 1;
          flakes.push({ x: -SIDE + rand() * (w + SIDE * 2), y: -TOP, r: L.size[0] + rand() * (L.size[1] - L.size[0]), vy: L.fall[0] + rand() * (L.fall[1] - L.fall[0]), ph: rand() * 6.28, land: false });
        }
      }
      for (let i = flakes.length - 1; i >= 0; i--) {
        const f = flakes[i];
        f.ph += dt * 2; f.y += f.vy * dt * (0.6 + f.r / 4); f.x += Math.sin(f.ph) * 10 * dt;
        const col = Math.floor(f.x / COL);
        if (col >= 0 && col < cap.length && f.y >= surface(w, r, f.x) - cap[col]) {
          if (lim[col] > cap[col] + 0.2) deposit(cap, lim, col, f.r * (weather === "sugar" ? 0.55 : 0.7));
          else if (rand() < 0.5) drops.push({ x: f.x, y: f.y, vx: (f.x < w / 2 ? -1 : 1) * 14, vy: 6, r: f.r * 0.7, life: 0.5 }); // slides off the shoulder
          flakes.splice(i, 1);
        } else if (f.y > h + FOOT) flakes.splice(i, 1);
      }
      settle(cap, lim, 0.9); settle(cap, lim, 0.9);
      const deep = cap.reduce((a, b) => a + b, 0) / Math.max(1, cap.length);
      if (on) {
        // icicles grow once there's some snow on top (snow only)
        if (weather === "snow" && deep > 3 && icicles.length < Math.floor((w - 2 * r) / 22) && rand() < dt * 2.2) {
          const x = r + 6 + rand() * (w - 2 * r - 12);
          if (icicles.every((c) => Math.abs(c.x - x) > 9)) icicles.push({ x, len: 0, max: 6 + rand() * 13, w: 1.8 + rand() * 1.6, drip: 1 + rand() * 2 });
        }
        for (const c of icicles) c.len = Math.min(c.max, c.len + dt * 7);
        // sugar dusts the face of the button too
        if (weather === "sugar" && dust.length < 140 && rand() < dt * 30) dust.push({ x: r * 0.6 + rand() * (w - r * 1.2), y: 4 + rand() * (h - 8) });
      } else {
        // melt: the drift sinks, icicles shrink and drip, sugar blows away
        for (let i = 0; i < cap.length; i++) cap[i] = Math.max(0, cap[i] - dt * (weather === "sugar" ? 9 : 5) * (0.6 + ((i * 7) % 5) / 10));
        for (const c of icicles) { c.len = Math.max(0, c.len - dt * 9); c.drip -= dt * 3; }
        icicles = icicles.filter((c) => c.len > 0.3);
        if (weather === "sugar") dust = dust.filter(() => rand() > dt * 6);
        if (weather === "snow" && deep > 0.4 && rand() < dt * 9) {
          const x = r + rand() * (w - 2 * r);
          drops.push({ x, y: h + 1, vx: 0, vy: 20, r: 1.6, life: 0.8 });
        }
      }
      for (const c of icicles) {
        c.drip -= dt;
        if (c.drip < 0 && c.len > 4) { c.drip = 1.5 + rand() * 2.5; drops.push({ x: c.x, y: h + c.len, vx: 0, vy: 10, r: 1.3, life: 0.9 }); }
      }
      for (let i = drops.length - 1; i >= 0; i--) {
        const d = drops[i];
        d.vy += 420 * dt; d.x += d.vx * dt; d.y += d.vy * dt; d.life -= dt;
        if (d.life <= 0 || d.y > h + FOOT) drops.splice(i, 1);
      }
      draw();
      const busy = on || flakes.length || drops.length || icicles.length || dust.length || cap.some((c) => c > 0.05);
      if (busy) raf = requestAnimationFrame(tick);
    };
    const run = () => { if (!raf) { last = 0; raf = requestAnimationFrame(tick); } };

    const ro = new ResizeObserver(() => { size(); draw(); });
    ro.observe(el);
    size();
    api.current = {
      on: (v) => {
        on = v;
        if (still) {
          // a finished drift, no falling
          cap = v ? lim.map((m) => m * 0.85) : lim.map(() => 0);
          icicles = v && weather === "snow" ? [0.3, 0.45, 0.62, 0.78].map((k, i) => ({ x: r + k * (w - 2 * r), len: [9, 14, 7, 11][i], max: 14, w: 2.4, drip: 99 })) : [];
          draw(); return;
        }
        run();
      },
      shake: () => {
        if (still) return;
        // a knock shakes some snow loose
        for (let i = 0; i < cap.length; i += 3) if (cap[i] > 2 && rand() < 0.5) drops.push({ x: (i + 0.5) * COL, y: surface(w, r, (i + 0.5) * COL) - cap[i], vx: (rand() - 0.5) * 60, vy: -40 - rand() * 50, r: 1 + rand() * 1.2, life: 0.9 });
        for (let i = 0; i < cap.length; i++) cap[i] *= 0.55;
        run();
      },
    };
    return () => { cancelAnimationFrame(raf); ro.disconnect(); api.current = null; };
  }, [weather, motion]);

  return (
    <span className={`scap scap--${weather} ${className}`} style={{ ["--sc-face" as string]: tone.face, ["--sc-label" as string]: tone.label, ["--sc-top" as string]: `${TOP}px`, ["--sc-side" as string]: `${SIDE}px` } as CSSProperties}>
      <button ref={btn} type={type} className="scap__btn" onClick={onClick}
        onPointerEnter={(e) => { if (e.pointerType === "mouse") api.current?.on(true); }}
        onPointerLeave={(e) => { if (e.pointerType === "mouse") api.current?.on(false); }}
        onPointerDown={(e) => { api.current?.shake(); if (e.pointerType !== "mouse") { api.current?.on(true); window.setTimeout(() => api.current?.on(false), 2600); } }}
        onFocus={(e) => { if (e.currentTarget.matches(":focus-visible")) api.current?.on(true); }}
        onBlur={() => api.current?.on(false)}>
        {children}
      </button>
      <canvas ref={canvas} className="scap__sky" aria-hidden="true" />
    </span>
  );
}

export default SnowCap;
