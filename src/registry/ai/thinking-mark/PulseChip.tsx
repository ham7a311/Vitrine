"use client";
import { useEffect, useRef, type CSSProperties } from "react";
import { crawl, fork } from "./crawl";
import type { Contour, Vec } from "./geometry";
import { BRANDS, LABELS, MARKS, type Brand, type Phase } from "./marks";
import { pill } from "./pill";
import { seeded } from "./random";
import "./pulse-chip.css";

export type { Brand, Phase };

export type PulseChipProps = {
  brand?: Brand;
  phase?: Phase;
  /** Accepted for a common indicator API; the chip is always inline. */
  size?: "inline" | "hero";
  /** Words after the assistant's name while it works ("is thinking"); the done label stands alone. */
  labels?: Partial<Record<Phase, string>>;
  motion?: "full" | "reduced";
  className?: string;
};

const PAD = 14;
const WORKING: Record<Exclude<Phase, "done">, string> = { thinking: "is thinking", planning: "is planning", coding: "is writing code" };

// count: streamers. len: px. life: seconds. drift: px/s. fork: chance per re-jitter. regen: seconds.
const MODES: Record<Phase, { count: number; len: [number, number]; life: [number, number]; drift: number; fork: number; regen: number; level: number }> = {
  thinking: { count: 2, len: [18, 34], life: [0.35, 0.8], drift: 14, fork: 0.08, regen: 0.07, level: 0.45 },
  planning: { count: 0, len: [0, 0], life: [0, 0], drift: 0, fork: 0, regen: 0.05, level: 0.6 },
  coding: { count: 5, len: [14, 40], life: [0.12, 0.4], drift: 40, fork: 0.3, regen: 0.04, level: 1 },
  done: { count: 0, len: [0, 0], life: [0, 0], drift: 0, fork: 0, regen: 0.05, level: 0 },
};

type Streamer = { s: number; len: number; life: number; dir: number; pts: Vec[]; branch: Vec[] | null };

/**
 * Pulse Chip
 * A compact status pill for a chat thread — the assistant's mark and "Claude is thinking…" — with electricity
 * crawling round its border while it works: a couple of slow arcs while it thinks, one current lapping the pill
 * while it plans, a crackling swarm while it writes code, and a single discharge round the edge when it is done.
 */
export function PulseChip({ brand = "claude", phase = "thinking", labels, motion = "full", className = "" }: PulseChipProps) {
  const root = useRef<HTMLSpanElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const phaseRef = useRef(phase);
  const kick = useRef<() => void>(() => {});
  phaseRef.current = phase;

  useEffect(() => {
    const el = root.current, cv = canvas.current, ctx = cv?.getContext("2d");
    if (!el || !cv || !ctx) return;
    const B = BRANDS[brand], rand = seeded(29 + brand.length);
    const still = motion === "reduced" || matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(devicePixelRatio || 1, 3);
    let c: Contour = pill(100, 30, PAD, PAD), w = 100, h = 30;
    let raf = 0, last = 0, regen = 0, level = 0, shown = -1, visible = true, current: Phase = phaseRef.current;
    // The done discharge is kept as positions round the outline (0–1) and drawn on the current outline, because the
    // chip changes width as its label switches to the done label.
    let lap = 0, lapPts: Vec[] = [], sparks: { at: number; reach: number }[] = [], flash = 0;
    const streams: Streamer[] = [];

    // The chip's width follows its label, so the outline is rebuilt whenever it resizes.
    const size = () => {
      w = el.offsetWidth; h = el.offsetHeight;
      cv.style.width = `${w + PAD * 2}px`; cv.style.height = `${h + PAD * 2}px`;
      cv.width = Math.round((w + PAD * 2) * dpr); cv.height = Math.round((h + PAD * 2) * dpr);
      c = pill(w, h, PAD, PAD);
    };
    const setLevel = (v: number) => { if (Math.abs(v - shown) < 0.01) return; shown = v; el.style.setProperty("--pchip-level", v.toFixed(3)); };
    const centre = () => ({ x: PAD + w / 2, y: PAD + h / 2 });
    const spawn = (st: Streamer, m: (typeof MODES)[Phase], fresh: boolean) => {
      st.s = rand() * c.len; st.len = m.len[0] + rand() * (m.len[1] - m.len[0]);
      st.life = (m.life[0] + rand() * (m.life[1] - m.life[0])) * (fresh ? rand() : 1); st.dir = rand() < 0.5 ? -1 : 1;
    };
    const stroke = (pts: Vec[], k: number) => {
      if (pts.length < 2 || k <= 0.01) return;
      ctx.beginPath(); ctx.moveTo(pts[0].x, pts[0].y);
      for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
      ctx.strokeStyle = B.glow; ctx.globalAlpha = 0.55 * k; ctx.lineWidth = 2.4; ctx.shadowColor = B.glow; ctx.shadowBlur = 7 * dpr; ctx.stroke();
      ctx.shadowBlur = 0; ctx.strokeStyle = B.core; ctx.globalAlpha = 0.95 * k; ctx.lineWidth = 0.9; ctx.stroke();
    };
    const shape = (m: (typeof MODES)[Phase]) => {
      for (const st of streams) {
        st.pts = crawl(c, st.s - st.len / 2, st.len, 1.5 + rand() * 1.5, 1.6, 3, rand);
        st.branch = rand() < m.fork ? fork(c, st.s + (rand() - 0.5) * st.len * 0.5, 5 + rand() * 7, centre(), rand) : null;
      }
      if (current === "planning") lapPts = crawl(c, lap - 22, 44, 2, 1.4, 3, rand);
    };
    const draw = () => {
      ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, cv.width, cv.height);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.globalCompositeOperation = "lighter"; ctx.lineJoin = "round"; ctx.lineCap = "round";
      for (const st of streams) { const k = Math.min(1, st.life * 8); stroke(st.pts, k); if (st.branch) stroke(st.branch, k * 0.75); }
      if (current === "planning") stroke(lapPts, 1);
      if (flash > 0) {
        stroke(crawl(c, 0, c.len, 2, 1.8, 3, rand), flash);
        for (const sp of sparks) stroke(fork(c, sp.at * c.len, sp.reach, centre(), rand), flash);
      }
      ctx.globalCompositeOperation = "source-over"; ctx.globalAlpha = 1;
    };

    const tick = (now: number) => {
      raf = 0;
      const dt = last ? Math.min(0.05, (now - last) / 1000) : 1 / 60;
      last = now;
      const next = phaseRef.current;
      if (next !== current) {
        if (next === "done") {
          // One discharge all the way round, with sparks thrown off it.
          sparks = Array.from({ length: 6 }, (_, i) => ({ at: (i + rand() * 0.5) / 6, reach: 7 + rand() * 8 }));
          flash = 1;
        }
        if (next === "planning") lap = rand() * c.len;
        current = next;
      }
      const m = MODES[current];
      level += (m.level - level) * Math.min(1, dt * 5);
      while (streams.length < m.count) { const st = { pts: [], branch: null } as unknown as Streamer; spawn(st, m, true); streams.push(st); }
      for (let i = streams.length - 1; i >= 0; i--) {
        const st = streams[i];
        st.life -= dt; st.s += st.dir * m.drift * dt;
        if (st.life <= 0) { if (streams.length > m.count) streams.splice(i, 1); else spawn(st, m, false); }
      }
      // Planning: one current laps the chip steadily, about once every 1.6s.
      if (current === "planning") lap += (c.len / 1.6) * dt;
      flash = Math.max(0, flash - dt / 0.35);

      regen -= dt;
      if (regen <= 0) { regen = m.regen; shape(m); }
      setLevel(level + flash * 0.8);
      draw();
      const busy = current !== "done" || streams.length > 0 || flash > 0 || level > 0.01;
      if (busy && visible && !document.hidden) raf = requestAnimationFrame(tick);
      else if (!busy) { setLevel(0); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, cv.width, cv.height); }
    };
    const run = () => {
      if (still) { setLevel(MODES[phaseRef.current].level); return; }
      if (!raf && visible && !document.hidden) { last = 0; raf = requestAnimationFrame(tick); }
    };
    kick.current = run;

    const ro = new ResizeObserver(size);
    ro.observe(el);
    size();
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible) run(); else { cancelAnimationFrame(raf); raf = 0; } });
    io.observe(el);
    const onVis = () => { if (!document.hidden) run(); };
    document.addEventListener("visibilitychange", onVis);
    run();
    return () => { cancelAnimationFrame(raf); ro.disconnect(); io.disconnect(); document.removeEventListener("visibilitychange", onVis); kick.current = () => {}; };
  }, [brand, motion]);

  useEffect(() => { kick.current(); }, [phase]);

  const B = BRANDS[brand], working = phase !== "done";
  const words = phase === "done" ? labels?.done ?? LABELS.done : labels?.[phase] ?? WORKING[phase];
  const vars = { ["--pchip-mark" as string]: B.mark, ["--pchip-glow" as string]: B.glow, ["--pchip-hint" as string]: B.hint, ["--pchip-pad" as string]: `${PAD}px` } as CSSProperties;
  return (
    <span ref={root} className={`pchip ${working ? "is-working" : ""} ${motion === "reduced" ? "pchip--still" : ""} ${className}`} data-phase={phase} style={vars}>
      <svg className="pchip__logo" viewBox="0 0 24 24" aria-hidden="true"><path d={MARKS[brand]} fill="currentColor" fillRule="evenodd" /></svg>
      <span className="pchip__text" role="status">
        {working ? <><span className="pchip__name">{B.name}</span> <span className="pchip__label">{words}…</span></> : <><span className="pchip__sr">{B.name}: </span><span className="pchip__label">{words}</span></>}
      </span>
      <canvas ref={canvas} className="pchip__arcs" aria-hidden="true" />
    </span>
  );
}

export default PulseChip;
