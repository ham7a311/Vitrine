"use client";
import { useId } from "react";
import { railProgress, shortDate } from "./timeline";
import "./milestone-timeline.css";

export type Milestone = { title: string; at: Date; note?: string };
export type MilestoneTimelineProps = {
  title?: string;
  milestones: Milestone[];
  /** The reference time; pass it so server and browser render the same words. */
  now: Date;
  /** The time zone dates are read in (an IANA name); UTC by default. */
  timeZone?: string;
  theme?: "light" | "dark";
  className?: string;
};

function Milestones({ milestones, now, tz, title, id }: { milestones: Milestone[]; now: Date; tz: string; title: string; id: string }) {
  const ms = [...milestones].sort((a, b) => a.at.getTime() - b.at.getTime());
  const p = railProgress(ms.map((m) => m.at), now);
  const span = Math.max(1, ms.length - 1);
  // Passed milestones are done; the next one ahead is the one in progress.
  const next = ms.findIndex((m) => m.at.getTime() > now.getTime());
  return (
    <>
      <header className="mltl__head"><h3 id={`${id}-t`}>{title}</h3><span className="mltl__sub">{Math.round((p / span) * 100)}% of the plan</span></header>
      <div className="mltl__scroll" tabIndex={0} role="region" aria-label={`${title}, scrollable`}>
        <ol className="mltl__steps" style={{ ["--mltl-n" as string]: ms.length, ["--mltl-p" as string]: p / span }}>
          {ms.map((m, i) => {
            const state = next === -1 || i < next ? "done" : i === next ? "now" : "next";
            return (
              <li key={m.title} className="mltl__step" data-state={state} aria-current={state === "now" ? "step" : undefined}>
                <span className="mltl__pin" aria-hidden="true">{state === "done" && <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 6.3 2 2 4-4.6" /></svg>}</span>
                <strong>{m.title}</strong>
                <time dateTime={m.at.toISOString()}>{shortDate(m.at, tz)}</time>
                {m.note && <small>{m.note}</small>}
                <span className="mltl__sr">{state === "done" ? "Done" : state === "now" ? "In progress" : "Upcoming"}</span>
              </li>
            );
          })}
        </ol>
      </div>
    </>
  );
}

/**
 * Milestone Timeline
 * A horizontal plan: a pin for each milestone on a line that is filled up to
 * today, with passed milestones ticked and the next one ahead marked.
 */
export function MilestoneTimeline({ title = "Roadmap", milestones, now, timeZone = "UTC", theme = "light", className = "" }: MilestoneTimelineProps) {
  const id = useId();
  return (
    <section className={`mltl ${theme === "dark" ? "mltl--dark" : ""} ${className}`} aria-labelledby={`${id}-t`}>
      <Milestones milestones={milestones} now={now} tz={timeZone} title={title} id={id} />
    </section>
  );
}
