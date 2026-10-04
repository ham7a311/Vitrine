"use client";

import { useRef, useState, type KeyboardEvent, type PointerEvent, type ReactNode } from "react";
import "./lenticular-card.css";

/**
 * Lenticular Card
 * Two images interleaved in fine vertical stripes behind ribbed plastic, like a
 * lenticular print. Tilt it — move the pointer, drag, or use the arrow keys —
 * and the stripes hand over from one image to the other.
 */

type Props = {
  front: ReactNode;
  back: ReactNode;
  /** Accessible description of what the two sides show. */
  label: string;
  /** Stripe pitch in px. */
  pitch?: number;
  className?: string;
};

const smooth = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

export function LenticularCard({ front, back, label, pitch = 6, className = "" }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const drag = useRef<{ x: number; t: number } | null>(null);
  const [side, setSide] = useState<"front" | "back">("front");

  const apply = (x: number, y = 0.5) => {
    const el = ref.current;
    if (!el) return;
    // flip happens across the middle band, like turning a real print
    const t = smooth(0.32, 0.68, x);
    el.style.setProperty("--t", t.toFixed(3));
    el.style.setProperty("--tilt-x", ((x - 0.5) * 2).toFixed(3));
    el.style.setProperty("--tilt-y", ((y - 0.5) * 2).toFixed(3));
    setSide(t > 0.5 ? "back" : "front");
  };

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    if (e.pointerType === "mouse") return apply((e.clientX - r.left) / r.width, (e.clientY - r.top) / r.height);
    if (drag.current) {
      const x = Math.min(1, Math.max(0, drag.current.t + (e.clientX - drag.current.x) / r.width));
      apply(x);
    }
  };

  const settle = (to: number) => {
    ref.current?.setAttribute("data-settling", "");
    apply(to);
    window.setTimeout(() => ref.current?.removeAttribute("data-settling"), 500);
  };

  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    if (["ArrowLeft", "ArrowRight", "Enter", " "].includes(e.key)) {
      e.preventDefault();
      const toBack = e.key === "ArrowRight" || ((e.key === "Enter" || e.key === " ") && side === "front");
      settle(toBack ? 1 : 0);
    }
  };

  return (
    <div
      ref={ref}
      className={`lent ${className}`}
      role="group"
      tabIndex={0}
      aria-roledescription="lenticular card"
      aria-label={`${label}. Showing the ${side} image. Use the arrow keys to tilt.`}
      style={{ ["--pitch" as string]: `${pitch}px` }}
      onPointerMove={onMove}
      onPointerLeave={(e) => e.pointerType === "mouse" && settle(0)}
      onPointerDown={(e) => {
        if (e.pointerType === "mouse") return;
        const cur = Number(getComputedStyle(e.currentTarget).getPropertyValue("--t")) || 0;
        drag.current = { x: e.clientX, t: 0.32 + cur * 0.36 };
        e.currentTarget.setPointerCapture(e.pointerId);
      }}
      onPointerUp={() => {
        if (!drag.current) return;
        drag.current = null;
        settle(side === "back" ? 1 : 0);
      }}
      onKeyDown={onKey}
    >
      <div className="lent__body">
        <div className="lent__layer lent__layer--front" aria-hidden={side !== "front"}>
          {front}
        </div>
        <div className="lent__layer lent__layer--back" aria-hidden={side !== "back"}>
          {back}
        </div>
        <div className="lent__ribs" aria-hidden="true" />
        <div className="lent__sheen" aria-hidden="true" />
      </div>
    </div>
  );
}
