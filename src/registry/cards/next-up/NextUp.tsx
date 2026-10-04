"use client";

import { useLayoutEffect, useRef } from "react";
import "./next-up.css";

/**
 * Next Up
 * An event card whose composition follows its distance in time. Far off, the date
 * leads; later the same day, the title does; in the last minutes the countdown and
 * Join take over; while it runs, a line shows how much is left; afterwards the card
 * asks for notes. The same elements re-lay out between phases, so you watch one object
 * change its job rather than one card replace another.
 */

export type Phase = "far" | "today" | "soon" | "live" | "done";

type Props = {
  title: string;
  start: Date;
  end: Date;
  /** The current time, so a demo or a server clock can drive it. */
  now: Date;
  place?: string;
  people?: string;
  onJoin?: () => void;
  onNotes?: () => void;
  theme?: "paper" | "night";
  motion?: "full" | "reduced";
};

const MIN = 60_000;

export function phaseAt(now: Date, start: Date, end: Date): Phase {
  const toStart = start.getTime() - now.getTime();
  if (now >= end) return "done";
  if (now >= start) return "live";
  if (toStart <= 15 * MIN) return "soon";
  if (toStart <= 24 * 60 * MIN) return "today";
  return "far";
}

const hm = (d: Date) => d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });

function span(ms: number) {
  const m = Math.max(1, Math.round(ms / MIN));
  if (m >= 2 * 24 * 60) return `${Math.round(m / (24 * 60))} days`;
  if (m >= 24 * 60) return "1 day";
  if (m >= 60) return `${Math.floor(m / 60)} h${m % 60 ? ` ${m % 60} min` : ""}`;
  return `${m} min`;
}

export function NextUp({ title, start, end, now, place, people, onJoin, onNotes, theme = "paper", motion = "full" }: Props) {
  const phase = phaseAt(now, start, end);
  const root = useRef<HTMLElement>(null);
  const last = useRef<{ phase: Phase; rects: Map<string, DOMRect> } | null>(null);

  const lead =
    phase === "far" ? `in ${span(start.getTime() - now.getTime())}` : phase === "today" ? `in ${span(start.getTime() - now.getTime())}` : phase === "soon" ? span(start.getTime() - now.getTime()) : phase === "live" ? `${span(end.getTime() - now.getTime())} left` : `Ended ${span(now.getTime() - end.getTime())} ago`;
  const progress = phase === "live" ? (now.getTime() - start.getTime()) / (end.getTime() - start.getTime()) : phase === "done" ? 1 : 0;

  // FLIP between phases: the same title, time, lead and action travel to their new places.
  useLayoutEffect(() => {
    const el = root.current;
    if (!el) return;
    const parts = Array.from(el.querySelectorAll<HTMLElement>("[data-part]"));
    const prev = last.current;
    const reduce = motion === "reduced" || window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const now = new Map(parts.map((p) => [p.dataset.part!, p.getBoundingClientRect()]));
    if (prev && prev.phase !== phase && !reduce) {
      parts.forEach((p) => {
        const a = prev.rects.get(p.dataset.part!);
        const b = now.get(p.dataset.part!);
        if (!a || !b || (a.width === 0 && a.height === 0)) return;
        const dx = a.left - b.left;
        const dy = a.top - b.top;
        if (Math.abs(dx) < 1 && Math.abs(dy) < 1) return;
        p.getAnimations().forEach((x) => x.id === "nu-flip" && x.cancel());
        p.animate([{ transform: `translate(${dx}px, ${dy}px)` }, { transform: "none" }], { id: "nu-flip", duration: 480, easing: "cubic-bezier(0.2, 0.8, 0.2, 1)" });
      });
    }
    last.current = { phase, rects: now };
  }, [phase, motion]);

  const day = start.toLocaleDateString("en-GB", { day: "numeric" });
  const month = start.toLocaleDateString("en-GB", { month: "short" });
  const weekday = start.toLocaleDateString("en-GB", { weekday: "long" });
  const canJoin = phase === "soon" || phase === "live";

  return (
    <section ref={root} className={`next-up next-up--${theme}`} data-phase={phase} data-motion={motion} aria-label={`Next up: ${title}`}>
      <div data-part="date" className="next-up__date" aria-hidden={phase !== "far"}>
        <span className="next-up__day">{day}</span>
        <span className="next-up__month">{month}</span>
      </div>
      <h3 data-part="title" className="next-up__title">
        {title}
      </h3>
      <p data-part="meta" className="next-up__meta">
        <span className="next-up__when">{phase === "far" ? `${weekday}, ${hm(start)}–${hm(end)}` : `${hm(start)}–${hm(end)}`}</span>
        {place && <span> · {place}</span>}
        {people && phase !== "soon" && phase !== "live" && <span> · {people}</span>}
      </p>
      <p data-part="lead" className="next-up__lead" aria-hidden="true">
        {lead}
      </p>
      <div data-part="track" className="next-up__track" aria-hidden="true">
        <span style={{ transform: `scaleX(${progress})` }} />
      </div>
      {phase === "done" ? (
        <button data-part="action" type="button" className="next-up__action next-up__action--quiet" onClick={onNotes}>
          <svg viewBox="0 0 16 16" aria-hidden="true">
            <path d="M3.5 8.5l3 3 6-7" />
          </svg>
          Add notes
        </button>
      ) : canJoin ? (
        <button data-part="action" type="button" className="next-up__action next-up__action--primary" onClick={onJoin}>
          {phase === "live" ? "Join now" : "Join"}
        </button>
      ) : (
        <button data-part="action" type="button" className="next-up__action next-up__action--quiet" onClick={onJoin}>
          Details
        </button>
      )}
      <p className="next-up__sr" role="status">
        {phase === "soon" ? `${title} starts in ${span(start.getTime() - now.getTime())}.` : phase === "live" ? `${title} is on now, ${lead}.` : ""}
      </p>
    </section>
  );
}
