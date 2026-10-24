"use client";
import { useEffect, useRef, type CSSProperties } from "react";
import { bolt } from "./bolt";
import type { Vec } from "./geometry";
import { BRANDS, LABELS, MARKS, type Brand, type Phase } from "./marks";
import { seeded } from "./random";
import "./corona.css";

export type { Brand, Phase };

export type CoronaProps = {
  brand?: Brand;
  phase?: Phase;
  /** inline: a 22px crown beside the phase word, for a chat reply. hero: a 200px crown with a caption pill. */
  size?: "inline" | "hero";
  labels?: Partial<Record<Phase, string>>;
  motion?: "full" | "reduced";
  className?: string;
};

// box: the crown's square. mark: the logo. r: where filaments start. len: filament length range. count: filaments.
// pad: room for streamers. glow/core: stroke widths. blur: halo.
const SIZES = {
  inline: { box: 22, mark: 13, r: 7.6, len: [1.4, 3.4], count: 20, pad: 7, glow: 1.3, core: 0.6, blur: 2.5 },
  hero: { box: 200, mark: 92, r: 56, len: [7, 24], count: 66, pad: 44, glow: 2.8, core: 1, blur: 9 },
};

// active: share of filaments lit. reach: length multiplier. tight: how close the crown sits (1 = at r).
// streamer: chance per lit filament per re-jitter of a long one. regen: seconds between re-jitters.
const MODES: Record<Phase, { active: number; reach: number; tight: number; streamer: number; regen: number; level: number }> = {
  thinking: { active: 0.32, reach: 0.75, tight: 1, streamer: 0, regen: 0.075, level: 0.45 },
  planning: { active: 0.06, reach: 1, tight: 1, streamer: 0, regen: 0.055, level: 0.6 },
  coding: { active: 0.86, reach: 1.2, tight: 0.9, streamer: 0.05, regen: 0.035, level: 1 },
  done: { active: 0, reach: 0, tight: 0.2, streamer: 0, regen: 0.05, level: 0 },
};

type Filament = { a: number; k: number; len: number; pts: Vec[] };

/**
 * Corona
 * The assistant's mark wearing a crown of electric discharge: a sparse flicker while it thinks, a bright sector
 * sweeping round while it plans, a dense crackling crown pulled in tight with the odd long streamer while it writes
 * code — and when it is done, the whole crown collapses into the mark as one glow.
 */
export function Corona({ brand = "claude", phase = "thinking", size = "inline", labels, motion = "full", className = "" }: CoronaProps) {
  const root = useRef<HTMLSpanElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const phaseRef = useRef(phase);
  const kick = useRef<() => void>(() => {});
  phaseRef.current = phase;

  useEffect(() => {
    const el = root.current, cv = canvas.current, ctx = cv?.getContext("2d");
    if (!el || !cv || !ctx) return;
    const B = BRANDS[brand], S = SIZES[size], rand = seeded(31 + brand.length);
    const still = motion === "reduced" || matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(devicePixelRatio || 1, size === "inline" ? 3 : 2), full = S.box + S.pad * 2, C = { x: full / 2, y: full / 2 };
    cv.width = Math.round(full * dpr); cv.height = Math.round(full * dpr);

    let raf = 0, last = 0, regen = 0, level = 0, shown = -1, visible = true, current: Phase = phaseRef.current;
    let tight = 1, reach = 0, sweep = 0, flash = 0, collapse = -1;
    const fs: Filament[] = Array.from({ length: S.count }, (_, i) => ({ a: (i / S.count) * Math.PI * 2, k: 0, len: 0, pts: [] }));

    const setLevel = (v: number) => { if (Math.abs(v - shown) < 0.01) return; shown = v; el.style.setProperty("--crna-level", v.toFixed(3)); };
    const lit = (f: Filament, m: (typeof MODES)[Phase]) => {
      if (current !== "planning") return rand() < m.active;
      // Planning: a bright sector sweeps round; the rest of the crown barely flickers.
      const d = Math.atan2(Math.sin(f.a - sweep), Math.cos(f.a - sweep));
      return rand() < m.active + 0.95 * Math.exp(-(d * d) / (2 * 0.5 * 0.5));
    };
    const shape = (m: (typeof MODES)[Phase]) => {
      for (const f of fs) {
        const on = collapse < 0 ? lit(f, m) : rand() < 0.8;
        f.k = on ? 0.45 + rand() * 0.55 : 0;
        if (!on) continue;
        const long = rand() < m.streamer ? 2.4 + rand() * 1.2 : 1;
        f.len = (S.len[0] + rand() * (S.len[1] - S.len[0])) * long;
        const a = f.a + (rand() - 0.5) * (Math.PI * 2 / S.count) * 0.8, r0 = S.r * tight, r1 = r0 + f.len * reach;
        f.pts = bolt({ x: C.x + Math.cos(a) * r0, y: C.y + Math.sin(a) * r0 }, { x: C.x + Math.cos(a) * r1, y: C.y + Math.sin(a) * r1 }, f.len * reach * 0.28, long > 1 ? 4 : 2, rand);
      }
    };
    const draw = () => {
      ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, cv.width, cv.height);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.globalCompositeOperation = "lighter"; ctx.lineJoin = "round"; ctx.lineCap = "round";
      // A faint ring of light where the crown sits.
      const r0 = S.r * tight, g = ctx.createRadialGradient(C.x, C.y, r0 * 0.7, C.x, C.y, r0 + S.len[1] * reach * 0.6 + 1);
      g.addColorStop(0, "transparent"); g.addColorStop(0.5, B.glow); g.addColorStop(1, "transparent");
      ctx.globalAlpha = 0.16 * Math.min(1, level + flash); ctx.fillStyle = g; ctx.fillRect(0, 0, full, full);
      for (const f of fs) {
        if (f.k <= 0.02 || f.pts.length < 2) continue;
        ctx.beginPath(); ctx.moveTo(f.pts[0].x, f.pts[0].y);
        for (let i = 1; i < f.pts.length; i++) ctx.lineTo(f.pts[i].x, f.pts[i].y);
        ctx.strokeStyle = B.glow; ctx.globalAlpha = 0.5 * f.k; ctx.lineWidth = S.glow; ctx.shadowColor = B.glow; ctx.shadowBlur = S.blur * dpr; ctx.stroke();
        ctx.shadowBlur = 0; ctx.strokeStyle = B.core; ctx.globalAlpha = 0.9 * f.k; ctx.lineWidth = S.core; ctx.stroke();
      }
      ctx.globalCompositeOperation = "source-over"; ctx.globalAlpha = 1;
    };

    const tick = (now: number) => {
      raf = 0;
      const dt = last ? Math.min(0.05, (now - last) / 1000) : 1 / 60;
      last = now;
      const next = phaseRef.current;
      if (next !== current) {
        if (next === "done") collapse = 0;
        if (current === "done") collapse = -1;
        current = next;
      }
      const m = MODES[current];
      level += (m.level - level) * Math.min(1, dt * 5);
      if (collapse >= 0) {
        // Done: the crown shrinks into the mark over 0.45s, then the mark glows once.
        collapse += dt / 0.45;
        tight = 1 - 0.8 * Math.min(1, collapse); reach = Math.max(0, 1 - collapse);
        if (collapse >= 1 && reach <= 0) { if (flash === 0 && collapse < 1.2) flash = 1; for (const f of fs) f.k = 0; }
      } else {
        tight += (m.tight - tight) * Math.min(1, dt * 4);
        reach += (m.reach - reach) * Math.min(1, dt * 6);
      }
      if (current === "planning") sweep += dt * (Math.PI * 2) / 1.4;
      flash = Math.max(0, flash - dt * 2);

      regen -= dt;
      if (regen <= 0) { regen = m.regen; if (collapse < 0 || reach > 0) shape(m); }
      setLevel(level + flash * 0.9);
      draw();
      const busy = current !== "done" || reach > 0.01 || flash > 0 || level > 0.01;
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
    if (current === "done") reach = 0;
    run();
    return () => { cancelAnimationFrame(raf); io.disconnect(); document.removeEventListener("visibilitychange", onVis); kick.current = () => {}; };
  }, [brand, size, motion]);

  useEffect(() => { kick.current(); }, [phase]);

  const B = BRANDS[brand], S = SIZES[size], label = labels?.[phase] ?? LABELS[phase], working = phase !== "done";
  const vars = { ["--crna-mark" as string]: B.mark, ["--crna-glow" as string]: B.glow, ["--crna-hint" as string]: B.hint, ["--crna-box" as string]: `${S.box}px`, ["--crna-m" as string]: `${S.mark}px`, ["--crna-pad" as string]: `${S.pad}px` } as CSSProperties;
  return (
    <span ref={root} className={`crna crna--${size} ${working ? "is-working" : ""} ${motion === "reduced" ? "crna--still" : ""} ${className}`} data-phase={phase} style={vars}>
      <span className="crna__crown" aria-hidden="true">
        <canvas ref={canvas} className="crna__discharge" />
        <svg className="crna__logo" viewBox="0 0 24 24"><path d={MARKS[brand]} fill="currentColor" fillRule="evenodd" /></svg>
      </span>
      <span className="crna__text" role="status">
        <span className="crna__sr">{B.name}: </span>
        {size === "hero" && <span className="crna__brand" aria-hidden="true">{B.name}<span className="crna__dot">·</span></span>}
        <span className="crna__label">{label}{working ? "…" : ""}</span>
      </span>
    </span>
  );
}

export default Corona;
