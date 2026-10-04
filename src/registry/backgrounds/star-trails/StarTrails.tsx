"use client";
import { useEffect, useRef } from "react";

type Props = { hue?: number; count?: number; className?: string };
type Star = { r: number; a: number; s: number; h: number };

export function StarTrails({ hue = 215, count = 420, className = "" }: Props) {
  const wrap = useRef<HTMLDivElement>(null);
  const cv = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = cv.current!, box = wrap.current!, ctx = canvas.getContext("2d")!;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let w = 0, h = 0, raf = 0, visible = true, ang = 0;
    let cx = 0.5, cy = 0.42, tx = 0.5, ty = 0.42;
    let stars: Star[] = [];
    const spawn = () => { stars = Array.from({ length: count }, () => ({ r: Math.pow(Math.random(), 0.75), a: Math.random() * 6.283, s: 0.25 + Math.random() * 1.1, h: hue + (Math.random() - 0.5) * 70 })); };
    const plot = (step: number) => {
      const R = Math.hypot(w, h) * 0.9;
      for (const s of stars) {
        const a0 = s.a + ang, a1 = a0 + step;
        const x0 = cx * w + Math.cos(a0) * s.r * R, y0 = cy * h + Math.sin(a0) * s.r * R;
        const x1 = cx * w + Math.cos(a1) * s.r * R, y1 = cy * h + Math.sin(a1) * s.r * R;
        ctx.strokeStyle = `hsla(${s.h},70%,${72 + s.s * 10}%,${0.5 + s.s * 0.3})`; ctx.lineWidth = s.s;
        ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke();
      }
      ang += step;
    };
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = box.clientWidth; h = box.clientHeight; canvas.width = w * dpr; canvas.height = h * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.fillStyle = "#03050b"; ctx.fillRect(0, 0, w, h); spawn(); ang = 0;
      const pre = reduce ? 700 : 160; for (let i = 0; i < pre; i++) plot(0.0035);
    };
    const draw = () => {
      raf = requestAnimationFrame(draw);
      if (!visible) return;
      cx += (tx - cx) * 0.05; cy += (ty - cy) * 0.05;
      ctx.fillStyle = "rgba(3,5,11,0.012)"; ctx.fillRect(0, 0, w, h);
      plot(0.0016);
    };
    resize();
    const ro = new ResizeObserver(resize); ro.observe(box);
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting)); io.observe(box);
    const mv = (e: PointerEvent) => { const r = box.getBoundingClientRect(); tx = 0.5 + ((e.clientX - r.left) / r.width - 0.5) * 0.5; ty = 0.42 + ((e.clientY - r.top) / r.height - 0.5) * 0.4; };
    box.addEventListener("pointermove", mv);
    if (!reduce) raf = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); io.disconnect(); box.removeEventListener("pointermove", mv); };
  }, [hue, count]);

  return <div ref={wrap} className={className} style={{ position: "relative", width: "100%", height: "100%", minHeight: 240, background: "#03050b" }}><canvas ref={cv} aria-hidden="true" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} /></div>;
}
