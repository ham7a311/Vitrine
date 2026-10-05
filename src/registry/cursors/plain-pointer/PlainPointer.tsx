"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import "./plain-pointer.css";

/**
 * Plain Pointer
 * Just the arrow. A clean dark arrow — every corner softly rounded — with
 * a white keyline and a soft shadow, drawn exactly where the pointer is — no glow, no trail, no lag.
 * It gives a page one consistent, crisp cursor and nothing more; a press
 * nudges it smaller, and text fields keep the system caret.
 */

type Props = {
  /** Arrow fill and keyline. */
  arrow?: "dark" | "light";
  motion?: "full" | "reduced";
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
};

const FIELDS = "input, textarea, select, [contenteditable='true'], [contenteditable='']";

/** The arrow: every corner rounded (tip 2, outer corners 3, notch 3). Tip apex at (3.73, 3.73). */
export const ARROW = "M5.77 3.24 L28.12 10.61 A3 3 0 0 1 28.07 16.33 L20.61 18.63 A3 3 0 0 0 18.63 20.61 L16.33 28.07 A3 3 0 0 1 10.61 28.12 L3.24 5.77 A2 2 0 0 1 5.77 3.24 Z";

export function PlainPointer({ arrow = "dark", motion = "full", className = "", style, children }: Props) {
  const hostRef = useRef<HTMLDivElement>(null);
  const layerRef = useRef<HTMLDivElement>(null);
  const arrowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current, layer = layerRef.current, arr = arrowRef.current;
    if (!host || !layer || !arr) return;
    if (!matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    host.dataset.live = "";

    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      const r = host.getBoundingClientRect();
      const s = r.width / host.offsetWidth || 1;
      arr.style.transform = `translate3d(${(e.clientX - r.left) / s}px, ${(e.clientY - r.top) / s}px, 0)`;
      const field = e.target instanceof Element && e.target.closest(FIELDS);
      if (field) delete layer.dataset.in;
      else layer.dataset.in = "";
    };
    const onLeave = () => { delete layer.dataset.in; delete layer.dataset.down; };
    const onDown = (e: PointerEvent) => { if (e.button === 0) layer.dataset.down = ""; };
    const onUp = () => { delete layer.dataset.down; };

    host.addEventListener("pointermove", onMove, { passive: true });
    host.addEventListener("pointerleave", onLeave);
    host.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    return () => {
      delete host.dataset.live;
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerleave", onLeave);
      host.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
    };
  }, []);

  return (
    <div ref={hostRef} className={`plain-pointer plain-pointer--${arrow} ${className}`} data-motion={motion} style={style}>
      {children}
      <div ref={layerRef} className="plain-pointer__layer" aria-hidden="true">
        <div ref={arrowRef} className="plain-pointer__arrow">
          <svg viewBox="0 0 32 32" width="32" height="32">
            <path d={ARROW} />
          </svg>
        </div>
      </div>
    </div>
  );
}
