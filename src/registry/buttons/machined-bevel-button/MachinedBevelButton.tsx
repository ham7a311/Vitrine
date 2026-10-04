"use client";

import { useEffect, useRef, useState, type ButtonHTMLAttributes } from "react";
import "./machined-bevel-button.css";

/**
 * Machined Bevel Button
 * A button turned from metal, with a bevelled rim that catches the light.
 * The light comes from your pointer: as it moves, the bright edge of the
 * bevel turns to face it. Press and the bevel flips, the face sinks, and
 * the status light shows whether the device connected.
 */

type Props = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> & {
  label: string;
  /** Shown once pressed. */
  doneLabel?: string;
  theme?: "paper" | "night";
  motion?: "full" | "reduced";
};

export function MachinedBevelButton({ label, doneLabel = "Connected", theme = "paper", motion = "full", className = "", onClick, ...rest }: Props) {
  const btn = useRef<HTMLButtonElement>(null);
  const [on, setOn] = useState(false);

  // The bevel's highlight faces the pointer wherever it is nearby: the angle from the button's centre,
  // measured like a conic gradient (0° at the top). Far away, the light returns to the top-left.
  useEffect(() => {
    if (motion === "reduced" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const move = (e: PointerEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const el = btn.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height / 2);
        if (Math.hypot(dx, dy) > 360) return el.style.removeProperty("--mbb-a");
        el.style.setProperty("--mbb-a", `${((Math.atan2(dy, dx) * 180) / Math.PI + 90).toFixed(1)}deg`);
      });
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => { window.removeEventListener("pointermove", move); cancelAnimationFrame(raf); };
  }, [motion]);

  return (
    <button
      ref={btn}
      type="button"
      className={`mbb mbb--${theme} ${className}`}
      data-motion={motion}
      data-on={on || undefined}
      aria-pressed={on}
      onClick={(e) => { setOn((v) => !v); onClick?.(e); }}
      {...rest}
    >
      <span className="mbb__led" aria-hidden="true" />
      <span className="mbb__label">{on ? doneLabel : label}</span>
    </button>
  );
}
