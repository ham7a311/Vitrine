"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Glyph Swell
 * A quiet grid of monospaced marks. Swells start from wherever your pointer
 * is and travel outward as rings, lifting each cell through denser glyphs
 * and brighter ink as the ring passes — the letter-after-letter cascade,
 * spread over a whole surface. Left alone, slow swells start from random
 * cells.
 */

type Props = {
  /** Background, ink, crest accent (hex). */
  colors?: [string, string, string];
  /** Glyphs from quiet to loud. */
  ramp?: string;
  /** Cell size in CSS px. */
  cell?: number;
  className?: string;
  children?: ReactNode;
};

type Swell = { x: number; y: number; t: number; a: number };

export function GlyphSwell({ colors = ["#07090a", "#9fe6b0", "#e9fff0"], ramp = "·:-+=*#", cell = 15, className = "", children }: Props) {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const canvas = document.createElement("canvas");
    canvas.setAttribute("aria-hidden", "true");
    canvas.style.cssText = "position:absolute;inset:0;width:100%;height:100%;display:block";
    host.prepend(canvas);
    const ctx = canvas.getContext("2d");
    if (!ctx) return () => canvas.remove();

    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarse = !matchMedia("(hover: hover) and (pointer: fine)").matches;
    const dpr = Math.min(devicePixelRatio, 2);
    const size = coarse ? Math.round(cell * 0.85) : cell;
    const L = ramp.length;

    // A glyph atlas: every mark pre-drawn once in ink and once in the crest colour.
    const atlas = document.createElement("canvas");
    const S = Math.ceil(size * dpr);
    atlas.width = S * L;
    atlas.height = S * 2;
    const a = atlas.getContext("2d")!;
    const paintAtlas = () => {
      a.clearRect(0, 0, atlas.width, atlas.height);
      a.textAlign = "center";
      a.textBaseline = "middle";
      a.font = `500 ${Math.round(size * 0.82 * dpr)}px "Geist Mono", "JetBrains Mono", ui-monospace, monospace`;
      [colors[1], colors[2]].forEach((c, row) => {
        a.fillStyle = c;
        for (let i = 0; i < L; i++) a.fillText(ramp[i], i * S + S / 2, row * S + S / 2 + dpr * 0.5);
      });
    };
    paintAtlas();

    let W = 0, H = 0, cols = 0, rows = 0;
    let raf = 0, visible = true, last = 0, lastIdle = 0, lastSpawn = 0, lastCell = -1;
    const swells: Swell[] = [];
    const t0 = performance.now();
    const now = () => (performance.now() - t0) / 1000;

    const resize = () => {
      const w = host.clientWidth, h = host.clientHeight;
      if (w === W && h === H) return;
      W = w; H = h;
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      cols = Math.ceil(W / size) + 1;
      rows = Math.ceil(H / size) + 1;
    };

    const frame = (t: number) => {
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      while (swells.length && t - swells[0].t > 6) swells.shift();
      const ox = ((W - (cols - 1) * size) / 2) * dpr, oy = ((H - (rows - 1) * size) / 2) * dpr;
      for (let j = 0; j < rows; j++) {
        for (let i = 0; i < cols; i++) {
          // A low murmur everywhere, so the field is never fully still.
          let v = 0.06 + 0.05 * Math.sin(i * 0.37 + t * 0.6) * Math.sin(j * 0.29 - t * 0.45);
          for (const s of swells) {
            const age = t - s.t, d = Math.hypot(i - s.x, j - s.y), front = age * 17;
            const band = Math.exp(-((d - front) ** 2) / 8);
            if (band < 0.01) continue;
            v += s.a * band * Math.exp(-age * 0.55) / (1 + d * 0.015);
          }
          if (v < 0.035) continue;
          const lv = Math.min(L - 1, Math.floor(v * L * 1.05));
          const crest = v > 0.8 ? 1 : 0;
          ctx.globalAlpha = Math.min(1, 0.2 + v * 1.15);
          ctx.drawImage(atlas, lv * S, crest * S, S, S, ox + i * size * dpr - S / 2, oy + j * size * dpr - S / 2, S, S);
        }
      }
      ctx.globalAlpha = 1;
    };

    const loop = (ms: number) => {
      if (!visible || document.hidden) { raf = 0; return; }
      raf = requestAnimationFrame(loop);
      if (ms - last < (coarse ? 33 : 24)) return;
      last = ms;
      resize();
      const t = now();
      if (t - lastIdle > 1.9 && t - lastSpawn > 1.2) {
        lastIdle = t;
        swells.push({ x: Math.random() * cols, y: Math.random() * rows, t, a: 0.7 });
      }
      frame(t);
    };
    const wake = () => { if (!reduced && !raf && visible && !document.hidden) raf = requestAnimationFrame(loop); };

    const at = (e: PointerEvent) => {
      const r = host.getBoundingClientRect();
      const x = e.clientX - r.left, y = e.clientY - r.top;
      if (x < 0 || y < 0 || x > r.width || y > r.height) return null;
      return { x: x / size, y: y / size };
    };
    // A new swell each time the pointer reaches a new cell, at most every 140ms.
    const onMove = (e: PointerEvent) => {
      const c = at(e);
      if (!c) return;
      const id = Math.floor(c.y) * 10000 + Math.floor(c.x), t = now();
      if (id === lastCell || t - lastSpawn < 0.14) return;
      lastCell = id; lastSpawn = t;
      swells.push({ x: c.x, y: c.y, t, a: 0.8 });
      if (swells.length > 14) swells.shift();
    };
    const onDown = (e: PointerEvent) => {
      const c = at(e);
      if (c) { swells.push({ x: c.x, y: c.y, t: now(), a: 1.6 }); lastSpawn = now(); }
    };

    // Redraw the atlas once the mono face has loaded, so the marks aren't in a fallback font.
    let alive = true;
    document.fonts?.ready.then(() => { if (!alive) return; paintAtlas(); if (reduced) frame(1.4); });

    resize();
    if (reduced) {
      // A still frame mid-swell.
      swells.push({ x: cols * 0.35, y: rows * 0.45, t: 0, a: 1.1 }, { x: cols * 0.75, y: rows * 0.3, t: 0.6, a: 0.8 });
      frame(1.4);
    } else frame(0);
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; wake(); });
    io.observe(host);
    const ro = new ResizeObserver(() => { if (reduced) { resize(); frame(1.4); } });
    ro.observe(host);
    document.addEventListener("visibilitychange", wake);
    if (!reduced) {
      wake();
      if (!coarse) window.addEventListener("pointermove", onMove, { passive: true });
      window.addEventListener("pointerdown", onDown, { passive: true });
    }
    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      raf = 0;
      io.disconnect();
      ro.disconnect();
      document.removeEventListener("visibilitychange", wake);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      canvas.remove();
    };
  }, [colors, ramp, cell]);

  return (
    <div ref={hostRef} className={`relative isolate overflow-hidden ${className}`} style={{ background: colors[0] }}>
      {children && <div className="relative z-[1] h-full">{children}</div>}
    </div>
  );
}
