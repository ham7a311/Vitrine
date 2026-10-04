"use client";

import { useEffect, useRef, type ButtonHTMLAttributes, type PointerEvent, type ReactNode } from "react";
import "./plucked-string-button.css";

/**
 * Plucked String Button
 * A taut hairline string runs across the bottom of the button between two
 * pins. It bends toward the cursor, and when you leave or press, it is
 * plucked — ringing out on a damped spring while the label trembles with it.
 */

type Props = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> & {
  children: ReactNode;
  /** How far the string can bend, in px. */
  tension?: number;
};

const STIFFNESS = 0.16;
const DAMPING = 0.9;

export function PluckedStringButton({ children, tension = 11, className = "", onPointerDown, onKeyDown, ...rest }: Props) {
  const ref = useRef<HTMLButtonElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const glowRef = useRef<SVGPathElement>(null);
  const endPinRef = useRef<SVGCircleElement>(null);
  const s = useRef({ x: 0.5, y: 0, v: 0, target: 0, hovering: false, raf: 0, reduced: false });

  useEffect(() => {
    const st = s.current;
    st.reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ro = new ResizeObserver(() => draw());
    if (ref.current) ro.observe(ref.current);
    return () => {
      ro.disconnect();
      cancelAnimationFrame(st.raf);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const draw = () => {
    const st = s.current;
    const btn = ref.current;
    if (!btn) return;
    const w = btn.clientWidth;
    const pad = 18;
    const x0 = pad;
    const x1 = w - pad;
    const cx = x0 + (x1 - x0) * st.x;
    // A quadratic curve's apex sits halfway to its control point, so double it.
    const d = `M ${x0} 0 Q ${cx.toFixed(1)} ${(st.y * 2).toFixed(2)} ${x1} 0`;
    pathRef.current?.setAttribute("d", d);
    endPinRef.current?.setAttribute("cx", String(x1));
    glowRef.current?.setAttribute("d", d);
    const energy = Math.min(1, Math.abs(st.y) / tension + Math.abs(st.v) / 3);
    btn.style.setProperty("--ps-energy", energy.toFixed(3));
    btn.style.setProperty("--ps-shift", `${(st.y * 0.12).toFixed(2)}px`);
  };

  const step = () => {
    const st = s.current;
    st.v += (st.target - st.y) * STIFFNESS;
    st.v *= DAMPING;
    st.y += st.v;
    draw();
    if (Math.abs(st.v) > 0.01 || Math.abs(st.target - st.y) > 0.01) {
      st.raf = requestAnimationFrame(step);
    } else {
      st.y = st.target;
      draw();
      st.raf = 0;
    }
  };
  const run = () => {
    if (!s.current.raf && !s.current.reduced) s.current.raf = requestAnimationFrame(step);
  };

  const onMove = (e: PointerEvent<HTMLButtonElement>) => {
    if (e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    const st = s.current;
    st.hovering = true;
    st.x = Math.min(0.9, Math.max(0.1, (e.clientX - r.left) / r.width));
    // pull toward the cursor: up when it's above the string, a little down when below
    const stringY = r.height - 12;
    const dy = e.clientY - r.top - stringY;
    st.target = Math.max(-tension, Math.min(tension * 0.5, dy * 0.45));
    run();
  };

  const pluck = (strength = 1) => {
    const st = s.current;
    st.target = 0;
    // Held away from rest? Just let go — the spring rings on its own. At rest? Flick it.
    if (Math.abs(st.y) < 2) st.v -= 5 * strength;
    run();
  };

  const onLeave = () => {
    s.current.hovering = false;
    pluck(0.6);
  };

  return (
    <button
      ref={ref}
      type="button"
      className={`ps ${className}`}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      onPointerDown={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        s.current.x = Math.min(0.9, Math.max(0.1, (e.clientX - r.left) / r.width));
        pluck(1.4);
        onPointerDown?.(e);
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          s.current.x = 0.5;
          pluck(1.2);
        }
        onKeyDown?.(e);
      }}
      {...rest}
    >
      <span className="ps__label">{children}</span>
      <svg className="ps__string" aria-hidden="true" preserveAspectRatio="none">
        <circle className="ps__pin" cx="18" cy="0" r="1.6" />
        <circle ref={endPinRef} className="ps__pin" cx="18" cy="0" r="1.6" />
        <path ref={glowRef} className="ps__glow" d="M 18 0 L 18 0" />
        <path ref={pathRef} className="ps__line" d="M 18 0 L 18 0" />
      </svg>
    </button>
  );
}
