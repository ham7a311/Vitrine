"use client";

import { useId, type CSSProperties } from "react";
import { HighlightSweep, SweepText } from "../../cursors/highlight-sweep/HighlightSweep";
import "./sweep-cards.css";

export type SweepCardTone = {
  /** Card background. */
  bg: string;
  /** Heading colour. */
  title: string;
  /** Body colour; the swept words keep it, so they stay readable on the highlight. */
  body: string;
  /** Highlight box fill and its edge. */
  mark: string;
  edge: string;
  /** The demo cursor's colour. */
  arrow: string;
};
export type SweepCard = {
  title: string;
  /** Body copy. Wrap the phrase to sweep in [[…]]. */
  body: string;
  tone: SweepCardTone;
};
export type SweepCardsProps = {
  cards: SweepCard[];
  label?: string;
  /** Delay before the first card's sweep, and between one card and the next (ms). */
  delay?: number;
  stagger?: number;
  theme?: "light" | "dark";
  motion?: "full" | "reduced";
  className?: string;
};

export const TONES = {
  sky: { bg: "#b9e4fa", title: "#0b2a45", body: "#164a6e", mark: "#38bdf8", edge: "#0ea5e9", arrow: "#0284c7" },
  mint: { bg: "#bdf5d3", title: "#0d3a22", body: "#17603a", mark: "#22d36b", edge: "#16b65b", arrow: "#15a34a" },
  butter: { bg: "#fff7c2", title: "#3d2a00", body: "#5c4300", mark: "#fcd34d", edge: "#eab308", arrow: "#d97706" },
} satisfies Record<string, SweepCardTone>;

/**
 * Sweep Cards
 * Three pastel cards, each with a question and a short answer. When they come
 * into view a demo cursor in each card's colour sweeps the phrase that
 * matters, one card after another, and leaves it highlighted. It plays once.
 */
export function SweepCards({ cards, label = "Questions and answers", delay = 500, stagger = 1150, theme = "dark", motion = "full", className = "" }: SweepCardsProps) {
  const id = useId();
  return (
    <section className={`swpc swpc--${theme} ${className}`} aria-label={label}>
      <div className="swpc__row">
        {cards.map((c, i) => (
          <article
            key={c.title}
            className="swpc__card"
            aria-labelledby={`${id}-${i}`}
            style={{ "--swpc-bg": c.tone.bg, "--swpc-title": c.tone.title, "--swpc-body": c.tone.body } as CSSProperties}
          >
            <h3 id={`${id}-${i}`} className="swpc__title">{c.title}</h3>
            <HighlightSweep
              className="swpc__sweep"
              repeat="once"
              color={c.tone.mark}
              fill={c.tone.mark}
              ring={c.tone.edge}
              ink={c.tone.body}
              arrow={c.tone.arrow}
              startDelay={delay + i * stagger}
              speed={340}
              padX={3}
              motion={motion}
            >
              <SweepText as="p" order={1} text={c.body} className="swpc__body" />
            </HighlightSweep>
          </article>
        ))}
      </div>
    </section>
  );
}
