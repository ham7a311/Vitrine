"use client";
import { useEffect, useId, useLayoutEffect, useReducer, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { flushSync } from "react-dom";
import { columnsFor, spanFor, type Span } from "./layout";
import { transition, unfold } from "./unfold";
import "./unfold-bento.css";

export type UnfoldTile = {
  id: string;
  title: string;
  /** A few words under the title on the folded tile. */
  kicker: string;
  /** The tile's colour; text on it is dark, so keep it light or saturated. */
  color: string;
  /** Small illustration on the folded tile; it's shown larger when unfolded. */
  teaser: ReactNode;
  /** What unfolds. */
  detail: string;
  steps?: string[];
  cta?: { label: string; href: string };
  span?: Span;
};

export type UnfoldBentoProps = {
  tiles: UnfoldTile[];
  eyebrow?: string;
  title?: string;
  lede?: string;
  theme?: "night" | "paper";
  rowHeight?: number;
  onNavigate?: (href: string, event: React.MouseEvent) => void;
  className?: string;
};

/**
 * Unfold Bento
 * A bento of colour tiles that open in place: choose one and it unfolds to fill the grid with
 * its story, while the others fold down into a row of chips you can jump between.
 */
export function UnfoldBento({ tiles, eyebrow, title, lede, theme = "night", rowHeight = 210, onNavigate, className = "" }: UnfoldBentoProps) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const stage = useRef<HTMLDivElement>(null);
  const [cols, setCols] = useState(4);
  const [height, setHeight] = useState<number | undefined>();
  const [s, dispatch] = useReducer(unfold, { open: null, from: null });
  const moved = useRef(false);

  useLayoutEffect(() => {
    const el = stage.current;
    if (!el) return;
    setCols(columnsFor(el.getBoundingClientRect().width || 1200));
    const ro = new ResizeObserver(([e]) => setCols(columnsFor(e.contentRect.width)));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // keep the folded grid's height while a tile is open, so the page doesn't jump
  useLayoutEffect(() => {
    if (!s.open && stage.current) setHeight(stage.current.querySelector<HTMLElement>(".ubento__grid")?.offsetHeight);
  }, [s.open, cols, tiles.length]);

  // focus follows the fold: into the panel when it opens, back to its tile when it closes
  useEffect(() => {
    if (!moved.current) return;
    moved.current = false;
    const el = stage.current;
    if (!el) return;
    if (s.open) el.querySelector<HTMLElement>(".ubento__panel h3")?.focus();
    else if (s.from) el.querySelector<HTMLElement>(`[data-tile="${s.from}"]`)?.focus();
  }, [s]);

  const act = (a: Parameters<typeof unfold>[1]) => { moved.current = true; transition(() => flushSync(() => dispatch(a))); };
  const vt = (id: string) => ({ viewTransitionName: `ub${uid}-${id}` }) as CSSProperties;
  const current = tiles.find((t) => t.id === s.open);
  const ids = tiles.map((t) => t.id);

  return (
    <section className={`ubento ubento--${theme} ${className}`} aria-label={title ?? "Features"}>
      {(eyebrow || title || lede) && (
        <header className="ubento__head">
          {eyebrow && <p className="ubento__eyebrow">{eyebrow}</p>}
          {title && <h2 className="ubento__title">{title}</h2>}
          {lede && <p className="ubento__lede">{lede}</p>}
        </header>
      )}
      <div ref={stage} className="ubento__stage" style={{ minHeight: s.open ? height : undefined }}
        onKeyDown={(e) => { if (e.key === "Escape" && s.open) { e.preventDefault(); act({ type: "close" }); } }}>
        {!current ? (
          <div className="ubento__grid" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`, gridAutoRows: `${rowHeight}px` }}>
            {tiles.map((t) => {
              const [c, r] = spanFor(t.span, cols);
              return (
                <button key={t.id} type="button" data-tile={t.id} className="ubento__tile" aria-expanded={false} aria-controls={`ub${uid}-panel`}
                  style={{ ...vt(t.id), gridColumn: `span ${c}`, gridRow: `span ${r}`, ["--ub-c" as string]: t.color } as CSSProperties}
                  onClick={() => act({ type: "open", id: t.id })}>
                  <span className="ubento__teaser" aria-hidden="true">{t.teaser}</span>
                  <span className="ubento__label"><b>{t.title}</b><small>{t.kicker}</small></span>
                  <span className="ubento__plus" aria-hidden="true"><svg width="14" height="14" viewBox="0 0 14 14"><path d="M7 2v10M2 7h10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg></span>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="ubento__open">
            <div id={`ub${uid}-panel`} role="region" aria-labelledby={`ub${uid}-h`} className="ubento__panel" style={{ ...vt(current.id), ["--ub-c" as string]: current.color } as CSSProperties}>
              <div className="ubento__panel-text">
                <p className="ubento__panel-kicker">{current.kicker}</p>
                <h3 id={`ub${uid}-h`} tabIndex={-1}>{current.title}</h3>
                <p className="ubento__panel-detail">{current.detail}</p>
                {current.steps && <ol className="ubento__steps">{current.steps.map((x) => <li key={x}>{x}</li>)}</ol>}
                {current.cta && <a className="ubento__cta" href={current.cta.href} onClick={(e) => onNavigate?.(current.cta!.href, e)}>{current.cta.label}<svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><path d="M2.5 7h8.5M7.5 3 11 7l-3.5 4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg></a>}
              </div>
              <div className="ubento__panel-visual" aria-hidden="true">{current.teaser}</div>
              <div className="ubento__panel-nav">
                <button type="button" aria-label="Previous feature" onClick={() => act({ type: "step", ids, by: -1 })}><svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><path d="M8.5 3 4.5 7l4 4" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg></button>
                <button type="button" aria-label="Next feature" onClick={() => act({ type: "step", ids, by: 1 })}><svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><path d="M5.5 3 9.5 7l-4 4" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg></button>
                <button type="button" className="ubento__close" aria-label={`Fold ${current.title} back`} onClick={() => act({ type: "close" })}><svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><path d="m3 3 8 8M11 3l-8 8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg></button>
              </div>
            </div>
            <div className="ubento__chips" role="group" aria-label="Other features">
              {tiles.filter((t) => t.id !== current.id).map((t) => (
                <button key={t.id} type="button" data-tile={t.id} className="ubento__chip" style={{ ...vt(t.id), ["--ub-c" as string]: t.color } as CSSProperties} onClick={() => act({ type: "open", id: t.id })}>
                  <i aria-hidden="true" />{t.title}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default UnfoldBento;
