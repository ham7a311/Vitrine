"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Isobar
 * A living weather map. Contour lines are traced with marching squares over a
 * slowly evolving pressure field; every fifth line is heavier, and the current
 * high and low are marked H and L. The cursor is a pressure system of its own —
 * isobars bend and gather around it.
 */

type Props = {
  color?: string;
  background?: string;
  /** Number of contour levels. */
  levels?: number;
  /** Grid resolution in px (smaller = smoother, more work). */
  cell?: number;
  /** Mark the highest and lowest pressure with H and L. */
  markers?: boolean;
  className?: string;
  children?: ReactNode;
};

// Small, fast value noise with smooth interpolation.
function makeNoise(seed = 7) {
  const perm = new Uint8Array(512);
  let s = seed;
  const rand = () => ((s = (s * 16807) % 2147483647) / 2147483647);
  const p = Array.from({ length: 256 }, (_, i) => i).sort(() => rand() - 0.5);
  for (let i = 0; i < 512; i++) perm[i] = p[i & 255];
  const grad = new Float32Array(256).map(() => rand());
  const fade = (t: number) => t * t * (3 - 2 * t);
  return (x: number, y: number) => {
    const xi = Math.floor(x), yi = Math.floor(y);
    const xf = x - xi, yf = y - yi;
    const a = grad[perm[(xi & 255) + perm[yi & 255]]];
    const b = grad[perm[((xi + 1) & 255) + perm[yi & 255]]];
    const c = grad[perm[(xi & 255) + perm[(yi + 1) & 255]]];
    const d = grad[perm[((xi + 1) & 255) + perm[(yi + 1) & 255]]];
    const u = fade(xf), v = fade(yf);
    return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
  };
}

export function Isobar({ color = "#b9cce4", background = "#07080c", levels = 16, cell = 12, markers = true, className = "", children }: Props) {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const canvas = document.createElement("canvas");
    canvas.setAttribute("aria-hidden", "true");
    canvas.style.cssText = "position:absolute;inset:0;width:100%;height:100%;display:block";
    host.prepend(canvas);
    const ctx = canvas.getContext("2d")!;
    const noise = makeNoise();
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0, h = 0, cols = 0, rows = 0;
    let field = new Float32Array(0);
    let raf = 0, last = 0, visible = true;
    const t0 = performance.now();
    const mouse = { x: -1e4, y: -1e4, s: 0, target: 0 };

    const resize = () => {
      const r = host.getBoundingClientRect();
      w = Math.max(1, r.width);
      h = Math.max(1, r.height);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cols = Math.ceil(w / cell) + 1;
      rows = Math.ceil(h / cell) + 1;
      field = new Float32Array(cols * rows);
    };

    const sample = (t: number) => {
      const sc = 0.0032;
      let lo = Infinity, hi = -Infinity, loI = 0, hiI = 0;
      for (let j = 0; j < rows; j++) {
        for (let i = 0; i < cols; i++) {
          const x = i * cell, y = j * cell;
          let v = noise(x * sc + t * 0.018, y * sc - t * 0.011) * 0.62 + noise(x * sc * 2.1 - t * 0.02, y * sc * 2.1 + 40) * 0.28 + noise(x * sc * 4.3, y * sc * 4.3 + t * 0.03) * 0.1;
          if (mouse.s > 0.001) {
            const dx = x - mouse.x, dy = y - mouse.y;
            v += Math.exp(-(dx * dx + dy * dy) / 9000) * 0.32 * mouse.s;
          }
          const k = j * cols + i;
          field[k] = v;
          if (v < lo) (lo = v), (loI = k);
          if (v > hi) (hi = v), (hiI = k);
        }
      }
      return { lo, hi, loI, hiI };
    };

    const draw = (now: number) => {
      const t = reduced ? 30 : (now - t0) / 1000;
      mouse.s += (mouse.target - mouse.s) * 0.08;
      const { lo, hi, loI, hiI } = sample(t);
      ctx.fillStyle = background;
      ctx.fillRect(0, 0, w, h);
      ctx.lineWidth = 1;
      ctx.lineCap = "round";
      for (let L = 1; L < levels; L++) {
        const iso = lo + ((hi - lo) * L) / levels;
        const major = L % 5 === 0;
        ctx.strokeStyle = color;
        ctx.globalAlpha = major ? 0.42 : 0.16;
        ctx.lineWidth = major ? 1.2 : 0.8;
        ctx.beginPath();
        for (let j = 0; j < rows - 1; j++) {
          for (let i = 0; i < cols - 1; i++) {
            const a = field[j * cols + i], b = field[j * cols + i + 1];
            const c = field[(j + 1) * cols + i + 1], d = field[(j + 1) * cols + i];
            const idx = (a > iso ? 8 : 0) | (b > iso ? 4 : 0) | (c > iso ? 2 : 0) | (d > iso ? 1 : 0);
            if (idx === 0 || idx === 15) continue;
            const x = i * cell, y = j * cell;
            const lerp = (p: number, q: number) => (iso - p) / (q - p || 1e-6);
            const top: [number, number] = [x + cell * lerp(a, b), y];
            const right: [number, number] = [x + cell, y + cell * lerp(b, c)];
            const bottom: [number, number] = [x + cell * lerp(d, c), y + cell];
            const left: [number, number] = [x, y + cell * lerp(a, d)];
            const seg = (p: [number, number], q: [number, number]) => {
              ctx.moveTo(p[0], p[1]);
              ctx.lineTo(q[0], q[1]);
            };
            switch (idx) {
              case 1: case 14: seg(left, bottom); break;
              case 2: case 13: seg(bottom, right); break;
              case 3: case 12: seg(left, right); break;
              case 4: case 11: seg(top, right); break;
              case 6: case 9: seg(top, bottom); break;
              case 7: case 8: seg(left, top); break;
              case 5: seg(left, top); seg(bottom, right); break;
              case 10: seg(top, right); seg(left, bottom); break;
            }
          }
        }
        ctx.stroke();
      }
      if (markers) {
        ctx.globalAlpha = 0.75;
        ctx.fillStyle = color;
        ctx.font = "600 13px ui-monospace, 'SF Mono', monospace";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        const mark = (k: number, label: string) => {
          const x = (k % cols) * cell, y = Math.floor(k / cols) * cell;
          if (x < 20 || y < 20 || x > w - 20 || y > h - 20) return;
          ctx.fillText(label, x, y);
        };
        mark(hiI, "H");
        mark(loI, "L");
      }
      ctx.globalAlpha = 1;
    };

    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      if (!visible || document.hidden || now - last < 50) return; // ~20fps is plenty for weather
      last = now;
      draw(now);
    };

    const onMove = (e: PointerEvent) => {
      const r = host.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
      mouse.target = mouse.x >= 0 && mouse.y >= 0 && mouse.x <= r.width && mouse.y <= r.height ? 1 : 0;
    };

    resize();
    draw(performance.now());
    const ro = new ResizeObserver(() => {
      resize();
      draw(performance.now());
    });
    ro.observe(host);
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(host);
    if (!reduced) {
      raf = requestAnimationFrame(loop);
      if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) window.addEventListener("pointermove", onMove, { passive: true });
    }
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
      canvas.remove();
    };
  }, [color, background, levels, cell, markers]);

  return (
    <div ref={hostRef} className={`relative isolate overflow-hidden ${className}`} style={{ background }}>
      {children && <div className="relative z-[1] h-full">{children}</div>}
    </div>
  );
}
