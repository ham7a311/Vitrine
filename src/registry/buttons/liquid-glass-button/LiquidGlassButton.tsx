"use client";

import { useEffect, useId, useRef, useState, type ButtonHTMLAttributes, type PointerEvent, type ReactNode } from "react";
import "./liquid-glass-button.css";

/**
 * Liquid Glass Button
 * A capsule of glass: the backdrop is blurred, saturated and — in Chromium,
 * which can run SVG filters on the backdrop — gently refracted, so whatever is
 * behind it bends at the edges. A specular highlight rides the rim toward
 * the pointer, and pressing squashes the capsule like a drop of liquid
 * before it springs back.
 */

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  shape?: "pill" | "round";
  /** RGB triplet, e.g. "185 204 228". */
  tint?: string;
};

export function LiquidGlassButton({ children, shape = "pill", tint = "255 255 255", className = "", style, onPointerMove, onPointerDown, ...rest }: Props) {
  const uid = useId().replace(/:/g, "");
  const ref = useRef<HTMLButtonElement>(null);
  const [refract, setRefract] = useState(false);

  // SVG backdrop filters only work in Chromium; elsewhere the plain blur stays
  useEffect(() => {
    const chromium = typeof navigator !== "undefined" && /Chrome\//.test(navigator.userAgent) && !/Edg\/|OPR\//.test(navigator.userAgent);
    setRefract(chromium && CSS.supports("backdrop-filter", "url(#x) blur(1px)"));
  }, []);

  const move = (e: PointerEvent<HTMLButtonElement>) => {
    const el = ref.current!, r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${(((e.clientX - r.left) / r.width) * 100).toFixed(1)}%`);
    el.style.setProperty("--my", `${(((e.clientY - r.top) / r.height) * 100).toFixed(1)}%`);
    onPointerMove?.(e);
  };
  const press = (e: PointerEvent<HTMLButtonElement>) => {
    const el = ref.current!;
    el.classList.remove("liquid-glass-button--squish");
    void el.offsetWidth; // restart the squish on every press
    el.classList.add("liquid-glass-button--squish");
    onPointerDown?.(e);
  };

  return (
    <button
      ref={ref}
      type="button"
      className={`liquid-glass-button liquid-glass-button--${shape} ${className}`}
      style={{
        ["--lg-tint" as string]: tint,
        ...(refract ? { backdropFilter: `url(#${uid}-lens) blur(6px) saturate(1.8) brightness(1.08)` } : null),
        ...style,
      }}
      onPointerMove={move}
      onPointerDown={press}
      onAnimationEnd={() => ref.current?.classList.remove("liquid-glass-button--squish")}
      {...rest}
    >
      <svg width="0" height="0" aria-hidden="true" className="liquid-glass-button__defs">
        <filter id={`${uid}-lens`} x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency="0.008 0.012" numOctaves="2" seed="7" result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="16" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>
      <span className="liquid-glass-button__rim" aria-hidden="true" />
      <span className="liquid-glass-button__label">{children}</span>
    </button>
  );
}
