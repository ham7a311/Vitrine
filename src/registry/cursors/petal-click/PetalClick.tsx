"use client";
import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { seeded, spray, step, type Particle } from "./burst";
import { attach } from "./layer";
import "./petal-click.css";

export type Season = "sakura" | "autumn";

export type PetalClickProps = {
  children?: ReactNode;
  season?: Season;
  /** Listen on the whole window instead of just this element. */
  global?: boolean;
  motion?: "full" | "reduced";
  className?: string;
  style?: CSSProperties;
};

export const SEASONS: Record<Season, { colors: [string, string][]; ring: string }> = {
  sakura: { colors: [["#f9a8c0", "#fff0f4"], ["#f48fb0", "#ffe3ec"], ["#ec7aa0", "#ffd6e3"], ["#fbb6ca", "#ffffff"]], ring: "#f799b5" },
  autumn: { colors: [["#d9541e", "#f08a3c"], ["#b8321f", "#de6a3a"], ["#e2a02a", "#f5c95a"], ["#8f4a1f", "#c27a3a"]], ring: "#d9541e" },
};

function petal(ctx: CanvasRenderingContext2D, s: number) {
  ctx.beginPath(); ctx.moveTo(0, -s);
  ctx.bezierCurveTo(s * 0.75, -s * 0.55, s * 0.75, s * 0.35, s * 0.18, s * 0.8);
  ctx.lineTo(0, s * 0.58); ctx.lineTo(-s * 0.18, s * 0.8);
  ctx.bezierCurveTo(-s * 0.75, s * 0.35, -s * 0.75, -s * 0.55, 0, -s); ctx.fill();
}
function leaf(ctx: CanvasRenderingContext2D, s: number) {
  ctx.beginPath(); ctx.moveTo(0, -s * 1.1);
  ctx.quadraticCurveTo(s * 0.8, -s * 0.2, 0, s * 0.8);
  ctx.quadraticCurveTo(-s * 0.8, -s * 0.2, 0, -s * 1.1); ctx.fill();
}

/**
 * Petal Click
 * The ordinary arrow, untouched — every click shakes loose a few petals that pop out from the
 * click and then drift down, swaying and turning over as they fall. Cherry blossom, or autumn
 * leaves. Hold before letting go for a bigger flurry.
 */
export function PetalClick({ children, season = "sakura", global = false, motion = "full", className = "", style }: PetalClickProps) {
  const host = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const el = host.current, cv = canvas.current;
    if (!el || !cv) return;
    const S = SEASONS[season], rand = seeded(31), leaves = season === "autumn";
    const ps: Particle[] = [];
    return attach(el, cv, global, {
      ring: S.ring,
      calm: () => motion === "reduced" || matchMedia("(prefers-reduced-motion: reduce)").matches,
      burst: (x, y, power) => {
        const n = Math.round(8 * power + 2);
        for (const v of spray(n, -Math.PI / 2, Math.PI * 1.1, 110, 230 * Math.sqrt(power), rand))
          ps.push({ x, y, ...v, a: rand() * Math.PI * 2, va: (rand() - 0.5) * 3, age: 0, ttl: 1.8 + rand() * 0.9, size: (leaves ? 7.5 : 7) + rand() * 3.5, color: String(Math.floor(rand() * S.colors.length)), kind: Math.floor(rand() * 4), ph: rand() * 6 });
      },
      frame: (ctx, dt, _w, h) => {
        for (let i = ps.length - 1; i >= 0; i--) {
          const p = ps[i];
          // a light thing falls slowly — strong drag, a little gravity — rocking side to side
          p.va = Math.cos(p.ph * 2.6 + p.kind) * 2.2;
          if (!step(p, dt, 95, 1.9, 34) || p.y > h + 20) ps.splice(i, 1);
        }
        for (const p of ps) {
          const k = p.age / p.ttl, [base, light] = S.colors[Number(p.color)];
          const turn = Math.cos(p.ph * 3.2 + p.kind * 1.7);
          ctx.globalAlpha = (k < 0.08 ? k / 0.08 : 1) * (k > 0.75 ? (1 - k) / 0.25 : 1);
          ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.a); ctx.scale(Math.max(0.15, Math.abs(turn)), 1);
          ctx.fillStyle = turn > 0 ? base : light;
          if (leaves) {
            leaf(ctx, p.size);
            ctx.strokeStyle = "rgba(60,25,8,0.45)"; ctx.lineWidth = 0.8;
            ctx.beginPath(); ctx.moveTo(0, -p.size * 0.9); ctx.lineTo(0, p.size * 1.2); ctx.stroke();
          } else {
            petal(ctx, p.size);
            // a pale heart at the base of each petal
            ctx.fillStyle = light; ctx.globalAlpha *= 0.7; ctx.beginPath(); ctx.ellipse(0, -p.size * 0.45, p.size * 0.22, p.size * 0.32, 0, 0, Math.PI * 2); ctx.fill();
          }
          ctx.restore();
        }
        ctx.globalAlpha = 1;
        return ps.length > 0;
      },
    });
  }, [season, global, motion]);

  return (
    <div ref={host} className={`ptlc ${className}`} style={style}>
      {children}
      <canvas ref={canvas} className={`ptlc__layer ${global ? "ptlc__layer--global" : ""}`} aria-hidden="true" />
    </div>
  );
}

export default PetalClick;
