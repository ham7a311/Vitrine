"use client";

import { useEffect, useId, useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { underline, waveLength, type Box, type Kind } from "./squiggle";
import "./squiggle-underline.css";

/**
 * Squiggle Underline
 * Hand-drawn underlines for running text: a wave, a zigzag, two quick strokes
 * or a row of cursive loops. They draw themselves in under each line when the
 * words come into view; pointing at them sets a wave travelling along, and
 * redraws the others.
 */

type Props = {
  children: ReactNode;
  kind?: Kind;
  color?: string;
  /** Wait before drawing (ms). */
  delay?: number;
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

export function SquiggleUnderline({ children, kind = "wave", color, delay = 0, className = "" }: Props) {
  const id = useId().replace(/[^a-zA-Z0-9]/g, "");
  const root = useRef<HTMLSpanElement>(null);
  const text = useRef<HTMLSpanElement>(null);
  const origin = useRef<HTMLSpanElement>(null);
  const [lines, setLines] = useState<Box[]>([]);
  const [fs, setFs] = useState(16);
  const [on, setOn] = useState(false);
  const [again, setAgain] = useState(false);
  const [live, setLive] = useState(false);

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

  // Pointing at it: a wave travels; anything else is drawn again, without the opening delay.
  const enter = () => {
    if (!on) return;
    if (kind === "wave") return setLive(true);
    setAgain(true);
    setOn(false);
    requestAnimationFrame(() => requestAnimationFrame(() => setOn(true)));
  };

  const L = waveLength(fs);
  let wait = again ? 0 : delay;
  const strokes = lines.map((b, k) => {
    const t = Math.round(Math.min(700, Math.max(260, b.w * 1.1)));
    const at = wait;
    wait += t + 60;
    return { b, t, at, paths: underline(kind, b, fs, 17 + k * 31) };
  });

  return (
    <span
      ref={root}
      className={`squig squig--${kind} ${className}`}
      data-on={on || undefined}
      data-live={live || undefined}
      style={{ ...(color ? { ["--squig" as string]: color } : null), ["--L" as string]: `${L.toFixed(2)}px` } as CSSProperties}
      onPointerEnter={enter}
      onPointerLeave={() => setLive(false)}
    >
      <span ref={origin} className="squig__origin" aria-hidden="true" />
      <svg className="squig__svg" aria-hidden="true">
        <defs>
          {strokes.map((s, k) => (
            <clipPath key={k} id={`${id}c${k}`}>
              <rect
                className="squig__reveal"
                x={s.b.x - fs * 0.06}
                y={s.b.y + s.b.h * 0.92 - fs * 0.4}
                width={s.b.w + fs * 0.12}
                height={fs * 0.8}
                style={{ ["--t" as string]: `${s.t}ms`, ["--at" as string]: `${s.at}ms` } as CSSProperties}
              />
            </clipPath>
          ))}
        </defs>
        {strokes.map((s, k) => (
          <g key={k} clipPath={`url(#${id}c${k})`}>
            {s.paths.map((d, j) => (
              <path key={j} className={kind === "wave" ? "squig__line squig__wave" : "squig__line"} d={d} strokeWidth={Math.max(2, fs * (kind === "double" ? 0.05 : 0.058))} />
            ))}
          </g>
        ))}
      </svg>
      <span ref={text} className="squig__text">{children}</span>
    </span>
  );
}

export default SquiggleUnderline;
