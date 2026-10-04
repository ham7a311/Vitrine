"use client";

import { useEffect, useId, useRef } from "react";
import "./depth-card.css";

/**
 * Depth Card
 * A destination card that is a little diorama: sky, far ridges, near ridges and foreground are
 * separate layers. Tilt it with the pointer and the layers slide past each other at different
 * speeds, so the canyon opens up with real depth; let go and it settles.
 */

export type DepthPalette = { sky: [string, string]; sun: string; far: string; mid: string; near: string; front: string; ink: string };

type Props = { place: string; title: string; meta: string; palette: DepthPalette; href?: string; motion?: "full" | "reduced"; className?: string };

export function DepthCard({ place, title, meta, palette: p, href = "#", motion = "full", className = "" }: Props) {
  const ref = useRef<HTMLAnchorElement>(null);
  const uid = useId().replace(/:/g, "");
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (motion === "reduced" || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const s = { x: 0, y: 0, vx: 0, vy: 0, tx: 0, ty: 0, raf: 0 };
    const tick = () => {
      s.raf = 0;
      s.vx = (s.vx + (s.tx - s.x) * 0.09) * 0.78;
      s.vy = (s.vy + (s.ty - s.y) * 0.09) * 0.78;
      s.x += s.vx;
      s.y += s.vy;
      el.style.setProperty("--px", s.x.toFixed(4));
      el.style.setProperty("--py", s.y.toFixed(4));
      if (Math.abs(s.tx - s.x) + Math.abs(s.ty - s.y) + Math.abs(s.vx) + Math.abs(s.vy) > 0.0005) s.raf = requestAnimationFrame(tick);
    };
    const wake = () => !s.raf && (s.raf = requestAnimationFrame(tick));
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      s.tx = ((e.clientX - r.left) / r.width - 0.5) * 2;
      s.ty = ((e.clientY - r.top) / r.height - 0.5) * 2;
      wake();
    };
    const leave = () => {
      s.tx = s.ty = 0;
      wake();
    };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    return () => {
      cancelAnimationFrame(s.raf);
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
    };
  }, [motion]);

  // Each layer gets a depth: further layers move less.
  const layer = (d: number) => ({ transform: `translate3d(calc(var(--px) * ${-d}px), calc(var(--py) * ${-d * 0.6}px), 0)` });

  return (
    <a ref={ref} href={href} className={`dpc ${className}`} style={{ ["--ink" as string]: p.ink }} onClick={(e) => href === "#" && e.preventDefault()}>
      <div className="dpc__scene" aria-hidden="true">
        <svg viewBox="0 0 400 500" preserveAspectRatio="xMidYMid slice">
          <defs>
            <linearGradient id={`dpc-sky-${uid}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor={p.sky[0]} />
              <stop offset="1" stopColor={p.sky[1]} />
            </linearGradient>
            <linearGradient id={`dpc-haze-${uid}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor={p.sky[1]} stopOpacity="0" />
              <stop offset="0.45" stopColor={p.sky[1]} stopOpacity="0.5" />
              <stop offset="1" stopColor={p.sky[1]} stopOpacity="0" />
            </linearGradient>
            <radialGradient id={`dpc-sun-${uid}`}>
              <stop offset="0" stopColor={p.sun} />
              <stop offset="1" stopColor={p.sun} stopOpacity="0" />
            </radialGradient>
          </defs>
          <rect x="-40" y="-40" width="480" height="580" fill={`url(#dpc-sky-${uid})`} />
          <g style={layer(4)}>
            <circle cx="250" cy="170" r="110" fill={`url(#dpc-sun-${uid})`} opacity="0.55" />
            <circle cx="250" cy="170" r="34" fill={p.sun} />
          </g>
          <g style={layer(8)}>
            <path d="M-40 280 L30 220 L80 250 L150 190 L210 240 L270 200 L330 245 L380 215 L440 250 V520 H-40Z" fill={p.far} />
            <rect x="-40" y="170" width="480" height="180" fill={`url(#dpc-haze-${uid})`} />
          </g>
          <g style={layer(16)}>
            <path d="M-40 330 L40 285 L95 315 L120 300 L170 340 L230 300 L290 330 L340 290 L440 335 V520 H-40Z" fill={p.mid} />
            <path d="M120 300 L135 520 L150 520 L170 340Z" fill={p.near} opacity="0.4" />
            <rect x="-40" y="285" width="480" height="90" fill={`url(#dpc-haze-${uid})`} opacity="0.6" />
          </g>
          <g style={layer(28)}>
            <path d="M-40 395 C40 370 70 382 120 392 C170 402 200 360 260 372 C320 384 360 368 440 380 V520 H-40Z" fill={p.near} />
            {/* a village on the canyon rim */}
            {[200, 214, 226, 240].map((x, i) => (
              <rect key={x} x={x} y={360 - (i % 2) * 6} width="11" height={12 + (i % 2) * 6} fill={p.front} opacity="0.8" />
            ))}
          </g>
          <g style={layer(46)}>
            <path d="M-40 460 C20 430 60 440 100 450 C130 457 150 470 190 466 V540 H-40Z" fill={p.front} />
            <path d="M300 470 C330 440 380 430 440 445 V540 H280Z" fill={p.front} />
            <path d="M58 448 C60 420 62 400 64 380 M64 380 C52 372 44 374 36 380 M64 380 C74 370 84 370 92 376 M64 380 C60 368 56 362 50 358 M64 380 C70 368 76 362 84 360" stroke={p.front} strokeWidth="3" fill="none" strokeLinecap="round" />
          </g>
        </svg>
      </div>
      <div className="dpc__shine" aria-hidden="true" />
      <div className="dpc__body">
        <span className="dpc__badge">{place}</span>
        <h3 className="dpc__title">{title}</h3>
        <p className="dpc__meta">{meta}</p>
      </div>
    </a>
  );
}
