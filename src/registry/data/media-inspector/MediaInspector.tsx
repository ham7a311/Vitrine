"use client";

import { useLayoutEffect, useRef, useState, type KeyboardEvent as ReactKeyboardEvent, type PointerEvent as ReactPointerEvent, type ReactNode } from "react";
import "./media-inspector.css";

/**
 * Media Inspector
 * No modal. Selecting an asset opens the grid around it: the thumbnail grows
 * into a full-width inspector on the row below its own, the rest of the grid
 * reflows to make room, and next/previous walk the inspector through the grid
 * in place. You never lose sight of where the asset lives.
 */

export type Asset = {
  id: string;
  name: string;
  width: number;
  height: number;
  bytes: number;
  type: string;
  /** Rendered in both the thumbnail and the inspector (an <img>, <svg>, <video>…). */
  media: ReactNode;
  alt: string;
  meta?: { label: string; value: ReactNode }[];
  palette?: string[];
};

type Action = { label: string; onSelect: (asset: Asset) => void; danger?: boolean };

type Props = {
  assets: Asset[];
  actions?: Action[];
  label?: string;
  theme?: "paper" | "night";
};

const fmtBytes = (b: number) => (b >= 1e6 ? `${(b / 1e6).toFixed(1)} MB` : `${Math.round(b / 1e3)} KB`);
const ratio = (w: number, h: number) => {
  const g = (a: number, b: number): number => (b ? g(b, a % b) : a);
  const d = g(w, h);
  return `${w / d}:${h / d}`;
};

export function MediaInspector({ assets, actions = [], label = "Media", theme = "paper" }: Props) {
  const [open, setOpen] = useState<number | null>(null);
  const [focus, setFocus] = useState(0);
  const gridRef = useRef<HTMLUListElement>(null);
  const cells = useRef(new Map<string, HTMLElement>());
  const thumbs = useRef(new Map<string, HTMLElement>());
  const before = useRef<Map<string, DOMRect> | null>(null);
  const openedFrom = useRef<DOMRect | null>(null);
  const moveFocus = useRef<"thumb" | "inspector" | null>(null);
  const swipe = useRef<{ x: number; y: number } | null>(null);

  const reduced = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /** Record where everything is, then change the selection. */
  const select = (i: number | null) => {
    before.current = new Map(Array.from(cells.current, ([id, el]) => [id, el.getBoundingClientRect()]));
    if (i !== null) openedFrom.current = thumbs.current.get(assets[i].id)?.getBoundingClientRect() ?? before.current.get(assets[i].id) ?? null;
    setOpen(i);
    if (i !== null) setFocus(i);
  };

  // FLIP: the grid reflows smoothly; the chosen image grows out of its thumbnail.
  useLayoutEffect(() => {
    const prev = before.current;
    before.current = null;
    if (!prev) return;
    if (!reduced()) {
      cells.current.forEach((el, id) => {
        const was = prev.get(id);
        if (!was || (open !== null && assets[open].id === id)) return;
        const now = el.getBoundingClientRect();
        const dx = was.left - now.left;
        const dy = was.top - now.top;
        if (Math.abs(dx) + Math.abs(dy) > 1) el.animate([{ transform: `translate(${dx}px, ${dy}px)` }, { transform: "none" }], { duration: 380, easing: "cubic-bezier(0.2, 0.8, 0.2, 1)" });
      });
      if (open !== null && openedFrom.current) {
        const stage = gridRef.current?.querySelector<HTMLElement>(".media-inspector__stage");
        const r = stage?.getBoundingClientRect();
        if (stage && r) {
          const f = openedFrom.current;
          stage.animate(
            [
              { transform: `translate(${f.left - r.left}px, ${f.top - r.top}px) scale(${f.width / r.width}, ${f.height / r.height})`, borderRadius: "10px" },
              { transform: "none", borderRadius: "14px" },
            ],
            { duration: 420, easing: "cubic-bezier(0.2, 0.8, 0.2, 1)" },
          );
        }
      }
    }
    if (moveFocus.current === "inspector") gridRef.current?.querySelector<HTMLElement>(".media-inspector__panel")?.focus({ preventScroll: true });
    if (moveFocus.current === "thumb") thumbs.current.get(assets[focus].id)?.focus({ preventScroll: true });
    moveFocus.current = null;
    // Keep the inspector in view.
    if (open !== null) gridRef.current?.querySelector(".media-inspector__panel")?.scrollIntoView({ block: "nearest", behavior: reduced() ? "auto" : "smooth" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const columns = () => {
    const els = Array.from(thumbs.current.values());
    if (els.length < 2) return 1;
    const top = els[0].getBoundingClientRect().top;
    return Math.max(1, els.findIndex((e) => Math.abs(e.getBoundingClientRect().top - top) > 4)) || els.length;
  };

  const onGridKey = (e: ReactKeyboardEvent) => {
    if ((e.target as HTMLElement).closest(".media-inspector__panel")) return;
    const n = assets.length;
    const cols = columns();
    const go = (i: number) => {
      e.preventDefault();
      const next = Math.max(0, Math.min(n - 1, i));
      setFocus(next);
      thumbs.current.get(assets[next].id)?.focus();
    };
    if (e.key === "ArrowRight") go(focus + 1);
    else if (e.key === "ArrowLeft") go(focus - 1);
    else if (e.key === "ArrowDown") go(focus + cols);
    else if (e.key === "ArrowUp") go(focus - cols);
    else if (e.key === "Home") go(0);
    else if (e.key === "End") go(n - 1);
  };

  const step = (d: number) => {
    if (open === null) return;
    const next = (open + d + assets.length) % assets.length;
    moveFocus.current = "inspector";
    select(next);
  };

  const close = () => {
    moveFocus.current = "thumb";
    select(null);
  };

  const onPanelKey = (e: ReactKeyboardEvent) => {
    if (e.key === "ArrowRight") (e.preventDefault(), step(1));
    else if (e.key === "ArrowLeft") (e.preventDefault(), step(-1));
    else if (e.key === "Escape") (e.preventDefault(), close());
  };

  // Swipe on the image (phones): left/right for next/previous.
  const onDown = (e: ReactPointerEvent) => (swipe.current = { x: e.clientX, y: e.clientY });
  const onUp = (e: ReactPointerEvent) => {
    const s = swipe.current;
    swipe.current = null;
    if (!s) return;
    const dx = e.clientX - s.x;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(e.clientY - s.y) * 1.5) step(dx < 0 ? 1 : -1);
  };

  const a = open !== null ? assets[open] : null;

  return (
    <div className={`media-inspector media-inspector--${theme}`}>
      <ul ref={gridRef} className="media-inspector__grid" aria-label={label} onKeyDown={onGridKey}>
        {assets.map((asset, i) => {
          const isOpen = open === i;
          return (
            <li
              key={asset.id}
              ref={(el) => {
                if (el) cells.current.set(asset.id, el);
                else cells.current.delete(asset.id);
              }}
              className="media-inspector__cell"
              data-open={isOpen || undefined}
            >
              {isOpen && a ? (
                <section className="media-inspector__panel" tabIndex={-1} aria-label={`${a.name}, ${open + 1} of ${assets.length}`} onKeyDown={onPanelKey}>
                  <div className="media-inspector__stage" onPointerDown={onDown} onPointerUp={onUp} style={{ aspectRatio: `${a.width} / ${a.height}` }}>
                    <div className="media-inspector__media" role="img" aria-label={a.alt}>
                      {a.media}
                    </div>
                  </div>
                  <div className="media-inspector__info">
                    <div className="media-inspector__bar">
                      <span className="media-inspector__count">
                        {open + 1} / {assets.length}
                      </span>
                      <div className="media-inspector__nav">
                        <button type="button" onClick={() => step(-1)} aria-label="Previous asset">
                          <svg viewBox="0 0 16 16" aria-hidden="true">
                            <path d="M10 3.5L5.5 8l4.5 4.5" />
                          </svg>
                        </button>
                        <button type="button" onClick={() => step(1)} aria-label="Next asset">
                          <svg viewBox="0 0 16 16" aria-hidden="true">
                            <path d="M6 3.5l4.5 4.5L6 12.5" />
                          </svg>
                        </button>
                        <button type="button" onClick={close} aria-label="Close inspector">
                          <svg viewBox="0 0 16 16" aria-hidden="true">
                            <path d="M4 4l8 8M12 4l-8 8" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    <h3 className="media-inspector__name">{a.name}</h3>
                    <dl className="media-inspector__meta">
                      <div>
                        <dt>Dimensions</dt>
                        <dd>
                          {a.width.toLocaleString("en")} × {a.height.toLocaleString("en")} <span>{ratio(a.width, a.height)}</span>
                        </dd>
                      </div>
                      <div>
                        <dt>Size</dt>
                        <dd>
                          {fmtBytes(a.bytes)} <span>{a.type}</span>
                        </dd>
                      </div>
                      {a.meta?.map((m) => (
                        <div key={m.label}>
                          <dt>{m.label}</dt>
                          <dd>{m.value}</dd>
                        </div>
                      ))}
                    </dl>
                    {a.palette && (
                      <div className="media-inspector__palette" aria-label="Dominant colours">
                        {a.palette.map((c) => (
                          <span key={c} style={{ background: c }} title={c} />
                        ))}
                      </div>
                    )}
                    {actions.length > 0 && (
                      <div className="media-inspector__actions">
                        {actions.map((act) => (
                          <button key={act.label} type="button" data-danger={act.danger || undefined} onClick={() => act.onSelect(a)}>
                            {act.label}
                          </button>
                        ))}
                      </div>
                    )}
                    <p className="media-inspector__hint" aria-hidden="true">
                      ← → to browse · Esc to close
                    </p>
                  </div>
                </section>
              ) : (
                <button
                  ref={(el) => {
                    if (el) thumbs.current.set(asset.id, el);
                    else thumbs.current.delete(asset.id);
                  }}
                  type="button"
                  className="media-inspector__thumb"
                  tabIndex={i === focus ? 0 : -1}
                  aria-label={`${asset.name}, ${asset.width} by ${asset.height}`}
                  aria-current={open !== null && Math.abs(open - i) === 0 ? "true" : undefined}
                  onFocus={() => setFocus(i)}
                  onClick={() => {
                    moveFocus.current = "inspector";
                    select(open === i ? null : i);
                  }}
                >
                  <span className="media-inspector__thumb-media" aria-hidden="true">
                    {asset.media}
                  </span>
                  <span className="media-inspector__thumb-name">{asset.name}</span>
                </button>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
