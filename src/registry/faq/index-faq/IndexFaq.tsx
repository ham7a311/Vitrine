"use client";

import { useId, useState, type ReactNode } from "react";
import "./index-faq.css";

/**
 * Index FAQ
 * An accordion set like the index of a book. Each entry has a mono index
 * number, a serif question and a plus that rotates into a dash. Opening an
 * entry slides the answer open on a grid-rows reveal while a rule draws
 * under the question. One entry open at a time; arrows move between them.
 */

export type Faq = { q: string; a: ReactNode };

export function IndexFaq({ items, defaultOpen = 0 }: { items: Faq[]; defaultOpen?: number | null }) {
  const uid = useId();
  const [open, setOpen] = useState<number | null>(defaultOpen);

  const onKey = (e: React.KeyboardEvent<HTMLButtonElement>, i: number) => {
    const btns = [...(e.currentTarget.closest("ol")?.querySelectorAll<HTMLButtonElement>(".ifaq__q") ?? [])];
    const to = e.key === "ArrowDown" ? (i + 1) % btns.length : e.key === "ArrowUp" ? (i - 1 + btns.length) % btns.length : e.key === "Home" ? 0 : e.key === "End" ? btns.length - 1 : null;
    if (to === null) return;
    e.preventDefault();
    btns[to]?.focus();
  };

  return (
    <ol className="ifaq">
      {items.map((it, i) => {
        const isOpen = open === i;
        return (
          <li key={i} className="ifaq__item" data-open={isOpen || undefined}>
            <h3 className="ifaq__h">
              <button
                type="button"
                className="ifaq__q"
                aria-expanded={isOpen}
                aria-controls={`${uid}-a${i}`}
                id={`${uid}-q${i}`}
                onClick={() => setOpen(isOpen ? null : i)}
                onKeyDown={(e) => onKey(e, i)}
              >
                <span className="ifaq__n">{String(i + 1).padStart(2, "0")}</span>
                <span className="ifaq__text">{it.q}</span>
                <span className="ifaq__icon" aria-hidden="true" />
              </button>
            </h3>
            <div id={`${uid}-a${i}`} role="region" aria-labelledby={`${uid}-q${i}`} className="ifaq__a">
              <div className="ifaq__a-inner">
                <div className="ifaq__a-body">{it.a}</div>
              </div>
            </div>
            <span className="ifaq__rule" aria-hidden="true" />
          </li>
        );
      })}
    </ol>
  );
}
