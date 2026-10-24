"use client";

import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { knobPath, knobs, mergeLines, type Box } from "./handles";
import "./handle-highlight.css";

/**
 * Handle Highlight
 * Words marked the way a design tool marks a selected layer: a soft tint, a
 * hairline frame, and handles on the corners and edges — circles, squares,
 * diamonds or outward-pointing triangles. The frame traces itself in and the
 * handles pop on one after another. Phrases that wrap stay one selection, with
 * handles only at its two ends.
 */

export type HandleShape = "circle" | "square" | "diamond" | "triangle";

type Props = {
  children: ReactNode;
  shape?: HandleShape;
  /** Frame and handle colour; the tint is mixed from it. */
  color?: string;
  /** Wait before drawing in (ms). */
  delay?: number;
  className?: string;
};

export function HandleHighlight({ children, shape = "circle", color, delay = 0, className = "" }: Props) {
  const root = useRef<HTMLSpanElement>(null);
  const text = useRef<HTMLSpanElement>(null);
  const origin = useRef<HTMLSpanElement>(null);
  const [lines, setLines] = useState<Box[]>([]);
  const [fs, setFs] = useState(16);
  const [on, setOn] = useState(false);

  useLayoutEffect(() => {
    const el = text.current, o = origin.current;
    if (!el || !o) return;
    const read = () => {
      const base = o.getBoundingClientRect();
      const range = document.createRange();
      range.selectNodeContents(el);
      const next = mergeLines(Array.from(range.getClientRects(), (r) => ({ x: r.left - base.left, y: r.top - base.top, w: r.width, h: r.height })));
      setLines((prev) => (JSON.stringify(prev) === JSON.stringify(next) ? prev : next));
      setFs(parseFloat(window.getComputedStyle(el).fontSize) || 16);
    };
    read();
    // Inline boxes don't report resizes; their block does, and so does the window.
    const ro = new ResizeObserver(read);
    ro.observe(el.closest("p, h1, h2, h3, h4, li, blockquote, div") ?? document.body);
    window.addEventListener("resize", read);
    let alive = true;
    document.fonts?.ready.then(() => alive && read());
    return () => { alive = false; ro.disconnect(); window.removeEventListener("resize", read); };
  }, [children]);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setOn(true); io.disconnect(); } }, { threshold: 0.5 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const px = fs * 0.1, py = fs * 0.02;
  const boxes = lines.map((b) => ({ x: b.x - px, y: b.y - py, w: b.w + px * 2, h: b.h + py * 2 }));
  const size = Math.min(10, Math.max(5, fs * 0.1));
  const points = knobs(boxes);

  return (
    <span
      ref={root}
      className={`handlehl handlehl--${shape} ${className}`}
      data-on={on || undefined}
      style={{ ...(color ? { ["--hh" as string]: color } : null), ["--delay" as string]: `${delay}ms` } as CSSProperties}
    >
      <span ref={origin} className="handlehl__origin" aria-hidden="true" />
      <svg className="handlehl__back" aria-hidden="true">
        {boxes.map((b, k) => <rect key={k} className="handlehl__fill" x={b.x} y={b.y} width={b.w} height={b.h} rx={1.5} />)}
      </svg>
      <span ref={text} className="handlehl__text">{children}</span>
      <svg className="handlehl__front" aria-hidden="true">
        {boxes.map((b, k) => (
          <rect key={k} className="handlehl__frame" x={b.x} y={b.y} width={b.w} height={b.h} rx={1.5} pathLength={1} />
        ))}
        {points.map((p, k) => (
          <g key={k} transform={`translate(${p.x.toFixed(1)} ${p.y.toFixed(1)})`}>
            <path className="handlehl__knob" d={knobPath(shape, size, p.dx, p.dy)} style={{ ["--i" as string]: k } as CSSProperties} />
          </g>
        ))}
      </svg>
    </span>
  );
}

export default HandleHighlight;
