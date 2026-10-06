"use client";
import { useId, useState, type ReactNode } from "react";
import { ago, clock, dayLabel, groupByDay } from "./timeline";
import "./activity-timeline.css";

export type EventKind = "deploy" | "merge" | "comment" | "alert" | "invite" | "release";
export type ActivityEvent = {
  id: string;
  kind: EventKind;
  who: string;
  action: string;
  target: string;
  /** Words after the target ("to Production"). */
  where?: string;
  at: Date;
  status?: "ok" | "fail" | "running";
  /** Expandable detail, shown in mono (a log excerpt, a comment). */
  detail?: string;
};

export type ActivityTimelineProps = {
  title?: string;
  events: ActivityEvent[];
  /** The reference time; pass it so server and browser render the same words. */
  now: Date;
  /** The time zone dates are read in (an IANA name); UTC by default. */
  timeZone?: string;
  /** Show the "live" marker. */
  live?: boolean;
  theme?: "light" | "dark";
  className?: string;
};

const KIND: Record<EventKind, { label: string; filter: string; icon: ReactNode }> = {
  deploy: { label: "Deploy", filter: "Deploys", icon: <svg viewBox="0 0 16 16"><path d="M8 2.2 14 13H2Z" fill="currentColor" /></svg> },
  merge: { label: "Merge", filter: "Code", icon: <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="4.5" cy="3.5" r="1.6" /><circle cx="4.5" cy="12.5" r="1.6" /><circle cx="11.5" cy="8" r="1.6" /><path d="M4.5 5.1v5.8M4.5 5.5c0 2.5 2.3 2.5 5.4 2.5" /></svg> },
  comment: { label: "Comment", filter: "Comments", icon: <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"><path d="M2.5 3h11v7.5H7L4 13v-2.5H2.5Z" /></svg> },
  alert: { label: "Alert", filter: "Alerts", icon: <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M8 4v4.6M8 11.4v.1" strokeWidth="2" /></svg> },
  invite: { label: "Member", filter: "Team", icon: <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><circle cx="6.5" cy="5.5" r="2.4" /><path d="M2 13c.6-2.4 2.3-3.6 4.5-3.6S10.4 10.6 11 13M12.5 5v4M10.5 7h4" /></svg> },
  release: { label: "Release", filter: "Code", icon: <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"><path d="M2.5 8.6V2.5h6.1l5 5-6.1 6.1Z" /><circle cx="5.6" cy="5.6" r="1" fill="currentColor" stroke="none" /></svg> },
};
const STATUS = { ok: "Ready", fail: "Failed", running: "Building" } as const;
const initials = (name: string) => name.split(/\s+/).map((p) => p[0]).slice(0, 2).join("").toUpperCase();

function Activity({ events, now, tz, live, title, id }: { events: ActivityEvent[]; now: Date; tz: string; live?: boolean; title: string; id: string }) {
  const filters = ["All", ...Array.from(new Set(events.map((e) => KIND[e.kind].filter)))];
  const [filter, setFilter] = useState("All");
  const [open, setOpen] = useState<string | null>(null);
  const shown = events.filter((e) => filter === "All" || KIND[e.kind].filter === filter);
  return (
    <>
      <header className="actl__head">
        <h3 id={`${id}-t`}>{title}</h3>
        {live && <span className="actl__live"><i aria-hidden="true" />Live</span>}
        <div className="actl__filters" role="group" aria-label="Show">
          {filters.map((f) => <button key={f} type="button" aria-pressed={filter === f} onClick={() => setFilter(f)}>{f}</button>)}
        </div>
      </header>
      <div aria-live="polite" aria-relevant="additions" className="actl__groups">
        {groupByDay(shown, now, tz).map((g) => (
          <section key={g.label} className="actl__day" aria-label={g.label}>
            <h4>{g.label}</h4>
            <ol className="actl__list">
              {g.items.map((e) => {
                const k = KIND[e.kind];
                const isOpen = open === e.id;
                return (
                  <li key={e.id} className={`actl__item actl__item--${e.kind}`} data-status={e.status}>
                    <span className="actl__node" aria-hidden="true">{e.kind === "comment" ? <b>{initials(e.who)}</b> : k.icon}</span>
                    <div className="actl__body">
                      <p>
                        <strong>{e.who}</strong> {e.action} <span className="actl__target">{e.target}</span>{e.where ? ` ${e.where}` : ""}
                        {e.status && <span className={`actl__status actl__status--${e.status}`}>{STATUS[e.status]}</span>}
                      </p>
                      <time dateTime={e.at.toISOString()} title={`${dayLabel(e.at, now, tz)}, ${clock(e.at, tz)}`}>{ago(e.at, now, tz)}</time>
                      {e.detail && (
                        <>
                          <button type="button" className="actl__more" aria-expanded={isOpen} aria-controls={`${id}-${e.id}`} onClick={() => setOpen(isOpen ? null : e.id)}>
                            {isOpen ? "Hide details" : e.kind === "comment" ? "Show comment" : "Show details"}
                          </button>
                          <div id={`${id}-${e.id}`} className="actl__detail" hidden={!isOpen}><pre>{e.detail}</pre></div>
                        </>
                      )}
                    </div>
                  </li>
                );
              })}
            </ol>
          </section>
        ))}
        {!shown.length && <p className="actl__empty">Nothing here yet.</p>}
      </div>
    </>
  );
}

/**
 * Activity Timeline
 * A live activity feed grouped by day: icon and avatar nodes on a rail, status
 * chips, filters, relative times, and details that expand in place.
 */
export function ActivityTimeline({ title = "Activity", events, now, timeZone = "UTC", live, theme = "light", className = "" }: ActivityTimelineProps) {
  const id = useId();
  return (
    <section className={`actl ${theme === "dark" ? "actl--dark" : ""} ${className}`} aria-labelledby={`${id}-t`}>
      <Activity events={events} now={now} tz={timeZone} live={live} title={title} id={id} />
    </section>
  );
}
