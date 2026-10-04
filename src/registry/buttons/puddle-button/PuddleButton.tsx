"use client";

import { useEffect, useId, useLayoutEffect, useRef, useState, type ButtonHTMLAttributes, type CSSProperties, type PointerEvent } from "react";
import "./puddle-button.css";

/**
 * Puddle Button
 * A capsule of glass that behaves like the surface of a puddle. Press it and
 * a ring spreads out from your fingertip, bending whatever is behind the
 * glass as it passes, then dies away. Where the bending isn't supported, a
 * bright ring of light spreads instead.
 */

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  motion?: "full" | "reduced";
};

const BAND = 11; // half-width of the ring, px

/** A displacement map that is neutral everywhere except a ring of radius r around (x, y), where it pushes outward. */
function ringMap(w: number, h: number, x: number, y: number, r: number) {
  const R = Math.max(r, 1);
  const inner = Math.max(0, (R - BAND) / (R + BAND)), mid = R / (R + BAND);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><defs>` +
    `<linearGradient id="x" gradientUnits="userSpaceOnUse" x1="${x - R}" x2="${x + R}" y1="0" y2="0"><stop offset="0" stop-color="#f00"/><stop offset="1" stop-color="#000"/></linearGradient>` +
    `<linearGradient id="y" gradientUnits="userSpaceOnUse" x1="0" x2="0" y1="${y - R}" y2="${y + R}"><stop offset="0" stop-color="#00f"/><stop offset="1" stop-color="#000"/></linearGradient>` +
    `<radialGradient id="m" gradientUnits="userSpaceOnUse" cx="${x}" cy="${y}" r="${R + BAND}"><stop offset="${inner}" stop-color="#fff" stop-opacity="0"/><stop offset="${mid}" stop-color="#fff" stop-opacity="1"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>` +
    `<mask id="k"><rect width="${w}" height="${h}" fill="url(#m)"/></mask></defs>` +
    `<rect width="${w}" height="${h}" fill="#808080"/>` +
    `<g mask="url(#k)"><rect width="${w}" height="${h}" fill="#000"/><rect width="${w}" height="${h}" fill="url(#x)"/><rect width="${w}" height="${h}" fill="url(#y)" style="mix-blend-mode:difference"/></g></svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

export function PuddleButton({ motion = "full", className = "", children, onPointerDown, onKeyDown, ...rest }: Props) {
  const uid = useId().replace(/:/g, "");
  const btn = useRef<HTMLButtonElement>(null);
  const img = useRef<SVGFEImageElement>(null);
  const disp = useRef<SVGFEDisplacementMapElement>(null);
  const ring = useRef<HTMLSpanElement>(null);
  const raf = useRef(0);
  const [box, setBox] = useState({ w: 0, h: 0 });
  const [refract, setRefract] = useState(false);

  useEffect(() => {
    const chromium = /Chrome\//.test(navigator.userAgent) && !/Edg\/|OPR\//.test(navigator.userAgent);
    setRefract(chromium && CSS.supports("backdrop-filter", "url(#x) blur(1px)"));
  }, []);
  useLayoutEffect(() => {
    const el = btn.current!;
    const read = () => setBox({ w: el.offsetWidth, h: el.offsetHeight });
    read();
    const ro = new ResizeObserver(read);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  useEffect(() => () => { cancelAnimationFrame(raf.current); raf.current = 0; }, []);

  const ripple = (x: number, y: number) => {
    if (motion === "reduced" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const { w, h } = box;
    // The ring of light (shown everywhere; the only effect where refraction isn't supported).
    const el = ring.current!;
    el.style.left = `${x}px`;
    el.style.top = `${y}px`;
    el.style.setProperty("--pb-size", `${Math.hypot(Math.max(x, w - x), Math.max(y, h - y)) * 2 + 24}px`);
    el.classList.remove("pb__ring--go");
    void el.offsetWidth;
    el.classList.add("pb__ring--go");
    if (!refract || !img.current) return;
    const far = Math.hypot(Math.max(x, w - x), Math.max(y, h - y)) + BAND * 2;
    const t0 = performance.now(), life = 900;
    cancelAnimationFrame(raf.current);
    const tick = (now: number) => {
      const t = Math.min(1, (now - t0) / life);
      const r = (1 - (1 - t) ** 2.2) * far;
      img.current?.setAttribute("href", ringMap(w, h, x, y, r));
      disp.current?.setAttribute("scale", String(-34 * (1 - t) ** 1.4));
      if (t < 1) raf.current = requestAnimationFrame(tick);
      else { raf.current = 0; disp.current?.setAttribute("scale", "0"); }
    };
    raf.current = requestAnimationFrame(tick);
  };

  const lens = refract && box.w > 0;
  return (
    <button
      ref={btn}
      type="button"
      className={`pb ${className}`}
      data-motion={motion}
      style={lens ? ({ backdropFilter: `url(#${uid}-ripple) blur(3px) saturate(1.7) brightness(1.06)` } as CSSProperties) : undefined}
      onPointerDown={(e: PointerEvent<HTMLButtonElement>) => {
        const r = btn.current!.getBoundingClientRect();
        ripple(e.clientX - r.left, e.clientY - r.top);
        onPointerDown?.(e);
      }}
      onKeyDown={(e) => { if ((e.key === "Enter" || e.key === " ") && !e.repeat) ripple(box.w / 2, box.h / 2); onKeyDown?.(e); }}
      {...rest}
    >
      {lens && (
        <svg width="0" height="0" className="pb__defs" aria-hidden="true">
          <filter id={`${uid}-ripple`} x="0" y="0" width={box.w} height={box.h} filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
            <feImage ref={img} x="0" y="0" width={box.w} height={box.h} result="map" href={ringMap(box.w, box.h, box.w / 2, box.h / 2, 0)} />
            <feDisplacementMap ref={disp} in="SourceGraphic" in2="map" scale="0" xChannelSelector="R" yChannelSelector="B" />
          </filter>
        </svg>
      )}
      <span ref={ring} className="pb__ring" aria-hidden="true" />
      <span className="pb__label">{children}</span>
    </button>
  );
}
