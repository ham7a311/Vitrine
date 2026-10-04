"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import "./nib-trail.css";

/**
 * Nib Trail
 * The pointer is a broad-nib pen. Moving it leaves a ribbon of ink whose
 * width comes from the pen's own geometry: the nib is held at a fixed angle,
 * so strokes across it are full and strokes along it are hairlines — the
 * thick-and-thin of real lettering, not a width curve. Ink spreads a little
 * when fresh and dries away within a second. Hold the button and the ink is
 * wetter and stays for a few seconds, long enough to sign your name;
 * double-click wipes the page.
 */

type Props = {
  /** Ink colour (hex). */
  ink?: string;
  /** Nib angle in degrees from horizontal. 30–45 for italic, ~70 for naskh. */
  angle?: number;
  /** Nib width in CSS px. */
  nib?: number;
  theme?: "paper" | "night";
  motion?: "full" | "reduced";
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
};

type Pt = { x: number; y: number; t: number; w: number; life: number; lift?: boolean };

const HOVER_LIFE = 900;
const HELD_LIFE = 4200;

export function NibTrail({ ink = "#1d2b4f", angle = 38, nib = 9, theme = "paper", motion = "full", className = "", style, children }: Props) {
  const hostRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const nibRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current, canvas = canvasRef.current, mark = nibRef.current;
    if (!host || !canvas || !mark) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const fine = matchMedia("(any-hover: hover) and (any-pointer: fine)");
    const rm = matchMedia("(prefers-reduced-motion: reduce)");
    const still = () => motion === "reduced" || rm.matches;
    if (!fine.matches) return;
    host.dataset.live = "";

    const a = (angle * Math.PI) / 180;
    const ux = Math.cos(a), uy = -Math.sin(a); // the nib edge, rising to the right
    const dpr = Math.min(devicePixelRatio || 1, 2);
    const pts: Pt[] = [];
    let W = 0, H = 0, raf = 0, inside = false, held = false, last: Pt | null = null, wipe = 0;

    const resize = () => {
      const w = host.offsetWidth, h = host.offsetHeight;
      if (w === W && h === H) return;
      W = w; H = h;
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (still()) paint(performance.now());
    };
    const local = (cx: number, cy: number) => {
      const r = host.getBoundingClientRect();
      const s = r.width / host.offsetWidth || 1;
      return { x: (cx - r.left) / s, y: (cy - r.top) / s };
    };

    /** Draw every live segment: each is the nib swept from one point to the next. */
    const paint = (now: number) => {
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = ink;
      ctx.strokeStyle = ink;
      ctx.lineCap = "round";
      const fadeAll = wipe ? Math.max(0, 1 - (now - wipe) / 260) : 1;
      // Segments are grouped by how dry they are and each group is filled as one path, all
      // wound the same way, so overlapping quads merge instead of stacking up seams.
      const BUCKETS = 14;
      const fills: (Path2D | null)[] = Array(BUCKETS * 2).fill(null);
      const hairs: (Path2D | null)[] = Array(BUCKETS * 2).fill(null);
      for (let i = 1; i < pts.length; i++) {
        const A = pts[i - 1], B = pts[i];
        if (B.lift) continue;
        const age = now - B.t;
        const k = still() && B.life === HELD_LIFE ? 1 : 1 - age / B.life;
        if (k <= 0) continue;
        const b = Math.min(BUCKETS - 1, Math.floor(k * BUCKETS)) + (B.life === HELD_LIFE ? BUCKETS : 0);
        // Fresh ink spreads a touch, then settles as it dries.
        const bleed = 1 + 0.16 * Math.max(0, 1 - age / 140);
        const ha = (A.w * bleed) / 2, hb = (B.w * bleed) / 2;
        const f = (fills[b] ??= new Path2D());
        // Travel across the nib one way or the other flips the quad; keep every quad clockwise.
        const cw = (B.x - A.x) * uy - (B.y - A.y) * ux >= 0;
        const s1 = cw ? 1 : -1;
        f.moveTo(A.x - ux * ha * s1, A.y - uy * ha * s1);
        f.lineTo(A.x + ux * ha * s1, A.y + uy * ha * s1);
        f.lineTo(B.x + ux * hb * s1, B.y + uy * hb * s1);
        f.lineTo(B.x - ux * hb * s1, B.y - uy * hb * s1);
        f.closePath();
        // The hairline: even a stroke along the nib leaves a thread of ink.
        const hl = (hairs[b] ??= new Path2D());
        hl.moveTo(A.x, A.y);
        hl.lineTo(B.x, B.y);
      }
      ctx.lineWidth = 0.9;
      ctx.lineJoin = "round";
      for (let b = 0; b < BUCKETS * 2; b++) {
        if (!fills[b]) continue;
        const held = b >= BUCKETS;
        const k = ((b % BUCKETS) + 0.5) / BUCKETS;
        ctx.globalAlpha = Math.min(1, k * 1.25) * fadeAll * (held ? 0.96 : 0.82);
        ctx.fill(fills[b]!, "nonzero");
        ctx.stroke(hairs[b]!);
      }
      // A small pool where the pen came down.
      for (const p of pts) {
        if (!p.lift || p.w === 0) continue;
        const k = still() ? 1 : 1 - (now - p.t) / p.life;
        if (k <= 0) continue;
        ctx.globalAlpha = Math.min(1, k * 1.25) * fadeAll * 0.9;
        ctx.beginPath();
        ctx.ellipse(p.x, p.y, p.w * 0.55, p.w * 0.28, -a, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      if (wipe && fadeAll === 0) {
        pts.length = 0;
        last = null;
        wipe = 0;
      }
    };

    const prune = (now: number) => {
      let n = 0;
      while (n < pts.length && now - pts[n].t > pts[n].life && (still() ? pts[n].life !== HELD_LIFE : true)) n++;
      if (n) pts.splice(0, n);
    };

    const loop = (now: number) => {
      raf = 0;
      prune(now);
      paint(now);
      if ((pts.length || wipe) && !document.hidden && !still()) raf = requestAnimationFrame(loop);
    };
    const wake = () => { if (!raf) raf = requestAnimationFrame(loop); };

    const add = (x: number, y: number, t: number, pressure: number, pen: boolean) => {
      const life = held ? HELD_LIFE : HOVER_LIFE;
      if (still() && !held) return; // reduced motion: only deliberate, held strokes, which stay put
      const sp = last && !last.lift ? Math.hypot(x - last.x, y - last.y) / Math.max(1, t - last.t) : 0;
      // Fast strokes run a little thinner; a pen's pressure swells the nib.
      const thin = 1 - Math.min(0.32, sp * 0.09);
      const press = pen ? 0.55 + pressure * 0.9 : 1;
      const base = held ? nib * 1.22 : nib * 0.72;
      const w = Math.max(1.2, base * thin * press);
      if (last && !last.lift && Math.hypot(x - last.x, y - last.y) < 0.6) return;
      const p: Pt = { x, y, t, w, life };
      if (!last || last.lift) {
        // Start a new stroke: a zero-length anchor so the first segment has somewhere to come from.
        // Held strokes start with a small pool of ink; hover strokes taper in from nothing.
        pts.push({ x, y, t, w: held ? w : 0, life, lift: true });
      }
      pts.push(p);
      last = p;
    };

    const placeMark = (x: number, y: number) => {
      mark.style.transform = `translate3d(${x}px, ${y}px, 0) rotate(${-angle}deg)`;
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      resize();
      const events = typeof e.getCoalescedEvents === "function" ? e.getCoalescedEvents() : [];
      const list = events.length ? events : [e];
      const overField = (e.target as Element)?.closest?.("input, textarea, select, button, a, [contenteditable='true']");
      for (const ev of list) {
        const q = local(ev.clientX, ev.clientY);
        if (!overField || held) add(q.x, q.y, ev.timeStamp || performance.now(), ev.pressure || 0.5, ev.pointerType === "pen");
      }
      if (overField && !held && last) last = { ...last, lift: true };
      const q = local(e.clientX, e.clientY);
      placeMark(q.x, q.y);
      host.toggleAttribute("data-over-control", !!overField && !held);
      if (!inside) {
        inside = true;
        mark.dataset.in = "";
      }
      if (still()) paint(performance.now());
      else wake();
    };
    const lift = () => {
      if (last) last = { ...last, lift: true };
    };
    const onLeave = () => {
      inside = false;
      delete mark.dataset.in;
      lift();
    };
    const onDown = (e: PointerEvent) => {
      if (e.button !== 0 || e.pointerType === "touch") return;
      if ((e.target as Element)?.closest?.("input, textarea, select, button, a, [contenteditable='true']")) return;
      held = true;
      mark.dataset.held = "";
      lift();
      const q = local(e.clientX, e.clientY);
      add(q.x, q.y, performance.now(), e.pressure || 0.5, e.pointerType === "pen");
      if (still()) paint(performance.now());
      else wake();
    };
    const onUp = () => {
      if (!held) return;
      held = false;
      delete mark.dataset.held;
      lift();
    };
    const onDbl = (e: MouseEvent) => {
      if ((e.target as Element)?.closest?.("input, textarea, select, button, a")) return;
      wipe = performance.now();
      if (still()) { pts.length = 0; last = null; wipe = 0; paint(wipe); }
      else wake();
    };
    // Writing should never select the text underneath.
    const onSelect = (e: Event) => { if (held) e.preventDefault(); };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(host);
    host.addEventListener("pointermove", onMove, { passive: true });
    host.addEventListener("pointerleave", onLeave);
    host.addEventListener("pointerdown", onDown);
    host.addEventListener("dblclick", onDbl);
    host.addEventListener("selectstart", onSelect);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
    const onVis = () => { if (!document.hidden && pts.length) wake(); };
    document.addEventListener("visibilitychange", onVis);
    return () => {
      cancelAnimationFrame(raf);
      raf = 0;
      ro.disconnect();
      delete host.dataset.live;
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerleave", onLeave);
      host.removeEventListener("pointerdown", onDown);
      host.removeEventListener("dblclick", onDbl);
      host.removeEventListener("selectstart", onSelect);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [ink, angle, nib, motion]);

  return (
    <div ref={hostRef} className={`nt nt--${theme} ${className}`} data-motion={motion} style={{ ...style, ["--nt-ink" as string]: ink, ["--nt-nib" as string]: `${nib}px` }}>
      {children}
      <canvas ref={canvasRef} className="nt__ink" aria-hidden="true" />
      <div ref={nibRef} className="nt__nib" aria-hidden="true">
        <span />
      </div>
    </div>
  );
}
