"use client";

import { useEffect, useId, useRef, useState } from "react";
import "./pleat-crumbs.css";

/**
 * Pleat Crumbs
 * A breadcrumb where every level is a fold. Open one and its siblings unfold
 * in the line itself, right where the crumb was, while the rest of the path
 * folds down to its initials so nothing wraps and nothing floats over the page.
 * Pick a sibling and the path from there on is replaced.
 */

export type Crumb = {
  id: string;
  label: string;
  href?: string;
  /** Other places at this level, including this one. */
  siblings?: { id: string; label: string }[];
};

type Props = {
  path: Crumb[];
  /** Called with the level that changed and the chosen sibling's id. */
  onNavigate?: (level: number, id: string) => void;
  theme?: "paper" | "night";
  motion?: "full" | "reduced";
};

export function PleatCrumbs({ path, onNavigate, theme = "paper", motion = "full" }: Props) {
  const [open, setOpen] = useState<number | null>(null);
  const [showAll, setShowAll] = useState(false);
  const uid = useId();
  const foldBtns = useRef(new Map<number, HTMLButtonElement>());
  const row = useRef<HTMLUListElement>(null);
  const restore = useRef<number | null>(null);

  // Opening a pleat puts focus on the current sibling; closing returns it to the fold.
  useEffect(() => {
    if (open !== null) {
      const cur = row.current?.querySelector<HTMLElement>("[aria-current='true']") ?? row.current?.querySelector<HTMLElement>("button");
      cur?.focus({ preventScroll: true });
    } else if (restore.current !== null) {
      foldBtns.current.get(restore.current)?.focus({ preventScroll: true });
      restore.current = null;
    }
  }, [open]);

  useEffect(() => {
    if (open === null) return;
    const away = (e: PointerEvent) => {
      if (!(e.target as Element).closest(".pleat-crumbs")) setOpen(null);
    };
    document.addEventListener("pointerdown", away);
    return () => document.removeEventListener("pointerdown", away);
  }, [open]);

  const close = (focusFold = true) => {
    if (focusFold) restore.current = open;
    setOpen(null);
  };

  const onRowKey = (e: React.KeyboardEvent<HTMLUListElement>) => {
    const items = Array.from(e.currentTarget.querySelectorAll<HTMLElement>("button"));
    const i = items.indexOf(document.activeElement as HTMLElement);
    if (e.key === "Escape") {
      e.preventDefault();
      close();
    } else if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
      e.preventDefault();
      items[Math.min(items.length - 1, Math.max(0, i + (e.key === "ArrowRight" ? 1 : -1)))]?.focus();
    } else if (e.key === "Home" || e.key === "End") {
      e.preventDefault();
      items[e.key === "Home" ? 0 : items.length - 1]?.focus();
    }
  };

  const last = path.length - 1;
  return (
    <nav className={`pleat-crumbs pleat-crumbs--${theme}`} aria-label="Breadcrumb" data-motion={motion} data-open={open !== null || undefined} data-all={showAll || undefined}>
      <ol className="pleat-crumbs__list">
        {path.length > 3 && !showAll && (
          <li className="pleat-crumbs__more">
            <button type="button" onClick={() => setShowAll(true)} aria-label={`Show ${path.length - 2} earlier levels`}>
              …
            </button>
          </li>
        )}
        {path.map((c, i) => {
          const isOpen = open === i;
          const folded = open !== null && !isOpen;
          const hidden = path.length > 3 && !showAll && i < path.length - 2;
          const has = !!c.siblings && c.siblings.length > 1;
          return (
            <li key={c.id} className="pleat-crumbs__item" data-open={isOpen || undefined} data-folded={folded || undefined} data-hidden={hidden || undefined} data-current={i === last || undefined}>
              {isOpen ? (
                <ul ref={row} id={`${uid}-${i}`} className="pleat-crumbs__row" aria-label={`Other places at this level`} onKeyDown={onRowKey}>
                  {c.siblings!.map((s, k) => (
                    <li key={s.id} style={{ ["--k" as string]: k }}>
                      <button
                        type="button"
                        className="pleat-crumbs__sibling"
                        aria-current={s.id === c.id ? "true" : undefined}
                        onClick={() => {
                          if (s.id !== c.id) onNavigate?.(i, s.id);
                          close();
                        }}
                      >
                        {s.label}
                      </button>
                    </li>
                  ))}
                </ul>
              ) : c.href && i !== last ? (
                <a className="pleat-crumbs__crumb" href={c.href} title={folded ? c.label : undefined} aria-label={folded ? c.label : undefined}>
                  <span className="pleat-crumbs__label">{c.label}</span>
                </a>
              ) : (
                <span className="pleat-crumbs__crumb" aria-current={i === last ? "page" : undefined} title={folded ? c.label : undefined} aria-label={folded ? c.label : undefined}>
                  <span className="pleat-crumbs__label">{c.label}</span>
                </span>
              )}
              {has && (
                <button
                  ref={(el) => {
                    if (el) foldBtns.current.set(i, el);
                  }}
                  type="button"
                  className="pleat-crumbs__fold"
                  aria-expanded={isOpen}
                  aria-controls={isOpen ? `${uid}-${i}` : undefined}
                  aria-label={`${c.label}: show other places at this level`}
                  onClick={() => (isOpen ? close() : setOpen(i))}
                  onKeyDown={(e) => {
                    if (e.key === "ArrowDown" && !isOpen) {
                      e.preventDefault();
                      setOpen(i);
                    }
                  }}
                >
                  <svg viewBox="0 0 12 12" aria-hidden="true">
                    <path d="M4 2.5l4 3.5-4 3.5" />
                  </svg>
                </button>
              )}
              {!has && i < last && (
                <span className="pleat-crumbs__sep" aria-hidden="true">
                  <svg viewBox="0 0 12 12">
                    <path d="M4 2.5l4 3.5-4 3.5" />
                  </svg>
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
