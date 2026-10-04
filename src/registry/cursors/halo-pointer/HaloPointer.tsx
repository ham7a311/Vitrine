"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import "./halo-pointer.css";

/**
 * Halo Pointer
 * A crisp arrow with a soft light behind it. The arrow is drawn on the
 * pointer event itself, so it never lags the hand; the halo follows on a
 * critically damped spring and stretches along the direction of travel,
 * like a light with a little momentum. Over anything marked data-halo it
 * takes that colour and swells; a press tightens it, and the release
 * throws one faint ring.
 */

type Props = {
  /** Halo colour (hex). Elements can override it with data-halo="#hex". */
  color?: string;
  /** Arrow fill and keyline. */
  arrow?: "dark" | "light";
  motion?: "full" | "reduced";
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
};

const FIELDS = "input, textarea, select, [contenteditable='true'], [contenteditable='']";

export function HaloPointer({ color = "#3b82f6", arrow = "dark", motion = "full", className = "", style, children }: Props) {
  const hostRef = useRef<HTMLDivElement>(null);
  const layerRef = useRef<HTMLDivElement>(null);
  const arrowRef = useRef<HTMLDivElement>(null);
  const haloRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current, layer = layerRef.current, arr = arrowRef.current, halo = haloRef.current, ring = ringRef.current;
    if (!host || !layer || !arr || !halo || !ring) return;
    const fine = matchMedia("(hover: hover) and (pointer: fine)");
    const rm = matchMedia("(prefers-reduced-motion: reduce)");
    const still = () => motion === "reduced" || rm.matches;
    if (!fine.matches) return;
    host.dataset.live = "";

    // Pointer (target), halo (spring), and the small state the springs chase.
    const p = { x: 0, y: 0, vx: 0, vy: 0, t: 0 };
    const h = { x: 0, y: 0, vx: 0, vy: 0 };
    let tilt = 0, grow = 1, growV = 0, growTo = 1, stretch = 1, heading = 0;
    let raf = 0, lastT = 0, inside = false, pressed = false, pulse = 0;

    const local = (e: PointerEvent) => {
      const r = host.getBoundingClientRect();
      const s = r.width / host.offsetWidth || 1; // the host may be drawn scaled (gallery thumbnails)
      return { x: (e.clientX - r.left) / s, y: (e.clientY - r.top) / s };
    };
    const place = () => {
      arr.style.transform = `translate3d(${p.x}px, ${p.y}px, 0) rotate(${tilt.toFixed(2)}deg)`;
    };
    const paint = () => {
      halo.style.transform = `translate3d(${h.x + 8}px, ${h.y + 8}px, 0) rotate(${heading.toFixed(1)}rad) scale(${(stretch * grow).toFixed(3)}, ${(grow / Math.sqrt(stretch)).toFixed(3)})`;
    };

    const step = (now: number) => {
      raf = 0;
      const dt = Math.min(0.032, lastT ? (now - lastT) / 1000 : 0.016);
      lastT = now;
      if (still()) {
        h.x = p.x; h.y = p.y; h.vx = h.vy = 0;
        tilt = 0; stretch = 1; grow = growTo;
      } else {
        // Critically damped: it arrives as fast as it can without overshooting.
        const k = 420, c = 2 * Math.sqrt(k);
        h.vx += ((p.x - h.x) * k - h.vx * c) * dt;
        h.vy += ((p.y - h.y) * k - h.vy * c) * dt;
        h.x += h.vx * dt;
        h.y += h.vy * dt;
        const sp = Math.hypot(h.vx, h.vy);
        const want = 1 + Math.min(0.85, sp / 2200);
        stretch += (want - stretch) * Math.min(1, dt * 14);
        // Only take a new heading while actually moving, so it never spins at rest.
        if (sp > 40) {
          const a = Math.atan2(h.vy, h.vx);
          let d = a - heading;
          d = Math.atan2(Math.sin(d), Math.cos(d));
          heading += d * Math.min(1, dt * 18);
        }
        // The arrow leans a few degrees into horizontal travel, then rights itself.
        const pv = now - p.t < 60 ? p.vx : 0;
        const lean = Math.max(-8, Math.min(8, pv / 160));
        tilt += (lean - tilt) * Math.min(1, dt * 12);
        growV += ((growTo - grow) * 260 - growV * 22) * dt;
        grow += growV * dt;
      }
      place();
      paint();
      const busy =
        Math.abs(p.x - h.x) + Math.abs(p.y - h.y) > 0.15 || Math.abs(h.vx) + Math.abs(h.vy) > 1 ||
        Math.abs(stretch - 1) > 0.004 || Math.abs(tilt) > 0.05 || Math.abs(growTo - grow) > 0.002 || Math.abs(growV) > 0.01 ||
        now - p.t < 80;
      if (busy && !document.hidden) raf = requestAnimationFrame(step);
      else lastT = 0;
    };
    const wake = () => { if (!raf) raf = requestAnimationFrame(step); };

    const tint = (target: EventTarget | null) => {
      const el = target instanceof Element ? target.closest<HTMLElement>("[data-halo]") : null;
      const over = el && host.contains(el);
      host.style.setProperty("--hp-c", over ? el.dataset.halo || color : color);
      growTo = pressed ? 0.78 : over ? 1.35 : 1;
    };

    const onMove = (e: PointerEvent) => {
      const q = local(e);
      const now = performance.now();
      const dt = Math.max(1, now - p.t);
      if (inside) {
        p.vx = p.vx * 0.6 + ((q.x - p.x) / dt) * 1000 * 0.4;
        p.vy = p.vy * 0.6 + ((q.y - p.y) / dt) * 1000 * 0.4;
      }
      p.x = q.x; p.y = q.y; p.t = now;
      if (!inside) {
        // Appear where the pointer came in, never sweeping across from the last exit.
        inside = true;
        h.x = p.x; h.y = p.y; h.vx = h.vy = 0; p.vx = p.vy = 0;
        layer.dataset.in = "";
      }
      const field = e.target instanceof Element && e.target.closest(FIELDS);
      if (field) delete layer.dataset.in;
      else layer.dataset.in = "";
      tint(e.target);
      place(); // drawn now, not on the next frame
      wake();
    };
    const onLeave = () => {
      inside = false;
      pressed = false;
      delete layer.dataset.in;
      delete layer.dataset.down;
    };
    const onDown = (e: PointerEvent) => {
      if (e.button !== 0) return;
      pressed = true;
      layer.dataset.down = "";
      tint(e.target);
      wake();
    };
    const onUp = (e: PointerEvent) => {
      if (!pressed) return;
      pressed = false;
      delete layer.dataset.down;
      tint(e.target);
      if (!still()) {
        // Alternate between two identical keyframes so the ring restarts without a remount.
        pulse ^= 1;
        ring.style.transform = `translate3d(${p.x + 8}px, ${p.y + 8}px, 0)`;
        ring.dataset.pulse = pulse ? "a" : "b";
      }
      wake();
    };

    host.addEventListener("pointermove", onMove, { passive: true });
    host.addEventListener("pointerleave", onLeave);
    host.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    return () => {
      cancelAnimationFrame(raf);
      raf = 0;
      delete host.dataset.live;
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerleave", onLeave);
      host.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
    };
  }, [color, motion]);

  return (
    <div
      ref={hostRef}
      className={`hp hp--${arrow} ${className}`}
      data-motion={motion}
      style={{ ...style, ["--hp-c" as string]: color, ["--hp-base" as string]: color }}
    >
      {children}
      <div ref={layerRef} className="hp__layer" aria-hidden="true">
        <div ref={haloRef} className="hp__halo">
          <span className="hp__veil" />
          <span className="hp__core" />
        </div>
        <div ref={ringRef} className="hp__ring">
          <span />
        </div>
        <div ref={arrowRef} className="hp__arrow">
          <svg viewBox="0 0 24 24" width="27" height="27">
            <path d="M3 3 L20.4 9.6 L12.5 12.4 L9.6 20.4 Z" />
          </svg>
        </div>
      </div>
    </div>
  );
}
