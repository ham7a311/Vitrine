"use client";

import { createContext, useContext, useId, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { connector, stack } from "./layout";
import "./margin-note.css";

/**
 * Margin Note
 * Comments that live beside the words they're about. Each highlighted phrase
 * is tied to its card in the margin by a soft curve; cards line up with their
 * phrase and stack without overlapping. Point at, or tab to, either the phrase
 * or the card and the pair lights up together. On narrow screens the cards
 * drop below the text, numbered to match.
 */

export type MarginComment = { id: string; author: string; body: ReactNode; time?: string };

type Ctx = { active: string | null; set: (id: string | null) => void; number: (id: string) => number; cardId: (id: string) => string };
const NoteContext = createContext<Ctx>({ active: null, set: () => {}, number: () => 0, cardId: (id) => id });

/** A highlighted phrase with a comment in the margin. */
export function Note({ id, children }: { id: string; children: ReactNode }) {
  const c = useContext(NoteContext);
  const on = c.active === id;
  return (
    <mark
      className={on ? "margnote__mark is-active" : "margnote__mark"}
      data-note={id}
      tabIndex={0}
      aria-describedby={c.cardId(id)}
      onPointerEnter={() => c.set(id)}
      onPointerLeave={() => c.set(null)}
      onFocus={() => c.set(id)}
      onBlur={() => c.set(null)}
    >
      {children}
      <sup className="margnote__num" aria-hidden="true">{c.number(id)}</sup>
    </mark>
  );
}

type Layout = { tops: Record<string, number>; paths: Record<string, string>; ends: Record<string, [number, number]>; height: number };

export function MarginNotes({ notes, children, theme = "paper", className = "" }: { notes: MarginComment[]; children: ReactNode; theme?: "paper" | "night"; className?: string }) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const root = useRef<HTMLDivElement>(null);
  const margin = useRef<HTMLDivElement>(null);
  const cards = useRef<Record<string, HTMLElement | null>>({});
  const [active, setActive] = useState<string | null>(null);
  const [wide, setWide] = useState(true);
  const [layout, setLayout] = useState<Layout | null>(null);

  useLayoutEffect(() => {
    const el = root.current;
    if (!el) return;
    const measure = () => {
      const base = el.getBoundingClientRect();
      const isWide = base.width >= 700;
      setWide(isWide);
      const m = margin.current;
      if (!isWide || !m) { setLayout(null); return; }
      const left = m.getBoundingClientRect().left - base.left;
      const marks = notes.map((n) => el.querySelector<HTMLElement>(`[data-note="${n.id}"]`));
      const wanted = marks.map((mk) => (mk ? mk.getClientRects()[0].top - base.top - 10 : 0));
      const heights = notes.map((n) => cards.current[n.id]?.offsetHeight ?? 80);
      const tops = stack(wanted, heights);
      const next: Layout = { tops: {}, paths: {}, ends: {}, height: 0 };
      notes.forEach((n, i) => {
        const mk = marks[i];
        if (!mk) return;
        const rects = mk.getClientRects();
        const last = rects[rects.length - 1];
        const x1 = last.right - base.left + 3, y1 = last.top - base.top + last.height * 0.55;
        const y2 = tops[i] + 22;
        next.tops[n.id] = tops[i];
        next.ends[n.id] = [x1, y1];
        next.paths[n.id] = connector(x1, y1, left - 2, y2);
        next.height = Math.max(next.height, tops[i] + heights[i]);
      });
      setLayout((prev) => (JSON.stringify(prev) === JSON.stringify(next) ? prev : next));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    let alive = true;
    document.fonts?.ready.then(() => alive && measure());
    return () => { alive = false; ro.disconnect(); };
  }, [notes, wide]);

  const ctx: Ctx = {
    active,
    set: setActive,
    number: (id) => notes.findIndex((n) => n.id === id) + 1,
    cardId: (id) => `${uid}-${id}`,
  };

  return (
    <NoteContext.Provider value={ctx}>
      <div ref={root} className={`margnote margnote--${theme} ${className}`} data-wide={wide || undefined} data-active={active ?? undefined}>
        {wide && layout && (
          <svg className="margnote__wires" aria-hidden="true">
            {notes.map((n) => layout.paths[n.id] && (
              <g key={n.id} className={active === n.id ? "margnote__wire is-active" : "margnote__wire"}>
                <path d={layout.paths[n.id]} />
                <circle cx={layout.ends[n.id][0]} cy={layout.ends[n.id][1]} r={2.5} />
              </g>
            ))}
          </svg>
        )}
        <div className="margnote__text">{children}</div>
        <div ref={margin} className="margnote__margin" style={wide && layout ? { minHeight: layout.height } : undefined}>
          {notes.map((n, i) => (
            <article
              key={n.id}
              id={`${uid}-${n.id}`}
              ref={(el) => { cards.current[n.id] = el; }}
              className={active === n.id ? "margnote__card is-active" : "margnote__card"}
              style={wide && layout ? { top: layout.tops[n.id] ?? 0 } : undefined}
              tabIndex={0}
              aria-label={`Comment ${i + 1} by ${n.author}`}
              onPointerEnter={() => setActive(n.id)}
              onPointerLeave={() => setActive(null)}
              onFocus={() => setActive(n.id)}
              onBlur={() => setActive(null)}
            >
              <header className="margnote__head">
                <span className="margnote__badge" aria-hidden="true">{i + 1}</span>
                <span className="margnote__author">{n.author}</span>
                {n.time && <span className="margnote__time">{n.time}</span>}
              </header>
              <div className="margnote__body">{n.body}</div>
            </article>
          ))}
        </div>
      </div>
    </NoteContext.Provider>
  );
}

export default MarginNotes;
