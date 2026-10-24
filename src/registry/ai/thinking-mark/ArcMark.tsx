"use client";
import { useEffect, useRef, type CSSProperties } from "react";
import { bolt } from "./bolt";
import { crawl, fork } from "./crawl";
import { at, pick, type Vec } from "./geometry";
import { BRANDS, LABELS, MARKS, type Brand, type Phase } from "./marks";
import { outline } from "./outline";
import { seeded } from "./random";
import "./arc-mark.css";

export type { Brand, Phase };

export type ArcMarkProps = {
  brand?: Brand;
  phase?: Phase;
  /** inline: a 20px mark beside the phase word, for a chat reply. hero: a large mark with a caption pill. */
  size?: "inline" | "hero";
  labels?: Partial<Record<Phase, string>>;
  motion?: "full" | "reduced";
  className?: string;
};

// px: the mark. pad: room round it for arcs. glow/core: stroke widths in px. blur: halo. gap: px between arc
// samples. rough: jitter across the edge. out: how far arcs stand off the edge, in px. reach: fork length, px
// (from, plus up to). jumps: chance per re-jitter, while coding, of a bolt leaping between two nearby edges.
const SIZES = {
  inline: { px: 20, pad: 8, glow: 2.3, core: 1, blur: 4, gap: 2.2, rough: 1.2, out: 1.5, reach: [3, 4], jumps: 0.18 },
  hero: { px: 132, pad: 44, glow: 4.2, core: 1.5, blur: 16, gap: 3.4, rough: 2.6, out: 3.4, reach: [10, 20], jumps: 0.3 },
};

// Lengths are in the mark's 24-unit grid. level drives the mark's own glow.
const MODES: Record<Phase, { count: number; regen: number; len: [number, number]; life: [number, number]; fork: number; drift: number; level: number }> = {
  thinking: { count: 2, regen: 0.075, len: [5, 11], life: [0.35, 0.8], fork: 0.1, drift: 4, level: 0.5 },
  planning: { count: 0, regen: 0.06, len: [4, 6], life: [0, 0], fork: 0, drift: 0, level: 0.65 },
  coding: { count: 5, regen: 0.04, len: [4, 12], life: [0.12, 0.4], fork: 0.32, drift: 12, level: 1 },
  done: { count: 0, regen: 0.05, len: [0, 0], life: [0, 0], fork: 0, drift: 0, level: 0 },
};

type Streamer = { c: number; s: number; len: number; life: number; dir: number; pts: Vec[]; branch: Vec[] | null };
const CENTRE = { x: 12, y: 12 };

/**
 * Arc Mark
 * The assistant's own mark with electricity crawling along its outline while it works: a couple of slow arcs while
 * it thinks, one arc leaping from edge to edge while it plans, a crackling swarm with forks while it writes code,
 * and one sweep round the whole mark when it is done.
 */
export function ArcMark({ brand = "claude", phase = "thinking", size = "inline", labels, motion = "full", className = "" }: ArcMarkProps) {
  const root = useRef<HTMLSpanElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const phaseRef = useRef(phase);
  const kick = useRef<() => void>(() => {});
  phaseRef.current = phase;

  useEffect(() => {
    const el = root.current, cv = canvas.current, ctx = cv?.getContext("2d");
    if (!el || !cv || !ctx) return;
    const B = BRANDS[brand], S = SIZES[size], o = outline(MARKS[brand]), rand = seeded(7 + brand.length);
    const still = motion === "reduced" || matchMedia("(prefers-reduced-motion: reduce)").matches;
    const scale = S.px / 24, gap = S.gap / scale, rough = S.rough / scale, out = S.out / scale;
    // A place on the outline, favouring the outer edges and tips, where arcs read clearly and cross nothing.
    const place = () => {
      let c = 0, s = 0;
      for (let tries = 0; tries < 6; tries++) {
        c = pick(o, rand()); s = rand() * o.contours[c].len;
        const p = at(o.contours[c], s);
        if (Math.hypot(p.x - CENTRE.x, p.y - CENTRE.y) > 5) break;
      }
      return { c, s };
    };
    // A small canvas can afford the full pixel ratio of a 3x phone; the large one stops at 2x.
    const dpr = Math.min(devicePixelRatio || 1, size === "inline" ? 3 : 2), box = S.px + S.pad * 2;
    cv.width = Math.round(box * dpr); cv.height = Math.round(box * dpr);

    let raf = 0, last = 0, regen = 0, level = 0, shown = -1, visible = true;
    let current: Phase = phaseRef.current, hopT = 0, hopC = 0, hopS = 0, leap: Vec[] | null = null, leapK = 0, sweep = -1, fade = 0;
    let hop: Vec[] = [], jump: Vec[] | null = null;
    // Two nearby points on different parts of the outline (another contour, or far along this one), for a jump.
    const jumper = () => {
      for (let tries = 0; tries < 10; tries++) {
        const a = place(), b = place();
        if (a.c === b.c && Math.abs(a.s - b.s) < 4) continue;
        const p = at(o.contours[a.c], a.s), q = at(o.contours[b.c], b.s), d = Math.hypot(q.x - p.x, q.y - p.y);
        if (d > 2 && d < 6.5) return bolt({ x: p.x + p.nx * out, y: p.y + p.ny * out }, { x: q.x + q.nx * out, y: q.y + q.ny * out }, d * 0.3, 4, rand);
      }
      return null;
    };
    const trail: { pts: Vec[]; k: number }[] = [];
    const streams: Streamer[] = [];

    const setLevel = (v: number) => {
      if (Math.abs(v - shown) < 0.01) return;
      shown = v; el.style.setProperty("--arcm-level", v.toFixed(3));
    };
    const stroke = (pts: Vec[], k: number) => {
      if (pts.length < 2 || k <= 0.01) return;
      ctx.beginPath(); ctx.moveTo(pts[0].x, pts[0].y);
      for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
      ctx.strokeStyle = B.glow; ctx.globalAlpha = 0.55 * k; ctx.lineWidth = S.glow / scale; ctx.shadowColor = B.glow; ctx.shadowBlur = S.blur * dpr; ctx.stroke();
      ctx.shadowBlur = 0; ctx.strokeStyle = B.core; ctx.globalAlpha = 0.95 * k; ctx.lineWidth = S.core / scale; ctx.stroke();
    };
    const spawn = (st: Streamer, m: (typeof MODES)[Phase], fresh: boolean) => {
      const p = place(); st.c = p.c; st.s = p.s;
      st.len = m.len[0] + rand() * (m.len[1] - m.len[0]);
      st.life = (m.life[0] + rand() * (m.life[1] - m.life[0])) * (fresh ? rand() : 1);
      st.dir = rand() < 0.5 ? -1 : 1;
    };
    const shape = (m: (typeof MODES)[Phase]) => {
      for (const st of streams) {
        const c = o.contours[st.c];
        st.pts = crawl(c, st.s - st.len / 2, st.len, out * (0.7 + rand() * 0.6), rough, gap, rand);
        st.branch = rand() < m.fork ? fork(c, st.s + (rand() - 0.5) * st.len * 0.6, (S.reach[0] + rand() * S.reach[1]) / scale, CENTRE, rand) : null;
      }
      jump = current === "coding" && rand() < S.jumps ? jumper() : null;
      if (current === "planning") hop = crawl(o.contours[hopC], hopS - 2.5, 5, out * 1.1, rough * 1.2, gap, rand);
    };
    const nextHop = () => {
      const from = at(o.contours[hopC], hopS);
      if (o.contours.length >= 3) { hopC = (hopC + 1) % o.contours.length; hopS = rand() * o.contours[hopC].len; }
      else {
        // Step round a single-contour mark, landing on its outer half so each leap reads as tip to tip.
        const c = o.contours[hopC];
        for (let tries = 0, s0 = hopS; tries < 8; tries++) {
          hopS = s0 + c.len / 13 * (0.8 + tries * 0.35 + rand() * 0.3);
          const p = at(c, hopS);
          if (Math.hypot(p.x - CENTRE.x, p.y - CENTRE.y) > 7) break;
        }
      }
      const to = at(o.contours[hopC], hopS);
      if (hop.length) trail.unshift({ pts: hop, k: 0.7 });
      trail.length = Math.min(trail.length, 3);
      leap = bolt({ x: from.x + from.nx * out, y: from.y + from.ny * out }, { x: to.x + to.nx * out, y: to.y + to.ny * out }, Math.hypot(to.x - from.x, to.y - from.y) * 0.22, 3, rand);
      leapK = 1;
    };

    const draw = () => {
      ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, cv.width, cv.height);
      ctx.setTransform(dpr * scale, 0, 0, dpr * scale, S.pad * dpr, S.pad * dpr);
      ctx.globalCompositeOperation = "lighter"; ctx.lineJoin = "round"; ctx.lineCap = "round";
      for (const st of streams) {
        const k = Math.min(1, st.life * 8);
        stroke(st.pts, k);
        if (st.branch) stroke(st.branch, k * 0.75);
      }
      if (current === "planning") stroke(hop, 1);
      for (const t of trail) stroke(t.pts, t.k);
      if (leap) stroke(leap, leapK);
      if (jump) stroke(jump, 0.9);
      if (sweep >= 0) {
        const p = Math.min(1, sweep);
        for (const c of o.contours) stroke(crawl(c, 0, c.len * p, out * 0.8, rough * 0.8, gap, rand), fade);
      }
      ctx.globalCompositeOperation = "source-over"; ctx.globalAlpha = 1;
    };

    const tick = (now: number) => {
      raf = 0;
      const dt = last ? Math.min(0.05, (now - last) / 1000) : 1 / 60;
      last = now;
      const next = phaseRef.current;
      if (next !== current) {
        if (next === "done") { sweep = 0; fade = 1; }
        if (next === "planning") { hopT = 0; const p = place(); hopC = p.c; hopS = p.s; }
        if (current === "planning") trail.length = 0;
        current = next;
      }
      const m = MODES[current];
      level += (m.level - level) * Math.min(1, dt * 5);

      while (streams.length < m.count) { const st = { pts: [], branch: null } as unknown as Streamer; spawn(st, m, true); streams.push(st); }
      for (let i = streams.length - 1; i >= 0; i--) {
        const st = streams[i];
        st.life -= dt;
        st.s += st.dir * m.drift * dt;
        if (st.life <= 0) { if (streams.length > m.count) streams.splice(i, 1); else spawn(st, m, false); }
      }
      if (current === "planning") { hopT -= dt; if (hopT <= 0) { hopT = 0.17 + rand() * 0.06; nextHop(); } }
      for (const t of trail) t.k -= dt * 3.2;
      while (trail.length && trail[trail.length - 1].k <= 0) trail.pop();
      leapK -= dt * 7; if (leapK <= 0) leap = null;
      if (sweep >= 0) { sweep += dt / 0.55; if (sweep > 1) fade -= dt / 0.4; if (fade <= 0) sweep = -1; }

      regen -= dt;
      if (regen <= 0) { regen = m.regen; shape(m); }
      setLevel(level + (sweep >= 0 ? fade * 0.6 : 0));
      draw();
      if (current !== "coding") jump = null;
      const busy = current !== "done" || sweep >= 0 || streams.length > 0 || trail.length > 0 || leap || level > 0.01;
      if (busy && visible && !document.hidden) raf = requestAnimationFrame(tick);
      else if (!busy) { setLevel(0); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, cv.width, cv.height); }
    };
    const run = () => {
      if (still) { setLevel(MODES[phaseRef.current].level); return; }
      if (!raf && visible && !document.hidden) { last = 0; raf = requestAnimationFrame(tick); }
    };
    kick.current = run;

    // Work only while the mark is on screen and the tab is in front.
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible) run(); else { cancelAnimationFrame(raf); raf = 0; } });
    io.observe(el);
    const onVis = () => { if (!document.hidden) run(); };
    document.addEventListener("visibilitychange", onVis);
    if (current === "done") level = 0; // mounted finished: rest, no sweep
    run();
    return () => { cancelAnimationFrame(raf); io.disconnect(); document.removeEventListener("visibilitychange", onVis); kick.current = () => {}; };
  }, [brand, size, motion]);

  useEffect(() => { kick.current(); }, [phase]);

  const B = BRANDS[brand], S = SIZES[size], label = labels?.[phase] ?? LABELS[phase], working = phase !== "done";
  const vars = { ["--arcm-mark" as string]: B.mark, ["--arcm-glow" as string]: B.glow, ["--arcm-hint" as string]: B.hint, ["--arcm-px" as string]: `${S.px}px`, ["--arcm-pad" as string]: `${S.pad}px` } as CSSProperties;
  return (
    <span ref={root} className={`arcm arcm--${size} ${working ? "is-working" : ""} ${motion === "reduced" ? "arcm--still" : ""} ${className}`} data-phase={phase} style={vars}>
      <span className="arcm__mark" aria-hidden="true">
        <svg className="arcm__logo" viewBox="0 0 24 24"><path d={MARKS[brand]} fill="currentColor" fillRule="evenodd" /></svg>
        <canvas ref={canvas} className="arcm__arcs" />
      </span>
      <span className="arcm__text" role="status">
        <span className="arcm__sr">{B.name}: </span>
        {size === "hero" && <span className="arcm__brand" aria-hidden="true">{B.name}<span className="arcm__dot">·</span></span>}
        <span className="arcm__label">{label}{working ? "…" : ""}</span>
      </span>
    </span>
  );
}

export default ArcMark;
