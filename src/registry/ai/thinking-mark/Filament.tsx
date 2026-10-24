"use client";
import { useEffect, useRef, type CSSProperties } from "react";
import { heatColour, mix } from "./colour";
import { at, pick } from "./geometry";
import { BRANDS, LABELS, MARKS, type Brand, type Phase } from "./marks";
import { outline } from "./outline";
import { seeded } from "./random";
import "./filament.css";

export type { Brand, Phase };

export type FilamentProps = {
  brand?: Brand;
  phase?: Phase;
  /** inline: a 20px mark beside the phase word, for a chat reply. hero: a large mark with a caption pill. */
  size?: "inline" | "hero";
  labels?: Partial<Record<Phase, string>>;
  motion?: "full" | "reduced";
  className?: string;
};

// px: the mark. pad: room for glow and sparks. wire/glow: stroke widths in px. blur: halo. Sparks: px/s, px/s², per s.
const SIZES = {
  inline: { px: 20, pad: 9, wire: 0.7, glow: 1.5, blur: 3, speed: [14, 30], gravity: 70, rate: 9, spark: 0.8, streak: 0.05 },
  hero: { px: 132, pad: 48, wire: 1.6, glow: 4.6, blur: 14, speed: [70, 170], gravity: 320, rate: 38, spark: 1.8, streak: 0.06 },
};

// heat: the wire's base temperature (0–1). flicker: how much it wavers. sparks: whether it sheds them.
const MODES: Record<Phase, { heat: number; flicker: number; sparks: boolean; level: number }> = {
  thinking: { heat: 0.6, flicker: 0.07, sparks: false, level: 0.6 },
  planning: { heat: 0.42, flicker: 0.04, sparks: false, level: 0.7 },
  coding: { heat: 0.9, flicker: 0.1, sparks: true, level: 1 },
  done: { heat: 0, flicker: 0, sparks: false, level: 0 },
};

type Spark = { x: number; y: number; vx: number; vy: number; life: number; max: number };
const CENTRE = { x: 12, y: 12 };

/**
 * Filament
 * The assistant's mark as a hot wire: while it works the logo dims and its outline glows like a tungsten filament,
 * flickering warm while it thinks, heating segment by segment round the outline while it plans, running white-hot
 * and shedding sparks while it writes code, then cooling back into the plain logo when it is done.
 */
export function Filament({ brand = "claude", phase = "thinking", size = "inline", labels, motion = "full", className = "" }: FilamentProps) {
  const root = useRef<HTMLSpanElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const phaseRef = useRef(phase);
  const kick = useRef<() => void>(() => {});
  phaseRef.current = phase;

  useEffect(() => {
    const el = root.current, cv = canvas.current, ctx = cv?.getContext("2d");
    if (!el || !cv || !ctx) return;
    const B = BRANDS[brand], S = SIZES[size], o = outline(MARKS[brand]), rand = seeded(13 + brand.length);
    const still = motion === "reduced" || matchMedia("(prefers-reduced-motion: reduce)").matches;
    const scale = S.px / 24, ember = mix(B.mark, "#000000", 0.62);
    const dpr = Math.min(devicePixelRatio || 1, size === "inline" ? 3 : 2), box = S.px + S.pad * 2;
    cv.width = Math.round(box * dpr); cv.height = Math.round(box * dpr);
    const X = (x: number) => S.pad + x * scale;

    let raf = 0, last = 0, level = 0, shown = -1, visible = true, current: Phase = phaseRef.current;
    let heat = 0, wobble = 0, owed = 0, head = 0, stepT = 0, from = 0;
    const sparks: Spark[] = [];

    const setLevel = (v: number) => { if (Math.abs(v - shown) < 0.01) return; shown = v; el.style.setProperty("--flmt-level", v.toFixed(3)); };
    // Stroke a stretch of one contour (s0 to s1, in grid units) at heat h.
    const wire = (ci: number, s0: number, s1: number, h: number, k = 1) => {
      const c = o.contours[ci], col = heatColour(ember, B.glow, B.core, h), step = 0.3;
      ctx.beginPath();
      for (let s = s0, first = true; s <= s1 + 1e-6; s += step, first = false) {
        const p = at(c, Math.min(s, s1));
        if (first) ctx.moveTo(X(p.x), X(p.y)); else ctx.lineTo(X(p.x), X(p.y));
      }
      ctx.strokeStyle = col; ctx.globalAlpha = Math.min(1, 0.25 + h * 0.6) * k; ctx.lineWidth = S.glow; ctx.shadowColor = B.glow; ctx.shadowBlur = S.blur * dpr * h; ctx.stroke();
      ctx.shadowBlur = 0; ctx.globalAlpha = Math.min(1, 0.35 + h) * k; ctx.lineWidth = S.wire; ctx.stroke();
    };
    const emit = () => {
      for (let tries = 0; tries < 6; tries++) {
        const ci = pick(o, rand()), p = at(o.contours[ci], rand() * o.contours[ci].len);
        const rx = p.x - CENTRE.x, ry = p.y - CENTRE.y, rl = Math.hypot(rx, ry);
        if (rl < 5) continue;
        let dx = p.nx + rx / rl, dy = p.ny + ry / rl - 0.4;
        const dl = Math.hypot(dx, dy) || 1, v = S.speed[0] + rand() * (S.speed[1] - S.speed[0]), max = 0.3 + rand() * 0.4;
        dx /= dl; dy /= dl;
        sparks.push({ x: X(p.x), y: X(p.y), vx: dx * v, vy: dy * v, life: max, max });
        return;
      }
    };
    const draw = () => {
      ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, cv.width, cv.height);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.globalCompositeOperation = "lighter"; ctx.lineJoin = "round"; ctx.lineCap = "round";
      const h = Math.max(0, Math.min(1, heat + wobble));
      if (h > 0.02) o.contours.forEach((c, ci) => wire(ci, 0, c.len, h * (0.94 + 0.06 * Math.sin(ci * 1.7 + wobble * 40))));
      // Planning: a hot stretch travels round the outline a segment at a time.
      if (current === "planning" && heat > 0.05) {
        const total = o.total, span = total * 0.16;
        let s = ((head % total) + total) % total;
        for (let ci = 0; ci < o.contours.length; ci++) {
          const c = o.contours[ci];
          if (s < c.len) { wire(ci, s, Math.min(c.len, s + span), 1, Math.min(1, heat * 2.2)); break; }
          s -= c.len;
        }
      }
      for (const sp of sparks) {
        const k = sp.life / sp.max;
        ctx.strokeStyle = heatColour(ember, B.glow, B.core, 0.6 + k * 0.4); ctx.globalAlpha = Math.min(1, 0.3 + k); ctx.lineWidth = S.spark;
        ctx.beginPath(); ctx.moveTo(sp.x, sp.y); ctx.lineTo(sp.x - sp.vx * S.streak, sp.y - sp.vy * S.streak); ctx.shadowColor = B.glow; ctx.shadowBlur = S.blur * 0.5 * dpr; ctx.stroke(); ctx.shadowBlur = 0;
      }
      ctx.globalCompositeOperation = "source-over"; ctx.globalAlpha = 1;
    };

    const tick = (now: number) => {
      raf = 0;
      const dt = last ? Math.min(0.05, (now - last) / 1000) : 1 / 60;
      last = now;
      const next = phaseRef.current;
      if (next !== current) { if (next === "planning") { head = rand() * o.total; from = head; stepT = 0; } current = next; }
      const m = MODES[current];
      level += (m.level - level) * Math.min(1, dt * 4);
      // Heating up is quick; cooling down after done takes about a second, through the glow colour to an ember.
      heat += (m.heat - heat) * Math.min(1, dt * (m.heat > heat ? 5 : 2.4));
      wobble += ((rand() - 0.5) * 2 * m.flicker - wobble) * Math.min(1, dt * 14);
      if (current === "planning") {
        stepT += dt;
        if (stepT >= 0.22) { stepT = 0; from = head; }
        const e = Math.min(1, stepT / 0.09);
        head = from + (o.total / 12) * (1 - (1 - e) ** 3);
      }
      if (m.sparks) { owed += S.rate * dt; while (owed >= 1) { owed -= 1; emit(); } }
      for (let i = sparks.length - 1; i >= 0; i--) {
        const sp = sparks[i];
        sp.life -= dt; sp.vy += S.gravity * dt; sp.x += sp.vx * dt; sp.y += sp.vy * dt;
        if (sp.life <= 0) sparks.splice(i, 1);
      }
      setLevel(Math.max(level, heat));
      draw();
      const busy = current !== "done" || heat > 0.02 || sparks.length > 0 || level > 0.01;
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
  const vars = { ["--flmt-mark" as string]: B.mark, ["--flmt-glow" as string]: B.glow, ["--flmt-hint" as string]: B.hint, ["--flmt-px" as string]: `${S.px}px`, ["--flmt-pad" as string]: `${S.pad}px` } as CSSProperties;
  return (
    <span ref={root} className={`flmt flmt--${size} ${working ? "is-working" : ""} ${motion === "reduced" ? "flmt--still" : ""} ${className}`} data-phase={phase} style={vars}>
      <span className="flmt__mark" aria-hidden="true">
        <svg className="flmt__logo" viewBox="0 0 24 24"><path d={MARKS[brand]} fill="currentColor" fillRule="evenodd" /></svg>
        <canvas ref={canvas} className="flmt__wire" />
      </span>
      <span className="flmt__text" role="status">
        <span className="flmt__sr">{B.name}: </span>
        {size === "hero" && <span className="flmt__brand" aria-hidden="true">{B.name}<span className="flmt__dot">·</span></span>}
        <span className="flmt__label">{label}{working ? "…" : ""}</span>
      </span>
    </span>
  );
}

export default Filament;
