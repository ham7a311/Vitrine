"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";
import { RIMS, rimGradient, type PrismRim } from "./rim";
import "./prism-rim-button.css";

/**
 * Prism Rim Button
 * A dark pill held in a hairline of graded colour. At rest the rim reads like a printed spectrum;
 * on hover the colour starts to flow round it and spills a faint glow from each end.
 */

type Props = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> & {
  children?: ReactNode;
  rim?: PrismRim;
  /** Font size in px; everything else scales from it. */
  size?: number;
  icon?: ReactNode | false;
};

function Plane() {
  return (
    <svg className="prmb__plane" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M21.4 2.6 3.6 9.9c-.8.3-.8 1.5.1 1.8l6.3 2.1Z" />
      <path d="M21.4 2.6 11.2 14.6l2.1 6.3c.3.9 1.5.9 1.8.1Z" />
    </svg>
  );
}

export function PrismRimButton({ children = "Get Started", rim = RIMS.spectrum, size = 20, icon, className = "", style, ...rest }: Props) {
  const first = rim.stops[0];
  const last = rim.stops[rim.stops.length - 1];
  return (
    <button
      type="button"
      className={`prmb ${className}`}
      style={{
        ["--prmb-rim" as string]: rimGradient(rim.stops),
        ["--prmb-in-a" as string]: rim.inside[0],
        ["--prmb-in-b" as string]: rim.inside[1],
        ["--prmb-sheen" as string]: rim.sheen,
        ["--prmb-start" as string]: first,
        ["--prmb-end" as string]: last,
        fontSize: size,
        ...style,
      }}
      {...rest}
    >
      <span className="prmb__label">
        {children}
        {icon === false ? null : (icon ?? <Plane />)}
      </span>
    </button>
  );
}
