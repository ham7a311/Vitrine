"use client";

import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent as ReactPointerEvent } from "react";
import "./day-planner.css";

/**
 * Day Planner
 * Schedule your day. Tasks have weight: drag one from the tray onto the day and it takes up exactly its
 * length, so you can see whether everything fits before the day starts. The time still unplanned is always
 * totalled, and the tray says outright when what is left no longer fits.
 */

export type PlannerTask = { id: string; title: string; minutes: number; tone?: "a" | "b" | "c" };
export type PlannerEvent = { title: string; start: number; end: number };
export type DayPlannerProps = {
  tasks: PlannerTask[];
  /** Meetings and other things that cannot move. Times are minutes from midnight. */
  fixed?: PlannerEvent[];
  /** Where each planned task starts, by id. */
  defaultPlan?: Record<string, number>;
  start?: number;
  end?: number;
  /** The current time, in minutes from midnight, for the "now" line. */
  now?: number;
  heading?: string;
  theme?: "light" | "dark";
  onChange?: (plan: Record<string, number>) => void;
  className?: string;
};

const STEP = 15;
export const clock = (min: number) => `${String(Math.floor(min / 60)).padStart(2, "0")}:${String(min % 60).padStart(2, "0")}`;
export const span = (min: number) => (min >= 60 ? `${Math.floor(min / 60)}h${min % 60 ? ` ${min % 60}m` : ""}` : `${min}m`);

/** The earliest start at or after `from` where `minutes` fit between the things already there. */
export function firstFit(minutes: number, busy: [number, number][], from: number, end: number) {
  for (let at = Math.ceil(from / STEP) * STEP; at + minutes <= end; at += STEP) {
    if (busy.every(([s, e]) => at + minutes <= s || at >= e)) return at;
  }
  return null;
}

type Drag = { id: string; grab: number; x: number; y: number; at: number | null; moved: boolean; startX: number; startY: number };

export function DayPlanner({ tasks, fixed = [], defaultPlan = {}, start = 480, end = 1080, now, heading = "Today", theme = "light", onChange, className = "" }: DayPlannerProps) {
  const [plan, setPlan] = useState<Record<string, number>>(defaultPlan);
  const [drag, setDrag] = useState<Drag | null>(null);
  const [said, setSaid] = useState("");
  const day = useRef<HTMLDivElement>(null);
  const live = useRef({ plan, drag });
  live.current = { plan, drag };

  const byId = new Map(tasks.map((t) => [t.id, t]));
  const busy = (skip?: string, from = plan): [number, number][] => [
    ...fixed.map((f): [number, number] => [f.start, f.end]),
    ...Object.entries(from).filter(([id]) => id !== skip && byId.has(id)).map(([id, at]): [number, number] => [at, at + byId.get(id)!.minutes]),
  ];
  const fits = (id: string, at: number) => at >= start && at + byId.get(id)!.minutes <= end && busy(id).every(([s, e]) => at + byId.get(id)!.minutes <= s || at >= e);
  const commit = (next: Record<string, number>, message: string) => { setPlan(next); setSaid(message); onChange?.(next); };
  const place = (id: string, at: number) => commit({ ...plan, [id]: at }, `${byId.get(id)!.title} at ${clock(at)}`);
  const unplace = (id: string) => { const { [id]: _, ...rest } = plan; commit(rest, `${byId.get(id)!.title} back in the tray`); };
  const placeFirst = (id: string) => {
    const at = firstFit(byId.get(id)!.minutes, busy(id), Math.max(start, now ?? start), end) ?? firstFit(byId.get(id)!.minutes, busy(id), start, end);
    if (at === null) setSaid(`No gap long enough for ${byId.get(id)!.title}`);
    else place(id, at);
  };

  // One listener pair for the whole drag, reading the latest state through a ref.
  const dragging = !!drag;
  useEffect(() => {
    if (!dragging) return;
    const onMove = (e: PointerEvent) => {
      const d = live.current.drag, rect = day.current?.getBoundingClientRect();
      if (!d || !rect) return;
      const hour = rect.height / ((end - start) / 60);
      const over = e.clientX >= rect.left - 24 && e.clientX <= rect.right + 24 && e.clientY >= rect.top - 24 && e.clientY <= rect.bottom + 24;
      const raw = start + Math.round((((e.clientY - d.grab - rect.top) / hour) * 60) / STEP) * STEP;
      const at = over ? Math.max(start, Math.min(end - byId.get(d.id)!.minutes, raw)) : null;
      setDrag({ ...d, x: e.clientX, y: e.clientY, at, moved: d.moved || Math.hypot(e.clientX - d.startX, e.clientY - d.startY) > 5 });
    };
    const onUp = () => {
      const d = live.current.drag;
      setDrag(null);
      if (!d) return;
      if (!d.moved) { if (!(d.id in live.current.plan)) placeFirst(d.id); return; }
      if (d.at === null) { if (d.id in live.current.plan) unplace(d.id); }
      else if (fits(d.id, d.at)) place(d.id, d.at);
      else setSaid(`${byId.get(d.id)!.title} does not fit at ${clock(d.at)}`);
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
    return () => { window.removeEventListener("pointermove", onMove); window.removeEventListener("pointerup", onUp); window.removeEventListener("pointercancel", onUp); };
  }, [dragging]); // eslint-disable-line react-hooks/exhaustive-deps

  const grab = (id: string) => (e: ReactPointerEvent<HTMLElement>) => {
    if (e.button !== 0 || (e.target as HTMLElement).closest("[data-remove]")) return;
    const r = e.currentTarget.getBoundingClientRect();
    setDrag({ id, grab: id in plan ? e.clientY - r.top : 12, x: e.clientX, y: e.clientY, at: null, moved: false, startX: e.clientX, startY: e.clientY });
  };
  const onBlockKey = (id: string) => (e: KeyboardEvent) => {
    const by = { ArrowUp: -STEP, ArrowDown: STEP }[e.key];
    if (by) { e.preventDefault(); if (fits(id, plan[id] + by)) place(id, plan[id] + by); else setSaid("Something is in the way"); }
    if (e.key === "Backspace" || e.key === "Delete") { e.preventDefault(); unplace(id); }
  };

  const tray = tasks.filter((t) => !(t.id in plan));
  const planned = fixed.reduce((n, f) => n + f.end - f.start, 0) + tasks.filter((t) => t.id in plan).reduce((n, t) => n + t.minutes, 0);
  const free = end - start - planned, waiting = tray.reduce((n, t) => n + t.minutes, 0);
  const top = (min: number) => `${((min - start) / (end - start)) * 100}%`;
  const size = (min: number) => `${(min / (end - start)) * 100}%`;
  const hours = Array.from({ length: Math.floor((end - start) / 60) + 1 }, (_, i) => start + i * 60);
  const held = drag?.moved ? byId.get(drag.id) : undefined;

  return (
    <section className={`dayp dayp--${theme} ${className}`} style={{ ["--dayp-hours" as string]: (end - start) / 60 } as CSSProperties} data-dragging={held ? "" : undefined} aria-label={`Plan ${heading}`}>
      <div className="dayp__panes">
      <div className="dayp__side">
        <header>
          <h3 className="dayp__title">{heading}</h3>
          <p className="dayp__free"><b>{span(Math.max(0, free))}</b> free <span>of {span(end - start)}</span></p>
          <div className="dayp__meter" aria-hidden="true"><i style={{ width: `${Math.min(100, (planned / (end - start)) * 100)}%` }} /></div>
        </header>
        <div className="dayp__tray">
          <p className="dayp__label">To plan <span>{tray.length ? span(waiting) : "nothing left"}</span></p>
          {tray.map((t) => (
            <button key={t.id} type="button" className="dayp__chip" data-tone={t.tone ?? "a"} data-held={drag?.id === t.id && drag.moved ? "" : undefined} onPointerDown={grab(t.id)} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); placeFirst(t.id); } }} aria-label={`${t.title}, ${span(t.minutes)}. Press Enter to place it in the first gap.`}>
              <span>{t.title}</span><small>{span(t.minutes)}</small>
            </button>
          ))}
          {waiting > free
            ? <p className="dayp__warn">{span(waiting - free)} more than the day has left</p>
            : <p className="dayp__hint">{tray.length ? "Drag a task onto the day, or press it to drop it in the first gap." : "Everything has a place."}</p>}
        </div>
      </div>

      <div className="dayp__day">
        <div className="dayp__hours" aria-hidden="true">{hours.map((h) => <span key={h} style={{ top: top(h) }}>{clock(h)}</span>)}</div>
        <div ref={day} className="dayp__lane">
          {hours.slice(0, -1).map((h) => <i key={h} className="dayp__rule" style={{ top: top(h) }} />)}
          {fixed.map((f) => (
            <div key={f.title + f.start} className="dayp__fixed" data-tiny={f.end - f.start <= 15 ? "" : undefined} style={{ top: top(f.start), height: size(f.end - f.start) }}>
              <span>{f.title}</span><small>{clock(f.start)}–{clock(f.end)}</small>
            </div>
          ))}
          {tasks.filter((t) => t.id in plan).map((t) => (
            <div key={t.id} role="group" tabIndex={0} className="dayp__block" data-tone={t.tone ?? "a"} data-short={t.minutes <= 30 ? "" : undefined} data-held={drag?.id === t.id && drag.moved ? "" : undefined} style={{ top: top(plan[t.id]), height: size(t.minutes) }} onPointerDown={grab(t.id)} onKeyDown={onBlockKey(t.id)} aria-label={`${t.title}, ${clock(plan[t.id])} to ${clock(plan[t.id] + t.minutes)}. Arrow keys move it, Delete returns it to the tray.`}>
              <span>{t.title}</span><small>{clock(plan[t.id])}–{clock(plan[t.id] + t.minutes)}</small>
              <button type="button" data-remove className="dayp__remove" onClick={() => unplace(t.id)} aria-label={`Return ${t.title} to the tray`}>×</button>
            </div>
          ))}
          {held && drag?.at != null && (
            <div className="dayp__ghost" data-ok={fits(held.id, drag.at)} style={{ top: top(drag.at), height: size(held.minutes) }}>
              <small>{clock(drag.at)}–{clock(drag.at + held.minutes)}</small>
            </div>
          )}
          {now != null && now >= start && now <= end && <div className="dayp__now" style={{ top: top(now) }}><span>{clock(now)}</span></div>}
        </div>
      </div>
      </div>

      {held && drag && <div className="dayp__chip dayp__float" data-tone={held.tone ?? "a"} style={{ left: drag.x, top: drag.y }} aria-hidden="true"><span>{held.title}</span><small>{span(held.minutes)}</small></div>}
      <p className="dayp__said" role="status">{said}</p>
    </section>
  );
}

export default DayPlanner;
