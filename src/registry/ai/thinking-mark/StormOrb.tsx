"use client";
import { useEffect, useRef, type CSSProperties } from "react";
import { bolt } from "./bolt";
import type { Outline, Vec } from "./geometry";
import { BRANDS, LABELS, MARKS, type Brand, type Phase } from "./marks";
import { outline } from "./outline";
import { seeded } from "./random";
import "./storm-orb.css";

export type { Brand, Phase };

export type StormOrbProps = {
  brand?: Brand;
  phase?: Phase;
  /** inline: a 22px orb beside the phase word, for a chat reply. hero: a 200px orb with a caption pill. */
  size?: "inline" | "hero";
  labels?: Partial<Record<Phase, string>>;
  motion?: "full" | "reduced";
  className?: string;
};

// orb and mark: diameters in px. glow/core: stroke widths in px. blur: halo. spot: wall-contact glow radius.
const SIZES = {
  inline: { orb: 22, mark: 11, glow: 1.6, core: 0.75, blur: 3, spot: 2.6, depth: 3 },
  hero: { orb: 200, mark: 80, glow: 3.6, core: 1.3, blur: 12, spot: 14, depth: 5 },
};

// count: tendrils. life: seconds each lives. wander: how fast an end slides along the wall (rad/s).
const MODES: Record<Phase, { count: number; life: [number, number]; wander: number; regen: number; fork: number; level: number }> = {
  thinking: { count: 3, life: [0.9, 2.2], wander: 0.7, regen: 0.06, fork: 0.08, level: 0.45 },
  planning: { count: 2, life: [9, 9], wander: 0, regen: 0.05, fork: 0, level: 0.6 },
  coding: { count: 7, life: [0.25, 0.8], wander: 2.6, regen: 0.035, fork: 0.35, level: 1 },
  done: { count: 0, life: [0, 0], wander: 0, regen: 0.05, fork: 0, level: 0 },
};

type Tendril = { a: number; v: number; life: number; reach: number; pts: Vec[]; branch: Vec[] | null };

/** The outermost point of the mark in each of 72 directions round its centre, in the mark's 24-unit grid. */
function rim(o: Outline) {
  const best: { x: number; y: number; r: number }[] = Array.from({ length: 72 }, () => ({ x: 12, y: 12, r: 0 }));
  for (const c of o.contours)
    for (let i = 0; i < c.x.length; i += 3) {
      const dx = c.x[i] - 12, dy = c.y[i] - 12, r = Math.hypot(dx, dy);
      const k = Math.floor(((Math.atan2(dy, dx) + Math.PI * 2) % (Math.PI * 2)) / (Math.PI * 2) * 72) % 72;
      if (r > best[k].r) best[k] = { x: c.x[i], y: c.y[i], r };
    }
  return best;
}

/**
 * Storm Orb
 * The assistant's mark inside a small dark glass sphere, with plasma tendrils reaching from it to the wall like a
 * plasma ball: a few wandering slowly while it thinks, two sweeping round like clock hands while it plans, a
 * crackling crowd while it writes code, all drawn back into the mark with one glow when it is done.
 */
export function StormOrb({ brand = "claude", phase = "thinking", size = "inline", labels, motion = "full", className = "" }: StormOrbProps) {
  const root = useRef<HTMLSpanElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const phaseRef = useRef(phase);
  const kick = useRef<() => void>(() => {});
  phaseRef.current = phase;

  useEffect(() => {
    const el = root.current, cv = canvas.current, ctx = cv?.getContext("2d");
    if (!el || !cv || !ctx) return;
    const B = BRANDS[brand], S = SIZES[size], rand = seeded(19 + brand.length);
    const still = motion === "reduced" || matchMedia("(prefers-reduced-motion: reduce)").matches;
    const edge = rim(outline(MARKS[brand]));
    const dpr = Math.min(devicePixelRatio || 1, size === "inline" ? 3 : 2), R = S.orb / 2, ms = S.mark / 24, off = R - S.mark / 2;
    cv.width = Math.round(S.orb * dpr); cv.height = Math.round(S.orb * dpr);

    let raf = 0, last = 0, regen = 0, level = 0, shown = -1, visible = true, current: Phase = phaseRef.current;
    let sweep = 0, retract = -1, flash = 0;
    const ts: Tendril[] = [];

    const setLevel = (v: number) => { if (Math.abs(v - shown) < 0.01) return; shown = v; el.style.setProperty("--sorb-level", v.toFixed(3)); };
    const from = (a: number) => {
      const k = Math.floor(((a % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2)) / (Math.PI * 2) * 72) % 72, p = edge[k];
      return { x: off + p.x * ms, y: off + p.y * ms };
    };
    const spawn = (t: Tendril, m: (typeof MODES)[Phase], fresh: boolean) => {
      t.a = rand() * Math.PI * 2; t.v = (rand() - 0.5) * 2 * m.wander;
      t.life = (m.life[0] + rand() * (m.life[1] - m.life[0])) * (fresh ? 0.3 + rand() * 0.7 : 1);
      t.reach = 1;
    };
    const stroke = (pts: Vec[], k: number, w = 1) => {
      if (pts.length < 2 || k <= 0.01) return;
      ctx.beginPath(); ctx.moveTo(pts[0].x, pts[0].y);
      for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
      ctx.strokeStyle = B.glow; ctx.globalAlpha = 0.5 * k; ctx.lineWidth = S.glow * w; ctx.shadowColor = B.glow; ctx.shadowBlur = S.blur * dpr; ctx.stroke();
      ctx.shadowBlur = 0; ctx.strokeStyle = B.core; ctx.globalAlpha = 0.95 * k; ctx.lineWidth = S.core * w; ctx.stroke();
    };
    const spot = (p: Vec, k: number) => {
      const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, S.spot);
      g.addColorStop(0, B.core); g.addColorStop(0.35, B.glow); g.addColorStop(1, "transparent");
      ctx.globalAlpha = 0.55 * k; ctx.fillStyle = g; ctx.beginPath(); ctx.arc(p.x, p.y, S.spot, 0, Math.PI * 2); ctx.fill();
    };
    const shape = (m: (typeof MODES)[Phase]) => {
      for (const t of ts) {
        const a = from(t.a), wall = R - S.core * 2, r0 = Math.hypot(a.x - R, a.y - R);
        const r = r0 + (wall - r0) * t.reach;
        const b = { x: R + Math.cos(t.a) * r, y: R + Math.sin(t.a) * r };
        t.pts = bolt(a, b, Math.hypot(b.x - a.x, b.y - a.y) * 0.16, S.depth, rand);
        t.branch = null;
        if (rand() < m.fork && t.pts.length > 4) {
          const p = t.pts[Math.floor(t.pts.length * (0.35 + rand() * 0.3))], side = rand() < 0.5 ? -1 : 1, len = R * (0.18 + rand() * 0.22);
          const ang = t.a + side * (0.5 + rand() * 0.5);
          t.branch = bolt(p, { x: p.x + Math.cos(ang) * len, y: p.y + Math.sin(ang) * len }, len * 0.3, S.depth - 1, rand);
        }
      }
    };
    const draw = () => {
      ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, cv.width, cv.height);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.save(); ctx.beginPath(); ctx.arc(R, R, R - 0.5, 0, Math.PI * 2); ctx.clip();
      ctx.globalCompositeOperation = "lighter"; ctx.lineJoin = "round"; ctx.lineCap = "round";
      for (const t of ts) {
        const k = Math.min(1, t.life * 4);
        stroke(t.pts, k);
        if (t.branch) stroke(t.branch, k * 0.7, 0.8);
        if (t.reach > 0.9 && t.pts.length) spot(t.pts[t.pts.length - 1], k);
      }
      if (flash > 0) {
        const g = ctx.createRadialGradient(R, R, S.mark * 0.3, R, R, R);
        g.addColorStop(0, B.glow); g.addColorStop(1, "transparent");
        ctx.globalAlpha = 0.45 * flash; ctx.fillStyle = g; ctx.fillRect(0, 0, S.orb, S.orb);
      }
      ctx.restore(); ctx.globalAlpha = 1; ctx.globalCompositeOperation = "source-over";
    };

    const tick = (now: number) => {
      raf = 0;
      const dt = last ? Math.min(0.05, (now - last) / 1000) : 1 / 60;
      last = now;
      const next = phaseRef.current;
      if (next !== current) {
        if (next === "done") retract = 0;
        if (current === "done") { retract = -1; ts.length = 0; }
        if (next === "planning") { ts.length = 0; sweep = rand() * Math.PI * 2; }
        current = next;
      }
      const m = MODES[current];
      level += (m.level - level) * Math.min(1, dt * 5);

      if (retract < 0) {
        while (ts.length < m.count) { const t = { pts: [], branch: null } as unknown as Tendril; spawn(t, m, true); ts.push(t); }
        for (let i = ts.length - 1; i >= 0; i--) {
          const t = ts[i];
          t.life -= dt;
          t.v += (rand() - 0.5) * m.wander * 3 * dt; t.v = Math.max(-m.wander, Math.min(m.wander, t.v));
          t.a += t.v * dt;
          if (t.life <= 0) { if (ts.length > m.count) ts.splice(i, 1); else spawn(t, m, false); }
        }
        // Planning: two tendrils opposite each other, swept round like clock hands.
        if (current === "planning") { sweep += dt * (Math.PI * 2) / 1.6; ts.forEach((t, i) => { t.a = sweep + i * Math.PI; }); }
      } else {
        // Done: every tendril is drawn back into the mark, then the sphere glows once.
        retract += dt / 0.4;
        for (const t of ts) t.reach = Math.max(0, 1 - retract);
        if (retract >= 1 && ts.length) { ts.length = 0; flash = 1; }
      }
      flash = Math.max(0, flash - dt * 2.2);

      regen -= dt;
      if (regen <= 0) { regen = m.regen; shape(m); }
      setLevel(level + flash * 0.8);
      draw();
      const busy = current !== "done" || ts.length > 0 || flash > 0 || level > 0.01;
      if (busy && visible && !document.hidden) raf = requestAnimationFrame(tick);
      else if (!busy) { setLevel(0); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, cv.width, cv.height); }
    };
    const run = () => {
      if (still) { setLevel(MODES[phaseRef.current].level); return; }
      if (!raf && visible && !document.hidden) { last = 0; raf = requestAnimationFrame(tick); }
    };
    kick.current = run;

    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible) run(); else { cancelAnimationFrame(raf); raf = 0; } });
    io.observe(el);
    const onVis = () => { if (!document.hidden) run(); };
    document.addEventListener("visibilitychange", onVis);
    run();
    return () => { cancelAnimationFrame(raf); io.disconnect(); document.removeEventListener("visibilitychange", onVis); kick.current = () => {}; };
  }, [brand, size, motion]);

  useEffect(() => { kick.current(); }, [phase]);

  const B = BRANDS[brand], S = SIZES[size], label = labels?.[phase] ?? LABELS[phase], working = phase !== "done";
  const vars = { ["--sorb-mark" as string]: B.mark, ["--sorb-glow" as string]: B.glow, ["--sorb-hint" as string]: B.hint, ["--sorb-d" as string]: `${S.orb}px`, ["--sorb-m" as string]: `${S.mark}px` } as CSSProperties;
  return (
    <span ref={root} className={`sorb sorb--${size} ${working ? "is-working" : ""} ${motion === "reduced" ? "sorb--still" : ""} ${className}`} data-phase={phase} style={vars}>
      <span className="sorb__orb" aria-hidden="true">
        <canvas ref={canvas} className="sorb__plasma" />
        <svg className="sorb__logo" viewBox="0 0 24 24"><path d={MARKS[brand]} fill="currentColor" fillRule="evenodd" /></svg>
      </span>
      <span className="sorb__text" role="status">
        <span className="sorb__sr">{B.name}: </span>
        {size === "hero" && <span className="sorb__brand" aria-hidden="true">{B.name}<span className="sorb__dot">·</span></span>}
        <span className="sorb__label">{label}{working ? "…" : ""}</span>
      </span>
    </span>
  );
}

export default StormOrb;
