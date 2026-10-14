"use client";
import { useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { columnsFor, spanFor, type Span } from "./layout";
import { origin } from "./mono";
import "./mono-bento.css";

export type MonoTile = {
  id: string;
  title: string;
  body?: string;
  visual?: ReactNode;
  span?: Span;
  href?: string;
};

export type MonoBentoProps = {
  tiles: MonoTile[];
  /** Small running head above the title, set in mono. */
  kicker?: string;
  title?: string;
  lede?: string;
  theme?: "night" | "paper";
  rowHeight?: number;
  onNavigate?: (href: string, event: React.MouseEvent) => void;
  className?: string;
};

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * Mono Bento
 * A black-and-white editorial bento on a hairline grid: square corners, numbered tiles, no colour.
 * Pointing at a tile inverts it with a circular wipe that starts where the pointer came in;
 * keyboard focus inverts it from the centre.
 */
export function MonoBento({ tiles, kicker, title, lede, theme = "night", rowHeight = 232, onNavigate, className = "" }: MonoBentoProps) {
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

  const aim = (e: React.PointerEvent<HTMLElement>) => {
    const o = origin(e.clientX, e.clientY, e.currentTarget.getBoundingClientRect());
    e.currentTarget.style.setProperty("--mb-x", `${o.x}%`);
    e.currentTarget.style.setProperty("--mb-y", `${o.y}%`);
  };

  return (
    <section className={`mbento mbento--${theme} ${className}`} aria-label={title ?? "Features"}>
      {(kicker || title || lede) && (
        <header className="mbento__head">
          {kicker && <p className="mbento__kicker"><span>{kicker}</span><span aria-hidden="true">({pad(1)}—{pad(tiles.length)})</span></p>}
          {title && <h2 className="mbento__title">{title}</h2>}
          {lede && <p className="mbento__lede">{lede}</p>}
        </header>
      )}
      <div ref={grid} className="mbento__grid" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`, gridAutoRows: `${rowHeight}px` }}>
        {tiles.map((t, i) => {
          const [c, r] = spanFor(t.span, cols);
          return (
            <article
              key={t.id}
              className="mbento__tile"
              aria-labelledby={`mb-${t.id}`}
              style={{ gridColumn: `span ${c}`, gridRow: `span ${r}` } as CSSProperties}
              onPointerEnter={aim}
              onPointerLeave={aim}
              onFocus={(e) => { if (e.target.matches(":focus-visible")) { e.currentTarget.style.setProperty("--mb-x", "50%"); e.currentTarget.style.setProperty("--mb-y", "50%"); } }}
            >
              <span className="mbento__index" aria-hidden="true">{pad(i + 1)}</span>
              {t.visual && <div className="mbento__visual">{t.visual}</div>}
              <div className="mbento__text">
                <h3 id={`mb-${t.id}`} className="mbento__name">
                  {t.href ? <a href={t.href} onClick={(e) => onNavigate?.(t.href!, e)}>{t.title}<svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true"><path d="M3 9 9 3M4 3h5v5" fill="none" stroke="currentColor" strokeWidth="1.4" /></svg></a> : t.title}
                </h3>
                {t.body && <p className="mbento__body">{t.body}</p>}
              </div>
              <span className="mbento__ink" aria-hidden="true" />
            </article>
          );
        })}
      </div>
    </section>
  );
}

export default MonoBento;
