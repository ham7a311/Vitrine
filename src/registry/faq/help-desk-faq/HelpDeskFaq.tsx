"use client";

import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import "./help-desk-faq.css";

/**
 * Help Desk FAQ
 * A help centre in three panes: topics, the questions in that topic, and
 * the answer — like a mail client for help. Arrow keys move within a pane,
 * left and right move between panes, and every answer ends by asking
 * whether it helped. On a phone the panes become a drill-down with a way
 * back at each level.
 */

export type Article = { q: string; body: string[]; updated: string };
export type Topic = { name: string; icon: string; articles: Article[] };
type Props = { topics: Topic[]; title?: string; theme?: "paper" | "night"; motion?: "full" | "reduced"; className?: string };

const ICONS: Record<string, string> = {
  calendar: "M3 5.5h14v11H3zM3 9h14M7 3.5v3M13 3.5v3",
  card: "M2.5 5.5h15v9h-15zM2.5 8.5h15M5.5 12h3",
  person: "M10 10a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM4 16.5c.8-2.8 3.2-4 6-4s5.2 1.2 6 4",
  home: "M3.5 9.5L10 4l6.5 5.5V16h-13zM8 16v-4h4v4",
  shield: "M10 3l6 2v4.5c0 3.6-2.6 6.2-6 7.5-3.4-1.3-6-3.9-6-7.5V5z",
};

export function HelpDeskFaq({ topics, title = "Help centre", theme = "paper", motion = "full", className = "" }: Props) {
  const id = useId();
  const [t, setT] = useState(0);
  const [a, setA] = useState(0);
  const [level, setLevel] = useState<0 | 1 | 2>(0); // phone drill-down depth
  const [votes, setVotes] = useState<Record<string, "yes" | "no">>({});
  const topicRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const qRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const artRef = useRef<HTMLHeadingElement>(null);
  const topic = topics[t];
  const art = topic.articles[a];
  const key = `${t}:${a}`;

  useEffect(() => { setA(0); }, [t]);

  const roving = (e: KeyboardEvent, i: number, n: number, refs: (HTMLButtonElement | null)[], select: (i: number) => void, left?: () => void, right?: () => void) => {
    let go = -1;
    if (e.key === "ArrowDown") go = (i + 1) % n;
    else if (e.key === "ArrowUp") go = (i - 1 + n) % n;
    else if (e.key === "Home") go = 0;
    else if (e.key === "End") go = n - 1;
    else if (e.key === "ArrowRight" && right) { e.preventDefault(); right(); return; }
    else if (e.key === "ArrowLeft" && left) { e.preventDefault(); left(); return; }
    if (go < 0) return;
    e.preventDefault();
    select(go);
    refs[go]?.focus();
  };

  const toQuestions = () => { setLevel(1); requestAnimationFrame(() => qRefs.current[a]?.focus()); };
  const toArticle = () => { setLevel(2); requestAnimationFrame(() => artRef.current?.focus()); };
  const toTopics = () => { setLevel(0); requestAnimationFrame(() => topicRefs.current[t]?.focus()); };

  return (
    <section className={`hdk hdk--${theme} ${className}`} data-motion={motion} data-level={level} aria-label={title}>
      <nav className="hdk__crumbs" aria-label="Breadcrumb">
        <ol>
          <li><button type="button" onClick={toTopics}>{title}</button></li>
          <li><button type="button" onClick={toQuestions}>{topic.name}</button></li>
          <li aria-current="page"><span>{art.q}</span></li>
        </ol>
      </nav>

      <div className="hdk__panes">
        <div className="hdk__pane hdk__topics">
          <h3 className="hdk__ph" id={`${id}-t`}>Topics</h3>
          <ul aria-labelledby={`${id}-t`}>
            {topics.map((x, i) => (
              <li key={x.name}>
                <button
                  ref={(el) => { topicRefs.current[i] = el; }}
                  type="button"
                  className="hdk__row"
                  aria-current={i === t || undefined}
                  tabIndex={i === t ? 0 : -1}
                  onClick={() => { setT(i); toQuestions(); }}
                  onKeyDown={(e) => roving(e, i, topics.length, topicRefs.current, setT, undefined, () => qRefs.current[0]?.focus())}
                >
                  <svg viewBox="0 0 20 20" aria-hidden="true"><path d={ICONS[x.icon] ?? ICONS.home} /></svg>
                  <span className="hdk__rt">{x.name}</span>
                  <span className="hdk__count">{x.articles.length}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="hdk__pane hdk__qs" key={`q-${t}`}>
          <button type="button" className="hdk__back" onClick={toTopics}>← Topics</button>
          <h3 className="hdk__ph" id={`${id}-q`}>{topic.name}</h3>
          <ul aria-labelledby={`${id}-q`}>
            {topic.articles.map((x, i) => (
              <li key={x.q} style={{ ["--i" as string]: i }}>
                <button
                  ref={(el) => { qRefs.current[i] = el; }}
                  type="button"
                  className="hdk__row hdk__q"
                  aria-current={i === a || undefined}
                  tabIndex={i === a ? 0 : -1}
                  onClick={() => { setA(i); toArticle(); }}
                  onKeyDown={(e) => roving(e, i, topic.articles.length, qRefs.current, setA, () => topicRefs.current[t]?.focus(), () => artRef.current?.focus())}
                >
                  <span className="hdk__rt">{x.q}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        <article className="hdk__pane hdk__art" key={`a-${key}`} aria-labelledby={`${id}-h`} onKeyDown={(e) => { if (e.key === "ArrowLeft" && e.target === artRef.current) { e.preventDefault(); qRefs.current[a]?.focus(); } }}>
          <button type="button" className="hdk__back" onClick={toQuestions}>← {topic.name}</button>
          <p className="hdk__kicker">{topic.name}</p>
          <h3 className="hdk__h" id={`${id}-h`} ref={artRef} tabIndex={-1}>{art.q}</h3>
          {art.body.map((p, i) => <p key={i} className="hdk__p">{p}</p>)}
          <p className="hdk__updated">Updated {art.updated}</p>
          <div className="hdk__vote" role="group" aria-label="Was this helpful?">
            {votes[key] ? (
              <p className="hdk__thanks" role="status">
                {votes[key] === "yes" ? "Glad it helped." : "Thanks — we’ll make this clearer."}{" "}
                <button type="button" className="hdk__undo" onClick={() => setVotes((v) => { const n = { ...v }; delete n[key]; return n; })}>Change</button>
              </p>
            ) : (
              <>
                <span className="hdk__ask">Was this helpful?</span>
                <button type="button" className="hdk__thumb" onClick={() => setVotes((v) => ({ ...v, [key]: "yes" }))}>
                  <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M6 9v8H3V9zM6 9l3.5-6c1.4 0 2 1 1.7 2.3L10.6 8H16a1.5 1.5 0 0 1 1.5 1.8l-1.2 5.6a2 2 0 0 1-2 1.6H6" /></svg>
                  Yes
                </button>
                <button type="button" className="hdk__thumb" onClick={() => setVotes((v) => ({ ...v, [key]: "no" }))}>
                  <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M14 11V3h3v8zM14 11l-3.5 6c-1.4 0-2-1-1.7-2.3L9.4 12H4a1.5 1.5 0 0 1-1.5-1.8l1.2-5.6a2 2 0 0 1 2-1.6H14" /></svg>
                  No
                </button>
              </>
            )}
          </div>
        </article>
      </div>
    </section>
  );
}
