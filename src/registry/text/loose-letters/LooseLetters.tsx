"use client";

import { useEffect, useRef, useState } from "react";
import "./loose-letters.css";

/**
 * Loose Letters
 * A shop sign whose letters hang from a rail on little strings. Brush past
 * and they swing — each one a damped pendulum, nudging its neighbours — and
 * a fast swipe sends one spinning right round its pin. Click the sign and
 * they come off their hooks, fall, bounce and tumble across the floor, then
 * climb back up to their pins and settle.
 */

type Props = {
  text: string;
  theme?: "paper" | "night";
  motion?: "full" | "reduced";
  className?: string;
};

type L = {
  el: HTMLSpanElement;
  // Hanging: angle and angular velocity.
  a: number; w: number;
  // Off the hook: offset from the pin, velocity, spin.
  x: number; y: number; vx: number; vy: number; r: number; vr: number;
  cx: number; cy: number; hw: number; hh: number; // pin and half-size at rest, in host px
};

const G = 2400; // px/s² while falling
const SWING_K = 38; // g/L for the pendulum
const DAMP = 2.4; // ζ ≈ 0.2: a few lively swings, settled within ~4s
const COUPLE = 6;

export function LooseLetters({ text, theme = "paper", motion = "full", className = "" }: Props) {
  const hostRef = useRef<HTMLDivElement>(null);
  const api = useRef<{ drop: () => void; shake: () => void } | null>(null);
  const [mode, setMode] = useState<"hang" | "fallen" | "climb">("hang");
  const [reduced, setReduced] = useState(motion === "reduced");

  useEffect(() => {
    const rm = matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(motion === "reduced" || rm.matches);
  }, [motion]);

  useEffect(() => {
    const host = hostRef.current;
    if (!host || reduced) return;
    const els = Array.from(host.querySelectorAll<HTMLSpanElement>(".ll__tile"));
    const Ls: L[] = els.map((el) => ({ el, a: 0, w: 0, x: 0, y: 0, vx: 0, vy: 0, r: 0, vr: 0, cx: 0, cy: 0, hw: 0, hh: 0 }));
    let state: "hang" | "fall" | "rest" | "climb" = "hang";
    let raf = 0, last = 0, restAt = 0, climbT = 0;
    const from: { x: number; y: number; r: number }[] = [];

    const measure = () => {
      const hr = host.getBoundingClientRect();
      const s = hr.width / host.offsetWidth || 1;
      Ls.forEach((l) => {
        const t = l.el.style.transform;
        l.el.style.transform = "none";
        const r = l.el.getBoundingClientRect();
        l.el.style.transform = t;
        l.cx = (r.left + r.width / 2 - hr.left) / s;
        l.cy = (r.top - hr.top) / s; // the pin is at the string's top, above the tile
        l.hw = r.width / s / 2;
        l.hh = r.height / s / 2;
      });
    };

    const draw = () => {
      for (const l of Ls) {
        if (state === "hang") l.el.style.transform = `rotate(${l.a.toFixed(4)}rad)`;
        else l.el.style.transform = `translate(${l.x.toFixed(2)}px, ${l.y.toFixed(2)}px) rotate(${l.r.toFixed(4)}rad)`;
      }
    };

    const step = (now: number) => {
      raf = 0;
      const dt = Math.min(0.024, last ? (now - last) / 1000 : 0.016);
      last = now;
      let busy = false;
      if (state === "hang") {
        // Damped pendulums with a soft spring to each neighbour.
        for (let sub = 0; sub < 2; sub++) {
          const h = dt / 2;
          Ls.forEach((l, i) => {
            const nb = (i > 0 ? Ls[i - 1].a - l.a : 0) + (i < Ls.length - 1 ? Ls[i + 1].a - l.a : 0);
            l.w += (-SWING_K * Math.sin(l.a) - DAMP * l.w + COUPLE * nb) * h;
          });
          Ls.forEach((l) => { l.a += l.w * h; });
        }
        // Keep angles wrapped once a letter has spun all the way round.
        Ls.forEach((l) => { if (Math.abs(l.a) > Math.PI) l.a -= Math.sign(l.a) * Math.PI * 2; });
        busy = Ls.some((l) => Math.abs(l.a) > 0.003 || Math.abs(l.w) > 0.02);
        if (!busy) Ls.forEach((l) => { l.a = 0; l.w = 0; });
      } else if (state === "fall" || state === "rest") {
        const floor = host.offsetHeight - 78; // above the buttons
        let moving = false;
        for (const l of Ls) {
          l.vy += G * dt;
          l.x += l.vx * dt;
          l.y += l.vy * dt;
          l.r += l.vr * dt;
          // The tile's lowest point, roughly, given its spin.
          const reach = Math.abs(Math.cos(l.r)) * l.hh * 2 + Math.abs(Math.sin(l.r)) * l.hw;
          const bottom = l.cy + l.y + reach + 10;
          if (bottom > floor) {
            l.y -= bottom - floor;
            if (l.vy > 0) l.vy *= -0.32;
            l.vx *= 0.82;
            l.vr = l.vr * 0.7 + l.vx * 0.004;
            // Topple toward lying flat or upright, whichever is nearer.
            const flat = Math.round(l.r / (Math.PI / 2)) * (Math.PI / 2);
            l.vr += (flat - l.r) * 6 * dt * 10;
            l.vr *= 0.9;
          }
          // Walls.
          const left = l.cx + l.x - l.hw, right = l.cx + l.x + l.hw;
          if (left < 6) { l.x += 6 - left; l.vx = Math.abs(l.vx) * 0.5; }
          if (right > host.offsetWidth - 6) { l.x -= right - (host.offsetWidth - 6); l.vx = -Math.abs(l.vx) * 0.5; }
          if (Math.abs(l.vy) > 12 || Math.abs(l.vx) > 6 || Math.abs(l.vr) > 0.08) moving = true;
        }
        busy = true;
        if (state === "fall" && !moving) { state = "rest"; restAt = now; }
        if (state === "rest" && now - restAt > 1300) beginClimb(now);
      } else if (state === "climb") {
        // Back up to the pins on an eased path, then a little swing as they rehang.
        const t = Math.min(1, (now - climbT) / 1100);
        Ls.forEach((l, i) => {
          const k = Math.max(0, Math.min(1, (t * 1.35 - i * 0.04)));
          const e = 1 - Math.pow(1 - k, 3);
          l.x = from[i].x * (1 - e);
          l.y = from[i].y * (1 - e) - Math.sin(e * Math.PI) * 40;
          l.r = from[i].r * (1 - e);
        });
        busy = true;
        if (t >= 1 && Ls.every((_, i) => t * 1.35 - i * 0.04 >= 1)) {
          state = "hang";
          setMode("hang");
          Ls.forEach((l, i) => { l.a = 0; l.w = (i % 2 ? -1 : 1) * 1.6; });
        }
      }
      draw();
      if (busy && !document.hidden) raf = requestAnimationFrame(step);
      else last = 0;
    };
    const wake = () => { if (!raf) raf = requestAnimationFrame(step); };

    const beginClimb = (now: number) => {
      state = "climb";
      setMode("climb");
      climbT = now;
      Ls.forEach((l, i) => {
        // Unwind whole turns so they climb back the short way round.
        const r = ((l.r % (Math.PI * 2)) + Math.PI * 3) % (Math.PI * 2) - Math.PI;
        from[i] = { x: l.x, y: l.y, r };
      });
    };

    const drop = () => {
      if (state === "fall" || state === "rest") { beginClimb(performance.now()); wake(); return; }
      if (state === "climb") return;
      state = "fall";
      setMode("fallen");
      Ls.forEach((l) => {
        // Off the hook with whatever swing it had, plus a little scatter.
        l.x = 0; l.y = 0; l.r = l.a;
        l.vx = l.w * 60 + (Math.random() - 0.5) * 260;
        l.vy = -120 - Math.random() * 160;
        l.vr = l.w * 0.6 + (Math.random() - 0.5) * 7;
      });
      wake();
    };
    const shake = () => {
      if (state !== "hang") return;
      Ls.forEach((l, i) => { l.w += (i % 2 ? -1 : 1) * (5 + Math.random() * 4); });
      wake();
    };
    api.current = { drop, shake };

    // Brushing past: horizontal pointer speed near a tile becomes a push on its swing.
    let px = NaN, py = NaN, pt = 0;
    const onMove = (e: PointerEvent) => {
      if (state !== "hang") return;
      const hr = host.getBoundingClientRect();
      const s = hr.width / host.offsetWidth || 1;
      const x = (e.clientX - hr.left) / s, y = (e.clientY - hr.top) / s, t = e.timeStamp;
      if (!Number.isNaN(px)) {
        const dtm = Math.max(8, t - pt) / 1000;
        const vx = (x - px) / dtm;
        for (const l of Ls) {
          const dx = x - l.cx, dy = y - (l.cy + l.hh * 1.6);
          const d = Math.hypot(dx / (l.hw * 1.3), dy / (l.hh * 1.5));
          if (d < 1) {
            // Lower on the tile pushes harder (more lever).
            const lever = Math.max(0.3, Math.min(1, (y - l.cy) / (l.hh * 3)));
            l.w = Math.max(-14, Math.min(14, l.w + (vx / 120) * lever * (1 - d) * 1.3));
          }
        }
        wake();
      }
      px = x; py = y; pt = t;
      void py;
    };
    const onLeave = () => { px = NaN; };

    measure();
    const ro = new ResizeObserver(() => { if (state === "hang") measure(); });
    ro.observe(host);
    document.fonts?.ready.then(measure);
    host.addEventListener("pointermove", onMove, { passive: true });
    host.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      raf = 0;
      ro.disconnect();
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerleave", onLeave);
      api.current = null;
      els.forEach((el) => (el.style.transform = ""));
    };
  }, [reduced, text]);

  const words = text.split(" ");
  return (
    <div className={`ll ll--${theme} ${className}`} data-motion={motion}>
      <div ref={hostRef} className="ll__host" data-mode={mode} onClick={(e) => { if ((e.target as HTMLElement).closest(".ll__ctl")) return; api.current?.drop(); }}>
        <h2 className="ll__sign" aria-label={text}>
          <span className="ll__rail" aria-hidden="true" />
          {words.map((w, wi) => (
            <span key={wi} className="ll__word" aria-hidden="true">
              {Array.from(w).map((ch, i) => (
                <span key={i} className="ll__tile">
                  <span className="ll__string" />
                  <span className="ll__face">{ch}</span>
                </span>
              ))}
            </span>
          ))}
        </h2>
        {!reduced && (
          <div className="ll__ctl">
            <button type="button" onClick={() => api.current?.shake()} disabled={mode !== "hang"}>Shake</button>
            <button type="button" onClick={() => api.current?.drop()} disabled={mode === "climb"}>{mode === "hang" ? "Drop" : "Hang back up"}</button>
          </div>
        )}
      </div>
    </div>
  );
}
