"use client";

import { useEffect, useMemo, useState } from "react";
import "./ribbon-changelog.css";

/**
 * Ribbon Changelog
 * Release notes on a ruled margin, with a bookmark ribbon laid where you stopped
 * reading: everything above it is new since your last visit. Filtering by
 * kind folds what doesn't match instead of removing it, and the ribbon stays
 * put in the sequence.
 */

export type ChangeKind = "new" | "improved" | "fixed";
export type Release = {
  version: string;
  /** ISO date, "2026-10-12". */
  date: string;
  title: string;
  changes: { kind: ChangeKind; text: string }[];
};

type Props = {
  releases: Release[];
  /** ISO date of the visitor's previous visit. If omitted, it is read from (and written to) localStorage. */
  lastVisit?: string;
  /** Key used when lastVisit is not given. */
  storageKey?: string;
  /** Today, as an ISO date. Defaults to the real date; set it for a stable demo. */
  today?: string;
  theme?: "paper" | "night";
  motion?: "auto" | "reduced";
  className?: string;
};

const KINDS: ChangeKind[] = ["new", "improved", "fixed"];
const LABEL: Record<ChangeKind, string> = { new: "New", improved: "Improved", fixed: "Fixed" };
const DAY = 86400000;
const day = (iso: string) => Math.floor(Date.parse(iso) / DAY);
const fmt = (iso: string) => new Date(iso + "T00:00:00Z").toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });

function ago(from: string, to: string) {
  const n = day(to) - day(from);
  if (n <= 0) return "today";
  if (n === 1) return "yesterday";
  if (n < 60) return `${n} days ago`;
  return `${Math.round(n / 30)} months ago`;
}

export function RibbonChangelog({ releases, lastVisit, storageKey = "changelog:last-visit", today, theme = "paper", motion = "auto", className = "" }: Props) {
  const [filter, setFilter] = useState<ChangeKind | "all">("all");
  const [visit, setVisit] = useState<string | undefined>(lastVisit);
  const now = today ?? new Date().toISOString().slice(0, 10);

  // Without a given last visit, remember this one for next time. Storage can be unavailable, so it is optional.
  useEffect(() => {
    if (lastVisit) return setVisit(lastVisit);
    try {
      setVisit(localStorage.getItem(storageKey) ?? undefined);
      localStorage.setItem(storageKey, now);
    } catch {}
  }, [lastVisit, storageKey, now]);

  const sorted = useMemo(() => [...releases].sort((a, b) => Date.parse(b.date) - Date.parse(a.date)), [releases]);
  const firstSeen = visit ? sorted.findIndex((r) => day(r.date) <= day(visit)) : -1;
  const unseen = visit ? (firstSeen === -1 ? sorted.length : firstSeen) : 0;
  const counts = useMemo(() => {
    const c = { all: 0, new: 0, improved: 0, fixed: 0 };
    sorted.forEach((r) => r.changes.forEach((x) => { c.all++; c[x.kind]++; }));
    return c;
  }, [sorted]);
  const ribbonAt = visit && unseen > 0 && unseen < sorted.length ? unseen : visit && unseen === sorted.length ? sorted.length : -1;

  const ribbon = visit ? (
    <li className="ribbon-changelog__ribbon" key="ribbon">
      <svg viewBox="0 0 14 22" aria-hidden="true"><path d="M0 0h14v22l-7-5-7 5z" /></svg>
      <span>You were here <time dateTime={visit}>{ago(visit, now)}</time></span>
    </li>
  ) : null;

  return (
    <section
      className={`ribbon-changelog ribbon-changelog--${theme} ${className}`}
      data-motion={motion === "reduced" ? "reduced" : undefined}
      aria-label="Changelog"
    >
      <div className="ribbon-changelog__bar">
        <div role="group" aria-label="Filter changes" className="ribbon-changelog__filters">
          {(["all", ...KINDS] as const).map((k) => (
            <button key={k} type="button" aria-pressed={filter === k} onClick={() => setFilter(k)}>
              {k === "all" ? "All" : LABEL[k]} <span>{counts[k]}</span>
            </button>
          ))}
        </div>
        {visit && (
          <p className="ribbon-changelog__since" role="status">
            {unseen === 0 ? "You are up to date" : `${unseen} ${unseen === 1 ? "release" : "releases"} since your last visit`}
          </p>
        )}
      </div>

      <ol className="ribbon-changelog__list">
        {sorted.flatMap((r, i) => {
          const match = r.changes.some((c) => filter === "all" || c.kind === filter);
          const el = (
            <li key={r.version} className="ribbon-changelog__release" data-new={visit && i < unseen ? "" : undefined} data-open={match}>
              <div className="ribbon-changelog__fold"><div>
                <article aria-labelledby={`rc-${r.version}`}>
                  <p className="ribbon-changelog__date"><time dateTime={r.date}>{fmt(r.date)}</time></p>
                  <div className="ribbon-changelog__main">
                    <h3 id={`rc-${r.version}`}><span className="ribbon-changelog__version">{r.version}</span> {r.title}</h3>
                    <ul>
                      {r.changes.map((c, k) => {
                        const on = filter === "all" || c.kind === filter;
                        return (
                          <li key={k} data-open={on}>
                            <div className="ribbon-changelog__fold"><div>
                              <p><b data-kind={c.kind}>{LABEL[c.kind]}</b>{c.text}</p>
                            </div></div>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </article>
              </div></div>
            </li>
          );
          return i === ribbonAt ? [ribbon, el] : [el];
        }).concat(ribbonAt === sorted.length ? [ribbon] : [])}
      </ol>
    </section>
  );
}
