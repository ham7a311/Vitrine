"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import "./extrude-text.css";

/**
 * Extrude
 * Poster letters with real depth. Each letter is a stack of thin slices
 * that darken as they go back, so turning the word shows solid sides, not
 * a flat shadow. It sways a little on its own and turns to face the
 * pointer on a spring; click it (or press Enter) and the letters pop
 * forward one after another and drop back into line.
 */

type Props = {
  text: string;
  /** Slices per letter: more is smoother, fewer is cheaper. */
  depth?: number;
  palette?: "tomato" | "cobalt" | "mint";
  motion?: "full" | "reduced";
  className?: string;
};

export function ExtrudeText({ text, depth = 28, palette = "tomato", motion = "full", className = "" }: Props) {
  const hostRef = useRef<HTMLDivElement>(null);
  const turnRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const host = hostRef.current, turn = turnRef.current;
    if (!host || !turn) return;
    const rm = matchMedia("(prefers-reduced-motion: reduce)");
    if (motion === "reduced" || rm.matches) return;
    // A spring toward the pointer's angle; the loop runs only until it settles.
    const s = { x: 0, y: 0, vx: 0, vy: 0, tx: 0, ty: 0 };
    let raf = 0, last = 0;
    const step = (now: number) => {
      raf = 0;
      const dt = Math.min(0.032, last ? (now - last) / 1000 : 0.016);
      last = now;
      const k = 120, c = 2 * 0.62 * Math.sqrt(k);
      s.vx += ((s.tx - s.x) * k - s.vx * c) * dt;
      s.vy += ((s.ty - s.y) * k - s.vy * c) * dt;
      s.x += s.vx * dt;
      s.y += s.vy * dt;
      turn.style.transform = `rotateX(${s.y.toFixed(2)}deg) rotateY(${s.x.toFixed(2)}deg)`;
      host.style.setProperty("--ry", (s.x / 30).toFixed(3));
      if (Math.abs(s.tx - s.x) + Math.abs(s.ty - s.y) > 0.02 || Math.abs(s.vx) + Math.abs(s.vy) > 0.05) raf = requestAnimationFrame(step);
      else last = 0;
    };
    const wake = () => { if (!raf) raf = requestAnimationFrame(step); };
    const onMove = (e: PointerEvent) => {
      const r = host.getBoundingClientRect();
      const nx = ((e.clientX - r.left) / r.width) * 2 - 1;
      const ny = ((e.clientY - r.top) / r.height) * 2 - 1;
      s.tx = Math.max(-1, Math.min(1, nx)) * 30;
      s.ty = Math.max(-1, Math.min(1, ny)) * -22;
      host.dataset.held = "";
      wake();
    };
    const onLeave = () => { s.tx = 0; s.ty = 0; delete host.dataset.held; wake(); };
    host.addEventListener("pointermove", onMove, { passive: true });
    host.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      raf = 0;
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerleave", onLeave);
    };
  }, [motion]);

  const pop = () => {
    const rm = matchMedia("(prefers-reduced-motion: reduce)");
    if (motion === "reduced" || rm.matches) return;
    btnRef.current?.querySelectorAll<HTMLElement>(".ex__letter").forEach((l, i) => {
      l.animate(
        [
          { transform: "translateZ(0) translateY(0)" },
          { transform: "translateZ(0.5em) translateY(-0.08em)", offset: 0.38 },
          { transform: "translateZ(-0.04em) translateY(0)", offset: 0.72 },
          { transform: "translateZ(0) translateY(0)" },
        ],
        { duration: 720, delay: i * 70, easing: "cubic-bezier(.3,.7,.3,1)" },
      );
    });
  };

  const letters = Array.from(text);
  return (
    <div ref={hostRef} className={`ex ex--${palette} ${className}`} data-motion={motion}>
      <h2 className="ex__sr">{text}</h2>
      <button ref={btnRef} type="button" className="ex__btn" onClick={pop} aria-label={`${text} — pop the letters`}>
        <span className="ex__sway" aria-hidden="true">
          <span ref={turnRef} className="ex__turn">
            {letters.map((ch, i) => (
              <span key={i} className="ex__letter" data-space={ch === " " || undefined}>
                {Array.from({ length: depth }, (_, k) => (
                  <span key={k} className="ex__slice" style={{ ["--k" as string]: k, ["--t" as string]: (k / (depth - 1)).toFixed(3) } as CSSProperties}>{ch}</span>
                ))}
                <span className="ex__face">{ch}</span>
              </span>
            ))}
          </span>
        </span>
      </button>
      <span className="ex__floor" aria-hidden="true" />
    </div>
  );
}
