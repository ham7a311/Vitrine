"use client";
import { useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent } from "react";
import "./loupe-roster.css";

type Props = { names: string[]; radius?: number; zoom?: number; accent?: string; className?: string };

export function LoupeRoster({ names, radius = 72, zoom = 2.4, accent = "#e8a24a", className = "" }: Props) {
  const box = useRef<HTMLDivElement>(null);
  const [p, setP] = useState<{ x: number; y: number } | null>(null);
  const text = names.join("  ·  ");

  const move = (e: PointerEvent) => {
    const r = box.current!.getBoundingClientRect();
    setP({ x: e.clientX - r.left, y: e.clientY - r.top });
  };
  const key = (e: KeyboardEvent) => {
    const r = box.current!.getBoundingClientRect();
    const d: Record<string, [number, number]> = { ArrowLeft: [-28, 0], ArrowRight: [28, 0], ArrowUp: [0, -28], ArrowDown: [0, 28] };
    if (!d[e.key]) return;
    e.preventDefault();
    const cur = p ?? { x: r.width / 2, y: r.height / 2 };
    setP({ x: Math.min(r.width, Math.max(0, cur.x + d[e.key][0])), y: Math.min(r.height, Math.max(0, cur.y + d[e.key][1])) });
  };

  const lens = p ? ({ "--lx": `${p.x}px`, "--ly": `${p.y}px` } as CSSProperties) : undefined;
  return (
    <div ref={box} className={`loupe-roster ${className}`} style={{ "--lr-r": `${radius}px`, "--lr-z": zoom, "--lr-accent": accent, ...lens } as CSSProperties}
      tabIndex={0} role="group" aria-label="Names. Use arrow keys to move the magnifier." onPointerMove={move} onPointerDown={move} onPointerLeave={() => setP(null)} onKeyDown={key} onBlur={() => setP(null)}>
      <p className="loupe-roster__text">{text}</p>
      {p && (
        <>
          <div className="loupe-roster__lens" aria-hidden="true">
            <div className="loupe-roster__zoom"><p className="loupe-roster__text">{text}</p></div>
          </div>
          <span className="loupe-roster__ring" aria-hidden="true" />
        </>
      )}
    </div>
  );
}
