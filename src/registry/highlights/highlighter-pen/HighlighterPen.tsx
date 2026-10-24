"use client";

import { useEffect, useId, useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { hash, penTime, stroke, type Box } from "./marker";
import "./highlighter-pen.css";

/**
 * Highlighter Pen
 * Text marked by hand with a chisel-tip highlighter, imperfectly: the ink sits
 * low on the line, starts a little late, stops short or runs over, tilts, and
 * gets darker where the pen went back over the end. A phrase that wraps is
 * marked line by line at writing speed, the way you'd actually do it.
 */

export type MarkerTone = "yellow" | "pink" | "green" | "blue";

type Props = {
  children: ReactNode;
  tone?: MarkerTone;
  /** Any ink colour instead of a tone. */
  color?: string;
  /** Wait before marking (ms), to mark several phrases in reading order. */
  delay?: number;
  theme?: "paper" | "night";
  className?: string;
};

function mergeLines(rects: Box[]) {
  const lines: Box[] = [];
  for (const r of rects) {
    if (r.w < 1) continue;
    const last = lines[lines.length - 1];
    if (last && Math.abs(r.y - last.y) < Math.max(2, last.h * 0.3)) {
      const x2 = Math.max(last.x + last.w, r.x + r.w);
      last.x = Math.min(last.x, r.x);
      last.w = x2 - last.x;
      last.h = Math.max(last.h, r.h);
    } else lines.push({ ...r });
  }
  return lines;
}

export function HighlighterPen({ children, tone = "yellow", color, delay = 0, theme = "paper", className = "" }: Props) {
  const id = useId().replace(/[^a-zA-Z0-9]/g, "");
  const root = useRef<HTMLElement>(null);
  const text = useRef<HTMLSpanElement>(null);
  const origin = useRef<HTMLSpanElement>(null);
  const [lines, setLines] = useState<Box[]>([]);
  const [fs, setFs] = useState(16);
  const [seed, setSeed] = useState(1);
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
      setSeed(hash(el.textContent ?? ""));
    };
    read();
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
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setOn(true); io.disconnect(); } }, { threshold: 0.8 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Each line waits for the one before it, plus the moment it takes to move the pen down a line.
  let wait = delay;
  const strokes = lines.map((b, k) => {
    const s = stroke(b, fs, seed + k * 101);
    const t = penTime(s.to - s.from);
    const at = wait;
    wait += t + 90;
    return { ...s, t, at, b };
  });

  return (
    <mark
      ref={root}
      className={`hlpen hlpen--${theme} hlpen--${tone} ${className}`}
      data-on={on || undefined}
      style={color ? ({ ["--ink" as string]: color } as CSSProperties) : undefined}
    >
      <span ref={origin} className="hlpen__origin" aria-hidden="true" />
      <svg className="hlpen__ink" aria-hidden="true">
        <defs>
          <filter id={`${id}g`} x="-5%" y="-30%" width="110%" height="160%">
            <feTurbulence type="fractalNoise" baseFrequency="0.06 0.4" numOctaves="2" seed={seed % 97} />
            <feDisplacementMap in="SourceGraphic" scale={Math.max(1.5, fs * 0.05)} />
          </filter>
          {strokes.map((s, k) => (
            <mask key={k} id={`${id}m${k}`} maskUnits="userSpaceOnUse" x={-10000} y={-10000} width={20000} height={20000}>
              <path
                className="hlpen__pen"
                d={s.pen}
                pathLength={1}
                strokeWidth={s.b.h * 2}
                style={{ ["--t" as string]: `${s.t}ms`, ["--at" as string]: `${s.at}ms` } as CSSProperties}
              />
            </mask>
          ))}
        </defs>
        {strokes.map((s, k) => (
          <g key={k} mask={`url(#${id}m${k})`}>
            <g filter={`url(#${id}g)`}>
              <path className="hlpen__body" d={s.body} />
              <path className="hlpen__body" d={s.redo} />
            </g>
          </g>
        ))}
      </svg>
      <span ref={text} className="hlpen__text">{children}</span>
    </mark>
  );
}

export default HighlighterPen;
