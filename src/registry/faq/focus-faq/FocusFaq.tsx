"use client";

import { useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import "./focus-faq.css";

/**
 * Focus FAQ
 * Instead of rows opening in place, the question you pick becomes the page's
 * subject. Every question is a FLIP element: we record where each one is,
 * change the layout, then animate each from its old box to its new one — so
 * the chosen question visibly travels up and grows into the heading while the
 * others slide into a smaller list underneath.
 */

export type QA = { q: string; a: string };

type Props = { items: QA[]; title?: string; accent?: string; className?: string };

export function FocusFaq({ items, title = "Questions, answered", accent = "#e8a24a", className = "" }: Props) {
  const [active, setActive] = useState<number | null>(null);
  const root = useRef<HTMLElement>(null);
  const before = useRef<Map<string, DOMRect>>(new Map());

  const snapshot = () => {
    before.current = new Map(Array.from(root.current!.querySelectorAll<HTMLElement>("[data-flip]")).map((el) => [el.dataset.flip!, el.getBoundingClientRect()]));
  };
  const choose = (i: number | null) => { snapshot(); setActive(i); };

  useLayoutEffect(() => {
    if (!before.current.size || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    root.current!.querySelectorAll<HTMLElement>("[data-flip]").forEach((el) => {
      const a = before.current.get(el.dataset.flip!);
      if (!a) return;
      const b = el.getBoundingClientRect();
      const dx = a.left - b.left, dy = a.top - b.top, s = a.height / b.height;
      if (Math.abs(dx) < 1 && Math.abs(dy) < 1 && Math.abs(s - 1) < 0.01) return;
      el.animate(
        [{ transformOrigin: "0 0", transform: `translate(${dx}px, ${dy}px) scale(${s})` }, { transformOrigin: "0 0", transform: "none" }],
        { duration: 620, easing: "cubic-bezier(0.16, 1, 0.3, 1)" },
      );
    });
    before.current.clear();
  }, [active]);

  const rest = items.map((it, i) => ({ it, i })).filter(({ i }) => i !== active);

  return (
    <section ref={root} className={`focus-faq ${className}`} style={{ "--ff-accent": accent } as CSSProperties} data-focused={active !== null || undefined}>
      <p className="focus-faq__eyebrow">{active === null ? title : `Question ${String(active + 1).padStart(2, "0")} of ${String(items.length).padStart(2, "0")}`}</p>

      {active !== null && (
        <div className="focus-faq__stage">
          <h3 className="focus-faq__heading" data-flip={`q${active}`}>{items[active].q}</h3>
          <p key={active} className="focus-faq__answer">{items[active].a}</p>
          <button type="button" className="focus-faq__back" onClick={() => choose(null)}>← All questions</button>
        </div>
      )}

      <ol className="focus-faq__list" data-compact={active !== null || undefined}>
        {rest.map(({ it, i }) => (
          <li key={i}>
            <button type="button" className="focus-faq__q" onClick={() => choose(i)}>
              <span className="focus-faq__n" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
              <span data-flip={`q${i}`} className="focus-faq__text">{it.q}</span>
              <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M4 12L12 4M6 4h6v6" /></svg>
            </button>
          </li>
        ))}
      </ol>
    </section>
  );
}
