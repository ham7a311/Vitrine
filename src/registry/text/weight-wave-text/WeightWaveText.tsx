"use client";

import { useEffect, useRef } from "react";
import "./weight-wave-text.css";

/**
 * Weight Wave
 * A headline set in a variable font, where weight is something you can
 * move. Left alone, a slow wave of weight breathes along the line. Bring
 * the pointer close and it becomes a lens: the letters nearest swell to
 * their heaviest and ease back to hairline as you pass, like light
 * through glass.
 */

type Props = {
  text: string;
  /** Resting weight and the heaviest the lens goes. */
  min?: number;
  max?: number;
  theme?: "night" | "paper" | "gradient";
  motion?: "full" | "reduced";
  className?: string;
};

export function WeightWaveText({ text, min = 220, max = 900, theme = "night", motion = "full", className = "" }: Props) {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const spans = Array.from(host.querySelectorAll<HTMLSpanElement>(".ww__l"));
    const rm = matchMedia("(prefers-reduced-motion: reduce)");
    if (motion === "reduced" || rm.matches) { spans.forEach((s) => (s.style.fontWeight = String(Math.round((min + max) / 2.4)))); return; }

    // Letter centres are measured at rest weight and cached, so the reflow
    // the lens causes never feeds back into where the lens is.
    let cx: number[] = [], cy: number[] = [], em = 16;
    const measure = () => {
      spans.forEach((s) => (s.style.fontWeight = String(min)));
      const r = host.getBoundingClientRect();
      const k = r.width / host.offsetWidth || 1;
      cx = spans.map((s) => { const b = s.getBoundingClientRect(); return (b.left + b.width / 2 - r.left) / k; });
      cy = spans.map((s) => { const b = s.getBoundingClientRect(); return (b.top + b.height / 2 - r.top) / k; });
      em = parseFloat(getComputedStyle(spans[0] ?? host).fontSize) || 16;
    };
    const cur = spans.map(() => min);
    let px = NaN, py = NaN, near = 0; // near: 0 = idle wave, 1 = lens
    let raf = 0, visible = true, last = 0, t0 = performance.now();

    const tick = (now: number) => {
      raf = 0;
      if (!visible || document.hidden) { last = 0; return; }
      const dt = Math.min(0.05, last ? (now - last) / 1000 : 0.016);
      last = now;
      const t = (now - t0) / 1000;
      near += ((Number.isNaN(px) ? 0 : 1) - near) * Math.min(1, dt * 5);
      const sx = em * 1.05, sy = em * 0.9;
      spans.forEach((s, i) => {
        // The wave: a crest travelling along the line every ~3.4s.
        const wave = 0.5 + 0.5 * Math.sin(t * 1.85 - i * 0.42);
        const idle = min + (max - min) * 0.62 * Math.pow(wave, 2.2);
        let lens = min;
        if (!Number.isNaN(px)) {
          const dx = (px - cx[i]) / sx, dy = (py - cy[i]) / sy;
          lens = min + (max - min) * Math.exp(-(dx * dx + dy * dy) / 2);
        }
        const target = idle * (1 - near) + lens * near;
        cur[i] += (target - cur[i]) * Math.min(1, dt * 14);
        s.style.fontWeight = cur[i].toFixed(0);
        s.style.setProperty("--w", ((cur[i] - min) / (max - min)).toFixed(3));
      });
      raf = requestAnimationFrame(tick);
    };
    const wake = () => { if (!raf) raf = requestAnimationFrame(tick); };

    const onMove = (e: PointerEvent) => {
      const r = host.getBoundingClientRect();
      const k = r.width / host.offsetWidth || 1;
      px = (e.clientX - r.left) / k;
      py = (e.clientY - r.top) / k;
    };
    const onLeave = () => { px = NaN; py = NaN; };

    measure();
    const ro = new ResizeObserver(() => { measure(); });
    ro.observe(host);
    let alive = true;
    document.fonts?.ready.then(() => alive && measure());
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible) wake(); });
    io.observe(host);
    const onVis = () => wake();
    document.addEventListener("visibilitychange", onVis);
    host.addEventListener("pointermove", onMove, { passive: true });
    host.addEventListener("pointerleave", onLeave);
    host.addEventListener("pointercancel", onLeave);
    host.addEventListener("pointerup", (e) => { if (e.pointerType === "touch") onLeave(); });
    wake();
    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      raf = 0;
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerleave", onLeave);
      host.removeEventListener("pointercancel", onLeave);
    };
  }, [text, min, max, motion]);

  const words = text.split(" ");
  let n = 0;
  return (
    <div ref={hostRef} className={`ww ww--${theme} ${className}`} data-motion={motion}>
      <h2 className="ww__h" aria-label={text}>
        {words.map((w, wi) => (
          <span key={wi} className="ww__word" aria-hidden="true">
            {Array.from(w).map((ch, i) => {
              const k = n++;
              return <span key={i} className="ww__l" style={{ ["--i" as string]: k, fontWeight: min }}>{ch}</span>;
            })}
          </span>
        ))}
      </h2>
    </div>
  );
}
