"use client";
import { useEffect, useRef } from "react";

type Props = { sky?: [string, string]; sand?: [string, string]; layers?: number; className?: string };

export function DuneField({ sky = ["#f6c48a", "#f7e7c6"], sand = ["#e8a35d", "#5a2b19"], layers = 7, className = "" }: Props) {
  const wrap = useRef<HTMLDivElement>(null);
  const cv = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = cv.current!, box = wrap.current!, ctx = canvas.getContext("2d")!;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let w = 0, h = 0, raf = 0, visible = true, px = 0.5;
    const mix = (a: string, b: string, t: number) => {
      const p = (s: string, i: number) => parseInt(s.slice(1 + i * 2, 3 + i * 2), 16);
      return `rgb(${[0, 1, 2].map((i) => Math.round(p(a, i) + (p(b, i) - p(a, i)) * t)).join(",")})`;
    };
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = box.clientWidth; h = box.clientHeight; canvas.width = w * dpr; canvas.height = h * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const ridge = (x: number, l: number, t: number) => {
      const k = 0.0035 + l * 0.0012;
      return Math.sin(x * k + l * 3.1 + t * (0.05 + l * 0.02)) * 0.5 + Math.sin(x * k * 2.3 + l * 1.7 - t * 0.04) * 0.28 + Math.sin(x * k * 0.45 + l) * 0.6;
    };
    const draw = (now: number) => {
      raf = requestAnimationFrame(draw);
      if (!visible) return;
      const t = reduce ? 0 : now / 1000;
      const g = ctx.createLinearGradient(0, 0, 0, h); g.addColorStop(0, sky[0]); g.addColorStop(1, sky[1]);
      ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
      const sun = ctx.createRadialGradient(w * 0.75, h * 0.32, 0, w * 0.75, h * 0.32, h * 0.35);
      sun.addColorStop(0, "rgba(255,244,214,.9)"); sun.addColorStop(1, "rgba(255,244,214,0)");
      ctx.fillStyle = sun; ctx.fillRect(0, 0, w, h);
      for (let l = 0; l < layers; l++) {
        const depth = l / (layers - 1);
        const base = h * (0.36 + depth * 0.5), amp = h * (0.05 + depth * 0.09);
        const off = (px - 0.5) * 60 * (0.3 + depth);
        const pts: [number, number][] = [];
        for (let x = -10; x <= w + 10; x += 6) pts.push([x, base - ridge(x + off, l, t) * amp]);
        ctx.beginPath(); ctx.moveTo(-10, h); pts.forEach(([x, y]) => ctx.lineTo(x, y)); ctx.lineTo(w + 10, h); ctx.closePath();
        const f = ctx.createLinearGradient(0, base - amp * 1.4, 0, h);
        f.addColorStop(0, mix(sand[0], sand[1], depth * 0.75)); f.addColorStop(1, mix(sand[0], sand[1], Math.min(1, depth * 0.75 + 0.35)));
        ctx.fillStyle = f; ctx.fill();
        // shadow face: darken where the ridge slopes away from the sun (right side falls)
        for (let i = 1; i < pts.length; i++) {
          const s = pts[i][1] - pts[i - 1][1];
          if (s > 0.35) { ctx.fillStyle = `rgba(60,24,12,${Math.min(0.32, s * 0.09)})`; ctx.fillRect(pts[i - 1][0], pts[i - 1][1], 6, Math.min(h, amp * 1.8)); }
        }
        ctx.strokeStyle = `rgba(255,236,196,${0.55 - depth * 0.3})`; ctx.lineWidth = 1; ctx.beginPath(); pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.stroke();
      }
    };
    resize();
    const ro = new ResizeObserver(resize); ro.observe(box);
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting)); io.observe(box);
    const mv = (e: PointerEvent) => { const r = box.getBoundingClientRect(); px = (e.clientX - r.left) / r.width; };
    box.addEventListener("pointermove", mv);
    raf = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); io.disconnect(); box.removeEventListener("pointermove", mv); };
  }, [sky, sand, layers]);

  return <div ref={wrap} className={className} style={{ position: "relative", width: "100%", height: "100%", minHeight: 240 }}><canvas ref={cv} aria-hidden="true" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} /></div>;
}
