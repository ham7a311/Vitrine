"use client";

import { useId, useMemo, useState, type MouseEvent } from "react";
import { nearest, normalise, type Mark, type Route } from "./nearest";
import "./nearest-page.css";

/**
 * Nearest Page
 * A not-found page that does the looking for you. It takes the address that
 * failed, ranks the real pages by edit distance, and shows the closest few with
 * the characters that differ marked on both sides, so you can see it was a
 * typo, not a mystery. A plain search box sits beneath for everything else.
 */

type Props = {
  /** The path that wasn't found: "/work/walley". */
  path: string;
  /** Every real page. */
  routes: Route[];
  /** Called instead of following the link, for client routing. */
  onNavigate?: (path: string) => void;
  /** Shown when nothing is close. */
  startHere?: Route[];
  theme?: "paper" | "night";
  motion?: "auto" | "reduced";
  className?: string;
};

function Marked({ marks, kind }: { marks: Mark[]; kind: "asked" | "found" }) {
  return (
    <>
      {marks.map((m, i) => (m.changed ? <mark key={i} data-kind={kind}>{m.ch}</mark> : m.ch))}
    </>
  );
}

const off = (n: number) => (n === 1 ? "1 character off" : `${n} characters off`);

export function NearestPage({ path, routes, onNavigate, startHere, theme = "paper", motion = "auto", className = "" }: Props) {
  const uid = useId();
  const [q, setQ] = useState("");
  const matches = useMemo(() => nearest(path, routes), [path, routes]);
  const asked = normalise(path);

  const results = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return [];
    return routes.filter((r) => r.title.toLowerCase().includes(t) || r.path.toLowerCase().includes(t)).slice(0, 5);
  }, [q, routes]);

  const go = (p: string) => (e: MouseEvent) => {
    if (!onNavigate) return;
    e.preventDefault();
    onNavigate(p);
  };

  const list = q.trim() ? null : matches;
  const fallback = startHere ?? routes.slice(0, 3);

  return (
    <main className={`nearest-page nearest-page--${theme} ${className}`} data-motion={motion === "reduced" ? "reduced" : undefined}>
      <p className="nearest-page__eyebrow">404 · Not found</p>
      <h1 className="nearest-page__title">That address doesn't exist.</h1>

      <p className="nearest-page__cap" id={`${uid}-asked`}>You asked for</p>
      <p className="nearest-page__asked" aria-labelledby={`${uid}-asked`}>
        <code>
          {matches[0] ? <Marked marks={matches[0].asked} kind="asked" /> : asked}
        </code>
      </p>

      <p className="nearest-page__cap" id={`${uid}-list`}>
        {q.trim() ? "Search results" : matches.length ? "Closest pages that do" : "Nothing close. Start here"}
      </p>
      <ol className="nearest-page__list" aria-labelledby={`${uid}-list`} aria-live="polite">
        {(list ?? []).map((m, i) => (
          <li key={m.route.path} data-best={i === 0 || undefined} style={{ "--i": i } as React.CSSProperties}>
            <a href={m.route.path} onClick={go(m.route.path)}>
              <span className="nearest-page__n">{String(i + 1).padStart(2, "0")}</span>
              <code className="nearest-page__path"><Marked marks={m.found} kind="found" /></code>
              <span className="nearest-page__name">{m.route.title}</span>
              <span className="nearest-page__off">{off(m.distance)}</span>
            </a>
          </li>
        ))}
        {!q.trim() && matches.length === 0 && fallback.map((r, i) => (
          <li key={r.path} style={{ "--i": i } as React.CSSProperties}>
            <a href={r.path} onClick={go(r.path)}>
              <span className="nearest-page__n">{String(i + 1).padStart(2, "0")}</span>
              <code className="nearest-page__path">{r.path}</code>
              <span className="nearest-page__name">{r.title}</span>
              <span className="nearest-page__off" />
            </a>
          </li>
        ))}
        {results.map((r, i) => (
          <li key={r.path} style={{ "--i": i } as React.CSSProperties}>
            <a href={r.path} onClick={go(r.path)}>
              <span className="nearest-page__n">{String(i + 1).padStart(2, "0")}</span>
              <code className="nearest-page__path">{r.path}</code>
              <span className="nearest-page__name">{r.title}</span>
              <span className="nearest-page__off" />
            </a>
          </li>
        ))}
        {q.trim() && results.length === 0 && <li className="nearest-page__none">Nothing matches “{q.trim()}”.</li>}
      </ol>

      <div className="nearest-page__search">
        <label htmlFor={`${uid}-q`}>Or search the site</label>
        <input id={`${uid}-q`} type="search" value={q} placeholder="Masar, writing, contact" autoComplete="off" onChange={(e) => setQ(e.target.value)} />
      </div>
    </main>
  );
}
