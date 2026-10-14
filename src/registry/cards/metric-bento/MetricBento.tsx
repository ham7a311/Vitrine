"use client";
import { useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { columnsFor, spanFor, type Span } from "./layout";
import "./metric-bento.css";

export type MetricTile = {
  id: string;
  title: string;
  /** Small note on the right of the title, such as the period. */
  meta?: string;
  visual: ReactNode;
  span?: Span;
};

export type MetricBentoProps = {
  tiles: MetricTile[];
  eyebrow?: string;
  title?: string;
  lede?: string;
  theme?: "night" | "paper";
  rowHeight?: number;
  className?: string;
};

/**
 * Metric Bento
 * A bento that is also a small working dashboard: a revenue figure with a scrubbable trend,
 * a live request counter, the plan mix, twelve weeks of activity, top countries and a funnel.
 */
export function MetricBento({ tiles, eyebrow, title, lede, theme = "night", rowHeight = 220, className = "" }: MetricBentoProps) {
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
  return (
    <section className={`mxb mxb--${theme} ${className}`} aria-label={title ?? "Metrics"}>
      {(eyebrow || title || lede) && (
        <header className="mxb__head">
          {eyebrow && <p className="mxb__eyebrow"><i aria-hidden="true" />{eyebrow}</p>}
          {title && <h2 className="mxb__title">{title}</h2>}
          {lede && <p className="mxb__lede">{lede}</p>}
        </header>
      )}
      <div ref={grid} className="mxb__grid" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`, gridAutoRows: `minmax(${rowHeight}px, auto)` }}>
        {tiles.map((t) => {
          const [c, r] = spanFor(t.span, cols);
          return (
            <article key={t.id} className="mxb__tile" aria-labelledby={`mxb-${t.id}`} style={{ gridColumn: `span ${c}`, gridRow: `span ${r}` }}>
              <header className="mxb__bar"><h3 id={`mxb-${t.id}`}>{t.title}</h3>{t.meta && <span>{t.meta}</span>}</header>
              <div className="mxb__body">{t.visual}</div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

export default MetricBento;
