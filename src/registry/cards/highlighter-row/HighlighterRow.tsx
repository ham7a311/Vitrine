"use client";

import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent, type ReactNode, type RefObject } from "react";
import "./highlighter-row.css";

/**
 * Highlighter Row
 * An editorial list item. On hover or keyboard focus a highlighter-marker
 * stroke swipes across the title, an underline draws along the row, and a
 * hand-sketched arrow loops from the icon to the index number.
 */

export type HighlighterItem = {
  title: string;
  description: string;
  tags?: string[];
  icon: ReactNode;
};

type Point = { x: number; y: number };
type Sketch = { id: number; d: string; head: string };

const HEAD_SIZE = 5.5;
const NUMBER_GAP = 8;
const f = (v: number) => v.toFixed(1);
const canUseHover = () => window.matchMedia("(hover: hover) and (pointer: fine)").matches;

function relativePoint(el: Element, root: DOMRect, x: number, y: number): Point {
  const box = el.getBoundingClientRect();
  return { x: box.left - root.left + x, y: box.top - root.top + y };
}

/** A bowed cubic with a little random jitter, so no two arrows are identical. */
function sketchCurve(start: Point, end: Point, seed: number): Sketch {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const dist = Math.hypot(dx, dy) || 1;
  let nx = -dy / dist;
  let ny = dx / dist;
  if (ny > 0) {
    nx = -nx;
    ny = -ny;
  }
  const bow = Math.min(13, Math.max(7, dist * 0.3));
  const jitter = (seed - 0.5) * 3.5;
  const c1x = start.x + dx * 0.32 + nx * bow * 0.85 + jitter;
  const c1y = start.y + dy * 0.32 + ny * bow * 0.85;
  const c2x = start.x + dx * 0.68 + nx * bow - jitter * 0.4;
  const c2y = start.y + dy * 0.68 + ny * bow;
  const d = `M ${f(start.x)} ${f(start.y)} C ${f(c1x)} ${f(c1y)}, ${f(c2x)} ${f(c2y)}, ${f(end.x)} ${f(end.y)}`;
  const angle = Math.atan2(end.y - c2y, end.x - c2x);
  const spread = 0.7;
  const head = `M ${f(end.x - Math.cos(angle - spread) * HEAD_SIZE)} ${f(end.y - Math.sin(angle - spread) * HEAD_SIZE)} L ${f(end.x)} ${f(end.y)} L ${f(end.x - Math.cos(angle + spread) * HEAD_SIZE)} ${f(end.y - Math.sin(angle + spread) * HEAD_SIZE)}`;
  return { id: Date.now() + seed * 1000, d, head };
}

function measure(root: HTMLElement, from: HTMLElement, to: HTMLElement): Sketch | null {
  const wrap = root.getBoundingClientRect();
  const icon = from.getBoundingClientRect();
  const index = to.getBoundingClientRect();
  const start = relativePoint(from, wrap, icon.width + 2, icon.height / 2);
  const end = relativePoint(to, wrap, -NUMBER_GAP, index.height / 2);
  if (end.x - start.x < 10) return null;
  return sketchCurve(start, end, Math.random());
}

function SketchArrow({
  active,
  rootRef,
  fromRef,
  toRef,
}: {
  active: boolean;
  rootRef: RefObject<HTMLElement | null>;
  fromRef: RefObject<HTMLElement | null>;
  toRef: RefObject<HTMLElement | null>;
}) {
  const [sketch, setSketch] = useState<Sketch | null>(null);
  const [phase, setPhase] = useState<"in" | "out">("out");
  const fadeTimer = useRef(0);

  useEffect(() => {
    const [root, from, to] = [rootRef.current, fromRef.current, toRef.current];
    if (!root || !from || !to) return;
    window.clearTimeout(fadeTimer.current);
    if (active) {
      const next = measure(root, from, to);
      if (!next) return;
      setSketch(next);
      setPhase("in");
      return;
    }
    setPhase("out");
    fadeTimer.current = window.setTimeout(() => setSketch(null), 220);
    return () => window.clearTimeout(fadeTimer.current);
  }, [active, rootRef, fromRef, toRef]);

  useEffect(() => {
    if (!active || !rootRef.current) return;
    const ro = new ResizeObserver(() => {
      const [root, from, to] = [rootRef.current, fromRef.current, toRef.current];
      if (!root || !from || !to) return;
      const next = measure(root, from, to);
      if (next) setSketch(next);
    });
    ro.observe(rootRef.current);
    return () => ro.disconnect();
  }, [active, rootRef, fromRef, toRef]);

  if (!sketch) return null;
  return (
    <svg key={sketch.id} aria-hidden="true" data-phase={phase} className="hlr-sketch">
      <path d={sketch.d} pathLength={1} className="hlr-sketch__stroke" />
      <path d={sketch.head} className="hlr-sketch__head" />
    </svg>
  );
}

export function HighlighterRow({ item, index }: { item: HighlighterItem; index: number }) {
  const rowRef = useRef<HTMLElement>(null);
  const iconRef = useRef<HTMLElement>(null);
  const numberRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState(false);

  const onPointerEnter = (e: PointerEvent<HTMLElement>) => {
    if (e.pointerType === "touch" || !canUseHover()) return;
    setActive(true);
  };
  const onPointerLeave = () => {
    if (rowRef.current?.matches(":focus-visible")) return;
    setActive(false);
  };
  const onFocus = () => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    setActive(true);
  };
  const onKeyDown = (e: KeyboardEvent<HTMLElement>) => {
    if (e.key === "Escape") setActive(false);
  };

  return (
    <article
      ref={rowRef}
      tabIndex={0}
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
      onFocus={onFocus}
      onBlur={() => setActive(false)}
      onKeyDown={onKeyDown}
      className="hlr group"
      data-active={active || undefined}
    >
      <span ref={iconRef} aria-hidden="true" className="hlr-icon">
        {item.icon}
      </span>

      <div className="hlr-body">
        <div className="hlr-head">
          <span ref={numberRef} className="hlr-index">
            {String(index + 1).padStart(2, "0")}
          </span>
          <h3 className="hlr-title">
            <span aria-hidden="true" data-variant={index % 4} className={active ? "hlr-mark is-on" : "hlr-mark"} />
            <span className="hlr-title__text">{item.title}</span>
          </h3>
        </div>
        <p className="hlr-desc">{item.description}</p>
        {item.tags?.length ? (
          <ul className="hlr-tags">
            {item.tags.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        ) : null}
      </div>

      <span aria-hidden="true" className="hlr-underline" />
      <SketchArrow active={active} rootRef={rowRef} fromRef={iconRef} toRef={numberRef} />
    </article>
  );
}

export function HighlighterList({ items }: { items: HighlighterItem[] }) {
  return (
    <div className="hlr-list">
      {items.map((item, i) => (
        <HighlighterRow key={item.title} item={item} index={i} />
      ))}
    </div>
  );
}
