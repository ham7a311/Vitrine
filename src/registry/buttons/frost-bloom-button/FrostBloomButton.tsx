"use client";

import { useRef, type ButtonHTMLAttributes, type CSSProperties, type PointerEvent, type ReactNode } from "react";
import { blobBox, lean, PALETTES, type FrostPalette } from "./bloom";
import "./frost-bloom-button.css";

/**
 * Frost Bloom Button
 * A frosted pill tinted from inside by soft blobs of colour, with a white glow rising from under
 * its bottom edge. The colour drifts slowly and leans toward the pointer; the paper plane lifts
 * off on hover.
 */

type Props = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> & {
  children?: ReactNode;
  palette?: FrostPalette;
  /** Font size in px; everything else scales from it. */
  size?: number;
  icon?: ReactNode | false;
};

export function Plane() {
  return (
    <svg className="fbmb__plane" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M21.4 2.6 3.6 9.9c-.8.3-.8 1.5.1 1.8l6.3 2.1Z" />
      <path d="M21.4 2.6 11.2 14.6l2.1 6.3c.3.9 1.5.9 1.8.1Z" />
    </svg>
  );
}

export function FrostBloomButton({ children = "Get Started", palette = PALETTES.azure, size = 20, icon, className = "", style, onPointerMove, onPointerLeave, ...rest }: Props) {
  const ref = useRef<HTMLButtonElement>(null);
  const move = (e: PointerEvent<HTMLButtonElement>) => {
    onPointerMove?.(e);
    if (e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--fbmb-lean", `${lean((e.clientX - r.left) / r.width)}%`);
  };
  const leave = (e: PointerEvent<HTMLButtonElement>) => {
    onPointerLeave?.(e);
    e.currentTarget.style.setProperty("--fbmb-lean", "0%");
  };
  return (
    <button
      ref={ref}
      type="button"
      className={`fbmb ${className}`}
      style={{ ["--fbmb-base" as string]: palette.base, ["--fbmb-ink" as string]: palette.ink, ["--fbmb-rim" as string]: palette.rim, fontSize: size, ...style }}
      onPointerMove={move}
      onPointerLeave={leave}
      {...rest}
    >
      <span className="fbmb__paint" aria-hidden="true">
        {palette.blobs.map((b, i) => (
          <span key={i} className={`fbmb__blob fbmb__blob--${i % 5}`} style={{ ...blobBox(b), background: `radial-gradient(closest-side, ${b.c}, ${b.c} 35%, transparent)`, opacity: b.o ?? 1 }} />
        ))}
      </span>
      <span className="fbmb__glow" aria-hidden="true" style={{ left: `${palette.glow}%` }} />
      <span className="fbmb__label">
        {children}
        {icon === false ? null : (icon ?? <Plane />)}
      </span>
    </button>
  );
}
