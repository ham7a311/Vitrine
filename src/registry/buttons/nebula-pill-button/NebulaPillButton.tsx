"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";
import { blobBox, PALETTES, type NebulaPalette } from "./nebula";
import "./nebula-pill-button.css";

/**
 * Nebula Pill Button
 * A dark pill with a nebula inside: soft clouds of colour, a little grain, and a fine rim. The
 * clouds turn slowly at rest and quicken and brighten when you hover.
 */

type Props = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> & {
  children?: ReactNode;
  palette?: NebulaPalette;
  /** Font size in px; everything else scales from it. */
  size?: number;
  icon?: ReactNode | false;
};

function Plane() {
  return (
    <svg className="nbpl__plane" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M21.4 2.6 3.6 9.9c-.8.3-.8 1.5.1 1.8l6.3 2.1Z" />
      <path d="M21.4 2.6 11.2 14.6l2.1 6.3c.3.9 1.5.9 1.8.1Z" />
    </svg>
  );
}

export function NebulaPillButton({ children = "Get Started", palette = PALETTES.nebula, size = 20, icon, className = "", style, ...rest }: Props) {
  return (
    <button
      type="button"
      className={`nbpl ${className}`}
      style={{ ["--nbpl-base" as string]: palette.base, ["--nbpl-rim" as string]: `linear-gradient(90deg, ${palette.rim.join(", ")})`, fontSize: size, ...style }}
      {...rest}
    >
      <span className="nbpl__paint" aria-hidden="true">
        <span className="nbpl__clouds">
          {palette.blobs.map((b, i) => (
            <span key={i} className={`nbpl__blob nbpl__blob--${i % 4}`} style={{ ...blobBox(b), background: `radial-gradient(closest-side, ${b.c}, ${b.c} 30%, transparent)`, opacity: b.o ?? 1 }} />
          ))}
        </span>
        <span className="nbpl__grain" />
      </span>
      <span className="nbpl__label">
        {children}
        {icon === false ? null : (icon ?? <Plane />)}
      </span>
    </button>
  );
}
