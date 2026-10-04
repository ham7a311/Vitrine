"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import "./tether.css";

/**
 * Tether
 * A name tag on a lanyard. Pick it up from its nail and it hangs from your
 * cursor on a real rope — fourteen Verlet points under gravity — so it
 * trails, swings when you fling it and settles like a pendulum when you
 * stop. Click anywhere to hang it on a fresh pin; brush past it and it
 * sways. The tag is a real link, clickable whenever it is hanging.
 */

type Props = {
  /** The tag's contents (keep it small: it hangs about 170px wide). */
  tag: ReactNode;
  /** Where the tag hangs at first, as fractions of the host. */
  nail?: [number, number];
  href?: string;
  theme?: "paper" | "night";
  motion?: "full" | "reduced";
  /** Rope colour. */
  cord?: string;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
};

const N = 14; // rope points
const SEG = 9; // px between points
const G = 2200; // gravity, px/s²
const STEP = 1 / 120;

export function Tether({ tag, nail: [nx, ny] = [0.72, 0.16], href = "#", theme = "paper", motion = "full", cord = "#e0603a", className = "", style, children }: Props) {
  const hostRef = useRef<HTMLDivElement>(null);
  const ropeRef = useRef<SVGPathElement>(null);
  const tagRef = useRef<HTMLAnchorElement>(null);
  const pinRef = useRef<HTMLButtonElement>(null);
  const clipRef = useRef<HTMLDivElement>(null);
  const [carried, setCarried] = useState(false);
  const api = useRef<{ pickUp: () => void; hang: () => void; nudge: () => void } | null>(null);

  useEffect(() => {
    const host = hostRef.current, rope = ropeRef.current, tg = tagRef.current, pinEl = pinRef.current, clip = clipRef.current;
    if (!host || !rope || !tg || !pinEl || !clip) return;
    const fine = matchMedia("(hover: hover) and (pointer: fine)");
    const rm = matchMedia("(prefers-reduced-motion: reduce)");
    const still = () => motion === "reduced" || rm.matches;

    const px = new Float32Array(N), py = new Float32Array(N), ox = new Float32Array(N), oy = new Float32Array(N);
    const inv = new Float32Array(N).fill(1);
    inv[0] = 0;
    inv[N - 1] = 0.35; // the tag is heavier than the cord
    const pin = { x: 0, y: 0 };
    const ptr = { x: 0, y: 0, vx: 0, vy: 0, t: 0, in: false };
    let mode: "hung" | "carried" = "hung";
    let ang = 0, angV = 0, raf = 0, lastT = 0, acc = 0, quietSince = 0;

    const local = (cx: number, cy: number) => {
      const r = host.getBoundingClientRect();
      const s = r.width / host.offsetWidth || 1;
      return { x: (cx - r.left) / s, y: (cy - r.top) / s };
    };
    const clamp = (x: number, y: number) => ({
      x: Math.max(16, Math.min(host.offsetWidth - 16, x)),
      y: Math.max(12, Math.min(host.offsetHeight - 40, y)),
    });

    /** Lay the rope straight down from the pin, at rest. */
    const drop = () => {
      for (let i = 0; i < N; i++) {
        px[i] = ox[i] = pin.x;
        py[i] = oy[i] = pin.y + i * SEG;
      }
      ang = 0;
      angV = 0;
    };

    const simulate = (dt: number) => {
      px[0] = ox[0] = pin.x;
      py[0] = oy[0] = pin.y;
      for (let i = 1; i < N; i++) {
        const vx = (px[i] - ox[i]) * 0.989, vy = (py[i] - oy[i]) * 0.989;
        ox[i] = px[i];
        oy[i] = py[i];
        px[i] += vx;
        py[i] += vy + G * dt * dt;
      }
      for (let k = 0; k < 10; k++) {
        for (let i = 0; i < N - 1; i++) {
          const dx = px[i + 1] - px[i], dy = py[i + 1] - py[i];
          const d = Math.hypot(dx, dy) || 0.0001;
          const wa = inv[i], wb = inv[i + 1], w = wa + wb;
          if (!w) continue;
          const f = (d - SEG) / d / w;
          px[i] += dx * f * wa;
          py[i] += dy * f * wa;
          px[i + 1] -= dx * f * wb;
          py[i + 1] -= dy * f * wb;
        }
      }
      // The tag turns to follow the last stretch of cord, with a little inertia of its own.
      const lx = px[N - 1] - px[N - 3], ly = py[N - 1] - py[N - 3];
      const want = -Math.atan2(lx, ly);
      // Take the short way round when the card swings past the top.
      const da = Math.atan2(Math.sin(want - ang), Math.cos(want - ang));
      angV += (da * 140 - angV * 9) * dt;
      ang += angV * dt;
    };

    /** While it hangs, a pointer moving through the cord or tag gives it a push. */
    const brush = (dt: number) => {
      if (mode !== "hung" || !ptr.in || performance.now() - ptr.t > 60) return;
      const tx = px[N - 1], ty = py[N - 1];
      for (let i = 1; i < N; i++) {
        const near = Math.hypot(px[i] - ptr.x, py[i] - ptr.y) < 16;
        const onTag = i === N - 1 && Math.abs(ptr.x - tx) < tg.offsetWidth / 2 && ptr.y > ty && ptr.y < ty + tg.offsetHeight;
        if (!near && !onTag) continue;
        const k = onTag ? 0.08 : 0.3;
        ox[i] -= ptr.vx * dt * k;
        oy[i] -= ptr.vy * dt * k * 0.4;
      }
    };

    const draw = () => {
      // A smooth cord: a quadratic through the midpoints of the rope's points.
      let d = `M${px[0].toFixed(1)} ${py[0].toFixed(1)}`;
      for (let i = 1; i < N - 1; i++) {
        const mx = (px[i] + px[i + 1]) / 2, my = (py[i] + py[i + 1]) / 2;
        d += `Q${px[i].toFixed(1)} ${py[i].toFixed(1)} ${mx.toFixed(1)} ${my.toFixed(1)}`;
      }
      d += `L${px[N - 1].toFixed(1)} ${py[N - 1].toFixed(1)}`;
      rope.setAttribute("d", d);
      tg.style.transform = `translate3d(${px[N - 1].toFixed(1)}px, ${py[N - 1].toFixed(1)}px, 0) translateX(-50%) rotate(${ang.toFixed(4)}rad)`;
      pinEl.style.transform = `translate3d(${pin.x}px, ${pin.y}px, 0)`;
      clip.style.transform = `translate3d(${pin.x}px, ${pin.y}px, 0)`;
    };

    const energy = () => {
      let e = Math.abs(angV) * 4;
      for (let i = 1; i < N; i++) e += Math.abs(px[i] - ox[i]) + Math.abs(py[i] - oy[i]);
      return e;
    };

    const loop = (now: number) => {
      raf = 0;
      const dt = Math.min(0.05, lastT ? (now - lastT) / 1000 : STEP);
      lastT = now;
      if (still()) {
        drop();
        draw();
        lastT = 0;
        return;
      }
      acc += dt;
      while (acc >= STEP) {
        brush(STEP);
        simulate(STEP);
        acc -= STEP;
      }
      draw();
      // Sleep once the tag has settled and the pin hasn't moved for a while.
      if (energy() > 0.04 || now - ptr.t < 120) quietSince = now;
      if (now - quietSince < 400 && !document.hidden) raf = requestAnimationFrame(loop);
      else lastT = 0;
    };
    const wake = () => { if (!raf) raf = requestAnimationFrame(loop); };

    const setMode = (m: typeof mode) => {
      mode = m;
      host.dataset.mode = m;
      setCarried(m === "carried");
    };
    const pickUp = () => {
      setMode("carried");
      if (ptr.in) { pin.x = ptr.x; pin.y = ptr.y; }
      wake();
    };
    const hang = (x = pin.x, y = pin.y) => {
      const c = clamp(x, y);
      pin.x = c.x;
      pin.y = c.y;
      setMode("hung");
      wake();
    };
    // Touch can't carry the tag, so tapping the nail gives it a swing instead.
    const nudge = () => {
      for (let i = 1; i < N; i++) ox[i] += (i / N) * 7;
      angV += 3;
      wake();
    };
    api.current = { pickUp, hang: () => hang(), nudge };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      const q = local(e.clientX, e.clientY);
      const now = performance.now();
      const dt = Math.max(1, now - ptr.t);
      if (ptr.in) {
        ptr.vx = ptr.vx * 0.5 + ((q.x - ptr.x) / dt) * 1000 * 0.5;
        ptr.vy = ptr.vy * 0.5 + ((q.y - ptr.y) / dt) * 1000 * 0.5;
      } else { ptr.vx = ptr.vy = 0; }
      ptr.x = q.x; ptr.y = q.y; ptr.t = now; ptr.in = true;
      if (mode === "carried") {
        pin.x = q.x;
        pin.y = q.y;
        clip.style.transform = `translate3d(${pin.x}px, ${pin.y}px, 0)`; // the clip is the cursor: draw it now
      }
      wake();
    };
    const onLeave = () => {
      ptr.in = false;
      // Let go at the edge rather than dragging the tag off the page.
      if (mode === "carried") hang(ptr.x, ptr.y);
    };
    const onDown = (e: PointerEvent) => {
      if (e.button !== 0 || e.pointerType === "touch" || mode !== "carried") return;
      if ((e.target as Element).closest("a, button, input, textarea, select, [role='button']")) return;
      // Hang it right here.
      const q = local(e.clientX, e.clientY);
      hang(q.x, q.y);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && mode === "carried") hang();
    };

    const place = () => {
      const c = clamp(host.offsetWidth * nx, host.offsetHeight * ny);
      pin.x = c.x;
      pin.y = c.y;
      drop();
      draw();
    };
    place();
    host.dataset.mode = "hung";
    let w0 = host.offsetWidth;
    const ro = new ResizeObserver(() => {
      if (host.offsetWidth === w0) return;
      w0 = host.offsetWidth;
      if (mode === "hung") place();
    });
    ro.observe(host);
    if (fine.matches) host.dataset.live = "";
    host.addEventListener("pointermove", onMove, { passive: true });
    host.addEventListener("pointerleave", onLeave);
    host.addEventListener("pointerdown", onDown);
    window.addEventListener("keydown", onKey);
    const onVis = () => { if (!document.hidden) wake(); };
    document.addEventListener("visibilitychange", onVis);
    wake();
    return () => {
      cancelAnimationFrame(raf);
      raf = 0;
      ro.disconnect();
      api.current = null;
      delete host.dataset.live;
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerleave", onLeave);
      host.removeEventListener("pointerdown", onDown);
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [motion, nx, ny]);

  return (
    <div ref={hostRef} className={`tt tt--${theme} ${className}`} data-motion={motion} style={{ ...style, ["--tt-cord" as string]: cord }}>
      {children}
      <svg className="tt__cord" aria-hidden="true">
        <path ref={ropeRef} />
      </svg>
      <button
        ref={pinRef}
        type="button"
        className="tt__pin"
        aria-label={carried ? "Hang the name tag here" : "Pick up the name tag"}
        aria-pressed={carried}
        onClick={(e) => {
          e.stopPropagation();
          if (!matchMedia("(hover: hover) and (pointer: fine)").matches) api.current?.nudge();
          else if (carried) api.current?.hang();
          else api.current?.pickUp();
        }}
      >
        <span />
      </button>
      <a ref={tagRef} href={href} className="tt__tag" onFocus={() => carried && api.current?.hang()}>
        <span className="tt__hole" aria-hidden="true" />
        {tag}
      </a>
      <div ref={clipRef} className="tt__clip" aria-hidden="true" />
    </div>
  );
}
