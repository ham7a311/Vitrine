"use client";

import { Fragment, useEffect, useId, useState, type ReactNode } from "react";
import "./footnote-faq.css";

/**
 * Footnote FAQ
 * The questions people ask, answered in a few honest sentences of prose.
 * The phrases a reader would want to check carry footnote numbers; opening
 * one sets its answer as a note right under the paragraph, without leaving
 * the text. An index of every question sits underneath for people who scan.
 */

export type Note = { text: string; q: string; a: ReactNode; id?: string };
export type Paragraph = (string | Note)[];

type Props = {
  paragraphs: Paragraph[];
  /** Prefix for deep links: #faq-2 opens note 2. */
  anchor?: string;
  theme?: "paper" | "night";
  motion?: "full" | "reduced";
  className?: string;
};

export function FootnoteFaq({ paragraphs, anchor = "faq", theme = "paper", motion = "full", className = "" }: Props) {
  const uid = useId();
  // Number the notes in reading order.
  const notes: (Note & { n: number; p: number })[] = [];
  paragraphs.forEach((para, p) => para.forEach((part) => typeof part !== "string" && notes.push({ ...part, n: notes.length + 1, p })));
  const [open, setOpen] = useState<number[]>([]);

  useEffect(() => {
    const fromHash = () => {
      const m = window.location.hash.match(new RegExp(`^#${anchor}-(\\d+)$`));
      if (m) setOpen((o) => (o.includes(+m[1]) ? o : [...o, +m[1]]));
    };
    fromHash();
    window.addEventListener("hashchange", fromHash);
    return () => window.removeEventListener("hashchange", fromHash);
  }, [anchor]);

  const toggle = (n: number) => setOpen((o) => (o.includes(n) ? o.filter((x) => x !== n) : [...o, n]));
  const reveal = (n: number) => {
    setOpen((o) => (o.includes(n) ? o : [...o, n]));
    requestAnimationFrame(() => document.getElementById(`${uid}-mark-${n}`)?.focus({ preventScroll: false }));
  };

  let counter = 0;
  return (
    <div className={`fnf fnf--${theme} ${className}`} data-motion={motion}>
      <div className="fnf__prose">
        {paragraphs.map((para, p) => {
          const here = notes.filter((x) => x.p === p);
          return (
            <Fragment key={p}>
              <p className="fnf__para">
                {para.map((part, i) => {
                  if (typeof part === "string") return <Fragment key={i}>{part}</Fragment>;
                  const n = ++counter;
                  const isOpen = open.includes(n);
                  return (
                    // A span, not a <button>: buttons can't break across lines, and these phrases sit inside running text.
                    <span
                      key={i}
                      id={`${uid}-mark-${n}`}
                      role="button"
                      tabIndex={0}
                      className="fnf__mark"
                      data-open={isOpen || undefined}
                      aria-expanded={isOpen}
                      aria-controls={`${uid}-note-${n}`}
                      onClick={() => toggle(n)}
                      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggle(n); } }}
                    >
                      {part.text}
                      <sup className="fnf__sup" aria-hidden="true">{n}</sup>
                      <span className="fnf__sr">, note {n}: {part.q}</span>
                    </span>
                  );
                })}
              </p>
              {here.length > 0 && (
                <div className="fnf__notes">
                  {here.map((x) => (
                    <div key={x.n} id={`${uid}-note-${x.n}`} className="fnf__note" data-open={open.includes(x.n) || undefined} role="region" aria-labelledby={`${uid}-q-${x.n}`} inert={!open.includes(x.n)}>
                      <div className="fnf__note-inner">
                        <span className="fnf__n" aria-hidden="true">{x.n}</span>
                        <div className="fnf__note-body">
                          <p id={`${uid}-q-${x.n}`} className="fnf__q">{x.q}</p>
                          <div className="fnf__a">{x.a}</div>
                        </div>
                        <button type="button" className="fnf__close" aria-label={`Close note ${x.n}`} onClick={() => { toggle(x.n); document.getElementById(`${uid}-mark-${x.n}`)?.focus(); }}>
                          <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M4 4l8 8M12 4l-8 8" /></svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Fragment>
          );
        })}
      </div>

      <nav className="fnf__index" aria-label="All questions">
        <p className="fnf__index-title">All questions</p>
        <ol>
          {notes.map((x) => (
            <li key={x.n}>
              <a href={`#${anchor}-${x.n}`} onClick={(e) => { if (!e.defaultPrevented) history.replaceState(null, "", `#${anchor}-${x.n}`); e.preventDefault(); reveal(x.n); }} data-open={open.includes(x.n) || undefined}>
                <span className="fnf__index-n">{x.n}</span>
                {x.q}
              </a>
            </li>
          ))}
        </ol>
      </nav>
    </div>
  );
}
