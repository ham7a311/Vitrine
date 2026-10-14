"use client";
import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { seeded, spray, step, type Particle } from "./burst";
import { attach } from "./layer";
import "./confetti-click.css";

export type Party = "party" | "pastel";

export type ConfettiClickProps = {
  children?: ReactNode;
  mix?: Party;
  /** Listen on the whole window instead of just this element. */
  global?: boolean;
  motion?: "full" | "reduced";
  className?: string;
  style?: CSSProperties;
};

export const PARTIES: Record<Party, { colors: string[]; ring: string }> = {
  party: { colors: ["#ff3d6e", "#ffb000", "#2bc48a", "#2f7bff", "#a35bff", "#ff7a2f"], ring: "#2f7bff" },
  pastel: { colors: ["#ffb3c7", "#ffd89a", "#b6ecd2", "#a9d1ff", "#d6c2ff", "#ffc9a8"], ring: "#d6c2ff" },
};

// shapes: a strip, a square, a curl, a dot
const SHAPES = 4;

/**
 * Confetti Click
 * The ordinary arrow, untouched — every click pops a little handful of paper confetti: strips,
 * squares, curls and dots thrown up from the click, tumbling and fluttering as they fall. Hold a
 * moment before letting go for a bigger pop.
 */
export function ConfettiClick({ children, mix = "party", global = false, motion = "full", className = "", style }: ConfettiClickProps) {
  const host = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const el = host.current, cv = canvas.current;
    if (!el || !cv) return;
    const P = PARTIES[mix], rand = seeded(17);
    const ps: Particle[] = [];
    return attach(el, cv, global, {
      ring: P.ring,
      calm: () => motion === "reduced" || matchMedia("(prefers-reduced-motion: reduce)").matches,
      burst: (x, y, power) => {
        const n = Math.round(22 * power);
        for (const v of spray(n, -Math.PI / 2, Math.PI * (0.75 + power * 0.2), 260 * Math.sqrt(power), 520 * Math.sqrt(power), rand))
          ps.push({ x, y, ...v, a: rand() * Math.PI, va: (rand() - 0.5) * 16, age: 0, ttl: 1.3 + rand() * 0.9, size: 5 + rand() * 4, color: P.colors[Math.floor(rand() * P.colors.length)], kind: Math.floor(rand() * SHAPES), ph: rand() * 6 });
      },
      frame: (ctx, dt, _w, h) => {
        for (let i = ps.length - 1; i >= 0; i--) {
          const p = ps[i];
          // paper falls slowly once it's lost its throw: strong drag, steady gravity, a flutter sideways
          if (!step(p, dt, 620, 2.6, 26) || p.y > h + 20) ps.splice(i, 1);
        }
        for (const p of ps) {
          const k = p.age / p.ttl;
          ctx.globalAlpha = k > 0.75 ? (1 - k) / 0.25 : 1;
          ctx.fillStyle = ctx.strokeStyle = p.color;
          // the tumble: paper turning over squashes it along one axis
          const flip = Math.cos(p.ph * 9 + p.kind);
          ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.a); ctx.scale(1, flip);
          if (p.kind === 0) ctx.fillRect(-p.size * 0.9, -p.size * 0.3, p.size * 1.8, p.size * 0.6);
          else if (p.kind === 1) ctx.fillRect(-p.size * 0.5, -p.size * 0.5, p.size, p.size);
          else if (p.kind === 2) { ctx.lineWidth = 1.8; ctx.beginPath(); ctx.arc(0, 0, p.size * 0.7, 0.2, Math.PI * 1.2); ctx.stroke(); }
          else { ctx.beginPath(); ctx.arc(0, 0, p.size * 0.42, 0, Math.PI * 2); ctx.fill(); }
          // a darker face when it's turned away from the light
          if (flip < 0 && p.kind < 2) { ctx.globalAlpha *= 0.25; ctx.fillStyle = "#000"; ctx.fillRect(-p.size, -p.size * 0.5, p.size * 2, p.size); }
          ctx.restore();
        }
        ctx.globalAlpha = 1;
        return ps.length > 0;
      },
    });
  }, [mix, global, motion]);

  return (
    <div ref={host} className={`cnfc ${className}`} style={style}>
      {children}
      <canvas ref={canvas} className={`cnfc__layer ${global ? "cnfc__layer--global" : ""}`} aria-hidden="true" />
    </div>
  );
}

export default ConfettiClick;
