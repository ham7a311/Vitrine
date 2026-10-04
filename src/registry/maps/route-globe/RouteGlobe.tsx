"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { drawGlobe, landDots, rotate, slerp, toVec, type Vec3 } from "./globe";
import "./route-globe.css";

/**
 * Route Globe
 * A dotted globe with flight arcs from one hub. Each route lifts off the surface on a great
 * circle; a comet runs along it and the destination pulses when it lands. Drag to spin; it
 * turns slowly on its own when left alone.
 */

export type Place = { name: string; lon: number; lat: number; note?: string };

const MUSCAT: Place = { name: "Muscat", lon: 58.41, lat: 23.59 };
const DEST: Place[] = [
  { name: "London", lon: -0.13, lat: 51.5, note: "7h 45m" },
  { name: "Istanbul", lon: 28.98, lat: 41.01, note: "4h 50m" },
  { name: "Cairo", lon: 31.24, lat: 30.04, note: "4h 10m" },
  { name: "Nairobi", lon: 36.82, lat: -1.29, note: "5h 05m" },
  { name: "Zanzibar", lon: 39.2, lat: -6.16, note: "5h 30m" },
  { name: "Mumbai", lon: 72.88, lat: 19.08, note: "2h 55m" },
  { name: "Kathmandu", lon: 85.32, lat: 27.72, note: "4h 15m" },
  { name: "Bangkok", lon: 100.5, lat: 13.76, note: "6h 20m" },
  { name: "Kuala Lumpur", lon: 101.69, lat: 3.14, note: "7h 05m" },
  { name: "Manila", lon: 120.98, lat: 14.6, note: "8h 40m" },
];

export type GlobeTheme = { ground: string; land: string; arc: string; glow: string; text: string; muted: string };

type Props = { hub?: Place; places?: Place[]; theme?: GlobeTheme; motion?: "full" | "reduced"; className?: string; style?: CSSProperties };

const NIGHT: GlobeTheme = { ground: "#06080d", land: "#9fb4d6", arc: "#ffb547", glow: "rgb(90 140 255 / 0.18)", text: "#eef2fb", muted: "#7c8aa5" };

export function RouteGlobe({ hub = MUSCAT, places = DEST, theme = NIGHT, motion = "full", className = "", style }: Props) {
  const host = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const [hover, setHover] = useState<{ p: Place; x: number; y: number } | null>(null);

  useEffect(() => {
    const el = host.current, cv = canvas.current;
    if (!el || !cv) return;
    const ctx = cv.getContext("2d")!;
    const reduced = motion === "reduced" || matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dots = landDots(window.innerWidth < 640 ? 18000 : 30000);
    const H = toVec(hub.lon, hub.lat);
    const routes = places.map((p, i) => ({ p, v: toVec(p.lon, p.lat), offset: i / places.length }));
    const RAD = Math.PI / 180;
    const st = { yaw: hub.lon * RAD - 0.35, tilt: 18 * RAD, vy: 0, vt: 0, drag: false, px: 0, py: 0, last: 0, idle: 0 };
    let W = 0, Hh = 0, dpr = 1, raf = 0, alive = true, visible = true, t0 = performance.now();
    const pins: { p: Place; x: number; y: number; front: boolean }[] = [];

    const size = () => {
      dpr = Math.min(devicePixelRatio || 1, 2);
      W = el.clientWidth;
      Hh = el.clientHeight;
      cv.width = Math.round(W * dpr);
      cv.height = Math.round(Hh * dpr);
    };
    const project = (v: Vec3, lift: number, r: number, cx: number, cy: number) => {
      const [x, y, z] = rotate(v, st.yaw, st.tilt);
      return { x: cx + x * r * lift, y: cy - y * r * lift, z };
    };

    const draw = (now: number) => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, Hh);
      const r = Math.min(W, Hh) * 0.4, cx = W / 2, cy = Hh / 2;
      drawGlobe(ctx, dots, { cx, cy, r, yaw: st.yaw, tilt: st.tilt }, theme.land, Math.max(1.4, r / 150), theme.glow);
      const t = (now - t0) / 1000;
      pins.length = 0;
      ctx.lineCap = "round";
      for (const rt of routes) {
        const ang = Math.acos(Math.max(-1, Math.min(1, H[0] * rt.v[0] + H[1] * rt.v[1] + H[2] * rt.v[2])));
        const height = 0.06 + ang * 0.12;
        const pts: { x: number; y: number; z: number }[] = [];
        for (let k = 0; k <= 48; k++) {
          const u = k / 48;
          pts.push(project(slerp(H, rt.v, u), 1 + Math.sin(Math.PI * u) * height, r, cx, cy));
        }
        // the arc: faint where it passes behind the globe
        ctx.strokeStyle = theme.arc;
        ctx.lineWidth = 1.1;
        for (let k = 0; k < 48; k++) {
          const a = pts[k], b = pts[k + 1];
          const hidden = a.z < 0 && Math.hypot(a.x - cx, a.y - cy) < r;
          ctx.globalAlpha = hidden ? 0.06 : 0.38;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
        // the comet: a bright head with a fading tail, looping with its own offset
        const cycle = 3.6, ph = reduced ? 0.999 : ((t / cycle + rt.offset) % 1);
        const run = Math.min(1, ph / 0.7);
        const head = Math.floor(run * 48);
        for (let k = Math.max(0, head - 10); k < head; k++) {
          const a = pts[k], b = pts[k + 1];
          if (a.z < 0 && Math.hypot(a.x - cx, a.y - cy) < r) continue;
          ctx.globalAlpha = (1 - (head - k) / 10) * 0.95;
          ctx.lineWidth = 2.2;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
        const end = pts[48];
        const front = end.z > 0;
        pins.push({ p: rt.p, x: end.x, y: end.y, front });
        if (front) {
          ctx.globalAlpha = 1;
          ctx.fillStyle = theme.arc;
          ctx.beginPath();
          ctx.arc(end.x, end.y, 2.6, 0, Math.PI * 2);
          ctx.fill();
          // arrival pulse
          if (ph > 0.7) {
            const k = (ph - 0.7) / 0.3;
            ctx.globalAlpha = 1 - k;
            ctx.lineWidth = 1.4;
            ctx.beginPath();
            ctx.arc(end.x, end.y, 3 + k * 16, 0, Math.PI * 2);
            ctx.stroke();
          }
        }
      }
      // the hub
      const h = project(H, 1, r, cx, cy);
      if (h.z > 0) {
        ctx.globalAlpha = 1;
        ctx.fillStyle = theme.text;
        ctx.beginPath();
        ctx.arc(h.x, h.y, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 0.5 + 0.5 * Math.sin(t * 3);
        ctx.strokeStyle = theme.text;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.arc(h.x, h.y, 9, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
    };

    const tick = (now: number) => {
      raf = 0;
      if (!alive || !visible || document.hidden) return;
      const dt = st.last ? Math.min(0.05, (now - st.last) / 1000) : 0.016;
      st.last = now;
      if (!st.drag) {
        st.yaw += st.vy * dt;
        st.tilt += st.vt * dt;
        st.vy *= Math.pow(0.05, dt);
        st.vt *= Math.pow(0.05, dt);
        if (now - st.idle > 2500) st.yaw += dt * 0.08;
        st.tilt = Math.max(-0.9, Math.min(0.9, st.tilt + (18 * RAD - st.tilt) * Math.min(1, dt * 0.4)));
      }
      draw(now);
      raf = requestAnimationFrame(tick);
    };
    const start = () => {
      if (reduced) return draw(performance.now());
      if (!raf && alive) {
        st.last = 0;
        raf = requestAnimationFrame(tick);
      }
    };
    const onDown = (e: PointerEvent) => {
      cv.setPointerCapture(e.pointerId);
      st.drag = true;
      st.px = e.clientX;
      st.py = e.clientY;
      st.vy = st.vt = 0;
      el.dataset.dragging = "";
    };
    const onMove = (e: PointerEvent) => {
      if (st.drag) {
        const r = Math.min(W, Hh) * 0.4;
        const dx = e.clientX - st.px, dy = e.clientY - st.py;
        st.px = e.clientX;
        st.py = e.clientY;
        st.yaw -= dx / r;
        st.tilt = Math.max(-0.9, Math.min(0.9, st.tilt + dy / r));
        st.vy = (-dx / r) * 30;
        st.vt = (dy / r) * 30;
        st.idle = performance.now();
        if (reduced) draw(performance.now());
        setHover(null);
        return;
      }
      const b = cv.getBoundingClientRect();
      const x = e.clientX - b.left, y = e.clientY - b.top;
      const near = pins.filter((p) => p.front).map((p) => ({ ...p, d: Math.hypot(p.x - x, p.y - y) })).sort((a, b2) => a.d - b2.d)[0];
      setHover(near && near.d < 18 ? { p: near.p, x: near.x, y: near.y } : null);
    };
    const onUp = () => {
      st.drag = false;
      st.idle = performance.now();
      delete el.dataset.dragging;
    };
    cv.addEventListener("pointerdown", onDown);
    cv.addEventListener("pointermove", onMove);
    cv.addEventListener("pointerup", onUp);
    cv.addEventListener("pointercancel", onUp);
    cv.addEventListener("pointerleave", () => setHover(null));
    const ro = new ResizeObserver(() => {
      size();
      draw(performance.now());
    });
    ro.observe(el);
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible) start();
    });
    io.observe(el);
    const onVis = () => !document.hidden && start();
    document.addEventListener("visibilitychange", onVis);
    size();
    start();
    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      cv.removeEventListener("pointerdown", onDown);
      cv.removeEventListener("pointermove", onMove);
      cv.removeEventListener("pointerup", onUp);
      cv.removeEventListener("pointercancel", onUp);
    };
  }, [hub, places, theme, motion]);

  return (
    <div ref={host} className={`rg ${className}`} style={{ background: theme.ground, color: theme.text, ["--rg-muted" as string]: theme.muted, ["--rg-arc" as string]: theme.arc, ["--rg-ground" as string]: theme.ground, ...style }}>
      <canvas ref={canvas} className="rg__canvas" role="img" aria-label={`A globe with ${places.length} flight routes from ${hub.name}`} />
      {hover && (
        <div className="rg__tip" style={{ left: hover.x, top: hover.y }} aria-hidden="true">
          <strong>{hover.p.name}</strong>
          {hover.p.note && <span>{hover.p.note} from {hub.name}</span>}
        </div>
      )}
      <ul className="rg__sr">
        {places.map((p) => (
          <li key={p.name}>
            {hub.name} to {p.name}
            {p.note ? `, ${p.note}` : ""}
          </li>
        ))}
      </ul>
    </div>
  );
}
