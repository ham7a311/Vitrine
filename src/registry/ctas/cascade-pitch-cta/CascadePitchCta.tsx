"use client";

import { Fragment, useEffect, useId, useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import "./cascade-pitch-cta.css";

/**
 * Cascade Pitch CTA
 * One closing pitch that fits whoever is reading. Say who you are and the
 * headline, the line under it and the button rewrite themselves letter by
 * letter, left to right, each character turning over like a departures board
 * to the new one, so the page answers without reloading.
 */

export type Pitch = { id: string; role: string; headline: string; sub: string; action: string; href?: string };

type Props = {
  eyebrow?: string;
  pitches: Pitch[];
  defaultPitch?: string;
  theme?: "paper" | "night";
  motion?: "full" | "reduced";
  className?: string;
};

/**
 * Text that turns over to its new value. The old words roll up and out of
 * their line, letter by letter, left to right, while the new ones roll up
 * into place on their own layout a beat behind, so lines never mix mid-change.
 * Words stay together, so lines only break at spaces.
 */
function Letters({ text, kind, stagger }: { text: string; kind: "now" | "was"; stagger: number }) {
  let at = 0;
  const words = text.split(" ");
  return (
    <>
      {words.map((w, wi) => {
        const start = at;
        at += w.length + 1;
        return (
          <Fragment key={wi}>
            <span className="cpc__word">
              {Array.from(w).map((c, ci) => (
                <span key={ci} className="cpc__reel">
                  <span className={`cpc__ch cpc__ch--${kind}`} style={{ "--d": `${Math.min(start + ci, 60) * stagger}ms` } as CSSProperties}>{c}</span>
                </span>
              ))}
            </span>
            {wi < words.length - 1 ? " " : null}
          </Fragment>
        );
      })}
    </>
  );
}

function Roll({ text, from, run, stagger = 12, className = "" }: { text: string; from: string; run: number; stagger?: number; className?: string }) {
  return (
    <span className={`cpc__roll ${className}`} aria-hidden="true">
      <span key={`now-${run}`} className="cpc__now"><Letters text={text} kind="now" stagger={stagger} /></span>
      {from !== text && <span key={`was-${run}`} className="cpc__was"><Letters text={from} kind="was" stagger={stagger} /></span>}
    </span>
  );
}

export function CascadePitchCta({ eyebrow, pitches, defaultPitch, theme = "night", motion = "full", className = "" }: Props) {
  const uid = useId();
  const [id, setId] = useState(defaultPitch ?? pitches[0].id);
  const [prev, setPrev] = useState<Pitch | null>(null);
  const [run, setRun] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const p = pitches.find((x) => x.id === id) ?? pitches[0];
  const was = prev ?? p;

  // Once the roll has landed, settle: old and new are the same, so every letter takes its own width again.
  useEffect(() => {
    if (!prev) return;
    const t = setTimeout(() => setPrev(null), 1500);
    return () => clearTimeout(t);
  }, [prev, run]);

  const choose = (next: string) => {
    if (next === id) return;
    setPrev(p);
    setId(next);
    setRun((r) => r + 1);
  };
  const onKey = (e: KeyboardEvent, i: number) => {
    const n = pitches.length;
    const to = e.key === "ArrowRight" || e.key === "ArrowDown" ? (i + 1) % n : e.key === "ArrowLeft" || e.key === "ArrowUp" ? (i - 1 + n) % n : null;
    if (to === null) return;
    e.preventDefault();
    choose(pitches[to].id);
    tabs.current[to]?.focus();
  };

  return (
    <section className={`cpc cpc--${theme} ${className}`} data-motion={motion} data-run={run}>
      <div className="cpc__inner">
        {eyebrow && <p className="cpc__eyebrow">{eyebrow}</p>}
        <div className="cpc__roles" role="radiogroup" aria-label="I'm a">
          <span className="cpc__iam" aria-hidden="true">I&rsquo;m a</span>
          {pitches.map((x, i) => (
            <button
              key={x.id}
              ref={(el) => void (tabs.current[i] = el)}
              type="button"
              role="radio"
              aria-checked={x.id === id}
              tabIndex={x.id === id ? 0 : -1}
              className="cpc__role"
              onClick={() => choose(x.id)}
              onKeyDown={(e) => onKey(e, i)}
            >
              {x.role}
            </button>
          ))}
        </div>

        <h2 className="cpc__headline">
          <span className="cpc__sr">{p.headline}</span>
          <Roll text={p.headline} from={was.headline} run={run} stagger={11} />
        </h2>
        <p className="cpc__sub">
          <span className="cpc__sr">{p.sub}</span>
          <Roll text={p.sub} from={was.sub} run={run} stagger={4} />
        </p>
        <a href={p.href ?? "#"} className="cpc__action">
          <span className="cpc__sr">{p.action}</span>
          <Roll text={p.action} from={was.action} run={run} stagger={18} />
          <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 8h10M9 4l4 4-4 4" /></svg>
        </a>
        <p className="cpc__sr" aria-live="polite" id={`${uid}-said`}>{run > 0 ? p.headline : ""}</p>
      </div>
    </section>
  );
}
