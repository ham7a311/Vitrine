"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import "./eye-tracker.css";

/**
 * Watchful Ball
 * The eyes are on the ball. Each eye is a point on a sphere; the pointer turns the sphere, and
 * an eye heading for the rim moves less and narrows — foreshortening is what makes a flat
 * circle read as round. They blink, squint when you come close, and get dizzy if you circle them.
 */

export type BallColours = { ball: string; shade: string; eye: string; pupil: string };

type BallSpec = { x: number; y: number; size: number; colours?: Partial<BallColours> };

type Props = {
  balls?: BallSpec[];
  colours?: BallColours;
  motion?: "full" | "reduced";
  label?: string;
  className?: string;
  style?: CSSProperties;
};

const DEFAULT_BALLS: BallSpec[] = [
  { x: 0.5, y: 0.52, size: 0.34 },
  { x: 0.2, y: 0.66, size: 0.17 },
  { x: 0.8, y: 0.36, size: 0.2 },
];
const DEFAULT_COLOURS: BallColours = { ball: "#ff7a2f", shade: "#c2410c", eye: "#ffffff", pupil: "#1a1310" };

// The two eyes as points on the unit sphere (x right, y down, z toward you).
const EYES = [
  [-0.3, -0.16],
  [0.3, -0.16],
].map(([x, y]) => [x, y, Math.sqrt(1 - x * x - y * y)] as const);

export function EyeTracker({ balls = DEFAULT_BALLS, colours = DEFAULT_COLOURS, motion = "full", label = "Three round characters following your pointer with their eyes", className = "", style }: Props) {
  const host = useRef<HTMLDivElement>(null);
  const svgs = useRef<(SVGSVGElement | null)[]>([]);

  useEffect(() => {
    const el = host.current;
    if (!el) return;
    const reduced = motion === "reduced" || matchMedia("(prefers-reduced-motion: reduce)").matches;
    const st = balls.map(() => ({ yaw: 0, pitch: 0, ty: 0, tp: 0, blink: 1, squint: 0, tsquint: 0, nextBlink: performance.now() + 1500 + Math.random() * 3000, blinkAt: 0, spin: 0, dizzyUntil: 0, lastAngle: 0, turn: 0, turnT: 0 }));
    const ptr = { x: 0, y: 0, on: false };
    let raf = 0, alive = true, visible = true;

    const centre = (i: number) => {
      const s = svgs.current[i];
      if (!s) return { x: 0, y: 0, r: 1 };
      const r = s.getBoundingClientRect();
      return { x: r.left + r.width / 2, y: r.top + r.height / 2, r: r.width / 2 };
    };

    const paint = (i: number, now: number) => {
      const s = svgs.current[i];
      if (!s) return;
      const b = st[i];
      const R = 30;
      s.querySelectorAll<SVGGElement>("[data-eye]").forEach((eye, k) => {
        const [x0, y0, z0] = EYES[k];
        // THE EYES ARE ON THE BALL: rotate the point by yaw, then pitch.
        const x1 = x0 * Math.cos(b.yaw) + z0 * Math.sin(b.yaw);
        const z1 = -x0 * Math.sin(b.yaw) + z0 * Math.cos(b.yaw);
        const y2 = y0 * Math.cos(b.pitch) - z1 * Math.sin(b.pitch);
        const z2 = y0 * Math.sin(b.pitch) + z1 * Math.cos(b.pitch);
        const open = b.blink * (1 - 0.45 * b.squint);
        eye.setAttribute("transform", `translate(${(50 + x1 * R).toFixed(2)} ${(50 + y2 * R).toFixed(2)}) scale(${(0.35 + 0.65 * Math.max(0, z2)).toFixed(3)} ${(open * (0.55 + 0.45 * Math.max(0, z2))).toFixed(3)})`);
        const pupil = eye.querySelector<SVGGElement>("[data-pupil]")!;
        const dizzy = now < b.dizzyUntil;
        pupil.setAttribute("transform", dizzy ? `rotate(${((now / 4) % 360).toFixed(1)})` : `translate(${(Math.sin(b.yaw) * 2.2).toFixed(2)} ${(Math.sin(b.pitch) * 2.2).toFixed(2)})`);
        pupil.dataset.dizzy = dizzy ? "" : undefined!;
        if (!dizzy) delete pupil.dataset.dizzy;
      });
      // The highlight slides opposite the turn, so the ball itself seems to roll.
      s.querySelector("[data-shine]")?.setAttribute("transform", `translate(${(-b.yaw * 6).toFixed(2)} ${(-b.pitch * 6).toFixed(2)})`);
    };

    const tick = (now: number) => {
      raf = 0;
      if (!alive || !visible) return;
      let moving = false;
      balls.forEach((_, i) => {
        const b = st[i];
        const c = centre(i);
        if (ptr.on) {
          const dx = ptr.x - c.x, dy = ptr.y - c.y, d = Math.hypot(dx, dy);
          b.ty = Math.max(-1, Math.min(1, dx / (c.r * 4))) * 0.95;
          b.tp = Math.max(-1, Math.min(1, -dy / (c.r * 4))) * 0.75;
          b.tsquint = d < c.r * 1.4 ? 1 : 0;
          // Dizziness: add up how far the pointer has circled this ball.
          const a = Math.atan2(dy, dx);
          let da = a - b.lastAngle;
          if (da > Math.PI) da -= Math.PI * 2;
          if (da < -Math.PI) da += Math.PI * 2;
          b.lastAngle = a;
          if (d < c.r * 5) b.turn += da;
          if (now - b.turnT > 1600) {
            b.turn *= 0.3;
            b.turnT = now;
          }
          if (Math.abs(b.turn) > Math.PI * 4 && now > b.dizzyUntil) {
            b.dizzyUntil = now + 2200;
            b.turn = 0;
          }
        } else {
          b.ty = b.tp = 0;
          b.tsquint = 0;
        }
        const k = reduced ? 1 : 0.12;
        b.yaw += (b.ty - b.yaw) * k;
        b.pitch += (b.tp - b.pitch) * k;
        b.squint += (b.tsquint - b.squint) * 0.2;
        // Blink: close over 70ms, open over 120ms.
        if (!reduced && now > b.nextBlink) {
          b.blinkAt = now;
          b.nextBlink = now + 2600 + Math.random() * 3800;
        }
        const bt = now - b.blinkAt;
        b.blink = bt < 70 ? 1 - bt / 70 : bt < 190 ? (bt - 70) / 120 : 1;
        b.blink = Math.max(0.08, b.blink);
        paint(i, now);
        if (Math.abs(b.ty - b.yaw) + Math.abs(b.tp - b.pitch) + Math.abs(b.tsquint - b.squint) > 0.002 || bt < 200 || now < b.dizzyUntil) moving = true;
      });
      // Keep a slow heartbeat for blinks; otherwise sleep until the pointer moves.
      if (moving) raf = requestAnimationFrame(tick);
      else if (!reduced) setTimeout(() => !raf && alive && (raf = requestAnimationFrame(tick)), Math.max(30, Math.min(...st.map((b) => b.nextBlink)) - performance.now()));
    };
    const wake = () => {
      if (!raf && alive) raf = requestAnimationFrame(tick);
    };
    const onMove = (e: PointerEvent) => {
      ptr.x = e.clientX;
      ptr.y = e.clientY;
      ptr.on = true;
      wake();
    };
    const onLeave = () => {
      ptr.on = false;
      wake();
    };
    window.addEventListener("pointermove", onMove);
    document.addEventListener("pointerleave", onLeave);
    el.addEventListener("pointerleave", onLeave);
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible) wake();
    });
    io.observe(el);
    wake();
    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, [balls, motion]);

  return (
    <div ref={host} className={`et ${className}`} style={style} role="img" aria-label={label}>
      {balls.map((b, i) => {
        const c = { ...colours, ...b.colours };
        const gid = `et-g-${i}`;
        return (
          <svg
            key={i}
            ref={(n) => {
              svgs.current[i] = n;
            }}
            className="et__ball"
            viewBox="0 0 100 100"
            style={{ left: `${b.x * 100}%`, top: `${b.y * 100}%`, width: `min(${b.size * 100}vmin, ${b.size * 100}cqmin)` }}
            aria-hidden="true"
          >
            <defs>
              <radialGradient id={gid} cx="0.38" cy="0.32" r="0.72">
                <stop offset="0" stopColor={c.ball} />
                <stop offset="0.72" stopColor={c.ball} />
                <stop offset="1" stopColor={c.shade} />
              </radialGradient>
            </defs>
            <ellipse cx="50" cy="96" rx="30" ry="3.2" fill="#000" opacity="0.16" />
            <circle cx="50" cy="50" r="44" fill={`url(#${gid})`} />
            <ellipse data-shine cx="36" cy="30" rx="11" ry="7" fill="#fff" opacity="0.28" />
            {EYES.map((_, k) => (
              <g data-eye key={k}>
                <ellipse rx="9" ry="11" fill={c.eye} />
                <g data-pupil>
                  <circle r="5.2" fill={c.pupil} />
                  <circle cx="-1.6" cy="-2" r="1.5" fill="#fff" />
                  <path className="et__spiral" d="M0 0m-3 0a3 3 0 1 1 3 3a2 2 0 1 1 -2 -2" fill="none" stroke={c.eye} strokeWidth="0.9" />
                </g>
              </g>
            ))}
          </svg>
        );
      })}
    </div>
  );
}
