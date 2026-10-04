"use client";

import { useEffect, useState } from "react";
import "./ruler-index.css";

/**
 * Ruler Index
 * A vertical section index drawn as a ruler. Every section is a long tick with
 * a label; short ticks fill the gaps. Hovering the ruler reveals every label,
 * hovering a tick lengthens it, and the tick for the section currently in
 * view is always lit.
 */

export type RulerItem = { id: string; label: string };

type Props = {
  items: RulerItem[];
  /** Element whose scroll to track. Defaults to the window. */
  scrollRoot?: React.RefObject<HTMLElement | null>;
  onSelect?: (id: string) => void;
};

const MINORS = 4;

export function RulerIndex({ items, scrollRoot, onSelect }: Props) {
  const [active, setActive] = useState(items[0]?.id);

  useEffect(() => {
    const root = scrollRoot?.current ?? null;
    const els = items.map((i) => document.getElementById(i.id)).filter(Boolean) as HTMLElement[];
    if (!els.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        const vis = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (vis) setActive(vis.target.id);
      },
      { root, rootMargin: "-30% 0px -55% 0px", threshold: [0, 0.25, 0.5, 1] },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [items, scrollRoot]);

  return (
    <nav className="rul" aria-label="On this page">
      <ul className="rul__list">
        {items.map((it, idx) => (
          <li key={it.id} className="rul__item" data-active={it.id === active || undefined}>
            <a
              href={`#${it.id}`}
              className="rul__major"
              aria-current={it.id === active ? "location" : undefined}
              onClick={(e) => {
                if (onSelect) { e.preventDefault(); onSelect(it.id); }
              }}
            >
              <span className="rul__label">{it.label}</span>
              <span className="rul__tick" aria-hidden="true" />
            </a>
            {idx < items.length - 1 &&
              Array.from({ length: MINORS }, (_, k) => <span key={k} className="rul__minor" aria-hidden="true" />)}
          </li>
        ))}
      </ul>
    </nav>
  );
}
