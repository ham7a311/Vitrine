"use client";

import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import "./word-carousel.css";

/**
 * Word Carousel
 * The headline with a word that won't sit still — done with care. The
 * outgoing word lifts away letter by letter into a blur; the next rises
 * from below, coming into focus as it lands, while the slot it sits in
 * springs to its new width so the sentence never jumps. Each word brings
 * its own colour and a soft light beneath it. A hairline under the word
 * shows how long it will stay; hover or focus holds it.
 */

export type CarouselWord = { text: string; from: string; to: string };
type Props = {
  prefix: string;
  words: CarouselWord[];
  /** How long each word stays (ms). */
  interval?: number;
  theme?: "night" | "paper";
  motion?: "full" | "reduced";
  className?: string;
};

export function WordCarousel({ prefix, words, interval = 2600, theme = "night", motion = "full", className = "" }: Props) {
  const [i, setI] = useState(0);
  const [prev, setPrev] = useState<number | null>(null);
  const [held, setHeld] = useState(false);
  const [paused, setPaused] = useState(false);
  const [widths, setWidths] = useState<number[]>([]);
  // When the longest word can't share a line with the prefix, the slot always starts its own line — so it never jumps between lines.
  const [stack, setStack] = useState(false);
  const headRef = useRef<HTMLHeadingElement>(null);
  const prefixRef = useRef<HTMLSpanElement>(null);
  const [reduced, setReduced] = useState(motion === "reduced");
  const measureRef = useRef<HTMLSpanElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const rm = matchMedia("(prefers-reduced-motion: reduce)");
    const set = () => setReduced(motion === "reduced" || rm.matches);
    set();
    rm.addEventListener("change", set);
    return () => rm.removeEventListener("change", set);
  }, [motion]);

  // Measure every word once at the headline's size, so the slot can spring between widths.
  useLayoutEffect(() => {
    const m = measureRef.current;
    if (!m) return;
    const read = () => {
      const ws = Array.from(m.children).map((c) => (c as HTMLElement).getBoundingClientRect().width);
      setWidths(ws);
      const h = headRef.current, pre = prefixRef.current;
      if (h && pre) setStack(pre.getBoundingClientRect().width + Math.max(...ws) > h.clientWidth - 2);
    };
    read();
    const ro = new ResizeObserver(read);
    // Watch each word itself: a late-loading font changes their widths without moving anything else.
    Array.from(m.children).forEach((c) => ro.observe(c));
    if (headRef.current) ro.observe(headRef.current);
    let alive = true;
    document.fonts?.ready.then(() => alive && read());
    return () => { alive = false; ro.disconnect(); };
  }, [words]);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Reduced motion: words still change (slowly), without movement.
  useEffect(() => {
    if (!reduced || paused || held || !visible) return;
    const t = window.setTimeout(() => { setPrev(null); setI((x) => (x + 1) % words.length); }, interval + 1400);
    return () => clearTimeout(t);
  }, [reduced, paused, held, visible, i, interval, words.length]);

  // The dwell hairline's own animation is the clock: when it ends, the next word comes in.
  const next = () => { setPrev(i); setI((x) => (x + 1) % words.length); };

  const w = words[i];
  const stopped = paused || held || !visible;
  const letters = (text: string, k: number) => Array.from(text).map((ch, n, all) => (
    <span key={n} className="wc__l" style={{ ["--n" as string]: n, ["--t" as string]: all.length > 1 ? n / (all.length - 1) : 0, color: `color-mix(in oklch, ${words[k].from}, ${words[k].to} ${all.length > 1 ? Math.round((n / (all.length - 1)) * 100) : 0}%)` } as CSSProperties}>
      {ch === " " ? " " : ch}
    </span>
  ));

  return (
    <div
      ref={rootRef}
      className={`wc wc--${theme} ${className}`}
      data-motion={motion}
      style={{ ["--from" as string]: w.from, ["--to" as string]: w.to }}
      onPointerEnter={() => setHeld(true)}
      onPointerLeave={() => setHeld(false)}
      onFocus={() => setHeld(true)}
      onBlur={() => setHeld(false)}
    >
      <h2 ref={headRef} className="wc__h" data-stack={stack || undefined}>
        <span className="wc__sr">{prefix} {words.map((x) => x.text).join(", ").replace(/, ([^,]*)$/, ", or $1")}.</span>
        <span aria-hidden="true">
          <span ref={prefixRef}>{prefix}{" "}</span>
          <span className="wc__slot" style={{ width: widths[i] ? `${widths[i]}px` : undefined }}>
            <span className="wc__glow" />
            {prev !== null && !reduced && (
              <span key={`o-${prev}-${i}`} className="wc__word wc__word--out">{letters(words[prev].text, prev)}</span>
            )}
            <span key={`i-${i}`} className="wc__word wc__word--in" data-first={prev === null || undefined}>{letters(w.text, i)}</span>
            {!reduced && (
              <span
                key={`d-${i}`}
                className="wc__dwell"
                style={{ animationDuration: `${interval}ms`, animationPlayState: stopped ? "paused" : "running" }}
                onAnimationEnd={next}
              />
            )}
          </span>
        </span>
        {/* Every word, laid out invisibly at the same size, for measuring. */}
        <span ref={measureRef} className="wc__measure" aria-hidden="true">
          {words.map((x) => <span key={x.text}>{x.text.replace(/ /g, " ")}</span>)}
        </span>
      </h2>
      <button type="button" className="wc__pause" onClick={() => setPaused((p) => !p)} aria-pressed={paused}>
        {paused ? "Play" : "Pause"}
      </button>
    </div>
  );
}
