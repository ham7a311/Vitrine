"use client";
import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { seeded, spray, step, type Particle } from "./burst";
import { attach } from "./layer";
import "./sparkle-click.css";

export type Shine = "gold" | "prism" | "mono";

export type SparkleClickProps = {
  children?: ReactNode;
  shine?: Shine;
  /** Listen on the whole window instead of just this element. */
  global?: boolean;
  motion?: "full" | "reduced";
  className?: string;
  style?: CSSProperties;
};

export const SHINES: Record<Shine, { colors: string[]; glow: boolean; ring: string }> = {
  gold: { colors: ["#ffd56b", "#ffe9a8", "#ffb63d", "#fff6da"], glow: true, ring: "#ffd56b" },
  prism: { colors: ["#ff6b9a", "#ffb84d", "#f2dc3a", "#4fd896", "#4fb8ff", "#a98bff"], glow: true, ring: "#a98bff" },
  mono: { colors: ["#16161a", "#16161a", "#3a3a42"], glow: false, ring: "#16161a" },
};

const KIND = { star: 0, dot: 1, ring: 2 };

function sparkle(ctx: CanvasRenderingContext2D, s: number) {
  ctx.beginPath(); ctx.moveTo(0, -s);
  ctx.quadraticCurveTo(0, 0, s, 0); ctx.quadraticCurveTo(0, 0, 0, s);
  ctx.quadraticCurveTo(0, 0, -s, 0); ctx.quadraticCurveTo(0, 0, 0, -s); ctx.fill();
}

/**
 * Sparkle Click
 * The ordinary arrow, untouched — but every click leaves a little burst of four-pointed sparkles
 * that fly out, spin, twinkle and wink out. Hold a moment before letting go for a bigger one.
 */
export function SparkleClick({ children, shine = "gold", global = false, motion = "full", className = "", style }: SparkleClickProps) {
  const host = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const el = host.current, cv = canvas.current;
    if (!el || !cv) return;
    const S = SHINES[shine], rand = seeded(5);
    const ps: Particle[] = [];
    const pick = () => S.colors[Math.floor(rand() * S.colors.length)];
    return attach(el, cv, global, {
      ring: S.ring,
      calm: () => motion === "reduced" || matchMedia("(prefers-reduced-motion: reduce)").matches,
      burst: (x, y, power) => {
        const n = Math.round(9 * power + 2);
        for (const v of spray(n, -Math.PI / 2, Math.PI * 2, 170 * power, 340 * power, rand))
          ps.push({ x, y, ...v, a: rand() * 0.6 - 0.3, va: (rand() - 0.5) * 6, age: 0, ttl: 0.5 + rand() * 0.35 * power, size: 5 + rand() * 5 * Math.sqrt(power), color: pick(), kind: KIND.star, ph: rand() * 6 });
        for (const v of spray(Math.round(6 * power), 0, Math.PI * 2, 90, 260 * power, rand))
          ps.push({ x, y, ...v, a: 0, va: 0, age: 0, ttl: 0.35 + rand() * 0.3, size: 1 + rand() * 1.2, color: pick(), kind: KIND.dot, ph: 0 });
        ps.push({ x, y, vx: 0, vy: 0, a: 0, va: 0, age: 0, ttl: 0.32, size: 18 + 10 * power, color: S.ring, kind: KIND.ring, ph: 0 });
      },
      frame: (ctx, dt) => {
        for (let i = ps.length - 1; i >= 0; i--) if (!step(ps[i], dt, 40, 4.6)) ps.splice(i, 1);
        if (S.glow) ctx.globalCompositeOperation = "lighter";
        for (const p of ps) {
          const k = p.age / p.ttl;
          if (p.kind === KIND.ring) {
            ctx.globalAlpha = 0.5 * (1 - k); ctx.strokeStyle = p.color; ctx.lineWidth = 1.2;
            ctx.beginPath(); ctx.arc(p.x, p.y, p.size * Math.sqrt(k), 0, Math.PI * 2); ctx.stroke();
            continue;
          }
          // pop up, twinkle, then shrink away
          const life = Math.sin(Math.PI * Math.min(1, k * 1.15)) ** 0.7;
          const tw = p.kind === KIND.star ? 0.8 + 0.2 * Math.sin(p.ph * 30) : 1;
          ctx.globalAlpha = Math.min(1, (1 - k) * 2);
          ctx.fillStyle = p.color;
          if (S.glow) { ctx.shadowColor = p.color; ctx.shadowBlur = 8; }
          ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.a);
          if (p.kind === KIND.star) sparkle(ctx, p.size * life * tw);
          else { ctx.beginPath(); ctx.arc(0, 0, p.size * life, 0, Math.PI * 2); ctx.fill(); }
          ctx.restore();
        }
        ctx.shadowBlur = 0; ctx.globalAlpha = 1; ctx.globalCompositeOperation = "source-over";
        return ps.length > 0;
      },
    });
  }, [shine, global, motion]);

  return (
    <div ref={host} className={`spkc ${className}`} style={style}>
      {children}
      <canvas ref={canvas} className={`spkc__layer ${global ? "spkc__layer--global" : ""}`} aria-hidden="true" />
    </div>
  );
}

export default SparkleClick;
