"use client";

import { useEffect, useRef, useState, type AnchorHTMLAttributes, type ButtonHTMLAttributes, type ReactNode } from "react";
import "./ember-button.css";

/**
 * Ember Button
 * A warm amber button with a soft gold hover glow and a 1px press, plus two
 * optional ornaments that draw themselves in when the button scrolls into view:
 * "trace" (circuit traces that power on) and "sparkle" (hand-drawn asterisks).
 */

type Variant = "primary" | "secondary" | "ghost";
type Size = "sm" | "md" | "lg";
type Ornament = "none" | "trace" | "sparkle";

type Common = {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  /** Decorative flourish drawn once when the button enters the viewport. */
  ornament?: Ornament;
  /** Show the arrow that nudges up-and-right on hover. */
  arrow?: boolean;
  className?: string;
};

type AsButton = Common & Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof Common> & { href?: undefined };
type AsLink = Common & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof Common> & { href: string };

const base =
  "group/ember relative inline-flex font-[family-name:Geist,ui-sans-serif,system-ui,sans-serif] max-w-full select-none items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium tracking-[-0.01em] " +
  "transition-[background-color,border-color,color,box-shadow,transform] duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] " +
  "active:translate-y-px disabled:pointer-events-none disabled:opacity-50 " +
  "focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-[#f3b45f]";

const variants: Record<Variant, string> = {
  primary:
    "bg-[#e8a24a] text-[#14120f] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.22)] " +
    "hover:bg-[#f3b45f] hover:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.28),0_10px_24px_-16px_rgba(232,162,74,0.55)]",
  secondary: "border border-[#33312e] text-[#f4f3f1] hover:border-[#45423d] hover:bg-[#181716]/80",
  ghost: "text-[#c2c0b8] hover:text-[#f4f3f1]",
};

const sizes: Record<Size, string> = {
  sm: "h-10 px-3.5 text-[0.875rem]",
  md: "h-11 px-5 text-[0.9375rem]",
  lg: "h-12 px-6 text-base",
};

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const on = () => setReduced(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return reduced;
}

function Arrow() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="size-4 transition-transform duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover/ember:-translate-y-0.5 group-hover/ember:translate-x-0.5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M7 17 17 7M7 7h10v10" />
    </svg>
  );
}

const TRACES = {
  "top-right": { d: "M60 3 L60 17 L22 17 L22 39", pad: { cx: 22, cy: 39 }, delay: 600 },
  "bottom-left": { d: "M4 41 L4 27 L42 27 L42 5", pad: { cx: 42, cy: 5 }, delay: 690 },
} as const;

function PowerTrace({ side, armed, reduced }: { side: keyof typeof TRACES; armed: boolean; reduced: boolean }) {
  const [powered, setPowered] = useState(false);
  const trace = TRACES[side];

  useEffect(() => {
    if (!armed) return;
    if (reduced) return setPowered(true);
    const id = window.setTimeout(() => setPowered(true), trace.delay);
    return () => window.clearTimeout(id);
  }, [armed, reduced, trace.delay]);

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 64 44"
      data-phase={armed ? "in" : undefined}
      data-powered={powered ? "" : undefined}
      data-reduced={reduced ? "" : undefined}
      className={`ember-trace ember-trace--${side} pointer-events-none absolute h-11 w-16 overflow-visible ${
        side === "top-right" ? "-top-9 right-1" : "-bottom-9 left-1"
      }`}
    >
      <path d={trace.d} pathLength={1} fill="none" strokeWidth="1.75" strokeLinecap="square" strokeLinejoin="miter" className="ember-trace__line" />
      <circle cx={trace.pad.cx} cy={trace.pad.cy} r="3.5" className="ember-trace__pad" />
    </svg>
  );
}

const SPARKS = {
  "top-right":
    "M16.4 2.8 L16.8 12.6 M15.6 19.2 L15.1 29.4 M3.6 14.8 L13.4 15.9 M19.2 15.2 L29.1 16.6 M6.8 6.1 L13.7 13.4 M18.9 18.4 L26.8 27.1",
  "bottom-left":
    "M15.7 3.4 L16.1 13.2 M16.6 18.6 L17.2 28.8 M3.4 16.4 L13.2 15.5 M18.8 16.8 L28.6 15.4 M7.4 7.6 L13.9 13.8 M18.2 18.1 L25.6 26.2",
} as const;

function Sparkle({ side, armed, reduced }: { side: keyof typeof SPARKS; armed: boolean; reduced: boolean }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 32 32"
      data-phase={armed ? "in" : undefined}
      data-reduced={reduced ? "" : undefined}
      className={`ember-sparkle pointer-events-none absolute size-7 overflow-visible text-[#f3b45f] sm:size-8 ${
        side === "top-right" ? "-right-5 -top-5 sm:-right-6 sm:-top-6" : "-bottom-5 -left-5 sm:-bottom-6 sm:-left-6"
      }`}
    >
      <path d={SPARKS[side]} pathLength={1} fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" className="ember-sparkle__stroke" />
    </svg>
  );
}

export function EmberButton(props: AsButton | AsLink) {
  const { children, variant = "primary", size = "md", ornament = "none", arrow = false, className = "", ...rest } = props;
  const wrapRef = useRef<HTMLSpanElement>(null);
  const [armed, setArmed] = useState(false);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (ornament === "none") return;
    const node = wrapRef.current;
    if (!node) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setArmed(true);
          io.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    io.observe(node);
    return () => io.disconnect();
  }, [ornament]);

  const classes = `${base} ${variants[variant]} ${sizes[size]} ${ornament !== "none" ? "relative z-[1] w-full" : ""} ${className}`;
  const content = (
    <>
      {children}
      {arrow && <Arrow />}
    </>
  );

  const control =
    "href" in rest && rest.href !== undefined ? (
      <a
        {...(rest as AnchorHTMLAttributes<HTMLAnchorElement>)}
        className={classes}
        {...(/^https?:\/\//.test(rest.href) ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {content}
      </a>
    ) : (
      <button type="button" {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)} className={classes}>
        {content}
      </button>
    );

  if (ornament === "none") return control;

  const Mark = ornament === "trace" ? PowerTrace : Sparkle;
  return (
    <span ref={wrapRef} className="relative inline-block w-[min(100%,20.5rem)] overflow-visible">
      <Mark side="top-right" armed={armed} reduced={reduced} />
      {control}
      <Mark side="bottom-left" armed={armed} reduced={reduced} />
    </span>
  );
}
