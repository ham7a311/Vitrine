"use client";
import { useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { columnsFor, spanFor, type Span } from "./layout";
import { lean } from "./depth";
import "./depth-bento.css";

export type DepthTone = "iris" | "ember" | "sea" | "moss" | "rose" | "sky";

export type DepthTile = {
  id: string;
  title: string;
  body?: string;
  tone: DepthTone;
  /** The scene: a few <Layer z={…}> planes, back to front. */
  scene: ReactNode;
  span?: Span;
  href?: string;
};

/** One plane of a tile's scene. z is how far it rises when the tile is lifted (0 stays on the back). */
export function Layer({ z, children, className = "", style }: { z: number; children: ReactNode; className?: string; style?: CSSProperties }) {
  return <div className={`dbento__layer ${className}`} style={{ ["--z" as string]: z, ...style } as CSSProperties}>{children}</div>;
}

export type DepthBentoProps = {
  tiles: DepthTile[];
  eyebrow?: string;
  title?: string;
  lede?: string;
  theme?: "night" | "paper";
  rowHeight?: number;
  onNavigate?: (href: string, event: React.MouseEvent) => void;
  className?: string;
};

/**
 * Depth Bento
 * Every tile is a small illustration built from flat planes. Point at one and its planes part in
 * depth while the tile leans towards you, with a soft rim of light where the pointer is.
 */
export function DepthBento({ tiles, eyebrow, title, lede, theme = "night", rowHeight = 236, onNavigate, className = "" }: DepthBentoProps) {
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

  const move = (e: React.PointerEvent<HTMLElement>) => {
    if (e.pointerType !== "mouse") return;
    const el = e.currentTarget, r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
    const t = lean(x, y);
    el.style.setProperty("--rx", `${t.rx}deg`); el.style.setProperty("--ry", `${t.ry}deg`);
    el.style.setProperty("--px", `${Math.round(x * 100)}%`); el.style.setProperty("--py", `${Math.round(y * 100)}%`);
  };
  const reset = (e: React.PointerEvent<HTMLElement>) => { e.currentTarget.style.setProperty("--rx", "0deg"); e.currentTarget.style.setProperty("--ry", "0deg"); };

  return (
    <section className={`dbento dbento--${theme} ${className}`} aria-label={title ?? "Features"}>
      {(eyebrow || title || lede) && (
        <header className="dbento__head">
          {eyebrow && <p className="dbento__eyebrow">{eyebrow}</p>}
          {title && <h2 className="dbento__title">{title}</h2>}
          {lede && <p className="dbento__lede">{lede}</p>}
        </header>
      )}
      <div ref={grid} className="dbento__grid" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`, gridAutoRows: `${rowHeight}px` }}>
        {tiles.map((t) => {
          const [c, r] = spanFor(t.span, cols);
          return (
            <article key={t.id} className={`dbento__tile dbento__tile--${t.tone}`} style={{ gridColumn: `span ${c}`, gridRow: `span ${r}` }} onPointerMove={move} onPointerLeave={reset}>
              <div className="dbento__stage" aria-hidden="true"><div className="dbento__scene">{t.scene}</div></div>
              <div className="dbento__text">
                <h3 className="dbento__name">
                  {t.href ? <a href={t.href} onClick={(e) => onNavigate?.(t.href!, e)}>{t.title}</a> : t.title}
                </h3>
                {t.body && <p className="dbento__body">{t.body}</p>}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

export default DepthBento;
