"use client";

import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import "./pill-swap.css";

/**
 * Pill Swap
 * A word set in a soft pill with a status dot, inside a headline. Every few
 * seconds the word changes: the old one lifts out of the top of the pill, the
 * next rises in from below letter by letter, and the pill — tint, dot and ink —
 * takes on the new word's colours while it springs to the new width, so the
 * sentence around it never jumps.
 */

export type PillWord = {
  text: string;
  /** Pill fill. */
  tint: string;
  /** Status dot. */
  dot: string;
  /** Word colour; keep 4.5:1 against the tint. */
  ink: string;
};

type Props = {
  words: PillWord[];
  /** How long each word stays (ms). */
  interval?: number;
  /** Stop on the current word (for a pause control). */
  paused?: boolean;
  theme?: "paper" | "night";
  className?: string;
};

export function PillSwap({ words, interval = 2400, paused = false, theme = "paper", className = "" }: Props) {
  const [i, setI] = useState(0);
  const [prev, setPrev] = useState<number | null>(null);
  const [held, setHeld] = useState(false);
  const [visible, setVisible] = useState(true);
  const [reduced, setReduced] = useState(false);
  const [widths, setWidths] = useState<number[]>([]);
  const root = useRef<HTMLSpanElement>(null);
  const measure = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const mq = matchMedia("(prefers-reduced-motion: reduce)");
    const set = () => setReduced(mq.matches);
    set();
    mq.addEventListener("change", set);
    return () => mq.removeEventListener("change", set);
  }, []);

  // Every word is measured once, at the pill's own size, so the pill can spring between widths.
  useLayoutEffect(() => {
    const m = measure.current;
    if (!m) return;
    const read = () => setWidths(Array.from(m.children).map((c) => (c as HTMLElement).getBoundingClientRect().width));
    read();
    const ro = new ResizeObserver(read);
    Array.from(m.children).forEach((c) => ro.observe(c));
    let alive = true;
    document.fonts?.ready.then(() => alive && read());
    return () => { alive = false; ro.disconnect(); };
  }, [words]);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const running = !paused && !held && visible && words.length > 1;
  useEffect(() => {
    if (!running) return;
    // Reduced motion still changes the word, more slowly and without movement.
    const t = window.setTimeout(() => {
      setPrev(reduced ? null : i);
      setI((x) => (x + 1) % words.length);
    }, reduced ? interval + 1600 : interval);
    return () => window.clearTimeout(t);
  }, [running, i, interval, reduced, words.length]);

  const w = words[i];
  const letters = (text: string) => Array.from(text).map((ch, n) => (
    <span key={n} className="pillswap__l" style={{ ["--n" as string]: n } as CSSProperties}>{ch === " " ? " " : ch}</span>
  ));
  const list = words.map((x) => x.text);
  const spoken = list.length > 1 ? `${list.slice(0, -1).join(", ")} or ${list[list.length - 1]}` : list[0];

  return (
    <span
      ref={root}
      className={`pillswap pillswap--${theme} ${className}`}
      style={{ ["--tint" as string]: w.tint, ["--dot" as string]: w.dot, ["--ink" as string]: w.ink } as CSSProperties}
      onPointerEnter={() => setHeld(true)}
      onPointerLeave={() => setHeld(false)}
    >
      <span className="pillswap__sr">{spoken}</span>
      <span className="pillswap__pill" aria-hidden="true">
        <span key={`dot-${i}`} className="pillswap__dot" data-fresh={prev !== null || undefined} />
        <span className="pillswap__slot" style={{ width: widths[i] ? `${widths[i]}px` : undefined }}>
          {prev !== null && (
            <span key={`out-${prev}-${i}`} className="pillswap__word pillswap__word--out">{letters(words[prev].text)}</span>
          )}
          <span key={`in-${i}`} className="pillswap__word pillswap__word--in" data-first={prev === null || undefined}>{letters(w.text)}</span>
        </span>
      </span>
      {/* Every word laid out invisibly at the same size, for measuring. */}
      <span ref={measure} className="pillswap__measure" aria-hidden="true">
        {words.map((x) => <span key={x.text}>{x.text.replace(/ /g, " ")}</span>)}
      </span>
    </span>
  );
}

export default PillSwap;
