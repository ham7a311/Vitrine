"use client";

import type { AnchorHTMLAttributes, ButtonHTMLAttributes, CSSProperties, ReactNode } from "react";
import { RINGS, ringGradient } from "./ring";
import "./spectrum-ring-button.css";

/**
 * Spectrum Ring Button
 * A dark graphite pill whose icon sits in a well circled by broken, iridescent light, as if a
 * prism ring were catching a lamp overhead. The colours turn slowly round the ring under a fixed
 * flare; on hover they quicken and the flare brightens.
 */

type Common = {
  label?: ReactNode;
  icon?: ReactNode;
  /** Colours the ring cycles through. */
  ring?: string[];
  /** Flare colour bleeding outside the top of the ring. */
  flare?: string;
  /** Font size in px; everything scales from it. */
  size?: number;
  className?: string;
  style?: CSSProperties;
};
type AsButton = Common & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children" | "style"> & { href?: undefined };
type AsLink = Common & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "children" | "style"> & { href: string };

function House() {
  return (
    <svg className="sprb__icon" viewBox="0 0 24 24" aria-hidden="true">
      <defs>
        <linearGradient id="sprb-silver" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.55" stopColor="#d9dbe0" />
          <stop offset="1" stopColor="#a9adb5" />
        </linearGradient>
      </defs>
      <path d="M12 3.2 2.6 11.6c-.4.4-.1 1 .4 1h2.3v7.1c0 .5.4.9.9.9h3.6v-5.4h4.4v5.4h3.6c.5 0 .9-.4.9-.9v-7.1H21c.5 0 .8-.6.4-1Z" fill="url(#sprb-silver)" />
    </svg>
  );
}

export function SpectrumRingButton(props: AsButton | AsLink) {
  const { label = "Home", icon, ring = RINGS.spectrum, flare = "#ffb066", size = 16, className = "", style, ...rest } = props;
  const look = {
    ["--sprb-ring" as string]: ringGradient(ring),
    ["--sprb-flare" as string]: flare,
    fontSize: size,
    ...style,
  };
  const inner = (
    <>
      <span className="sprb__well">
        <span className="sprb__glow" aria-hidden="true" />
        <span className="sprb__ring" aria-hidden="true" />
        <span className="sprb__bands" aria-hidden="true" />
        <span className="sprb__flare" aria-hidden="true" />
        <span className="sprb__disc">{icon ?? <House />}</span>
      </span>
      <span className="sprb__label">{label}</span>
    </>
  );
  if ("href" in rest && rest.href) {
    return (
      <a className={`sprb ${className}`} style={look} {...(rest as AnchorHTMLAttributes<HTMLAnchorElement>)}>
        {inner}
      </a>
    );
  }
  return (
    <button type="button" className={`sprb ${className}`} style={look} {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}>
      {inner}
    </button>
  );
}
