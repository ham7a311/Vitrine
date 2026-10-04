"use client";

import { useId, useRef, type ButtonHTMLAttributes, type MouseEvent } from "react";
import "./droplet-button.css";

/**
 * Droplet Button
 * The arrow is a drop of the button itself. Hover and it pulls out of the
 * pill's end, stretching a neck that thins and snaps like water, then hangs
 * just beside it; move away and it drifts back and merges. Click and the drop
 * flies off ahead of you while a new one wells up in its place.
 */

type Props = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> & {
  children: string;
  theme?: "paper" | "night";
  motion?: "full" | "reduced";
};

export function DropletButton({ children, theme = "night", motion = "full", className = "", onClick, ...rest }: Props) {
  const uid = useId().replace(/:/g, "");
  const ref = useRef<HTMLButtonElement>(null);

  const fly = (e: MouseEvent<HTMLButtonElement>) => {
    const el = ref.current!;
    el.removeAttribute("data-fly");
    void el.offsetWidth; // restart on every click
    el.setAttribute("data-fly", "");
    onClick?.(e);
  };

  return (
    <button ref={ref} type="button" className={`drb drb--${theme} ${className}`} data-motion={motion} onClick={fly} onAnimationEnd={(e) => { if ((e.target as Element).classList.contains("drb__drop")) ref.current?.removeAttribute("data-fly"); }} {...rest}>
      <svg width="0" height="0" className="drb__defs" aria-hidden="true">
        <filter id={`${uid}-goo`}>
          <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="b" />
          <feColorMatrix in="b" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -10" result="g" />
          <feComposite in="SourceGraphic" in2="g" operator="atop" />
        </filter>
      </svg>
      {/* Pill and drop are drawn together through the goo filter, so they merge like liquid. */}
      <span className="drb__goo" style={{ filter: `url(#${uid}-goo)` }} aria-hidden="true">
        <span className="drb__pill" />
        <span className="drb__drop" />
      </span>
      <span className="drb__label">{children}</span>
      <span className="drb__arrow" aria-hidden="true">
        <svg viewBox="0 0 16 16"><path d="M3 8h10M9 4l4 4-4 4" /></svg>
      </span>
    </button>
  );
}
