"use client";

import { useState, type CSSProperties } from "react";
import "./cited-answer.css";

/**
 * Cited Answer
 * Citations work both ways. Point at a [2] in the answer and source 2 lifts
 * out of the row above; point at a source and every sentence it supports is
 * underlined in the answer. Evidence and claim are never more than a glance
 * apart.
 */

export type Source = { domain: string; title: string };
export type Sentence = { text: string; cites: number[] };

type Props = { question: string; sources: Source[]; answer: Sentence[]; theme?: "paper" | "night"; className?: string };

export function CitedAnswer({ question, sources, answer, theme = "paper", className = "" }: Props) {
  const [hot, setHot] = useState<number | null>(null);

  return (
    <article className={`cited-answer cited-answer--${theme} ${className}`} data-hot={hot ?? undefined}>
      <h2 className="cited-answer__q">{question}</h2>

      <p className="cited-answer__label">
        <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 4h10M3 8h10M3 12h6" /></svg>
        Sources <span>{sources.length}</span>
      </p>
      <ol className="cited-answer__sources">
        {sources.map((s, i) => (
          <li key={i} style={{ "--i": i } as CSSProperties}>
            <a
              href="#"
              className="cited-answer__source"
              data-hot={hot === i || undefined}
              onClick={(e) => e.preventDefault()}
              onMouseEnter={() => setHot(i)}
              onMouseLeave={() => setHot(null)}
              onFocus={() => setHot(i)}
              onBlur={() => setHot(null)}
            >
              <span className="cited-answer__title">{s.title}</span>
              <span className="cited-answer__domain">
                <i aria-hidden="true">{s.domain.charAt(0).toUpperCase()}</i>
                {s.domain}
                <b>{i + 1}</b>
              </span>
            </a>
          </li>
        ))}
      </ol>

      <p className="cited-answer__label">
        <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 2.5l1.4 3.6 3.6 1.4-3.6 1.4L8 12.5 6.6 8.9 3 7.5l3.6-1.4Z" /></svg>
        Answer
      </p>
      <p className="cited-answer__answer">
        {answer.map((s, k) => (
          <span key={k} className="cited-answer__sentence" data-lit={hot !== null && s.cites.includes(hot) ? "" : undefined} style={{ "--k": k } as CSSProperties}>
            {s.text}
            {s.cites.map((c) => (
              <button
                key={c}
                type="button"
                className="cited-answer__cite"
                data-hot={hot === c || undefined}
                aria-label={`Source ${c + 1}: ${sources[c]?.title}`}
                onMouseEnter={() => setHot(c)}
                onMouseLeave={() => setHot(null)}
                onFocus={() => setHot(c)}
                onBlur={() => setHot(null)}
              >
                {c + 1}
              </button>
            ))}{" "}
          </span>
        ))}
      </p>
    </article>
  );
}
