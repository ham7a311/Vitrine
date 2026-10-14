"use client";
import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { bolt, crawl, fork, length, seeded, type Vec } from "./arc";
import { around, nearest, pointAt } from "./perimeter";
import "./static-edge.css";

export type Charge = "blue" | "violet" | "amber";

export type StaticEdgeProps = {
  children: ReactNode;
  charge?: Charge;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  type?: "button" | "submit";
  motion?: "full" | "reduced";
  className?: string;
};

export const CHARGES: Record<Charge, { glow: string; core: string; face: string; label: string }> = {
  blue: { glow: "#3fa2ff", core: "#eef8ff", face: "#0a111f", label: "#e9f4ff" },
  violet: { glow: "#b06cff", core: "#f7efff", face: "#110a1e", label: "#f3eaff" },
  amber: { glow: "#ffa526", core: "#fff6e2", face: "#171006", label: "#fff1d8" },
};

const PAD = 28;
type Streamer = { s: number; len: number; life: number; pts: Vec[]; branch: Vec[] | null };

/**
 * Static Edge
 * Point at the button and it charges up: jagged arcs of electricity crawl along its edge, gathering
 * where your pointer is and snapping across to it when you come close to the rim, forking off into
 * the air now and then. Press to discharge the lot in one bright flash.
 */
export function StaticEdge({ children, charge = "blue", onClick, type = "button", motion = "full", className = "" }: StaticEdgeProps) {
  const btn = useRef<HTMLButtonElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const api = useRef<{ on: (v: boolean, s?: number) => void; point: (x: number, y: number) => void; zap: () => void } | null>(null);

  useEffect(() => {
    const el = btn.current, cv = canvas.current, ctx = cv?.getContext("2d");
    if (!el || !cv || !ctx) return;
    const C = CHARGES[charge], rand = seeded(11);
    const still = motion === "reduced" || matchMedia("(prefers-reduced-motion: reduce)").matches;
    let w = 0, h = 0, r = 0, L = 0, raf = 0, last = 0, regen = 0, on = false, level = 0, focus = 0, flash = 0;
    let pointer: Vec | null = null, reach: Vec[] | null = null, burst: Vec[][] = [];
    const streams: Streamer[] = [];

    const size = () => {
      w = el.offsetWidth; h = el.offsetHeight; r = h / 2; L = length(w, h, r);
      const dpr = Math.min(devicePixelRatio || 1, 2);
      cv.style.width = `${w + PAD * 2}px`; cv.style.height = `${h + PAD * 2}px`;
      cv.width = Math.round((w + PAD * 2) * dpr); cv.height = Math.round((h + PAD * 2) * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, PAD * dpr, PAD * dpr);
    };

    const stroke = (pts: Vec[], k: number) => {
      if (pts.length < 2) return;
      ctx.beginPath(); ctx.moveTo(pts[0].x, pts[0].y);
      for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
      ctx.strokeStyle = C.glow; ctx.globalAlpha = 0.5 * k; ctx.lineWidth = 3.2; ctx.shadowColor = C.glow; ctx.shadowBlur = 12; ctx.stroke();
      ctx.shadowBlur = 0; ctx.strokeStyle = C.core; ctx.globalAlpha = 0.95 * k; ctx.lineWidth = 1.1; ctx.stroke();
    };

    const shape = () => {
      for (const st of streams) {
        st.pts = crawl(w, h, r, st.s - st.len / 2, st.len, 2 + rand() * 3, 3.2, rand);
        st.branch = rand() < 0.22 ? fork(w, h, r, st.s + (rand() - 0.5) * st.len * 0.6, 7 + rand() * 11, rand) : null;
      }
      reach = null;
      if (pointer) {
        const s = nearest(w, h, r, pointer.x, pointer.y), p = pointAt(w, h, r, s);
        const d = Math.hypot(pointer.x - p.x, pointer.y - p.y);
        if (d < 18 && rand() < 0.8) reach = bolt({ x: p.x, y: p.y }, pointer, Math.max(2, d * 0.4), 3, rand);
      }
    };

    const draw = () => {
      ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, cv.width, cv.height); ctx.restore();
      ctx.globalCompositeOperation = "lighter"; ctx.lineJoin = "round"; ctx.lineCap = "round";
      for (const st of streams) {
        const k = Math.min(1, st.life * 6) * level;
        stroke(st.pts, k);
        if (st.branch) stroke(st.branch, k * 0.8);
      }
      if (reach) stroke(reach, level);
      for (const b of burst) stroke(b, flash);
      ctx.globalCompositeOperation = "source-over"; ctx.globalAlpha = 1;
    };

    const tick = (now: number) => {
      raf = 0;
      const dt = last ? Math.min(0.05, (now - last) / 1000) : 1 / 60;
      last = now;
      level += ((on ? 1 : 0) - level) * Math.min(1, dt * (on ? 10 : 6));
      flash = Math.max(0, flash - dt * 3.2);
      if (flash <= 0) burst = [];
      el.style.setProperty("--se-level", (level + flash).toFixed(3));
      // streamers drift towards the pointer's part of the edge and are reborn when they die
      for (const st of streams) {
        st.life -= dt;
        st.s += around(st.s, focus, L) * Math.min(1, dt * 1.6) + (rand() - 0.5) * 40 * dt;
        if (st.life <= 0) { st.s = focus + (rand() - 0.5) * L * 0.55; st.len = 26 + rand() * 60; st.life = 0.12 + rand() * 0.3; }
      }
      regen -= dt;
      if (regen <= 0) { regen = 0.045; shape(); }
      draw();
      if (on || level > 0.02 || flash > 0) raf = requestAnimationFrame(tick);
      else { streams.length = 0; draw(); }
    };
    const run = () => { if (!raf) { last = 0; raf = requestAnimationFrame(tick); } };

    const ro = new ResizeObserver(size);
    ro.observe(el);
    size();
    api.current = {
      on: (v, s) => {
        on = v;
        if (still) { el.style.setProperty("--se-level", v ? "1" : "0"); return; }
        if (!v) { pointer = null; }
        if (v) {
          if (s !== undefined) focus = s;
          while (streams.length < 4) streams.push({ s: focus + (rand() - 0.5) * 60, len: 26 + rand() * 60, life: rand() * 0.3, pts: [], branch: null });
        }
        run();
      },
      point: (x, y) => { pointer = { x, y }; focus = nearest(w, h, r, x, y); },
      zap: () => {
        if (still) return;
        // one bolt all the way round, and sparks thrown off it
        burst = [crawl(w, h, r, focus, L, 3, 4, rand), ...Array.from({ length: 7 }, (_, i) => fork(w, h, r, focus + (i / 7) * L, 14 + rand() * 12, rand))];
        flash = 1; run();
      },
    };
    return () => { cancelAnimationFrame(raf); ro.disconnect(); api.current = null; };
  }, [charge, motion]);

  const local = (e: React.PointerEvent<HTMLButtonElement>) => { const b = e.currentTarget.getBoundingClientRect(); return { x: e.clientX - b.left, y: e.clientY - b.top }; };
  const C = CHARGES[charge];
  return (
    <span className={`sedge sedge--${charge} ${className}`} style={{ ["--se-glow" as string]: C.glow, ["--se-core" as string]: C.core, ["--se-face" as string]: C.face, ["--se-label" as string]: C.label, ["--se-pad" as string]: `${PAD}px` } as CSSProperties}>
      <button ref={btn} type={type} className="sedge__btn" onClick={onClick}
        onPointerEnter={(e) => { if (e.pointerType !== "mouse") return; const p = local(e); api.current?.point(p.x, p.y); api.current?.on(true); }}
        onPointerMove={(e) => { if (e.pointerType === "mouse") { const p = local(e); api.current?.point(p.x, p.y); } }}
        onPointerLeave={(e) => { if (e.pointerType === "mouse") api.current?.on(false); }}
        onPointerDown={(e) => {
          api.current?.zap();
          if (e.pointerType !== "mouse") { api.current?.on(true); window.setTimeout(() => api.current?.on(false), 1800); }
        }}
        onFocus={(e) => { if (e.currentTarget.matches(":focus-visible")) api.current?.on(true, 0); }}
        onBlur={() => api.current?.on(false)}>
        <svg className="sedge__bolt" width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path d="M9.2 1.5 3.6 9h4l-1 5.5L12.4 7h-4z" fill="currentColor" /></svg>
        {children}
      </button>
      <canvas ref={canvas} className="sedge__arcs" aria-hidden="true" />
    </span>
  );
}

export default StaticEdge;
