"use client";
import { useEffect, useRef, type CSSProperties } from "react";
import { mix } from "./colour";
import type { Vec } from "./geometry";
import { BRANDS, LABELS, MARKS, type Brand, type Phase } from "./marks";
import { seeded } from "./random";
import { ride, spark } from "./ring";
import "./phase-ring.css";

export type { Brand, Phase };

export type PhaseRingProps = {
  brand?: Brand;
  phase?: Phase;
  /** inline: a 22px ring beside the phase word, for a chat reply. hero: a 200px ring with a caption pill. */
  size?: "inline" | "hero";
  labels?: Partial<Record<Phase, string>>;
  motion?: "full" | "reduced";
  className?: string;
};

/** The ring's colour says what the assistant is doing; thinking wears the brand's own colour. */
export const PHASE_COLOURS: Record<Exclude<Phase, "thinking">, { glow: string; core: string; hint: string }> = {
  planning: { glow: "#FFB547", core: "#FFF1D6", hint: "#FFD592" },
  coding: { glow: "#4ADE80", core: "#E3FBEA", hint: "#A7F3C3" },
  done: { glow: "#FFFFFF", core: "#FFFFFF", hint: "#ECECF1" },
};

// box: the ring's square. r: its radius. mark: the logo. pad: room for sparks. Widths and lengths in px.
const SIZES = {
  inline: { box: 22, r: 10, mark: 12, pad: 6, glow: 1.6, core: 0.75, blur: 3, gap: 1.6, rough: 0.9, reach: 2.6 },
  hero: { box: 200, r: 92, mark: 92, pad: 36, glow: 3.4, core: 1.3, blur: 12, gap: 4, rough: 2.6, reach: 12 },
};

// arcs: how many ride the ring. span: each arc's length (rad). speed: rad/s. spark: chance per re-jitter.
const MODES: Record<Phase, { arcs: number; span: [number, number]; speed: [number, number]; regen: number; spark: number; level: number }> = {
  thinking: { arcs: 2, span: [1.1, 1.4], speed: [0.8, 1], regen: 0.07, spark: 0.06, level: 0.5 },
  planning: { arcs: 4, span: [0.42, 0.42], speed: [0, 0], regen: 0.06, spark: 0, level: 0.6 },
  coding: { arcs: 6, span: [0.5, 1.1], speed: [2, 4.5], regen: 0.04, spark: 0.28, level: 1 },
  done: { arcs: 0, span: [0, 0], speed: [0, 0], regen: 0.05, spark: 0, level: 0 },
};

type Arc = { a: number; span: number; v: number; k: number; dying: boolean; pts: Vec[]; sp: Vec[] | null };

const colours = (brand: Brand, phase: Phase) => (phase === "thinking" ? BRANDS[brand] : PHASE_COLOURS[phase]);

/**
 * Phase Ring
 * The assistant's mark in a thin ring that electricity rides round, coloured by what it is doing: the brand's own
 * colour while it thinks, amber stepping round in quarters while it plans, green and crackling while it writes
 * code, and one white pulse round the ring when it is done.
 */
export function PhaseRing({ brand = "claude", phase = "thinking", size = "inline", labels, motion = "full", className = "" }: PhaseRingProps) {
  const root = useRef<HTMLSpanElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const phaseRef = useRef(phase);
  const kick = useRef<() => void>(() => {});
  phaseRef.current = phase;

  useEffect(() => {
    const el = root.current, cv = canvas.current, ctx = cv?.getContext("2d");
    if (!el || !cv || !ctx) return;
    const S = SIZES[size], rand = seeded(23 + brand.length);
    const still = motion === "reduced" || matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(devicePixelRatio || 1, size === "inline" ? 3 : 2), full = S.box + S.pad * 2, C = { x: full / 2, y: full / 2 };
    cv.width = Math.round(full * dpr); cv.height = Math.round(full * dpr);

    let raf = 0, last = 0, regen = 0, level = 0, shown = -1, visible = true, current: Phase = phaseRef.current;
    let from = colours(brand, current), to = from, blend = 1, step = 0, stepT = 0, pulse = 0, shownColour = "";
    const arcs: Arc[] = [];

    const tint = () => ({ glow: mix(from.glow, to.glow, blend), core: mix(from.core, to.core, blend) });
    const setLevel = (v: number) => { if (Math.abs(v - shown) < 0.01) return; shown = v; el.style.setProperty("--phring-level", v.toFixed(3)); };
    const setColour = (c: string) => { if (c === shownColour) return; shownColour = c; el.style.setProperty("--phring-c", c); };
    const add = (m: (typeof MODES)[Phase], i: number) => {
      const planning = current === "planning";
      arcs.push({
        a: planning ? (i / m.arcs) * Math.PI * 2 : rand() * Math.PI * 2,
        span: m.span[0] + rand() * (m.span[1] - m.span[0]),
        v: (m.speed[0] + rand() * (m.speed[1] - m.speed[0])) * (current === "coding" && rand() < 0.4 ? -1 : 1),
        k: 0, dying: false, pts: [], sp: null,
      });
    };
    const stroke = (pts: Vec[], k: number, col: { glow: string; core: string }, w = 1) => {
      if (pts.length < 2 || k <= 0.01) return;
      ctx.beginPath(); ctx.moveTo(pts[0].x, pts[0].y);
      for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
      ctx.strokeStyle = col.glow; ctx.globalAlpha = 0.55 * k; ctx.lineWidth = S.glow * w; ctx.shadowColor = col.glow; ctx.shadowBlur = S.blur * dpr; ctx.stroke();
      ctx.shadowBlur = 0; ctx.strokeStyle = col.core; ctx.globalAlpha = 0.95 * k; ctx.lineWidth = S.core * w; ctx.stroke();
    };
    const shape = (m: (typeof MODES)[Phase]) => {
      for (const a of arcs) {
        a.pts = ride(C, S.r, a.a - a.span / 2, a.span, S.rough, S.gap, rand);
        a.sp = !a.dying && rand() < m.spark ? spark(C, S.r, a.a + (rand() - 0.5) * a.span * 0.6, S.reach * (0.7 + rand() * 0.8), rand) : null;
      }
    };
    const draw = () => {
      ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, cv.width, cv.height);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.globalCompositeOperation = "lighter"; ctx.lineJoin = "round"; ctx.lineCap = "round";
      const col = tint();
      for (const a of arcs) { stroke(a.pts, a.k, col); if (a.sp) stroke(a.sp, a.k * 0.8, col, 0.85); }
      if (pulse > 0) stroke(ride(C, S.r, 0, Math.PI * 2, S.rough * 0.6, S.gap, rand), pulse, PHASE_COLOURS.done);
      ctx.globalCompositeOperation = "source-over"; ctx.globalAlpha = 1;
    };

    const tick = (now: number) => {
      raf = 0;
      const dt = last ? Math.min(0.05, (now - last) / 1000) : 1 / 60;
      last = now;
      const next = phaseRef.current;
      if (next !== current) {
        // Old arcs fade out while the new phase's arcs fade in, and the colour crossfades.
        from = { ...tint(), hint: to.hint }; to = colours(brand, next); blend = 0;
        for (const a of arcs) a.dying = true;
        if (next === "done") pulse = 1;
        current = next; step = 0; stepT = 0;
      }
      const m = MODES[current];
      level += (m.level - level) * Math.min(1, dt * 5);
      blend = Math.min(1, blend + dt / 0.45);

      const alive = arcs.filter((a) => !a.dying).length;
      for (let i = alive; i < m.arcs; i++) add(m, i);
      // Planning steps every arc a quarter-turn's eighth at a time, with a quick ease into each stop.
      if (current === "planning") {
        stepT += dt;
        if (stepT >= 0.3) { stepT = 0; step++; }
        const e = Math.min(1, stepT / 0.12), eased = 1 - (1 - e) ** 3;
        let i = 0;
        for (const a of arcs) if (!a.dying) a.a = ((i++ / m.arcs) + (step - 1 + eased) / 8) * Math.PI * 2;
      }
      for (let i = arcs.length - 1; i >= 0; i--) {
        const a = arcs[i];
        if (current !== "planning" || a.dying) a.a += a.v * dt;
        a.k = a.dying ? a.k - dt * 5 : Math.min(1, a.k + dt * 4);
        if (a.dying && a.k <= 0) arcs.splice(i, 1);
      }
      pulse = Math.max(0, pulse - dt / 0.6);

      regen -= dt;
      if (regen <= 0) { regen = m.regen; shape(m); }
      setLevel(level + pulse * 0.7);
      setColour(pulse > 0.05 ? PHASE_COLOURS.done.glow : tint().glow);
      draw();
      const busy = current !== "done" || arcs.length > 0 || pulse > 0 || level > 0.01;
      if (busy && visible && !document.hidden) raf = requestAnimationFrame(tick);
      else if (!busy) { setLevel(0); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, cv.width, cv.height); }
    };
    const run = () => {
      if (still) { setLevel(MODES[phaseRef.current].level); setColour(colours(brand, phaseRef.current).glow); return; }
      if (!raf && visible && !document.hidden) { last = 0; raf = requestAnimationFrame(tick); }
    };
    kick.current = run;

    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible) run(); else { cancelAnimationFrame(raf); raf = 0; } });
    io.observe(el);
    const onVis = () => { if (!document.hidden) run(); };
    document.addEventListener("visibilitychange", onVis);
    setColour(from.glow);
    run();
    return () => { cancelAnimationFrame(raf); io.disconnect(); document.removeEventListener("visibilitychange", onVis); kick.current = () => {}; };
  }, [brand, size, motion]);

  useEffect(() => { kick.current(); }, [phase]);

  const B = BRANDS[brand], S = SIZES[size], label = labels?.[phase] ?? LABELS[phase], working = phase !== "done";
  const vars = {
    ["--phring-mark" as string]: B.mark, ["--phring-hint" as string]: colours(brand, phase).hint,
    ["--phring-box" as string]: `${S.box}px`, ["--phring-m" as string]: `${S.mark}px`, ["--phring-pad" as string]: `${S.pad}px`, ["--phring-r" as string]: `${S.r * 2}px`,
  } as CSSProperties;
  return (
    <span ref={root} className={`phring phring--${size} ${working ? "is-working" : ""} ${motion === "reduced" ? "phring--still" : ""} ${className}`} data-phase={phase} style={vars}>
      <span className="phring__ring" aria-hidden="true">
        <svg className="phring__logo" viewBox="0 0 24 24"><path d={MARKS[brand]} fill="currentColor" fillRule="evenodd" /></svg>
        <canvas ref={canvas} className="phring__arcs" />
      </span>
      <span className="phring__text" role="status">
        <span className="phring__sr">{B.name}: </span>
        {size === "hero" && <span className="phring__brand" aria-hidden="true">{B.name}<span className="phring__dot">●</span></span>}
        <span className="phring__label">{label}{working ? "…" : ""}</span>
      </span>
    </span>
  );
}

export default PhaseRing;
