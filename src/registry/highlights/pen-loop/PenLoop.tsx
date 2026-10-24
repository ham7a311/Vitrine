"use client";

import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { arrow, loop } from "./loop";
import "./pen-loop.css";

/**
 * Pen Loop
 * A word circled in pen, the way you'd circle it on a printout: started at
 * the upper left, carried round a little more than once so the end overshoots
 * the start, drifting and wobbling as a hand does. It draws itself when the
 * word comes into view, and can trail an arrow to a short note.
 */

type Props = {
  children: ReactNode;
  /** A short handwritten-style note the loop points to. */
  note?: ReactNode;
  color?: string;
  seed?: number;
  /** Wait before drawing (ms). */
  delay?: number;
  theme?: "paper" | "night";
  className?: string;
};

export function PenLoop({ children, note, color, seed = 7, delay = 200, theme = "paper", className = "" }: Props) {
  const root = useRef<HTMLSpanElement>(null);
  const word = useRef<HTMLSpanElement>(null);
  const noteRef = useRef<HTMLSpanElement>(null);
  const [box, setBox] = useState<{ w: number; h: number; fs: number; nw: number; nh: number } | null>(null);
  const [on, setOn] = useState(false);

  useLayoutEffect(() => {
    const el = word.current;
    if (!el) return;
    const read = () => {
      const n = noteRef.current;
      const next = { w: el.offsetWidth, h: el.offsetHeight, fs: parseFloat(window.getComputedStyle(el).fontSize) || 16, nw: n?.offsetWidth ?? 0, nh: n?.offsetHeight ?? 0 };
      setBox((b) => (b && JSON.stringify(b) === JSON.stringify(next) ? b : next));
    };
    read();
    const ro = new ResizeObserver(read);
    ro.observe(el);
    if (noteRef.current) ro.observe(noteRef.current);
    let alive = true;
    document.fonts?.ready.then(() => alive && read());
    return () => { alive = false; ro.disconnect(); };
  }, []);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setOn(true); io.disconnect(); } }, { threshold: 0.7 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const shape = box ? loop(box.w, box.h, box.fs, seed) : null;
  // The note hangs under the word's right edge (so it never runs past it); the arrow leaves its left
  // side, hooks out and up, and lands on the bottom of the loop just above where it started.
  const noteTop = box ? box.h + box.fs * 0.5 : 0;
  const from: [number, number] | null = box ? [box.w - box.nw - box.fs * 0.06, noteTop + box.nh * 0.55] : null;
  const landing = shape && from ? shape.bottom.reduce((a, p) => (Math.abs(p[0] - (from[0] - (box?.fs ?? 16) * 0.1)) < Math.abs(a[0] - (from[0] - (box?.fs ?? 16) * 0.1)) ? p : a), shape.bottom[0]) : null;
  const to: [number, number] | null = landing && box ? [landing[0], landing[1] + box.fs * 0.07] : null;
  const pointer = note && from && to && box && box.nw ? arrow(from, to, box.fs) : null;
  const stroke = box ? Math.max(2, box.fs * 0.042) : 2;

  return (
    <span
      ref={root}
      className={`penloop penloop--${theme} ${className}`}
      data-on={on || undefined}
      style={{ ...(color ? { ["--loop" as string]: color } : null), ["--delay" as string]: `${delay}ms` } as CSSProperties}
    >
      <span ref={word} className="penloop__word">{children}</span>
      {shape && (
        <svg className="penloop__svg" aria-hidden="true">
          <path className="penloop__ring" d={shape.d} pathLength={1} strokeWidth={stroke} />
          {pointer && (
            <>
              <path className="penloop__shaft" d={pointer.shaft} pathLength={1} strokeWidth={stroke * 0.7} />
              <path className="penloop__head" d={pointer.head} pathLength={1} strokeWidth={stroke * 0.7} />
            </>
          )}
        </svg>
      )}
      {note && (
        <span ref={noteRef} className="penloop__note" style={{ top: noteTop }}>
          {note}
        </span>
      )}
    </span>
  );
}

export default PenLoop;
