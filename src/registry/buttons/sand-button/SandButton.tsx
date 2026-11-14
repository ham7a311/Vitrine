"use client";

import { useEffect, useRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { Sand, amplitude, ease, mix, seeded, type Mode } from "../../backgrounds/chladni-plate/chladni";
import "./sand-button.css";

/**
 * Sand Button
 * The button is a small plate with sand on it. The grains have settled on its outline and on the figure of the
 * note it is tuned to, leaving the label clear. Pointing at it bows the plate, so the figure re-forms; pressing
 * thumps it, the sand jumps away from your finger and finds its lines again. At rest nothing moves.
 */

type Props = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> & {
  children: ReactNode;
  theme?: "gold" | "ash";
  size?: "md" | "lg";
  /** The notes it moves between each time it is bowed. */
  figures?: Mode[];
  motion?: "full" | "reduced";
};

const NOTES: Mode[] = [{ n: 1, m: 4 }, { n: 2, m: 5 }, { n: 1, m: 6 }, { n: 3, m: 4 }];
/** How far the sand may spill past the button's edge, in pixels. */
const SPILL = 12;
/** Seconds the plate keeps ringing after it was last touched. */
const RING = 2.4;
const GLIDE = 0.9;

/** Distance to a rounded rectangle centred on the origin; negative inside. */
function box(x: number, y: number, hw: number, hh: number, r: number) {
  const qx = Math.abs(x) - hw + r, qy = Math.abs(y) - hh + r;
  return Math.hypot(Math.max(qx, 0), Math.max(qy, 0)) + Math.min(Math.max(qx, qy), 0) - r;
}

export function SandButton({ children, theme = "gold", size = "md", figures = NOTES, motion = "full", className = "", disabled, onPointerEnter, onPointerDown, onFocus, onKeyDown, ...rest }: Props) {
  const ref = useRef<HTMLButtonElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const label = useRef<HTMLSpanElement>(null);
  const api = useRef({ bow: () => {}, thump: (_x?: number, _y?: number) => {} });

  useEffect(() => {
    const el = ref.current!, cv = canvas.current!, ctx = cv.getContext("2d");
    if (!ctx) return;
    const reduced = motion === "reduced" || matchMedia("(prefers-reduced-motion: reduce)").matches;
    let W = 0, H = 0, dpr = 1, sand: Sand | null = null, grain = "#efe4c4";
    let raf = 0, alive = true, until = 0, note = 0, from = figures[0], glideAt = -1;
    // The label's box, in canvas pixels: the sand keeps out of it.
    let lx = 0, ly = 0, lhw = 0, lhh = 0, radius = 16;

    const field = (mode: Mode) => {
      const cx = W / 2, cy = H / 2, hw = W / 2 - SPILL, hh = H / 2 - SPILL, side = (H - SPILL * 2) * 1.7;
      return (x: number, y: number) => {
        const d = box(x - cx, y - cy, hw, hh, radius) / 14;
        if (d >= 0) return d;
        // Inside: the figure, measured from the middle so it mirrors both ways, fading to nothing over the label.
        const clear = Math.min(1, Math.max(0, 1 + box(x - lx, y - ly, lhw, lhh, 10) / 9));
        return d * (amplitude((x - cx) / side, (y - cy) / side, mode.n, mode.m, 1) * clear + 1.3 * (1 - clear));
      };
    };

    const draw = () => {
      if (!sand) return;
      ctx.clearRect(0, 0, cv.width, cv.height);
      ctx.fillStyle = grain;
      ctx.globalAlpha = disabled ? 0.35 : 0.9;
      const s = Math.max(1, 0.8 * dpr);
      for (let i = 0; i < sand.count; i++) {
        const r = i % 7 === 0 ? s * 1.45 : s;
        ctx.fillRect(sand.x[i] * dpr - r / 2, sand.y[i] * dpr - r / 2, r, r);
      }
    };

    const current = (now: number) => {
      if (glideAt < 0) return figures[note % figures.length];
      const t = (now - glideAt) / 1000 / GLIDE;
      if (t >= 1) { glideAt = -1; return figures[note % figures.length]; }
      return mix(from, figures[note % figures.length], ease(t));
    };

    const measure = () => {
      const w = el.offsetWidth + SPILL * 2, h = el.offsetHeight + SPILL * 2;
      if (!w || !h) return;
      const resized = w !== W || h !== H;
      W = w; H = h;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      cv.width = Math.round(W * dpr);
      cv.height = Math.round(H * dpr);
      const cs = getComputedStyle(el);
      grain = cs.getPropertyValue("--sandb-grain").trim() || grain;
      radius = parseFloat(cs.borderTopLeftRadius) || 16;
      const l = label.current!;
      lx = l.offsetLeft + l.offsetWidth / 2 + SPILL;
      ly = l.offsetTop + l.offsetHeight / 2 + SPILL;
      lhw = l.offsetWidth / 2 + 8;
      lhh = l.offsetHeight / 2 + 5;
      const count = Math.round(Math.min(4200, Math.max(1100, (w + h) * 6)));
      if (!sand || sand.count !== count) sand = new Sand(count, W, H, reduced || disabled ? seeded(11) : Math.random);
      else if (resized) sand.resize(W, H);
      if (disabled) {
        // An unplayed plate: the sand lies where it fell, inside the button.
        sand.scatter();
        for (let i = 0; i < sand.count; i++) {
          let x = SPILL + 3 + (sand.x[i] / W) * (W - SPILL * 2 - 6), y = SPILL + 3 + (sand.y[i] / H) * (H - SPILL * 2 - 6);
          // Grains that fell on the words are brushed to the nearer side of them.
          if (Math.abs(x - lx) < lhw && Math.abs(y - ly) < lhh) y = ly + (y < ly ? -1 : 1) * (lhh + Math.abs(y - ly) * 0.5);
          sand.x[i] = x;
          sand.y[i] = Math.min(H - SPILL - 2, Math.max(SPILL + 2, y));
        }
      } else if (reduced) {
        sand.scatter();
        const f = field(figures[0]);
        for (let i = 0; i < 170; i++) sand.step(f, { shake: 1.5, drift: 0.42 });
      }
      el.dataset.sand = "";
      draw();
    };

    const tick = (now: number) => {
      raf = 0;
      if (!alive || !sand || document.hidden) return;
      sand.step(field(current(now)), { shake: glideAt >= 0 ? 2.6 : 1.5, drift: 0.42 });
      draw();
      if (now < until) raf = requestAnimationFrame(tick);
    };
    const ring = () => {
      if (reduced || disabled) return;
      until = performance.now() + RING * 1000;
      if (!raf) raf = requestAnimationFrame(tick);
    };

    api.current.bow = () => {
      if (reduced || disabled || glideAt >= 0) return;
      from = figures[note % figures.length];
      note++;
      glideAt = performance.now();
      ring();
    };
    api.current.thump = (x, y) => {
      if (reduced || disabled || !sand) return;
      sand.kick(x ?? W / 2, y ?? H / 2, Math.max(70, H * 1.1), 5.5);
      ring();
    };

    const ro = new ResizeObserver(() => { measure(); ring(); });
    ro.observe(el);
    measure();
    ring();
    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [figures, motion, theme, size, disabled]);

  return (
    <button
      ref={ref}
      type="button"
      className={`sandb sandb--${theme} sandb--${size} ${className}`}
      disabled={disabled}
      onPointerEnter={(e) => { if (e.pointerType === "mouse") api.current.bow(); onPointerEnter?.(e); }}
      onFocus={(e) => { if (e.currentTarget.matches(":focus-visible")) api.current.bow(); onFocus?.(e); }}
      onPointerDown={(e) => {
        const r = e.currentTarget.getBoundingClientRect(), k = r.width / e.currentTarget.offsetWidth || 1;
        api.current.thump((e.clientX - r.left) / k + SPILL, (e.clientY - r.top) / k + SPILL);
        onPointerDown?.(e);
      }}
      onKeyDown={(e) => { if ((e.key === "Enter" || e.key === " ") && !e.repeat) api.current.thump(); onKeyDown?.(e); }}
      {...rest}
    >
      <canvas ref={canvas} className="sandb__sand" aria-hidden="true" />
      <span ref={label} className="sandb__label">{children}</span>
    </button>
  );
}

export default SandButton;
