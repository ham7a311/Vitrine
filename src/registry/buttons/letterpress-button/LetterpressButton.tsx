"use client";

import { useRef, type ButtonHTMLAttributes, type PointerEvent } from "react";
import "./letterpress-button.css";

/**
 * Letterpress Button
 * A cotton-paper plate with the label set in individual sorts. As the cursor
 * travels across it, each letter bites deeper into the paper by proximity — a
 * travelling dent — and a press stamps the whole line at once.
 */

type Props = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> & {
  /** Plain text label — it is split into individual letters. */
  children: string;
  /** Pixel radius of the cursor's influence. */
  reach?: number;
  tone?: "paper" | "ink";
};

export function LetterpressButton({ children, reach = 46, tone = "paper", className = "", onPointerDown, ...rest }: Props) {
  const ref = useRef<HTMLButtonElement>(null);
  const frame = useRef(0);
  const chars = Array.from(children);

  const press = (x: number | null) => {
    const btn = ref.current;
    if (!btn) return;
    const letters = btn.querySelectorAll<HTMLElement>(".lp__char");
    letters.forEach((el) => {
      if (x === null) return el.style.setProperty("--d", "0");
      const r = el.getBoundingClientRect();
      const dist = Math.abs(r.left + r.width / 2 - x);
      const d = Math.max(0, 1 - dist / reach);
      el.style.setProperty("--d", (d * d * (3 - 2 * d)).toFixed(3));
    });
  };

  const onMove = (e: PointerEvent<HTMLButtonElement>) => {
    if (e.pointerType !== "mouse") return;
    const x = e.clientX;
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => press(x));
  };

  return (
    <button
      ref={ref}
      type="button"
      aria-label={children}
      className={`lp lp--${tone} ${className}`}
      onPointerMove={onMove}
      onPointerLeave={() => {
        cancelAnimationFrame(frame.current);
        press(null);
      }}
      onPointerDown={(e) => {
        const btn = e.currentTarget;
        btn.removeAttribute("data-stamp");
        void btn.offsetWidth;
        btn.setAttribute("data-stamp", "");
        onPointerDown?.(e);
      }}
      onAnimationEnd={(e) => e.animationName === "lp-stamp" && e.currentTarget.removeAttribute("data-stamp")}
      {...rest}
    >
      <span className="lp__plate" aria-hidden="true" />
      <span className="lp__line" aria-hidden="true">
        {chars.map((c, i) => (
          <span key={i} className="lp__char" style={{ ["--i" as string]: i }}>
            {c === " " ? " " : c}
          </span>
        ))}
      </span>
    </button>
  );
}
