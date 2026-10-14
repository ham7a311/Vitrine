"use client";
import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { blink, flutter, ring, seeded, type Body } from "./flight";
import { length } from "./perimeter";
import "./moth-light.css";

export type Night = "moths" | "fireflies";

export type MothLightProps = {
  children: ReactNode;
  night?: Night;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  type?: "button" | "submit";
  motion?: "full" | "reduced";
  className?: string;
};

const PAD = 70;
type Moth = Body & { s: number; spin: number; off: number; ph: number; size: number; life: number; leaving: boolean; ex: number; ey: number; period: number; phase: number; bump: number };
type Mote = { x: number; y: number; vx: number; vy: number; ph: number };

/**
 * Moth Light
 * The button is a lamp. Point at it and it switches on, and moths come in out of the dark —
 * spiralling to the light, circling its edge in jittery loops and bumping into it — with dust
 * drifting in the glow. Leave and the lamp goes out and they scatter. Or fireflies, blinking.
 */
export function MothLight({ children, night = "moths", onClick, type = "button", motion = "full", className = "" }: MothLightProps) {
  const btn = useRef<HTMLButtonElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const api = useRef<{ on: (v: boolean) => void; bump: () => void } | null>(null);

  useEffect(() => {
    const el = btn.current, cv = canvas.current, ctx = cv?.getContext("2d");
    if (!el || !cv || !ctx) return;
    const rand = seeded(night === "moths" ? 3 : 9);
    const still = motion === "reduced" || matchMedia("(prefers-reduced-motion: reduce)").matches;
    const flies = night === "fireflies";
    let w = 0, h = 0, r = 0, L = 0, raf = 0, last = 0, t = 0, on = false, light = 0;
    let swarm: Moth[] = [], motes: Mote[] = [];

    const size = () => {
      w = el.offsetWidth; h = el.offsetHeight; r = h / 2; L = length(w, h, r);
      const dpr = Math.min(devicePixelRatio || 1, 2);
      cv.style.width = `${w + PAD * 2}px`; cv.style.height = `${h + PAD * 2}px`;
      cv.width = Math.round((w + PAD * 2) * dpr); cv.height = Math.round((h + PAD * 2) * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, PAD * dpr, PAD * dpr);
    };

    const spawn = (n: number) => {
      for (let i = 0; i < n; i++) {
        // in from the dark, somewhere round the edge of the overlay
        const a = rand() * Math.PI * 2, R = Math.max(w, h) * 0.5 + PAD;
        const x = w / 2 + Math.cos(a) * R, y = h / 2 + Math.sin(a) * R * 0.6;
        swarm.push({
          x, y, vx: 0, vy: 0, s: rand() * L, spin: (rand() < 0.5 ? -1 : 1) * (40 + rand() * 70), off: flies ? 14 + rand() * 40 : 5 + rand() * 16,
          ph: rand() * 6, size: flies ? 1.6 + rand() * 0.8 : 5.6 + rand() * 2.6, life: 0, leaving: false, ex: 0, ey: 0,
          period: 1.4 + rand() * 1.8, phase: rand(), bump: 1 + rand() * 3,
        });
      }
    };

    const drawMoth = (m: Moth, glow: number) => {
      const a = Math.atan2(m.vy, m.vx), f = Math.abs(Math.sin(m.ph)), sz = m.size;
      ctx.save(); ctx.translate(m.x, m.y); ctx.rotate(a);
      ctx.globalAlpha = Math.min(1, m.life * 2) * (0.45 + glow * 0.55);
      // wings, opening and closing; the lit side warm
      ctx.fillStyle = `rgb(${Math.round(150 + glow * 90)}, ${Math.round(130 + glow * 80)}, ${Math.round(100 + glow * 50)})`;
      for (const side of [1, -1]) {
        ctx.beginPath(); ctx.moveTo(sz * 0.3, 0);
        ctx.quadraticCurveTo(sz * 0.2, side * sz * (0.4 + f * 1.1), -sz * 0.9, side * sz * (0.3 + f * 0.9));
        ctx.quadraticCurveTo(-sz * 0.6, side * sz * 0.2, -sz * 0.3, 0); ctx.fill();
      }
      ctx.fillStyle = "#3b2c1c"; ctx.beginPath(); ctx.ellipse(-sz * 0.15, 0, sz * 0.55, sz * 0.2, 0, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
    };

    const drawFly = (m: Moth) => {
      const b = blink(t, m.period, m.phase) * Math.min(1, m.life * 2);
      ctx.globalAlpha = 0.35 + b * 0.65;
      ctx.fillStyle = "#3d4a2a"; ctx.beginPath(); ctx.arc(m.x, m.y, m.size * 0.8, 0, Math.PI * 2); ctx.fill();
      if (b > 0.02) {
        const g = ctx.createRadialGradient(m.x, m.y, 0, m.x, m.y, 12 * b + 2);
        g.addColorStop(0, `rgba(226,255,120,${0.9 * b})`); g.addColorStop(0.35, `rgba(180,240,90,${0.35 * b})`); g.addColorStop(1, "rgba(160,230,80,0)");
        ctx.globalAlpha = 1; ctx.fillStyle = g; ctx.beginPath(); ctx.arc(m.x, m.y, 12 * b + 2, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = `rgba(245,255,200,${b})`; ctx.beginPath(); ctx.arc(m.x, m.y, m.size, 0, Math.PI * 2); ctx.fill();
      }
      ctx.globalAlpha = 1;
    };

    const draw = () => {
      ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, cv.width, cv.height); ctx.restore();
      if (!flies) {
        for (const d of motes) { ctx.globalAlpha = light * (0.25 + 0.25 * Math.sin(d.ph)); ctx.fillStyle = "#ffe2a8"; ctx.fillRect(d.x, d.y, 1.2, 1.2); }
        ctx.globalAlpha = 1;
      }
      for (const m of swarm) {
        if (flies) drawFly(m);
        else {
          const cx = Math.max(r, Math.min(w - r, m.x)), d = Math.hypot(m.x - cx, m.y - h / 2) - r;
          drawMoth(m, light * Math.max(0, 1 - d / 70));
        }
      }
    };

    const tick = (now: number) => {
      raf = 0;
      const dt = last ? Math.min(0.04, (now - last) / 1000) : 1 / 60;
      last = now; t += dt;
      light += ((on ? 1 : 0) - light) * Math.min(1, dt * 5);
      el.parentElement?.style.setProperty("--ml-light", light.toFixed(3));
      for (const m of swarm) {
        m.ph += dt * (flies ? 2 : 34 + m.size * 2);
        if (m.leaving) {
          m.life -= dt * 0.9;
          if (flies) { m.x += m.vx * dt * 0.3; m.y += m.vy * dt * 0.3 - 4 * dt; continue; }
          flutter(m, m.ex, m.ey, dt, rand, 8, 2.5, 700);
          continue;
        }
        m.life = Math.min(1, m.life + dt);
        m.s += m.spin * dt;
        m.bump -= dt;
        // now and then a moth flies right into the lamp
        const off = !flies && m.bump < 0.18 ? 0 : m.off;
        if (m.bump < 0) m.bump = 1.5 + rand() * 3;
        const g = ring(w, h, r, m.s, off + (flies ? Math.sin(t * 0.7 + m.phase * 6) * 10 : 0));
        if (flies) flutter(m, g.x, g.y, dt, rand, 1.6, 1.4, 20);
        else flutter(m, g.x, g.y, dt, rand);
      }
      swarm = swarm.filter((m) => !(m.leaving && m.life <= 0));
      for (const d of motes) { d.ph += dt * 2; d.x += d.vx * dt; d.y += d.vy * dt; if (d.y < -PAD * 0.6) d.y = h + PAD * 0.4; }
      draw();
      if (on || swarm.length || light > 0.02) raf = requestAnimationFrame(tick);
    };
    const run = () => { if (!raf) { last = 0; raf = requestAnimationFrame(tick); } };

    const ro = new ResizeObserver(() => { size(); draw(); });
    ro.observe(el);
    size();
    motes = Array.from({ length: 28 }, () => ({ x: -30 + rand() * (w + 60), y: -PAD * 0.6 + rand() * (h + PAD), vx: (rand() - 0.5) * 6, vy: -3 - rand() * 6, ph: rand() * 6 }));

    api.current = {
      on: (v) => {
        on = v;
        if (still) {
          el.parentElement?.style.setProperty("--ml-light", v ? "1" : "0");
          // a few resting where the light is, nothing moving
          swarm = [];
          if (v) { spawn(flies ? 9 : 6); swarm.forEach((m, i) => { const g = ring(w, h, r, (i / swarm.length) * L, m.off); m.x = g.x; m.y = g.y; m.vx = 1; m.vy = 0.2; m.life = 1; }); t = 0.3; }
          light = v ? 1 : 0; draw(); return;
        }
        if (v) {
          const resting = swarm.filter((m) => !m.leaving).length;
          spawn((flies ? 11 : 7) - resting);
        } else {
          for (const m of swarm) {
            m.leaving = true;
            const a = Math.atan2(m.y - h / 2, m.x - w / 2);
            m.ex = w / 2 + Math.cos(a) * (w + 140); m.ey = h / 2 + Math.sin(a) * (h + 140);
            if (flies) { m.vx = Math.cos(a) * 30; m.vy = Math.sin(a) * 30; }
          }
        }
        run();
      },
      bump: () => {
        if (still || flies) return;
        // a tap on the lamp startles them out and back
        for (const m of swarm) { const a = Math.atan2(m.y - h / 2, m.x - w / 2); m.vx += Math.cos(a) * 260; m.vy += Math.sin(a) * 260; }
        run();
      },
    };
    return () => { cancelAnimationFrame(raf); ro.disconnect(); api.current = null; };
  }, [night, motion]);

  return (
    <span className={`mlamp mlamp--${night} ${className}`} style={{ ["--ml-pad" as string]: `${PAD}px` } as CSSProperties}>
      <span className="mlamp__halo" aria-hidden="true" />
      <button ref={btn} type={type} className="mlamp__btn" onClick={onClick}
        onPointerEnter={(e) => { if (e.pointerType === "mouse") api.current?.on(true); }}
        onPointerLeave={(e) => { if (e.pointerType === "mouse") api.current?.on(false); }}
        onPointerDown={(e) => { api.current?.bump(); if (e.pointerType !== "mouse") { api.current?.on(true); window.setTimeout(() => api.current?.on(false), 3200); } }}
        onFocus={(e) => { if (e.currentTarget.matches(":focus-visible")) api.current?.on(true); }}
        onBlur={() => api.current?.on(false)}>
        <span className="mlamp__label">{children}</span>
      </button>
      <canvas ref={canvas} className="mlamp__air" aria-hidden="true" />
    </span>
  );
}

export default MothLight;
