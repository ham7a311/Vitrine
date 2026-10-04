"use client";

import { useLayoutEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from "react";
import "./search-faq.css";

/**
 * Search FAQ
 * Scores every question by how many query words appear in it (question
 * matches count double), sorts by score, and highlights matching words in
 * both the question and the open answer. Rows glide to their new positions
 * (FLIP); rows that no longer match fold away. An empty result offers a way
 * to ask a person.
 */

export type Item = { q: string; a: string; tag: string };

type Props = { items: Item[]; contact?: string; accent?: string; className?: string };

const words = (s: string) => s.toLowerCase().split(/[^a-z0-9]+/).filter((w) => w.length > 1);

function mark(text: string, terms: string[]): ReactNode {
  if (!terms.length) return text;
  const re = new RegExp(`(${terms.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`, "gi");
  return text.split(re).map((part, i) => (i % 2 ? <mark key={i}>{part}</mark> : part));
}

export function SearchFaq({ items, contact = "hello@hamza.dev", accent = "#b9cce4", className = "" }: Props) {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState<number | null>(0);
  const list = useRef<HTMLUListElement>(null);
  const rects = useRef(new Map<string, DOMRect>());
  const terms = useMemo(() => words(q), [q]);

  const ranked = useMemo(() => {
    const scored = items.map((it, i) => {
      if (!terms.length) return { it, i, s: 1 };
      const qw = words(it.q), aw = words(it.a + " " + it.tag);
      const s = terms.reduce((acc, t) => acc + (qw.some((w) => w.startsWith(t)) ? 2 : 0) + (aw.some((w) => w.startsWith(t)) ? 1 : 0), 0);
      return { it, i, s };
    });
    return scored.filter((x) => x.s > 0).sort((a, b) => b.s - a.s || a.i - b.i);
  }, [items, terms]);

  // FLIP: remember positions before each render that changes order
  const remember = () => {
    rects.current = new Map(Array.from(list.current?.children ?? []).map((el) => [(el as HTMLElement).dataset.key!, el.getBoundingClientRect()]));
  };
  useLayoutEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    Array.from(list.current?.children ?? []).forEach((node) => {
      const el = node as HTMLElement, a = rects.current.get(el.dataset.key!);
      if (!a) { el.animate([{ opacity: 0, transform: "translateY(8px)" }, { opacity: 1, transform: "none" }], { duration: 420, easing: "cubic-bezier(0.16,1,0.3,1)" }); return; }
      const dy = a.top - el.getBoundingClientRect().top;
      if (Math.abs(dy) > 1) el.animate([{ transform: `translateY(${dy}px)` }, { transform: "none" }], { duration: 520, easing: "cubic-bezier(0.16,1,0.3,1)" });
    });
  }, [ranked]);

  return (
    <section className={`search-faq ${className}`} style={{ "--sf-accent": accent } as CSSProperties}>
      <label className="search-faq__field">
        <svg viewBox="0 0 16 16" aria-hidden="true"><circle cx="7" cy="7" r="4.5" /><path d="M10.5 10.5 14 14" /></svg>
        <input value={q} onChange={(e) => { remember(); setQ(e.target.value); }} placeholder="Search — try “refund”, “team”, “data”" aria-label="Search questions" />
        {q && <button type="button" onClick={() => { remember(); setQ(""); }} aria-label="Clear search">×</button>}
      </label>
      <p className="search-faq__count" aria-live="polite">{terms.length ? `${ranked.length} of ${items.length} questions` : `${items.length} questions`}</p>

      <ul ref={list} className="search-faq__list">
        {ranked.map(({ it, i }) => {
          const isOpen = open === i;
          return (
            <li key={i} data-key={i} className="search-faq__item" data-open={isOpen || undefined}>
              <button type="button" className="search-faq__q" aria-expanded={isOpen} onClick={() => setOpen(isOpen ? null : i)}>
                <span className="search-faq__tag">{it.tag}</span>
                <span className="search-faq__text">{mark(it.q, terms)}</span>
                <span className="search-faq__plus" aria-hidden="true" />
              </button>
              <div className="search-faq__a"><div><p>{mark(it.a, terms)}</p></div></div>
            </li>
          );
        })}
      </ul>

      {!ranked.length && (
        <div className="search-faq__empty">
          <p>Nothing here matches “{q}”.</p>
          <a href={`mailto:${contact}`}>Ask a person instead → {contact}</a>
        </div>
      )}
    </section>
  );
}
