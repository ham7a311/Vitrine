"use client";
import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { seeded, spray, step, type Particle } from "./burst";
import { attach } from "./layer";
import "./firework-click.css";

export type Sky = "night" | "daylight";

export type FireworkClickProps = {
  children?: ReactNode;
  sky?: Sky;
  /** Listen on the whole window instead of just this element. */
  global?: boolean;
  motion?: "full" | "reduced";
  className?: string;
  style?: CSSProperties;
};

export const SKIES: Record<Sky, { shells: [string, string][]; trail: string; glow: boolean; ring: string }> = {
  night: { shells: [["#ffcf5a", "#fff3c4"], ["#ff5c8a", "#ffd0de"], ["#58c8ff", "#e2f6ff"], ["#9d7bff", "#ffd36a"], ["#5cf0a8", "#f4fff9"]], trail: "#ffe3a3", glow: true, ring: "#ffcf5a" },
  daylight: { shells: [["#e0452b", "#f2a33a"], ["#1f6fe0", "#e0452b"], ["#14a06a", "#f2a33a"], ["#8a3fd6", "#e04a8f"]], trail: "#3a3328", glow: false, ring: "#1f6fe0" },
};

const SHELL = 0, SPARK = 1, PUFF = 2;

/**
 * Firework Click
 * The ordinary arrow, untouched — every click launches a tiny firework: a shell climbs from the
 * click on a fading trail, bursts into a ring of sparks that arc and fall with trails of their
 * own, and crackles out. Hold before letting go and it climbs higher and bursts bigger, twice.
 */
export function FireworkClick({ children, sky = "night", global = false, motion = "full", className = "", style }: FireworkClickProps) {
  const host = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const el = host.current, cv = canvas.current;
    if (!el || !cv) return;
    const S = SKIES[sky], rand = seeded(23);
    const ps: Particle[] = [];
    let shells = 0;

    const explode = (s: Particle) => {
      const [a, b] = S.shells[shells++ % S.shells.length];
      const power = s.size;
      const ring = (n: number, lo: number, hi: number, color: string, ttl: number) => {
        for (const v of spray(n, 0, Math.PI * 2, lo, hi, rand))
          ps.push({ x: s.x, y: s.y, ...v, a: 0, va: 0, age: 0, ttl: ttl + rand() * 0.35, size: 1.4 + rand() * 0.8, color, kind: SPARK, ph: rand() * 6, trail: [] });
      };
      ring(Math.round(28 * power), 160 * Math.sqrt(power), 240 * Math.sqrt(power), a, 0.95);
      if (power > 1.5) ring(14, 70, 110, b, 0.75); // a second, tighter ring for a held press
      else ring(9, 45, 80, b, 0.65);
      ps.push({ x: s.x, y: s.y, vx: 0, vy: 0, a: 0, va: 0, age: 0, ttl: 0.22, size: 26 * Math.sqrt(power), color: a, kind: PUFF, ph: 0 });
    };

    return attach(el, cv, global, {
      ring: S.ring,
      calm: () => motion === "reduced" || matchMedia("(prefers-reduced-motion: reduce)").matches,
      burst: (x, y, power) => {
        ps.push({ x, y, vx: (rand() - 0.5) * 30, vy: -330 * Math.sqrt(power), a: 0, va: 0, age: 0, ttl: 0.5 + 0.12 * power, size: power, color: S.trail, kind: SHELL, ph: 0, trail: [] });
        ps.push({ x, y, vx: 0, vy: 0, a: 0, va: 0, age: 0, ttl: 0.25, size: 10, color: S.trail, kind: PUFF, ph: 0 });
      },
      frame: (ctx, dt) => {
        for (let i = ps.length - 1; i >= 0; i--) {
          const p = ps[i];
          if (p.trail) { p.trail.push({ x: p.x, y: p.y }); if (p.trail.length > (p.kind === SHELL ? 10 : 7)) p.trail.shift(); }
          const alive = p.kind === SHELL ? step(p, dt, 520, 0.6) : p.kind === SPARK ? step(p, dt, 150, 1.5) : step(p, dt, 0, 0);
          if (p.kind === SHELL && (!alive || p.vy > -50)) { ps.splice(i, 1); explode(p); continue; }
          if (!alive) ps.splice(i, 1);
        }
        if (S.glow) ctx.globalCompositeOperation = "lighter";
        ctx.lineCap = "round";
        for (const p of ps) {
          const k = p.age / p.ttl;
          if (p.kind === PUFF) {
            ctx.globalAlpha = 0.5 * (1 - k); ctx.strokeStyle = p.color; ctx.lineWidth = 1.2;
            ctx.beginPath(); ctx.arc(p.x, p.y, p.size * Math.sqrt(k), 0, Math.PI * 2); ctx.stroke();
            continue;
          }
          const fade = p.kind === SPARK ? (k > 0.65 ? (1 - k) / 0.35 : 1) : 1;
          // crackle as it dies
          const flick = p.kind === SPARK && k > 0.6 ? (rand() < 0.35 ? 0.15 : 1) : 1;
          const t = p.trail ?? [];
          for (let j = 1; j < t.length; j++) {
            ctx.globalAlpha = (j / t.length) * 0.55 * fade;
            ctx.strokeStyle = p.color; ctx.lineWidth = p.kind === SHELL ? 2 : p.size;
            ctx.beginPath(); ctx.moveTo(t[j - 1].x, t[j - 1].y); ctx.lineTo(t[j].x, t[j].y); ctx.stroke();
          }
          ctx.globalAlpha = fade * flick; ctx.fillStyle = p.kind === SHELL ? (S.glow ? "#fff6dc" : S.trail) : p.color;
          if (S.glow) { ctx.shadowColor = p.color; ctx.shadowBlur = 6; }
          ctx.beginPath(); ctx.arc(p.x, p.y, p.kind === SHELL ? 2.2 : p.size, 0, Math.PI * 2); ctx.fill();
          ctx.shadowBlur = 0;
        }
        ctx.globalAlpha = 1; ctx.globalCompositeOperation = "source-over";
        return ps.length > 0;
      },
    });
  }, [sky, global, motion]);

  return (
    <div ref={host} className={`fwkc ${className}`} style={style}>
      {children}
      <canvas ref={canvas} className={`fwkc__layer ${global ? "fwkc__layer--global" : ""}`} aria-hidden="true" />
    </div>
  );
}

export default FireworkClick;
