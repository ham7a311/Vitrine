"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode, type RefObject } from "react";
import "./running-head.css";

/**
 * Running Head
 * A section header set like a chapter opening: index, a rule that draws once,
 * the heading as a sentence, a lede and a count. When it scrolls away, a
 * compact running head, like the one at the top of a book page, stays pinned
 * for as long as you are inside the section, then leaves with it, so the next
 * section's head takes over.
 *
 * Place it as the first child of the element that holds the section.
 */

type Props = {
  /** "02" — set in mono, and repeated in the running head. */
  index: string;
  /** Short name for the pinned head. Defaults to the title. */
  label?: string;
  title: ReactNode;
  lede?: ReactNode;
  /** Right-aligned fact about the section: "Four of twenty-one". */
  meta?: ReactNode;
  /** Element that scrolls. Defaults to the window. */
  scrollRef?: RefObject<HTMLElement | null>;
  /** Distance from the top of the scroller where the running head pins (e.g. below a sticky navbar). */
  stickyTop?: number;
  as?: "h1" | "h2" | "h3";
  theme?: "paper" | "night";
  motion?: "auto" | "reduced";
  className?: string;
};

export function RunningHead({ index, label, title, lede, meta, scrollRef, stickyTop = 0, as: Tag = "h2", theme = "paper", motion = "auto", className = "" }: Props) {
  const head = useRef<HTMLElement>(null);
  const [stuck, setStuck] = useState(false);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const el = head.current;
    if (!el) return;
    const root = scrollRef?.current ?? null;
    // The head counts as gone once its bottom edge has passed the pin line.
    const io = new IntersectionObserver(
      ([e]) => {
        const line = (e.rootBounds?.top ?? 0) + stickyTop;
        setStuck(!e.isIntersecting && e.boundingClientRect.bottom <= line + 1);
        if (e.isIntersecting) setSeen(true);
      },
      { root, rootMargin: `${-stickyTop}px 0px 0px 0px`, threshold: [0, 1] },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [scrollRef, stickyTop]);

  return (
    <>
      <div
        className={`running-head__pin running-head--${theme} ${className}`}
        style={{ "--rh-top": `${stickyTop}px` } as CSSProperties}
        data-stuck={stuck || undefined}
        data-motion={motion === "reduced" ? "reduced" : undefined}
        aria-hidden="true"
      >
        <div className="running-head__bar">
          <span className="running-head__num">{index}</span>
          <span className="running-head__label">{label ?? (typeof title === "string" ? title : "")}</span>
          {meta && <span className="running-head__bar-meta">{meta}</span>}
        </div>
      </div>

      <header
        ref={head}
        className={`running-head running-head--${theme} ${className}`}
        data-seen={seen || undefined}
        data-motion={motion === "reduced" ? "reduced" : undefined}
      >
        <div className="running-head__top">
          <span className="running-head__num">{index}</span>
          <span className="running-head__rule" aria-hidden="true" />
          {meta && <span className="running-head__meta">{meta}</span>}
        </div>
        <Tag className="running-head__title">{title}</Tag>
        {lede && <p className="running-head__lede">{lede}</p>}
      </header>
    </>
  );
}
