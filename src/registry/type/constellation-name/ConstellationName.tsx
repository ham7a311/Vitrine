"use client";
import { useEffect, useRef } from "react";

type Props = { text: string; color?: string; density?: number; className?: string };
type Star = { hx: number; hy: number; x: number; y: number; vx: number; vy: number; ph: number; r: number };

export function ConstellationName({ text, color = "#cfe0ff", density = 130, className = "" }: Props) {
  const wrap = useRef<HTMLDivElement>(null);
  const cv = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = cv.current!, box = wrap.current!, ctx = canvas.getContext("2d")!;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let stars: Star[] = [], w = 0, h = 0, raf = 0, visible = true, mx = -1e4, my = -1e4;

    const build = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = box.clientWidth; h = box.clientHeight;
      canvas.width = w * dpr; canvas.height = h * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const off = document.createElement("canvas"); off.width = w; off.height = h;
      const o = off.getContext("2d")!;
      let size = h * 0.7;
      o.font = `400 ${size}px "Instrument Serif", Georgia, serif`;
      size *= Math.min(1, (w * 0.86) / o.measureText(text).width);
      o.font = `italic 400 ${size}px "Instrument Serif", Georgia, serif`;
      o.textAlign = "center"; o.textBaseline = "middle"; o.fillStyle = "#fff"; o.fillText(text, w / 2, h / 2);
      const data = o.getImageData(0, 0, w, h).data, pts: [number, number][] = [];
      const step = Math.max(3, Math.round(Math.sqrt((w * h) / 9000)));
      for (let y = 0; y < h; y += step) for (let x = 0; x < w; x += step) if (data[(y * w + x) * 4 + 3] > 128) pts.push([x, y]);
      for (let i = pts.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [pts[i], pts[j]] = [pts[j], pts[i]]; }
      stars = pts.slice(0, density * 2).map(([x, y]) => ({ hx: x, hy: y, x: x + (Math.random() - 0.5) * 60, y: y + (Math.random() - 0.5) * 60, vx: 0, vy: 0, ph: Math.random() * 6.28, r: 0.8 + Math.random() * 1.6 }));
    };

    const draw = (t: number) => {
      ctx.clearRect(0, 0, w, h);
      const link = Math.max(26, w / 16);
      ctx.lineWidth = 0.6;
      for (const s of stars) {
        s.vx += (s.hx - s.x) * 0.03; s.vy += (s.hy - s.y) * 0.03;
        const dx = mx - s.x, dy = my - s.y, d = Math.hypot(dx, dy);
        if (d < 120 && d > 1) { const f = (1 - d / 120) * 0.9; s.vx += (dx / d) * f; s.vy += (dy / d) * f; }
        s.vx *= 0.86; s.vy *= 0.86; s.x += s.vx; s.y += s.vy;
      }
      for (let i = 0; i < stars.length; i++) for (let j = i + 1; j < stars.length; j++) {
        const a = stars[i], b = stars[j], d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d < link) { ctx.strokeStyle = color; ctx.globalAlpha = (1 - d / link) * 0.35; ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke(); }
      }
      ctx.fillStyle = color;
      for (const s of stars) { ctx.globalAlpha = 0.55 + 0.45 * Math.sin(t / 700 + s.ph); ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, 6.283); ctx.fill(); }
      ctx.globalAlpha = 1;
    };
    const loop = (t: number) => { raf = requestAnimationFrame(loop); if (visible) draw(t); };

    const start = () => { build(); if (reduce) { stars.forEach((s) => { s.x = s.hx; s.y = s.hy; }); draw(0); } };
    (document.fonts?.load('italic 40px "Instrument Serif"') ?? Promise.resolve()).then(() => { start(); if (!reduce) raf = requestAnimationFrame(loop); });
    const ro = new ResizeObserver(start); ro.observe(box);
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting)); io.observe(box);
    const move = (e: PointerEvent) => { const r = box.getBoundingClientRect(); mx = e.clientX - r.left; my = e.clientY - r.top; };
    const leave = () => { mx = my = -1e4; };
    box.addEventListener("pointermove", move); box.addEventListener("pointerleave", leave);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); io.disconnect(); box.removeEventListener("pointermove", move); box.removeEventListener("pointerleave", leave); };
  }, [text, color, density]);

  return (
    <div ref={wrap} className={className} style={{ position: "relative", width: "100%", height: "100%", minHeight: 220, touchAction: "pan-y" }} role="img" aria-label={text}>
      <canvas ref={cv} style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} />
    </div>
  );
}
