"use client";

import { useEffect, useRef, type AnchorHTMLAttributes, type ButtonHTMLAttributes, type PointerEvent, type ReactNode } from "react";
import "./phosphor-glass-button.css";

/**
 * Phosphor Glass Button
 * A liquid-glass pill that senses the cursor before it arrives: a rim light
 * swings to face the pointer, the pill leans a few pixels toward it, a pool of
 * light follows it across the surface, and a ring ripples out from each press.
 */

type Common = {
  children: ReactNode;
  /** "primary" is the glass pill; "text" is a quiet link whose underline draws in. */
  variant?: "primary" | "text";
  /** Trailing glyph, e.g. "→". */
  arrow?: ReactNode;
  className?: string;
};
type AsButton = Common & Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof Common> & { href?: undefined };
type AsLink = Common & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof Common> & { href: string };

/* ——— Proximity light: one shared, rAF-throttled window listener for every glass button ——— */
const RANGE = 180; // px from the edge where the button starts to notice the cursor
const LEAN = 4; // max px the pill leans toward the cursor
const tracked = new Set<HTMLElement>();
let frame = 0;
let px = -1e4;
let py = -1e4;
let listening = false;

function update() {
  frame = 0;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  tracked.forEach((el) => {
    const r = el.getBoundingClientRect();
    if (r.bottom < 0 || r.top > window.innerHeight) return;
    const dx = px - (r.left + r.width / 2);
    const dy = py - (r.top + r.height / 2);
    const outX = Math.max(Math.abs(dx) - r.width / 2, 0);
    const outY = Math.max(Math.abs(dy) - r.height / 2, 0);
    const prox = Math.max(0, 1 - Math.hypot(outX, outY) / RANGE);
    el.style.setProperty("--prox", prox.toFixed(3));
    el.style.setProperty("--angle", `${((Math.atan2(dx, -dy) * 180) / Math.PI).toFixed(1)}deg`);
    if (!reduced) {
      const len = Math.hypot(dx, dy) || 1;
      el.style.setProperty("--lx", ((dx / len) * prox * LEAN).toFixed(2));
      el.style.setProperty("--ly", ((dy / len) * prox * LEAN).toFixed(2));
    }
  });
}

function onMove(e: globalThis.PointerEvent) {
  if (e.pointerType !== "mouse") return;
  px = e.clientX;
  py = e.clientY;
  if (!frame) frame = requestAnimationFrame(update);
}

function track(el: HTMLElement) {
  if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return () => {};
  tracked.add(el);
  if (!listening) {
    window.addEventListener("pointermove", onMove, { passive: true });
    listening = true;
  }
  return () => {
    tracked.delete(el);
    ["--prox", "--lx", "--ly"].forEach((p) => el.style.removeProperty(p));
    if (!tracked.size && listening) {
      window.removeEventListener("pointermove", onMove);
      listening = false;
    }
  };
}

/* ——— Surface light + press ripple ——— */
function trackLight(event: PointerEvent<HTMLElement>) {
  const el = event.currentTarget;
  const rect = el.getBoundingClientRect();
  const x = event.clientX - rect.left;
  el.style.setProperty("--mx", `${x}px`);
  el.style.setProperty("--my", `${event.clientY - rect.top}px`);
  el.style.setProperty("--mxp", `${((x / rect.width) * 100).toFixed(1)}%`);
}

function ripple(event: PointerEvent<HTMLElement>) {
  const el = event.currentTarget;
  const rect = el.getBoundingClientRect();
  el.style.setProperty("--px", `${event.clientX - rect.left}px`);
  el.style.setProperty("--py", `${event.clientY - rect.top}px`);
  el.removeAttribute("data-press");
  void el.offsetWidth; // restart the animation
  el.setAttribute("data-press", "");
}

export function PhosphorGlassButton(props: AsButton | AsLink) {
  const { children, variant = "primary", arrow, className = "", ...rest } = props;
  const ref = useRef<HTMLElement | null>(null);
  const primary = variant === "primary";

  useEffect(() => {
    if (!primary || !ref.current) return;
    const el = ref.current;
    // only track while on screen
    let untrack: (() => void) | null = null;
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !untrack) untrack = track(el);
      else if (!entry.isIntersecting && untrack) {
        untrack();
        untrack = null;
      }
    });
    io.observe(el);
    return () => {
      io.disconnect();
      untrack?.();
    };
  }, [primary]);

  const classes = `pgb pgb--${variant} ${className}`;
  const content = (
    <>
      {primary && <span className="pgb__glass" aria-hidden="true" />}
      {primary && (
        <span
          className="pgb__ripple"
          aria-hidden="true"
          onAnimationEnd={(e) => e.currentTarget.parentElement?.removeAttribute("data-press")}
        />
      )}
      <span className="pgb__label">{children}</span>
      {arrow && (
        <span className="pgb__arrow" aria-hidden="true">
          {arrow}
        </span>
      )}
    </>
  );
  const pointer = primary ? { onPointerMove: trackLight, onPointerDown: ripple } : {};

  if ("href" in rest && rest.href !== undefined) {
    return (
      <a ref={(n) => void (ref.current = n)} className={classes} {...pointer} {...(rest as AnchorHTMLAttributes<HTMLAnchorElement>)}>
        {content}
      </a>
    );
  }
  return (
    <button ref={(n) => void (ref.current = n)} type="button" className={classes} {...pointer} {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}>
      {content}
    </button>
  );
}
