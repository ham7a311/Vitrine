"use client";

import { useRef, type ButtonHTMLAttributes, type PointerEvent, type ReactNode } from "react";
import "./stratum-button.css";

/**
 * Stratum Button
 * A face resting on three paper-thin plates. The cursor pushes the stack:
 * plates slide out on the side away from your pointer, deeper layers further,
 * like a deck fanning under a fingertip. Pressing squeezes them flat.
 */

type Props = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> & {
  children: ReactNode;
  /** Max spread of the deepest plate, in px. */
  spread?: number;
};

export function StratumButton({ children, spread = 9, className = "", ...rest }: Props) {
  const ref = useRef<HTMLButtonElement>(null);

  const setDir = (dx: number, dy: number) => {
    ref.current?.style.setProperty("--sx", dx.toFixed(3));
    ref.current?.style.setProperty("--sy", dy.toFixed(3));
  };

  const onMove = (e: PointerEvent<HTMLButtonElement>) => {
    if (e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    // vector from the pointer to the centre: the stack is pushed away from you
    const nx = ((r.left + r.width / 2 - e.clientX) / (r.width / 2)) * 0.9;
    const ny = (r.top + r.height / 2 - e.clientY) / (r.height / 2);
    const len = Math.hypot(nx, ny) || 1;
    const mag = Math.min(1, 0.55 + len * 0.45);
    setDir((nx / len) * mag, (ny / len) * mag);
  };

  return (
    <button
      ref={ref}
      type="button"
      className={`stratum ${className}`}
      style={{ ["--spread" as string]: `${spread}px` }}
      onPointerMove={onMove}
      onPointerLeave={() => setDir(0, 0)}
      {...rest}
    >
      <span className="stratum__plate stratum__plate--3" aria-hidden="true" />
      <span className="stratum__plate stratum__plate--2" aria-hidden="true" />
      <span className="stratum__plate stratum__plate--1" aria-hidden="true" />
      <span className="stratum__face">
        <span className="stratum__label">{children}</span>
      </span>
    </button>
  );
}
