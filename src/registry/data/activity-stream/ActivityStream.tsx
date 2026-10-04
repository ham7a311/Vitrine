"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState, type CSSProperties, type KeyboardEvent as ReactKeyboardEvent, type ReactNode } from "react";
import "./activity-stream.css";

/**
 * Activity Stream
 * An activity log where time has weight. The space between two events grows
 * with the time between them, so a busy half hour reads dense and a quiet
 * afternoon reads as a pause — you see the rhythm of the day before you read a
 * word. Days are set like an editorial margin; runs of the same thing by the
 * same person fold into one line; a focused event opens in place.
 */

export type ActivityKind = "deploy" | "comment" | "upload" | "assign" | "status" | "approve";
export type Activity = {
  id: string;
  at: number;
  actor: string;
  kind: ActivityKind;
  /** The sentence after the actor's name, e.g. <>deployed <b>vitrine-web</b> to Production</> */
  text: ReactNode;
  /** Used when several events fold together: "uploaded 4 files to Wayfinder". */
  groupText?: (n: number) => ReactNode;
  groupKey?: string;
  status?: { label: string; tone: "ok" | "warn" | "bad" | "neutral" };
  detail?: ReactNode;
};

type Props = {
  events: Activity[];
  now: number;
  loading?: boolean;
  empty?: ReactNode;
  label?: string;
  theme?: "paper" | "night";
};

const MIN = 60_000;
const GLYPH: Record<ActivityKind, string> = {
  deploy: "M8 2.5l4.5 8h-9zM8 10.5v3",
  comment: "M3 3.5h10v7H7l-3 2.5v-2.5H3z",
  upload: "M8 11V3.5M5 6.5l3-3 3 3M3.5 10.5v2.5h9v-2.5",
  assign: "M8 7.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5zM3.5 13.5c.6-2.4 2.3-3.5 4.5-3.5s3.9 1.1 4.5 3.5",
  status: "M3 8h8M8.5 5l3 3-3 3",
  approve: "M3.5 8.5l3 3 6-7",
};

const dayKey = (t: number) => new Date(t).toDateString();
const clock = (t: number) => new Date(t).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
function relative(t: number, now: number) {
  const m = Math.round((now - t) / MIN);
  if (m < 1) return "now";
  if (m < 60) return `${m} min`;
  return clock(t);
}
/** The space before an event: logarithmic in the minutes since the one above it. */
const gapFor = (minutes: number) => Math.round(Math.min(56, Math.max(2, 7 * Math.log2(1 + minutes / 6))));
function quiet(minutes: number) {
  if (minutes < 90) return null;
  const h = Math.round(minutes / 60);
  return `${h} ${h === 1 ? "hour" : "hours"} quiet`;
}

type Row = { key: string; items: Activity[]; gap: number; pause: string | null };

export function ActivityStream({ events, now, loading = false, empty, label = "Activity", theme = "paper" }: Props) {
  const [open, setOpen] = useState<string | null>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const rects = useRef(new Map<string, number>());
  const seen = useRef<Set<string> | null>(null);
  const [fresh, setFresh] = useState<Set<string>>(new Set());

  // Newest first; fold consecutive events that share a groupKey within 30 minutes.
  const days = useMemo(() => {
    const sorted = [...events].sort((a, b) => b.at - a.at);
    const out: { key: string; date: number; rows: Row[] }[] = [];
    for (const e of sorted) {
      let day = out[out.length - 1];
      if (!day || day.key !== dayKey(e.at)) {
        day = { key: dayKey(e.at), date: e.at, rows: [] };
        out.push(day);
      }
      const last = day.rows[day.rows.length - 1];
      const lastItem = last?.items[last.items.length - 1];
      if (last && e.groupKey && lastItem.groupKey === e.groupKey && lastItem.actor === e.actor && lastItem.at - e.at < 30 * MIN) {
        last.items.push(e);
        continue;
      }
      const minutes = lastItem ? (lastItem.at - e.at) / MIN : 0;
      day.rows.push({ key: e.id, items: [e], gap: last ? gapFor(minutes) : 0, pause: last ? quiet(minutes) : null });
    }
    return out;
  }, [events]);

  // Mark events that arrived after first render so they can enter.
  useEffect(() => {
    if (!seen.current) {
      seen.current = new Set(events.map((e) => e.id));
      return;
    }
    const added = events.filter((e) => !seen.current!.has(e.id)).map((e) => e.id);
    added.forEach((id) => seen.current!.add(id));
    if (added.length) {
      setFresh(new Set(added));
      const t = window.setTimeout(() => setFresh(new Set()), 2400);
      return () => window.clearTimeout(t);
    }
  }, [events]);

  // FLIP: the stream moves down to make room rather than jumping.
  useLayoutEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    list.querySelectorAll<HTMLElement>("[data-row]").forEach((el) => {
      const key = el.dataset.row!;
      const top = el.getBoundingClientRect().top + list.scrollTop;
      const was = rects.current.get(key);
      if (was !== undefined && !reduce && Math.abs(was - top) > 1) el.animate([{ transform: `translateY(${was - top}px)` }, { transform: "none" }], { duration: 420, easing: "cubic-bezier(0.2, 0.8, 0.2, 1)" });
      rects.current.set(key, top);
    });
  });

  const onKey = (e: ReactKeyboardEvent) => {
    if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
    const btns = Array.from(listRef.current?.querySelectorAll<HTMLElement>(".activity-stream__event:not(:disabled)") ?? []);
    const i = btns.indexOf(document.activeElement as HTMLElement);
    if (i < 0) return;
    e.preventDefault();
    btns[Math.max(0, Math.min(btns.length - 1, i + (e.key === "ArrowDown" ? 1 : -1)))]?.focus();
  };

  const today = dayKey(now);
  const yesterday = dayKey(now - 86_400_000);

  if (loading)
    return (
      <div className={`activity-stream activity-stream--${theme}`} aria-busy="true" aria-label={label}>
        {[0, 1].map((d) => (
          <section key={d} className="activity-stream__day" aria-hidden="true">
            <div className="activity-stream__rail">
              <span className="activity-stream__ph" style={{ width: 44, height: 40 }} />
            </div>
            <div className="activity-stream__rows">
              {[64, 48, 72, 40].map((w, i) => (
                <div key={i} className="activity-stream__ph-row" style={{ marginTop: i ? 10 + ((i * 13) % 22) : 0 }}>
                  <span className="activity-stream__ph" style={{ width: 36 }} />
                  <span className="activity-stream__ph" style={{ width: `${w}%` }} />
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    );

  if (!events.length)
    return (
      <div className={`activity-stream activity-stream--${theme}`} aria-label={label}>
        <div className="activity-stream__empty">{empty ?? <p>Nothing has happened yet.</p>}</div>
      </div>
    );

  return (
    <div ref={listRef} className={`activity-stream activity-stream--${theme}`} role="feed" aria-label={label} onKeyDown={onKey}>
      {days.map((day) => {
        const d = new Date(day.date);
        const name = day.key === today ? "Today" : day.key === yesterday ? "Yesterday" : d.toLocaleDateString("en-GB", { weekday: "long" });
        return (
          <section key={day.key} className="activity-stream__day" aria-label={`${name}, ${d.toLocaleDateString("en-GB", { day: "numeric", month: "long" })}`}>
            <div className="activity-stream__rail" aria-hidden="true">
              <span className="activity-stream__numeral">{d.getDate()}</span>
              <span className="activity-stream__dayname">{name}</span>
              <span className="activity-stream__month">{d.toLocaleDateString("en-GB", { month: "long" })}</span>
            </div>
            <ol className="activity-stream__rows">
              {day.rows.map((row) => {
                const first = row.items[0];
                const many = row.items.length > 1;
                const isOpen = open === row.key;
                const detail = many ? (
                  <ul className="activity-stream__folded">
                    {row.items.map((it) => (
                      <li key={it.id}>
                        <span className="activity-stream__time">{clock(it.at)}</span>
                        <span>{it.text}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  first.detail
                );
                return (
                  <li
                    key={row.key}
                    data-row={row.key}
                    className="activity-stream__row"
                    data-fresh={fresh.has(first.id) || undefined}
                    data-open={isOpen || undefined}
                    style={{ "--as-gap": `${row.gap}px` } as CSSProperties}
                  >
                    {row.pause && (
                      <p className="activity-stream__pause" aria-hidden="true">
                        {row.pause}
                      </p>
                    )}
                    <article aria-labelledby={`${row.key}-t`}>
                      <button
                        type="button"
                        className="activity-stream__event"
                        aria-expanded={detail ? isOpen : undefined}
                        disabled={!detail}
                        onClick={() => setOpen(isOpen ? null : row.key)}
                      >
                        <span className="activity-stream__time" title={new Date(first.at).toLocaleString("en-GB")}>
                          {day.key === today && now - first.at < 60 * MIN ? relative(first.at, now) : clock(first.at)}
                        </span>
                        <span className="activity-stream__mark" data-kind={first.kind} aria-hidden="true">
                          <svg viewBox="0 0 16 16">
                            <path d={GLYPH[first.kind]} />
                          </svg>
                        </span>
                        <span id={`${row.key}-t`} className="activity-stream__text">
                          <b>{first.actor}</b> {many && first.groupText ? first.groupText(row.items.length) : first.text}
                          {first.status && (
                            <span className="activity-stream__status" data-tone={first.status.tone}>
                              {first.status.label}
                            </span>
                          )}
                        </span>
                      </button>
                      {detail && (
                        <div className="activity-stream__detail" data-open={isOpen || undefined}>
                          <div>{isOpen && detail}</div>
                        </div>
                      )}
                    </article>
                  </li>
                );
              })}
            </ol>
          </section>
        );
      })}
    </div>
  );
}
