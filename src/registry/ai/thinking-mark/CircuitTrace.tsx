"use client";
import { useEffect, useMemo, useRef, type CSSProperties } from "react";
import { BRANDS, LABELS, MARKS, type Brand, type Phase } from "./marks";
import { seeded } from "./random";
import { along, pathOf, route, type Trace } from "./traces";
import "./circuit-trace.css";

export type { Brand, Phase };

export type CircuitTraceProps = {
  brand?: Brand;
  phase?: Phase;
  /** inline: a 26px board beside the phase word, for a chat reply. hero: a 220px board with a caption pill. */
  size?: "inline" | "hero";
  labels?: Partial<Record<Phase, string>>;
  motion?: "full" | "reduced";
  className?: string;
};

// box: the board. mark: the logo. count: traces. r0–r3: where each trace leaves the mark, bends, turns and ends.
// pad: pad radius. line: trace width. tail: pulse tail length. head: pulse head radius. speed: px/s at thinking.
const SIZES = {
  inline: { box: 26, mark: 13, count: 8, r: [7.6, 8.6, 10.6, 12.2], pad: 0.95, line: 0.6, tail: 4, head: 0.9, speed: 16, blur: 2.5 },
  hero: { box: 220, mark: 76, count: 12, r: [44, 54, 78, 100], pad: 3.2, line: 1.2, tail: 30, head: 2.4, speed: 80, blur: 10 },
};

// rate: new pulses per second. speed: multiplier. inward: share of pulses running back to the mark.
const MODES: Record<Phase, { rate: number; speed: number; inward: number; level: number }> = {
  thinking: { rate: 1.6, speed: 1, inward: 0, level: 0.45 },
  planning: { rate: 0, speed: 2.4, inward: 0, level: 0.6 },
  coding: { rate: 9, speed: 2, inward: 0.4, level: 1 },
  done: { rate: 0, speed: 1, inward: 0, level: 0 },
};

type Pulse = { t: number; s: number; v: number; inward: boolean };

/**
 * Circuit Trace
 * The assistant's mark at the heart of a small circuit board: current runs out along the traces while it works —
 * the odd pulse while it thinks, pads lighting one by one round the board while it plans, a rush both ways while
 * it writes code — and every pad lights at once when it is done.
 */
export function CircuitTrace({ brand = "claude", phase = "thinking", size = "inline", labels, motion = "full", className = "" }: CircuitTraceProps) {
  const S = SIZES[size];
  const traces = useMemo(() => route(S.box, S.count, S.r[0], S.r[1], S.r[2], S.r[3], 41), [S]);
  const root = useRef<HTMLSpanElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const phaseRef = useRef(phase);
  const kick = useRef<() => void>(() => {});
  phaseRef.current = phase;

  useEffect(() => {
    const el = root.current, cv = canvas.current, ctx = cv?.getContext("2d");
    if (!el || !cv || !ctx) return;
    const B = BRANDS[brand], rand = seeded(5 + brand.length);
    const still = motion === "reduced" || matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(devicePixelRatio || 1, size === "inline" ? 3 : 2);
    cv.width = Math.round(S.box * dpr); cv.height = Math.round(S.box * dpr);

    let raf = 0, last = 0, level = 0, shown = -1, visible = true, current: Phase = phaseRef.current, owed = 0, stepT = 0, step = 0, all = 0;
    const pulses: Pulse[] = [];
    const lit = new Float32Array(traces.length);

    const setLevel = (v: number) => { if (Math.abs(v - shown) < 0.01) return; shown = v; el.style.setProperty("--ctrace-level", v.toFixed(3)); };
    const fire = (t: number, inward: boolean, speed: number) => pulses.push({ t, s: inward ? traces[t].len : 0, v: S.speed * speed * (0.85 + rand() * 0.3), inward });

    const pulse = (p: Pulse) => {
      const tr: Trace = traces[p.t], dir = p.inward ? 1 : -1;
      // The tail: a few segments behind the head, each fainter than the last.
      const n = 6;
      for (let i = 0; i < n; i++) {
        const a = along(tr, p.s + dir * (S.tail * i) / n), b = along(tr, p.s + dir * (S.tail * (i + 1)) / n);
        ctx.globalAlpha = (1 - i / n) * 0.9; ctx.strokeStyle = B.glow; ctx.lineWidth = S.line * 2.2;
        ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
      }
      const h = along(tr, p.s);
      ctx.globalAlpha = 1; ctx.fillStyle = B.core; ctx.shadowColor = B.glow; ctx.shadowBlur = S.blur * dpr;
      ctx.beginPath(); ctx.arc(h.x, h.y, S.head, 0, Math.PI * 2); ctx.fill(); ctx.shadowBlur = 0;
    };
    const pad = (t: Trace, k: number) => {
      if (k <= 0.02) return;
      ctx.globalAlpha = k; ctx.fillStyle = B.core; ctx.shadowColor = B.glow; ctx.shadowBlur = S.blur * 1.4 * dpr;
      ctx.beginPath(); ctx.arc(t.pad.x, t.pad.y, S.pad * 1.05, 0, Math.PI * 2); ctx.fill(); ctx.shadowBlur = 0;
    };
    const draw = () => {
      ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, cv.width, cv.height);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.globalCompositeOperation = "lighter"; ctx.lineCap = "round";
      for (const p of pulses) pulse(p);
      traces.forEach((t, i) => pad(t, Math.max(lit[i], all)));
      ctx.globalCompositeOperation = "source-over"; ctx.globalAlpha = 1;
    };

    const tick = (now: number) => {
      raf = 0;
      const dt = last ? Math.min(0.05, (now - last) / 1000) : 1 / 60;
      last = now;
      const next = phaseRef.current;
      if (next !== current) {
        if (next === "done") { all = 1; pulses.length = 0; }
        if (next === "planning") { stepT = 0; step = Math.floor(rand() * traces.length); }
        current = next;
      }
      const m = MODES[current];
      level += (m.level - level) * Math.min(1, dt * 5);

      owed += m.rate * dt;
      while (owed >= 1) { owed -= 1; fire(Math.floor(rand() * traces.length), rand() < m.inward, m.speed); }
      // Planning: one pulse at a time races out to the next pad round the board, which stays lit for a while.
      if (current === "planning") { stepT -= dt; if (stepT <= 0) { stepT = 0.26; step = (step + 1) % traces.length; fire(step, false, m.speed); } }
      for (let i = pulses.length - 1; i >= 0; i--) {
        const p = pulses[i], tr = traces[p.t];
        p.s += (p.inward ? -1 : 1) * p.v * dt;
        const arrived = p.inward ? p.s <= -S.tail : p.s >= tr.len;
        if (!p.inward && p.s >= tr.len && p.s - p.v * dt < tr.len) lit[p.t] = 1;
        if (arrived && (p.inward || p.s >= tr.len + S.tail)) pulses.splice(i, 1);
      }
      for (let i = 0; i < lit.length; i++) lit[i] = Math.max(0, lit[i] - dt * (current === "planning" ? 0.9 : 2.4));
      all = Math.max(0, all - dt / 0.9);

      setLevel(level + all * 0.6);
      draw();
      const busy = current !== "done" || pulses.length > 0 || all > 0 || level > 0.01 || lit.some((v) => v > 0);
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
  }, [brand, size, motion, traces, S]);

  useEffect(() => { kick.current(); }, [phase]);

  const B = BRANDS[brand], label = labels?.[phase] ?? LABELS[phase], working = phase !== "done";
  const vars = { ["--ctrace-mark" as string]: B.mark, ["--ctrace-glow" as string]: B.glow, ["--ctrace-hint" as string]: B.hint, ["--ctrace-box" as string]: `${S.box}px`, ["--ctrace-m" as string]: `${S.mark}px` } as CSSProperties;
  return (
    <span ref={root} className={`ctrace ctrace--${size} ${working ? "is-working" : ""} ${motion === "reduced" ? "ctrace--still" : ""} ${className}`} data-phase={phase} style={vars}>
      <span className="ctrace__board" aria-hidden="true">
        <svg className="ctrace__traces" viewBox={`0 0 ${S.box} ${S.box}`}>
          {traces.map((t, i) => <path key={i} d={pathOf(t)} strokeWidth={S.line} />)}
          {traces.map((t, i) => <circle key={i} cx={t.pad.x} cy={t.pad.y} r={S.pad} strokeWidth={S.line} />)}
        </svg>
        <canvas ref={canvas} className="ctrace__current" />
        <svg className="ctrace__logo" viewBox="0 0 24 24"><path d={MARKS[brand]} fill="currentColor" fillRule="evenodd" /></svg>
      </span>
      <span className="ctrace__text" role="status">
        <span className="ctrace__sr">{B.name}: </span>
        {size === "hero" && <span className="ctrace__brand" aria-hidden="true">{B.name}<span className="ctrace__dot">·</span></span>}
        <span className="ctrace__label">{label}{working ? "…" : ""}</span>
      </span>
    </span>
  );
}

export default CircuitTrace;
