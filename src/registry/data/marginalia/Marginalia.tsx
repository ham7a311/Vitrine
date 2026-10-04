"use client";

import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import "./marginalia.css";

/**
 * Marginalia
 * A collection that recomposes around what you open. Choose a note and it takes
 * the page; the rest don't vanish, they move to the margin as an index of titles
 * and dates. Pick another from the margin and the page changes under it. Escape
 * returns everything to the grid.
 */

export type Note = { id: string; title: string; author: string; date: string; abstract: string; body: ReactNode };

type Props = {
  notes: Note[];
  theme?: "paper" | "night";
  motion?: "full" | "reduced";
  /** Start with a note open. */
  initialId?: string | null;
};

const EASE = "cubic-bezier(0.2, 0.8, 0.2, 1)";

export function Marginalia({ notes, theme = "paper", motion = "full", initialId = null }: Props) {
  const [openId, setOpenId] = useState<string | null>(initialId);
  const [announce, setAnnounce] = useState("");
  const els = useRef(new Map<string, HTMLElement>());
  const rects = useRef(new Map<string, DOMRect>());
  const focusAfter = useRef<"page" | string | null>(null);
  const pageHead = useRef<HTMLHeadingElement>(null);
  const root = useRef<HTMLDivElement>(null);
  const strip = useRef<HTMLDivElement>(null);
  const [narrow, setNarrow] = useState(false);

  // Layout follows the room the component has, not the window.
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setNarrow(el.clientWidth < 560));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Rects are kept relative to the component, so scrolling it into view never skews the glide.
  const rel = (el: HTMLElement) => {
    const r = el.getBoundingClientRect();
    const o = root.current!.getBoundingClientRect();
    return new DOMRect(r.left - o.left, r.top - o.top, r.width, r.height);
  };
  const measure = () => {
    els.current.forEach((el, id) => el.isConnected && rects.current.set(id, rel(el)));
  };

  const setOpen = (id: string | null) => {
    measure();
    focusAfter.current = id ? "page" : (openId ?? null);
    setOpenId(id);
    const n = notes.find((x) => x.id === id);
    setAnnounce(n ? `Reading ${n.title}. The other notes are in the margin.` : "All notes.");
  };

  // FLIP: every item glides from where it was to where it is now; a growing one opens out from its old box.
  useLayoutEffect(() => {
    const reduce = motion === "reduced" || window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!root.current) return;
    // On a narrow screen the page opens where the grid was; bring its top into view.
    if (focusAfter.current === "page" && narrow) {
      const top = root.current.getBoundingClientRect().top;
      if (top < 0 || top > window.innerHeight * 0.4) root.current.scrollIntoView({ block: "start" });
      strip.current?.querySelector<HTMLElement>("[data-active]")?.scrollIntoView({ block: "nearest", inline: "center" });
    }
    els.current.forEach((el, id) => {
      const was = rects.current.get(id);
      if (!was || reduce || !el.isConnected) return;
      const now = rel(el);
      const dx = was.left - now.left;
      const dy = was.top - now.top;
      const grow = now.width > was.width + 1 || now.height > was.height + 1;
      if (Math.abs(dx) < 1 && Math.abs(dy) < 1 && !grow) return;
      const clip = grow ? `inset(0 ${Math.max(0, now.width - was.width)}px ${Math.max(0, now.height - was.height)}px 0 round 14px)` : "inset(0 0 0 0 round 14px)";
      el.getAnimations().forEach((a) => a.id === "ma-flip" && a.cancel());
      el.animate([{ transform: `translate(${dx}px, ${dy}px)`, clipPath: clip }, { transform: "none", clipPath: "inset(0 0 0 0 round 14px)" }], { id: "ma-flip", duration: 460, easing: EASE });
    });
    rects.current.clear();
    const f = focusAfter.current;
    focusAfter.current = null;
    if (f === "page") pageHead.current?.focus({ preventScroll: true });
    else if (f) els.current.get(f)?.querySelector<HTMLElement>("[data-note]")?.focus({ preventScroll: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openId, motion]);

  useEffect(() => {
    // Keep the map in step with the notes on screen.
    const ids = new Set(notes.map((n) => n.id));
    els.current.forEach((_, id) => !ids.has(id) && els.current.delete(id));
  }, [notes]);

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Escape" && openId) {
      e.preventDefault();
      setOpen(null);
      return;
    }
    const arrows = ["ArrowRight", "ArrowLeft", "ArrowDown", "ArrowUp"];
    if (!arrows.includes(e.key)) return;
    const items = Array.from(e.currentTarget.querySelectorAll<HTMLElement>("[data-note]"));
    const i = items.indexOf(document.activeElement as HTMLElement);
    if (i < 0) return;
    const cols = openId ? 1 : Number(getComputedStyle(e.currentTarget.querySelector(".marginalia__stage") ?? e.currentTarget).getPropertyValue("--ma-cols")) || 3;
    const step = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : e.key === "ArrowDown" ? cols : -cols;
    const to = items[Math.min(items.length - 1, Math.max(0, i + step))];
    if (to && to !== items[i]) {
      e.preventDefault();
      to.focus();
    }
  };

  const open = notes.find((n) => n.id === openId) ?? null;
  const reg = (id: string) => (el: HTMLElement | null) => {
    if (el) els.current.set(id, el);
  };
  const page = (n: Note) => (
    <div className="marginalia__page" key="page">
      <p className="marginalia__meta">
        {n.author} · {n.date}
      </p>
      <h2 ref={pageHead} tabIndex={-1} className="marginalia__page-title">
        {n.title}
      </h2>
      <p className="marginalia__lede">{n.abstract}</p>
      <div className="marginalia__body">{n.body}</div>
    </div>
  );

  return (
    <div ref={root} className={`marginalia marginalia--${theme}`} data-mode={open ? "page" : "grid"} data-narrow={narrow || undefined} data-motion={motion} style={{ ["--ma-n" as string]: notes.length }} onKeyDown={onKeyDown}>
      {open && (
        <button type="button" className="marginalia__back" onClick={() => setOpen(null)}>
          <span aria-hidden="true">←</span> All notes
        </button>
      )}
      {open && narrow ? (
        <>
          {/* Narrow: the margin turns on its side into a strip above the page. */}
          <div ref={strip} className="marginalia__strip" role="list" aria-label="Other notes">
            {notes.map((n) => (
              <div key={n.id} ref={reg(n.id === openId ? `${n.id}~chip` : n.id)} role="listitem" className="marginalia__chip-wrap">
                <button type="button" data-note className="marginalia__chip" data-active={n.id === openId || undefined} aria-current={n.id === openId ? "true" : undefined} onClick={() => n.id !== openId && setOpen(n.id)}>
                  <span className="marginalia__date">{n.date}</span>
                  <span className="marginalia__chip-title">{n.title}</span>
                </button>
              </div>
            ))}
          </div>
          <article ref={reg(open.id)} className="marginalia__item" data-open>
            {page(open)}
          </article>
        </>
      ) : (
        <div className="marginalia__stage" role="list" aria-label="Research notes">
          {notes.map((n) => {
            const isOpen = n.id === openId;
            return (
              <article key={n.id} ref={reg(n.id)} role="listitem" className="marginalia__item" data-open={isOpen || undefined} data-margin={open && !isOpen ? "" : undefined}>
                {isOpen ? (
                  page(n)
                ) : (
                  <button type="button" data-note className="marginalia__card" onClick={() => setOpen(n.id)}>
                    <span className="marginalia__date">{n.date}</span>
                    <span className="marginalia__title">{n.title}</span>
                    <span className="marginalia__author">{n.author}</span>
                    <span className="marginalia__abstract">{n.abstract}</span>
                  </button>
                )}
              </article>
            );
          })}
        </div>
      )}
      <p className="marginalia__sr" role="status">
        {announce}
      </p>
    </div>
  );
}
