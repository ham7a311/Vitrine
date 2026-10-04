"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { drawGlobe, landDots, rotate, toVec } from "../route-globe/globe";
import "./pulse-globe.css";

/**
 * Pulse Globe
 * Live activity on a dotted globe. Every event rings out where it happened, the feed beside it
 * lists the latest few, and a sparkline counts events over the last minute. Hovering the feed
 * holds it still so you can read it; the globe keeps going.
 */

type Kind = "booking" | "search" | "signup";
type Event = { id: number; kind: Kind; city: string; lon: number; lat: number; t: number };

const CITIES = [
  ["Muscat", 58.41, 23.59], ["Salalah", 54.09, 17.02], ["Dubai", 55.27, 25.2], ["Riyadh", 46.72, 24.71], ["London", -0.13, 51.5],
  ["Paris", 2.35, 48.86], ["Berlin", 13.4, 52.52], ["Istanbul", 28.98, 41.01], ["Cairo", 31.24, 30.04], ["Nairobi", 36.82, -1.29],
  ["Lagos", 3.38, 6.52], ["Mumbai", 72.88, 19.08], ["Delhi", 77.21, 28.61], ["Singapore", 103.82, 1.35], ["Tokyo", 139.69, 35.69],
  ["Sydney", 151.21, -33.87], ["New York", -74.0, 40.71], ["São Paulo", -46.63, -23.55], ["Toronto", -79.38, 43.65], ["Cape Town", 18.42, -33.92],
] as const;

const KINDS: { id: Kind; label: string }[] = [
  { id: "booking", label: "Booking" },
  { id: "search", label: "Search" },
  { id: "signup", label: "Sign-up" },
];

export type PulsePalette = { ground: string; land: string; glow: string; text: string; muted: string; line: string; series: [string, string, string] };

type Props = { palette: PulsePalette; motion?: "full" | "reduced"; className?: string; style?: CSSProperties };

// A small seeded generator, so the stream is the same on every visit.
function rng(seed: number) {
  let a = seed;
  return () => ((a = (a * 1664525 + 1013904223) >>> 0) / 4294967296);
}

export function PulseGlobe({ palette, motion = "full", className = "", style }: Props) {
  const host = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const [feed, setFeed] = useState<Event[]>([]);
  const [counts, setCounts] = useState<number[]>(Array(12).fill(0));
  const [held, setHeld] = useState(false);
  const heldRef = useRef(false);
  heldRef.current = held;
  const [now, setNow] = useState(0);

  useEffect(() => {
    const el = host.current, cv = canvas.current;
    if (!el || !cv) return;
    const ctx = cv.getContext("2d")!;
    const reduced = motion === "reduced" || matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dots = landDots(window.innerWidth < 640 ? 16000 : 26000);
    const R = rng(42);
    const RAD = Math.PI / 180;
    const st = { yaw: 30 * RAD, tilt: 15 * RAD, vy: 0, drag: false, px: 0, last: 0 };
    let W = 0, H = 0, dpr = 1, raf = 0, alive = true, visible = true, id = 0, nextAt = 0;
    const live: Event[] = [];
    const all: Event[] = [];

    // Pre-fill the last minute so the sparkline and feed start full.
    const t0 = performance.now();
    const make = (t: number): Event => {
      const c = CITIES[Math.floor(R() * CITIES.length)];
      const k = R();
      return { id: id++, kind: k < 0.5 ? "search" : k < 0.82 ? "booking" : "signup", city: c[0], lon: c[1], lat: c[2], t };
    };
    for (let s = 60; s > 0; s -= 0.35 + R() * 0.75) all.push(make(t0 - s * 1000));
    const sync = (n: number) => {
      const buckets = Array(12).fill(0);
      for (const e of all) {
        const age = (n - e.t) / 1000;
        if (age >= 0 && age < 60) buckets[11 - Math.floor(age / 5)]++;
      }
      setCounts(buckets);
      if (!heldRef.current) setFeed(all.slice(-6).reverse());
      setNow(n);
    };
    sync(t0);

    const size = () => {
      dpr = Math.min(devicePixelRatio || 1, 2);
      W = cv.clientWidth;
      H = cv.clientHeight;
      cv.width = Math.round(W * dpr);
      cv.height = Math.round(H * dpr);
    };
    const colour = (k: Kind) => palette.series[KINDS.findIndex((x) => x.id === k)];
    const draw = (n: number) => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);
      const r = Math.min(W, H) * 0.42, cx = W / 2, cy = H / 2;
      drawGlobe(ctx, dots, { cx, cy, r, yaw: st.yaw, tilt: st.tilt }, palette.land, Math.max(1.3, r / 150), palette.glow);
      for (const e of live) {
        const age = (n - e.t) / 1000;
        const [x, y, z] = rotate(toVec(e.lon, e.lat), st.yaw, st.tilt);
        if (z < 0.05) continue;
        const px = cx + x * r, py = cy - y * r, c = colour(e.kind);
        ctx.fillStyle = c;
        ctx.strokeStyle = c;
        ctx.globalAlpha = Math.max(0, 1 - age / 2.6);
        ctx.beginPath();
        ctx.arc(px, py, 3.2, 0, Math.PI * 2);
        ctx.fill();
        for (const lag of [0, 0.5]) {
          const k = Math.max(0, Math.min(1, (age - lag) / 1.6));
          if (k <= 0 || k >= 1) continue;
          ctx.globalAlpha = (1 - k) * 0.9;
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.arc(px, py, 4 + k * 26 * z, 0, Math.PI * 2);
          ctx.stroke();
        }
      }
      ctx.globalAlpha = 1;
    };
    const tick = (n: number) => {
      raf = 0;
      if (!alive || !visible || document.hidden) return;
      const dt = st.last ? Math.min(0.05, (n - st.last) / 1000) : 0.016;
      st.last = n;
      if (!st.drag) {
        st.yaw += st.vy * dt + dt * 0.12;
        st.vy *= Math.pow(0.05, dt);
      }
      if (n > nextAt) {
        const e = make(n);
        all.push(e);
        live.push(e);
        if (all.length > 200) all.splice(0, all.length - 200);
        nextAt = n + 350 + R() * 750;
        sync(n);
      }
      for (let i = live.length - 1; i >= 0; i--) if (n - live[i].t > 2600) live.splice(i, 1);
      draw(n);
      raf = requestAnimationFrame(tick);
    };
    const start = () => {
      if (reduced) {
        live.push(...all.slice(-8).map((e) => ({ ...e, t: performance.now() - 300 })));
        return draw(performance.now());
      }
      if (!raf && alive) {
        st.last = 0;
        raf = requestAnimationFrame(tick);
      }
    };
    const onDown = (e: PointerEvent) => {
      cv.setPointerCapture(e.pointerId);
      st.drag = true;
      st.px = e.clientX;
    };
    const onMove = (e: PointerEvent) => {
      if (!st.drag) return;
      const dx = e.clientX - st.px;
      st.px = e.clientX;
      st.yaw -= dx / (Math.min(W, H) * 0.42);
      st.vy = (-dx / (Math.min(W, H) * 0.42)) * 30;
      if (reduced) draw(performance.now());
    };
    const onUp = () => (st.drag = false);
    cv.addEventListener("pointerdown", onDown);
    cv.addEventListener("pointermove", onMove);
    cv.addEventListener("pointerup", onUp);
    cv.addEventListener("pointercancel", onUp);
    const ro = new ResizeObserver(() => {
      size();
      draw(performance.now());
    });
    ro.observe(cv);
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
  }, [palette, motion]);

  const total = counts.reduce((a, b) => a + b, 0);
  const max = Math.max(1, ...counts);
  const spark = counts.map((c, i) => `${(i / 11) * 100},${28 - (c / max) * 24}`).join(" ");
  const ago = (t: number) => {
    const s = Math.max(0, Math.round((now - t) / 1000));
    return s < 2 ? "now" : `${s}s ago`;
  };

  return (
    <div
      ref={host}
      className={`pg ${className}`}
      style={{ background: palette.ground, color: palette.text, ["--pg-muted" as string]: palette.muted, ["--pg-line" as string]: palette.line, ...style }}
    >
      <canvas ref={canvas} className="pg__globe" role="img" aria-label="Globe showing where the latest events happened" />
      <aside className="pg__panel">
        <p className="pg__eyebrow">Live · last 60 seconds</p>
        <p className="pg__big">
          {total}
          <span> events</span>
        </p>
        <svg className="pg__spark" viewBox="0 0 100 30" preserveAspectRatio="none" role="img" aria-label={`Events per 5 seconds over the last minute, latest ${counts[11]}`}>
          <polyline points={spark} fill="none" stroke={palette.series[0]} strokeWidth="2" vectorEffect="non-scaling-stroke" strokeLinejoin="round" />
        </svg>
        <ul className="pg__legend">
          {KINDS.map((k, i) => (
            <li key={k.id}>
              <i style={{ background: palette.series[i] }} />
              {k.label}
            </li>
          ))}
        </ul>
        <ol className="pg__feed" aria-label="Latest events" aria-live={held ? "off" : "polite"} onPointerEnter={() => setHeld(true)} onPointerLeave={() => setHeld(false)} onFocus={() => setHeld(true)} onBlur={() => setHeld(false)} tabIndex={0}>
          {feed.map((e) => (
            <li key={e.id}>
              <i style={{ background: palette.series[KINDS.findIndex((x) => x.id === e.kind)] }} aria-hidden="true" />
              <span className="pg__what">{KINDS.find((k) => k.id === e.kind)!.label}</span>
              <span className="pg__where">{e.city}</span>
              <span className="pg__when">{ago(e.t)}</span>
            </li>
          ))}
        </ol>
        <p className="pg__note">{held ? "Feed paused while you read" : "Hover the feed to pause it"}</p>
      </aside>
    </div>
  );
}
