"use client";
import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { PONDS, PROFILE, lane, school, swim, type Fish, type Pond } from "./koi";
import { nearest } from "./perimeter";
import "./koi-pond.css";

export type KoiPondProps = {
  children: ReactNode;
  pond?: Pond;
  /** How many fish (2–4 suits a normal button). */
  fish?: number;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  type?: "button" | "submit";
  motion?: "full" | "reduced";
  className?: string;
};

type Ring = { x: number; y: number; age: number; big?: boolean };
const LANE = 13;

/**
 * Koi Pond
 * The button is a little pond. At rest the fish hang deep and still; point at it and they rise and
 * swim laps just inside the rim, bending towards your pointer, while rings spread where you move.
 * Press to drop a pellet and watch them dart for it.
 */
export function KoiPond({ children, pond = "koi", fish = 3, onClick, type = "button", motion = "full", className = "" }: KoiPondProps) {
  const btn = useRef<HTMLButtonElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const api = useRef<{ wake: (on: boolean) => void; ripple: (x: number, y: number) => void; feed: (x: number, y: number) => void; point: (x: number, y: number) => void; away: () => void } | null>(null);

  useEffect(() => {
    const el = btn.current, cv = canvas.current;
    const ctx = cv?.getContext("2d");
    if (!el || !cv || !ctx) return;
    const look = PONDS[pond];
    const still = motion === "reduced" || matchMedia("(prefers-reduced-motion: reduce)").matches;
    let W = 0, H = 0, school_: Fish[] = [], raf = 0, last = 0, depth = still ? 1 : 0, awake = still, dir: 1 | -1 = 1;
    let pointer: { x: number; y: number } | null = null, pellet: { x: number; y: number; age: number } | null = null;
    const rings: Ring[] = [];

    const size = () => {
      const dpr = Math.min(devicePixelRatio || 1, 2);
      W = el.offsetWidth; H = el.offsetHeight;
      cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      school_ = school(fish, W, H, H / 2, LANE, look.coats, dir);
    };

    const drawFish = (f: Fish) => {
      const sp = f.spine, n = sp.length;
      const alpha = 0.32 + depth * 0.68;
      // shadow on the pond floor, further away the deeper the fish
      ctx.globalAlpha = 0.22 * alpha;
      ctx.strokeStyle = "#000"; ctx.lineCap = "round";
      for (let k = 0; k < n - 1; k++) { ctx.lineWidth = PROFILE[k] * f.size * 2; ctx.beginPath(); ctx.moveTo(sp[k].x + 3, sp[k].y + 4); ctx.lineTo(sp[k + 1].x + 3, sp[k + 1].y + 4); ctx.stroke(); }
      ctx.globalAlpha = alpha;
      const ang = (k: number) => Math.atan2(sp[k].y - sp[k + 1].y, sp[k].x - sp[k + 1].x);
      // pectoral fins, sculling
      const a1 = ang(1), flap = Math.sin(f.phase * 1.3) * 0.35;
      ctx.fillStyle = f.coat[1];
      ctx.globalAlpha = alpha * 0.7;
      for (const side of [1, -1]) {
        ctx.save(); ctx.translate(sp[1].x, sp[1].y); ctx.rotate(a1 + side * (2.1 + flap));
        ctx.beginPath(); ctx.ellipse(f.size * 0.55, 0, f.size * 0.55, f.size * 0.22, 0, 0, Math.PI * 2); ctx.fill(); ctx.restore();
      }
      // tail fan, following the last two joints
      const t = sp[n - 1], at = ang(n - 2) + Math.PI, wag = Math.sin(f.phase + 1.6) * 0.5;
      ctx.fillStyle = f.coat[n - 1]; ctx.globalAlpha = alpha * 0.8;
      ctx.save(); ctx.translate(t.x, t.y); ctx.rotate(at + wag * 0.4);
      ctx.beginPath(); ctx.moveTo(0, 0);
      ctx.quadraticCurveTo(f.size * 0.7, -f.size * 0.75, f.size * 1.05, -f.size * 0.55);
      ctx.quadraticCurveTo(f.size * 0.6, 0, f.size * 1.05, f.size * 0.55);
      ctx.quadraticCurveTo(f.size * 0.7, f.size * 0.75, 0, 0); ctx.fill(); ctx.restore();
      // the body: round-capped strokes between joints, each in its patch of colour
      ctx.globalAlpha = alpha;
      if (look.glow) { ctx.shadowColor = f.coat[2]; ctx.shadowBlur = 8 * depth; }
      for (let k = n - 2; k >= 0; k--) {
        ctx.strokeStyle = f.coat[k]; ctx.lineWidth = PROFILE[k] * f.size * 2;
        ctx.beginPath(); ctx.moveTo(sp[k].x, sp[k].y); ctx.lineTo(sp[k + 1].x, sp[k + 1].y); ctx.stroke();
      }
      ctx.shadowBlur = 0;
      // a highlight down the back
      ctx.globalAlpha = alpha * 0.35; ctx.strokeStyle = "#fff"; ctx.lineWidth = 1.2;
      ctx.beginPath(); ctx.moveTo(sp[0].x, sp[0].y); for (let k = 1; k < 5; k++) ctx.lineTo(sp[k].x, sp[k].y); ctx.stroke();
      ctx.globalAlpha = 1;
    };

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      for (const f of school_) drawFish(f);
      if (pellet) {
        ctx.globalAlpha = Math.max(0, 1 - pellet.age / 2.4);
        ctx.fillStyle = "#c9894a"; ctx.beginPath(); ctx.arc(pellet.x, pellet.y, 2.2, 0, Math.PI * 2); ctx.fill();
        ctx.globalAlpha = 1;
      }
      for (const r of rings) {
        const life = r.big ? 1.2 : 0.9, k = r.age / life;
        ctx.strokeStyle = look.glint; ctx.lineWidth = 1;
        for (const [lag, sc] of [[0, 1], [0.18, 0.62]] as const) {
          const kk = Math.max(0, k - lag);
          if (kk <= 0) continue;
          ctx.globalAlpha = (1 - kk) * 0.55;
          ctx.beginPath(); ctx.ellipse(r.x, r.y, (3 + kk * (r.big ? 44 : 26)) * sc, (2 + kk * (r.big ? 26 : 15)) * sc, 0, 0, Math.PI * 2); ctx.stroke();
        }
      }
      ctx.globalAlpha = 1;
    };

    const tick = (now: number) => {
      raf = 0;
      const dt = last ? Math.min(0.05, (now - last) / 1000) : 1 / 60;
      last = now;
      depth += ((awake ? 1 : 0) - depth) * Math.min(1, dt * 3);
      const { L, at } = lane(W, H, H / 2, LANE);
      const speed = 14 + depth * 42;
      for (const f of school_) {
        let goal: { x: number; y: number };
        // keep each fish's place on the lane pinned to where it actually is
        for (let k = 0; k < 2; k++) { const q = at(f.s); f.s += (f.x - q.x) * q.tx + (f.y - q.y) * q.ty; }
        if (pellet && awake) goal = pellet;
        else {
          const g = at(f.s + dir * 20);
          goal = pointer && awake ? { x: g.x * 0.72 + pointer.x * 0.28, y: g.y * 0.72 + pointer.y * 0.28 } : g;
        }
        // ease off when catching up with the fish ahead, so the school spreads out
        let pace = speed * (0.92 + (f.size - 9) * 0.06);
        for (const o of school_) if (o !== f && Math.hypot(o.x - f.x, o.y - f.y) < 26 && (o.x - f.x) * Math.cos(f.a) + (o.y - f.y) * Math.sin(f.a) > 0) pace *= 0.6;
        swim(f, goal, pellet && awake ? speed * 1.9 : pace, pellet && awake ? 9 : 5.5, dt);
        if (pellet && Math.hypot(f.x - pellet.x, f.y - pellet.y) < 5) {
          rings.push({ x: pellet.x, y: pellet.y, age: 0 });
          pellet = null;
          // pick the lap back up from wherever each fish ended
          for (const g of school_) g.s = nearest(W - 2 * LANE, H - 2 * LANE, H / 2 - LANE, g.x - LANE, g.y - LANE);
        }
        f.s = ((f.s % L) + L) % L;
      }
      if (pellet) { pellet.age += dt; if (pellet.age > 2.4) pellet = null; }
      for (let i = rings.length - 1; i >= 0; i--) { rings[i].age += dt; if (rings[i].age > (rings[i].big ? 1.2 : 0.9)) rings.splice(i, 1); }
      draw();
      if (awake || depth > 0.02 || rings.length) raf = requestAnimationFrame(tick);
    };
    const run = () => { if (!raf && !still) { last = 0; raf = requestAnimationFrame(tick); } };

    const ro = new ResizeObserver(() => { size(); draw(); });
    ro.observe(el);
    size(); draw();
    api.current = {
      wake: (on) => { if (still) return; awake = on; if (!on) pointer = null; run(); },
      point: (x, y) => { pointer = { x, y }; },
      away: () => { pointer = null; },
      ripple: (x, y) => { if (still) return; rings.push({ x, y, age: 0 }); run(); },
      feed: (x, y) => { if (still) return; pellet = { x, y, age: 0 }; rings.push({ x, y, age: 0, big: true }); awake = true; run(); },
    };
    // swim the way the pointer came in
    (el as HTMLElement & { __dir?: (d: 1 | -1) => void }).__dir = (d) => {
      if (d === dir) return;
      dir = d;
      for (const f of school_) { f.a += Math.PI; f.spine.reverse(); f.x = f.spine[0].x; f.y = f.spine[0].y; }
    };
    return () => { cancelAnimationFrame(raf); ro.disconnect(); api.current = null; };
  }, [pond, fish, motion]);

  const local = (e: React.PointerEvent<HTMLButtonElement>) => { const r = e.currentTarget.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; };
  const lastRing = useRef({ x: -99, y: -99 });

  const look = PONDS[pond];
  return (
    <button ref={btn} type={type} className={`koip koip--${pond} ${className}`} onClick={onClick}
      style={{ ["--kp-deep" as string]: look.deep, ["--kp-mid" as string]: look.mid, ["--kp-glint" as string]: look.glint, ["--kp-label" as string]: look.label } as CSSProperties}
      onPointerEnter={(e) => {
        if (e.pointerType !== "mouse") return;
        const p = local(e), el = e.currentTarget;
        const turn = (el as HTMLElement & { __dir?: (d: 1 | -1) => void }).__dir;
        // heading right when coming in from the left half, and vice versa — the school follows you in
        turn?.(p.x < el.offsetWidth / 2 === p.y < el.offsetHeight / 2 ? 1 : -1);
        api.current?.wake(true); api.current?.point(p.x, p.y); api.current?.ripple(p.x, p.y);
      }}
      onPointerMove={(e) => {
        if (e.pointerType !== "mouse") return;
        const p = local(e); api.current?.point(p.x, p.y);
        if (Math.hypot(p.x - lastRing.current.x, p.y - lastRing.current.y) > 22) { lastRing.current = p; api.current?.ripple(p.x, p.y); }
      }}
      onPointerLeave={(e) => { if (e.pointerType === "mouse") { api.current?.wake(false); } }}
      onPointerDown={(e) => {
        const p = local(e); api.current?.feed(p.x, p.y);
        if (e.pointerType !== "mouse") window.setTimeout(() => api.current?.wake(false), 2600);
      }}
      onFocus={(e) => { if (e.currentTarget.matches(":focus-visible")) api.current?.wake(true); }}
      onBlur={() => api.current?.wake(false)}>
      <canvas ref={canvas} className="koip__water" aria-hidden="true" />
      <span className="koip__surface" aria-hidden="true" />
      <span className="koip__label">{children}</span>
    </button>
  );
}

export default KoiPond;
