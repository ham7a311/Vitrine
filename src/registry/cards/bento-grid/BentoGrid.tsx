"use client";
import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { columnsFor, local, spanFor, type Span } from "./layout";
import "./bento-grid.css";

export type BentoTile = {
  id: string;
  title: string;
  body?: string;
  /** A small piece of working interface, a picture or an illustration. */
  visual?: ReactNode;
  /** Footprint per breakpoint; defaults to one cell. */
  span?: Span;
  /** Put the text above the visual instead of below it. */
  textFirst?: boolean;
  href?: string;
};

export type BentoGridProps = {
  tiles: BentoTile[];
  eyebrow?: string;
  title?: string;
  lede?: string;
  theme?: "night" | "paper";
  /** Height of one grid row in pixels. */
  rowHeight?: number;
  onNavigate?: (href: string, event: React.MouseEvent) => void;
  className?: string;
};

export function BentoGrid({ tiles, eyebrow, title, lede, theme = "night", rowHeight = 244, onNavigate, className = "" }: BentoGridProps) {
  const grid = useRef<HTMLDivElement>(null);
  const [cols, setCols] = useState(4);

  useLayoutEffect(() => {
    const el = grid.current;
    if (!el) return;
    setCols(columnsFor(el.getBoundingClientRect().width || 1200));
    const ro = new ResizeObserver(([e]) => setCols(columnsFor(e.contentRect.width)));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // One light for the whole grid: each tile gets the pointer in its own coordinates.
  useEffect(() => {
    const el = grid.current;
    if (!el || matchMedia("(hover: none)").matches) return;
    let frame = 0, x = 0, y = 0;
    const paint = () => {
      frame = 0;
      for (const tile of el.querySelectorAll<HTMLElement>(".bento__tile")) {
        const p = local(x, y, tile.getBoundingClientRect());
        tile.style.setProperty("--bento-x", `${p.x}px`);
        tile.style.setProperty("--bento-y", `${p.y}px`);
      }
    };
    const move = (e: PointerEvent) => { x = e.clientX; y = e.clientY; if (!frame) frame = requestAnimationFrame(paint); };
    const enter = () => el.classList.add("bento__grid--lit");
    const leave = () => el.classList.remove("bento__grid--lit");
    el.addEventListener("pointermove", move); el.addEventListener("pointerenter", enter); el.addEventListener("pointerleave", leave);
    return () => { cancelAnimationFrame(frame); el.removeEventListener("pointermove", move); el.removeEventListener("pointerenter", enter); el.removeEventListener("pointerleave", leave); };
  }, []);

  return (
    <section className={`bento bento--${theme} ${className}`} aria-label={title ?? "Features"}>
      {(eyebrow || title || lede) && (
        <header className="bento__head">
          {eyebrow && <p className="bento__eyebrow">{eyebrow}</p>}
          {title && <h2 className="bento__title">{title}</h2>}
          {lede && <p className="bento__lede">{lede}</p>}
        </header>
      )}
      <div ref={grid} className="bento__grid" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`, gridAutoRows: `${rowHeight}px` }}>
        {tiles.map((t) => {
          const [c, r] = spanFor(t.span, cols);
          const text = (
            <div className="bento__text">
              <h3 className="bento__name">
                {t.title}
                {t.href && (
                  <a className="bento__link" href={t.href} onClick={(e) => onNavigate?.(t.href!, e)} aria-label={`${t.title}: learn more`}>
                    <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><path d="M4 10 10 4M5 4h5v5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  </a>
                )}
              </h3>
              {t.body && <p className="bento__body">{t.body}</p>}
            </div>
          );
          return (
            <article key={t.id} className={`bento__tile ${t.textFirst ? "bento__tile--top" : ""}`} style={{ gridColumn: `span ${c}`, gridRow: `span ${r}` }}>
              {t.textFirst && text}
              {t.visual && <div className="bento__visual">{t.visual}</div>}
              {!t.textFirst && text}
            </article>
          );
        })}
      </div>
    </section>
  );
}

export default BentoGrid;
