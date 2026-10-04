"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Ribbon Flow
 * A handful of translucent ribbons drift across the field, each a filled band
 * between two sine-summed edges. Overlaps add light (screen blend), so where
 * ribbons cross they glow — like silk or northern-light bands seen edge-on.
 * The pointer gently bends the ribbons near it.
 */

type Props = {
  colors?: string[];
  background?: string;
  className?: string;
  children?: ReactNode;
};

export function RibbonFlow({ colors = ["#8fa8d8", "#a898e0", "#7fc4c8", "#d8a8c8"], background = "#08060c", className = "", children }: Props) {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const canvas = document.createElement("canvas");
    canvas.setAttribute("aria-hidden", "true");
    canvas.style.cssText = "position:absolute;inset:0;width:100%;height:100%;display:block";
    host.prepend(canvas);
    const ctx = canvas.getContext("2d")!;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0, h = 0, raf = 0, last = 0, visible = true;
    const mouse = { x: -1e4, y: -1e4, s: 0, ts: 0 };
    const t0 = performance.now();

    // each ribbon: vertical centre, thickness, speed, frequencies and phases
    const ribbons = colors.map((c, i) => ({
      c,
      y: 0.25 + (i / Math.max(1, colors.length - 1)) * 0.5,
      th: 0.09 + (i % 3) * 0.035,
      sp: 0.05 + i * 0.013,
      f1: 1.1 + i * 0.35,
      f2: 2.6 + i * 0.5,
      p: i * 1.9,
      amp: 0.11 + (i % 2) * 0.05,
    }));

    const resize = () => {
      const r = host.getBoundingClientRect();
      w = Math.max(1, r.width);
      h = Math.max(1, r.height);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const edge = (rb: (typeof ribbons)[number], x: number, t: number, off: number) => {
      const u = x / w;
      let y = rb.y + Math.sin(u * rb.f1 * Math.PI * 2 + t * rb.sp * 6 + rb.p) * rb.amp + Math.sin(u * rb.f2 * Math.PI * 2 - t * rb.sp * 4 + rb.p * 1.7) * rb.amp * 0.35 + off * rb.th * (0.75 + 0.25 * Math.sin(u * 5 + t * rb.sp * 3 + rb.p));
      let py = y * h;
      if (mouse.s > 0.01) {
        const dx = x - mouse.x, dy = py - mouse.y;
        const d2 = dx * dx + dy * dy;
        py += (dy > 0 ? 1 : -1) * Math.exp(-d2 / 26000) * 46 * mouse.s;
      }
      return py;
    };

    const draw = (now: number) => {
      const t = reduced ? 20 : (now - t0) / 1000;
      mouse.s += (mouse.ts - mouse.s) * 0.06;
      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = background;
      ctx.fillRect(0, 0, w, h);
      ctx.globalCompositeOperation = "screen";
      const step = Math.max(6, Math.round(w / 160));
      for (const rb of ribbons) {
        ctx.beginPath();
        for (let x = 0; x <= w + step; x += step) ctx.lineTo(x, edge(rb, x, t, -1));
        for (let x = w + step; x >= 0; x -= step) ctx.lineTo(x, edge(rb, x, t, 1));
        ctx.closePath();
        const g = ctx.createLinearGradient(0, 0, w, 0);
        g.addColorStop(0, rb.c + "00");
        g.addColorStop(0.25, rb.c + "55");
        g.addColorStop(0.7, rb.c + "44");
        g.addColorStop(1, rb.c + "00");
        ctx.fillStyle = g;
        ctx.fill();
        ctx.strokeStyle = rb.c + "40";
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    };

    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      if (!visible || document.hidden || now - last < 33) return;
      last = now;
      draw(now);
    };
    const onMove = (e: PointerEvent) => {
      const r = host.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
      mouse.ts = mouse.x >= 0 && mouse.y >= 0 && mouse.x <= r.width && mouse.y <= r.height ? 1 : 0;
    };

    resize();
    draw(performance.now());
    const ro = new ResizeObserver(() => { resize(); draw(performance.now()); });
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [colors.join(), background]);

  return (
    <div ref={hostRef} className={`relative isolate overflow-hidden ${className}`} style={{ background }}>
      {children && <div className="relative z-[1] h-full">{children}</div>}
    </div>
  );
}
