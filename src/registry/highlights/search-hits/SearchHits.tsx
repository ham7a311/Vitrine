"use client";

import { useEffect, useId, useLayoutEffect, useMemo, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { findHits, step } from "./search";
import "./search-hits.css";

/**
 * Search Hits
 * Find-in-page done properly. Every match of the query is tinted as you type
 * — ignoring case and accents, so "cafe" finds "Café" — and a solid marker
 * glides from hit to hit as you step through them, scrolling each into view,
 * with a running count. Enter and Shift+Enter step, Escape clears.
 */

type Props = {
  /** The text to search, one string per paragraph. */
  paragraphs: string[];
  initialQuery?: string;
  /** Accessible name for the search field. */
  label?: string;
  title?: ReactNode;
  theme?: "paper" | "night";
  className?: string;
};

export function SearchHits({ paragraphs, initialQuery = "", label = "Find in this article", title, theme = "paper", className = "" }: Props) {
  const id = useId();
  const [query, setQuery] = useState(initialQuery);
  const [active, setActive] = useState(0);
  const doc = useRef<HTMLDivElement>(null);
  const glider = useRef<HTMLSpanElement>(null);

  const hits = useMemo(() => paragraphs.map((p) => findHits(p, query)), [paragraphs, query]);
  const total = hits.reduce((n, h) => n + h.length, 0);
  useEffect(() => setActive(0), [query]);

  // Move the marker onto the active hit (in the document's own scroll space) and bring it into view.
  useLayoutEffect(() => {
    const box = doc.current, g = glider.current;
    if (!box || !g) return;
    const place = (scroll: boolean) => {
      const mark = box.querySelector<HTMLElement>(`[data-hit="${active}"]`);
      if (!mark) { g.style.opacity = "0"; return; }
      const r = mark.getClientRects()[0] ?? mark.getBoundingClientRect();
      const base = box.getBoundingClientRect();
      const x = r.left - base.left + box.scrollLeft, y = r.top - base.top + box.scrollTop;
      // Appearing (first match, or after "No matches"): land in place; only moves between hits glide.
      const appearing = g.style.opacity !== "1";
      if (appearing) g.style.transition = "none";
      g.style.opacity = "1";
      g.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px)`;
      g.style.width = `${r.width.toFixed(1)}px`;
      g.style.height = `${r.height.toFixed(1)}px`;
      if (appearing) { g.getBoundingClientRect(); g.style.transition = ""; }
      if (scroll && (y < box.scrollTop + 8 || y + r.height > box.scrollTop + box.clientHeight - 8)) {
        const smooth = !matchMedia("(prefers-reduced-motion: reduce)").matches;
        box.scrollTo({ top: Math.max(0, y - box.clientHeight * 0.38), behavior: smooth ? "smooth" : "auto" });
      }
    };
    place(true);
    const ro = new ResizeObserver(() => place(false));
    ro.observe(box);
    // A late web font moves every word without resizing the box.
    let alive = true;
    document.fonts?.ready.then(() => alive && place(false));
    return () => { alive = false; ro.disconnect(); };
  }, [active, hits]);

  const go = (dir: 1 | -1) => setActive((a) => step(a, total, dir));
  const onKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") { e.preventDefault(); go(e.shiftKey ? -1 : 1); }
    if (e.key === "Escape" && query) { e.preventDefault(); setQuery(""); }
  };

  let n = 0;
  const status = !query.trim() ? "" : total ? `${active + 1} of ${total}` : "No matches";

  return (
    <section className={`srchits srchits--${theme} ${className}`} aria-label={label}>
      <div className="srchits__bar" role="search">
        <svg className="srchits__icon" viewBox="0 0 16 16" aria-hidden="true"><circle cx="7" cy="7" r="4.5" /><path d="m10.5 10.5 3 3" /></svg>
        <input
          id={`${id}q`}
          className="srchits__input"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={onKey}
          placeholder="Find…"
          aria-label={label}
          aria-describedby={`${id}s`}
          autoComplete="off"
          spellCheck={false}
        />
        <output id={`${id}s`} className="srchits__count" aria-live="polite">{status}</output>
        <button type="button" className="srchits__step" onClick={() => go(-1)} disabled={!total} aria-label="Previous match">
          <svg viewBox="0 0 16 16" aria-hidden="true"><path d="m4 10 4-4 4 4" /></svg>
        </button>
        <button type="button" className="srchits__step" onClick={() => go(1)} disabled={!total} aria-label="Next match">
          <svg viewBox="0 0 16 16" aria-hidden="true"><path d="m4 6 4 4 4-4" /></svg>
        </button>
      </div>
      <div ref={doc} className="srchits__doc" tabIndex={0} aria-label="Article">
        <span ref={glider} className="srchits__glider" aria-hidden="true" />
        {title}
        {paragraphs.map((p, k) => {
          const parts: ReactNode[] = [];
          let last = 0;
          for (const [s, e] of hits[k]) {
            if (s > last) parts.push(p.slice(last, s));
            const at = n++;
            parts.push(<mark key={s} data-hit={at} className={at === active ? "srchits__hit is-active" : "srchits__hit"}>{p.slice(s, e)}</mark>);
            last = e;
          }
          parts.push(p.slice(last));
          return <p key={k} className="srchits__p">{parts}</p>;
        })}
      </div>
    </section>
  );
}

export default SearchHits;
