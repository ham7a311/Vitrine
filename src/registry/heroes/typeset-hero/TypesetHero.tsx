"use client";

import type { CSSProperties, ReactNode } from "react";
import "./typeset-hero.css";

/**
 * Typeset Hero
 * The first screen as a typeset page: an eyebrow, a serif headline with one italic
 * phrase, a lede, one primary and one quiet action, and a ruled row of facts
 * the visitor can check. It owns no background. Pass any as `backdrop`; a flat
 * tint of the page colour sits behind the text column only, so the backdrop
 * stays whole where there is no type.
 */

type Action = { label: string; href: string };
export type HeroFact = { term: string; value: ReactNode };

type Props = {
  eyebrow?: ReactNode;
  /** Wrap one phrase in <em> for the italic. */
  headline: ReactNode;
  lede?: ReactNode;
  primary: Action;
  secondary?: Action;
  /** Two to four true, checkable facts: version, date, licence. */
  facts?: HeroFact[];
  /** Anything that fills a box: an SVG, an image, a canvas component. */
  backdrop?: ReactNode;
  /** 0 to 1: how strongly the page colour tints the backdrop behind the text column. */
  scrim?: number;
  theme?: "paper" | "night";
  motion?: "auto" | "reduced";
  className?: string;
};

export function TypesetHero({ eyebrow, headline, lede, primary, secondary, facts, backdrop, scrim = 0.7, theme = "night", motion = "auto", className = "" }: Props) {
  return (
    <section
      className={`typeset-hero typeset-hero--${theme} ${className}`}
      style={{ "--th-scrim": scrim } as CSSProperties}
      data-motion={motion === "reduced" ? "reduced" : undefined}
    >
      {backdrop && (
        <div className="typeset-hero__backdrop" aria-hidden="true">
          {backdrop}
        </div>
      )}
      <div className="typeset-hero__scrim" aria-hidden="true" />
      <div className="typeset-hero__inner">
        <div className="typeset-hero__copy">
          {eyebrow && <p className="typeset-hero__eyebrow"><span>{eyebrow}</span></p>}
          <h1 className="typeset-hero__title"><span>{headline}</span></h1>
          {lede && <p className="typeset-hero__lede"><span>{lede}</span></p>}
          <div className="typeset-hero__actions">
            <a className="typeset-hero__primary" href={primary.href}>{primary.label}</a>
            {secondary && <a className="typeset-hero__secondary" href={secondary.href}>{secondary.label}</a>}
          </div>
        </div>
        {facts && facts.length > 0 && (
          <dl className="typeset-hero__facts" style={{ "--th-n": facts.length } as CSSProperties}>
            {facts.map((f) => (
              <div key={f.term}>
                <dt>{f.term}</dt>
                <dd>{f.value}</dd>
              </div>
            ))}
          </dl>
        )}
      </div>
    </section>
  );
}
