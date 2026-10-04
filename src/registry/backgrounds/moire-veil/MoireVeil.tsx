"use client";
import { useRef, type CSSProperties, type PointerEvent, type ReactNode } from "react";
import "./moire-veil.css";

type Props = { children?: ReactNode; ink?: string; paper?: string; pitch?: number; className?: string };

export function MoireVeil({ children, ink = "#e8e4d8", paper = "#0c0d10", pitch = 7, className = "" }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const move = (e: PointerEvent) => {
    const r = ref.current!.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
    ref.current!.style.setProperty("--mv-tilt", `${(x * 5).toFixed(3)}deg`);
    ref.current!.style.setProperty("--mv-shift", `${(y * pitch * 3).toFixed(2)}px`);
  };
  return (
    <div ref={ref} className={`moire-veil ${className}`} onPointerMove={move} style={{ "--mv-ink": ink, "--mv-paper": paper, "--mv-pitch": `${pitch}px` } as CSSProperties}>
      <div className="moire-veil__grid moire-veil__grid--a" aria-hidden="true" />
      <div className="moire-veil__grid moire-veil__grid--b" aria-hidden="true" />
      <div className="moire-veil__rings" aria-hidden="true" />
      {children && <div className="moire-veil__content">{children}</div>}
    </div>
  );
}
