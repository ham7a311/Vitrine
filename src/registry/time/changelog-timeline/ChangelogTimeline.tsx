"use client";
import { useId } from "react";
import { dayLabel } from "./timeline";
import "./changelog-timeline.css";

export type Change = { tag: "new" | "improved" | "fixed"; text: string };
export type Release = { version: string; at: Date; title: string; changes: Change[] };
export type ChangelogTimelineProps = {
  title?: string;
  releases: Release[];
  /** The reference time; pass it so server and browser render the same words. */
  now: Date;
  /** The time zone dates are read in (an IANA name); UTC by default. */
  timeZone?: string;
  theme?: "light" | "dark";
  className?: string;
};

const TAG = { new: "New", improved: "Improved", fixed: "Fixed" } as const;
function Changelog({ releases, now, tz, title, id }: { releases: Release[]; now: Date; tz: string; title: string; id: string }) {
  return (
    <>
      <header className="chgl__head"><h3 id={`${id}-t`}>{title}</h3></header>
      <ol className="chgl__releases">
        {[...releases].sort((a, b) => b.at.getTime() - a.at.getTime()).map((r, i) => (
          <li key={r.version} className="chgl__release" data-latest={i === 0 || undefined}>
            <div className="chgl__when">
              <span className="chgl__version">{r.version}</span>
              <time dateTime={r.at.toISOString()}>{dayLabel(r.at, now, tz)}</time>
            </div>
            <span className="chgl__dot" aria-hidden="true" />
            <div className="chgl__notes">
              <h4>{r.title}</h4>
              <ul>{r.changes.map((c, j) => <li key={j}><span className={`chgl__tag chgl__tag--${c.tag}`}>{TAG[c.tag]}</span>{c.text}</li>)}</ul>
            </div>
          </li>
        ))}
      </ol>
    </>
  );
}

/**
 * Changelog Timeline
 * Releases newest first: the version and day on the left, a rail with the
 * latest release marked, and a title with tagged notes (New, Improved, Fixed).
 */
export function ChangelogTimeline({ title = "Changelog", releases, now, timeZone = "UTC", theme = "light", className = "" }: ChangelogTimelineProps) {
  const id = useId();
  return (
    <section className={`chgl ${theme === "dark" ? "chgl--dark" : ""} ${className}`} aria-labelledby={`${id}-t`}>
      <Changelog releases={releases} now={now} tz={timeZone} title={title} id={id} />
    </section>
  );
}
