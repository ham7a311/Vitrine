"use client";

import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";
import "./slot-booker.css";

/**
 * Slot Booker
 * Book an appointment. Every day in the month shows how open it is before you click it, as a small stack of
 * ticks, so you pick a good day first instead of by trial and error. Times are shown in the visitor's own
 * time zone, with the host's beside each one.
 */

export type SlotBookerProps = {
  /** Every open start time, as instants (Date or ISO string). */
  slots: (string | Date)[];
  /** Days before this one cannot be picked. Pass a fixed value when rendering on a server. */
  today?: string | Date;
  /** The visitor's time zone. Defaults to the browser's. */
  zone?: string;
  hostZone?: string;
  host?: string;
  title?: string;
  /** Length of the appointment, in minutes. */
  minutes?: number;
  theme?: "light" | "dark";
  onBook?: (slot: Date) => void;
  className?: string;
};

const DAY = 86_400_000;
const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const key = (y: number, m: number, d: number) => new Date(Date.UTC(y, m, d)).toISOString().slice(0, 10);
const shift = (iso: string, days: number) => new Date(Date.parse(iso) + days * DAY).toISOString().slice(0, 10);
const city = (zone: string) => (zone.split("/").pop() ?? zone).replace(/_/g, " ");
const dayKey = (at: Date, zone: string) => new Intl.DateTimeFormat("en-CA", { timeZone: zone, year: "numeric", month: "2-digit", day: "2-digit" }).format(at);
const clock = (at: Date, zone: string) => new Intl.DateTimeFormat("en-GB", { timeZone: zone, hour: "2-digit", minute: "2-digit" }).format(at);
const long = (iso: string) => new Intl.DateTimeFormat("en-GB", { timeZone: "UTC", weekday: "long", day: "numeric", month: "long" }).format(new Date(iso));
/** How tall the stack is: 0 for a closed day, up to 4 for seven or more open times. */
export const openness = (count: number) => Math.min(4, Math.ceil(count / 2));

export function SlotBooker({ slots, today = new Date(), zone: zoneProp, hostZone = "UTC", host = "Your host", title = "Intro call", minutes = 30, theme = "light", onBook, className = "" }: SlotBookerProps) {
  const [zone, setZone] = useState(zoneProp ?? "UTC");
  useEffect(() => { setZone(zoneProp ?? Intl.DateTimeFormat().resolvedOptions().timeZone); }, [zoneProp]);

  const first = dayKey(new Date(today), zone);
  // Open times grouped by the day they fall on for the visitor, which is not always the host's day.
  const byDay = useMemo(() => {
    const map = new Map<string, Date[]>();
    for (const at of slots.map((s) => new Date(s)).sort((a, b) => +a - +b)) {
      const k = dayKey(at, zone);
      if (k >= first) map.set(k, [...(map.get(k) ?? []), at]);
    }
    return map;
  }, [slots, zone, first]);
  const earliest = [...byDay.keys()][0] ?? first;

  const [view, setView] = useState(earliest.slice(0, 7));
  const [cursor, setCursor] = useState(earliest);
  const [day, setDay] = useState<string | null>(null);
  const [slot, setSlot] = useState<Date | null>(null);
  const [booked, setBooked] = useState(false);
  const grid = useRef<HTMLDivElement>(null);
  const refocus = useRef(false);
  useEffect(() => { setView(earliest.slice(0, 7)); setCursor(earliest); }, [earliest]);
  useEffect(() => {
    if (refocus.current) grid.current?.querySelector<HTMLButtonElement>(`[data-day="${cursor}"]`)?.focus();
    refocus.current = false;
  }, [cursor, view]);

  const [y, m] = view.split("-").map(Number);
  const lead = (new Date(Date.UTC(y, m - 1, 1)).getUTCDay() + 6) % 7;
  const length = new Date(Date.UTC(y, m, 0)).getUTCDate();
  const cells = Array.from({ length: Math.ceil((lead + length) / 7) * 7 }, (_, i) => (i < lead || i >= lead + length ? null : key(y, m - 1, i - lead + 1)));
  const monthName = new Intl.DateTimeFormat("en-GB", { timeZone: "UTC", month: "long", year: "numeric" }).format(new Date(Date.UTC(y, m - 1, 1)));
  const turn = (by: number) => setView(key(y, m - 1 + by, 1).slice(0, 7));
  const canGoBack = view > first.slice(0, 7);

  const move = (to: string) => {
    if (to < first) return;
    refocus.current = true;
    setCursor(to);
    setView(to.slice(0, 7));
  };
  const onKey = (e: KeyboardEvent) => {
    const col = (new Date(cursor).getUTCDay() + 6) % 7;
    const to = { ArrowLeft: shift(cursor, -1), ArrowRight: shift(cursor, 1), ArrowUp: shift(cursor, -7), ArrowDown: shift(cursor, 7), Home: shift(cursor, -col), End: shift(cursor, 6 - col), PageUp: key(y, m - 2, Math.min(Number(cursor.slice(8)), 28)), PageDown: key(y, m, Math.min(Number(cursor.slice(8)), 28)) }[e.key];
    if (!to) return;
    e.preventDefault();
    move(to);
  };

  const times = day ? byDay.get(day) ?? [] : [];
  const sameZone = zone === hostZone;
  const range = (at: Date) => `${clock(at, zone)}–${clock(new Date(+at + minutes * 60_000), zone)}`;

  return (
    <section className={`slotb slotb--${theme} ${className}`} aria-label={`Book ${title} with ${host}`}>
      <div className="slotb__panes">
      <div className="slotb__month">
        <header className="slotb__head">
          <div>
            <p className="slotb__meta">{host} · {minutes} min</p>
            <h3 className="slotb__title">{title}</h3>
          </div>
          <div className="slotb__nav">
            <button type="button" className="slotb__step" onClick={() => turn(-1)} disabled={!canGoBack} aria-label="Previous month">‹</button>
            <span className="slotb__name" aria-live="polite">{monthName}</span>
            <button type="button" className="slotb__step" onClick={() => turn(1)} aria-label="Next month">›</button>
          </div>
        </header>
        <div className="slotb__week" aria-hidden="true">{WEEKDAYS.map((w) => <span key={w}>{w}</span>)}</div>
        <div ref={grid} className="slotb__grid" role="group" aria-label={`${monthName}. Arrow keys move between days.`} onKeyDown={onKey}>
          {cells.map((iso, i) => {
            if (!iso) return <span key={i} />;
            const count = byDay.get(iso)?.length ?? 0, level = openness(count);
            const inView = cursor.slice(0, 7) === view;
            return (
              <button
                key={iso}
                type="button"
                data-day={iso}
                className="slotb__day"
                data-open={level}
                aria-pressed={day === iso}
                aria-disabled={!count}
                aria-label={`${long(iso)}, ${count ? `${count} time${count > 1 ? "s" : ""} open` : iso < first ? "past" : "no times"}`}
                tabIndex={(inView ? iso === cursor : iso.endsWith("-01")) ? 0 : -1}
                onFocus={() => setCursor(iso)}
                onClick={() => { if (count) { setDay(iso); setSlot(null); setBooked(false); } }}
              >
                <span className="slotb__num">{Number(iso.slice(8))}</span>
                <span className="slotb__stack" aria-hidden="true">{[4, 3, 2, 1].map((n) => <i key={n} data-on={n <= level} />)}</span>
              </button>
            );
          })}
        </div>
        <p className="slotb__legend"><span className="slotb__stack" aria-hidden="true">{[4, 3, 2, 1].map((n) => <i key={n} data-on="true" />)}</span>Taller stacks have more times open</p>
      </div>

      <div className="slotb__times">
        {booked && slot ? (
          <div className="slotb__done" role="status">
            <span className="slotb__tick" aria-hidden="true">✓</span>
            <h4 className="slotb__when">{long(dayKey(slot, zone))}</h4>
            <p className="slotb__range">{range(slot)} <span>{city(zone)} time</span></p>
            <p className="slotb__note">{title} with {host}. An invitation is on its way.</p>
            <button type="button" className="slotb__ghost" onClick={() => { setBooked(false); setSlot(null); }}>Pick another time</button>
          </div>
        ) : day ? (
          <>
            <h4 className="slotb__when">{long(day)}</h4>
            <p className="slotb__zone">Times in {city(zone)}{!sameZone && <>, with {city(hostZone)} beside</>}</p>
            <ul className="slotb__list">
              {times.map((at) => (
                <li key={+at}>
                  <button type="button" className="slotb__time" aria-pressed={slot === at} onClick={() => setSlot(at)}>
                    <b>{clock(at, zone)}</b>
                    {!sameZone && <span>{clock(at, hostZone)} {city(hostZone)}</span>}
                  </button>
                </li>
              ))}
            </ul>
            <div className="slotb__confirm">
              <p aria-live="polite">{slot ? <>{range(slot)}, {city(zone)} time</> : "Choose a time"}</p>
              <button type="button" className="slotb__book" disabled={!slot} onClick={() => { if (slot) { setBooked(true); onBook?.(slot); } }}>Confirm</button>
            </div>
          </>
        ) : (
          <div className="slotb__empty">
            <h4 className="slotb__when">Pick a day</h4>
            <p className="slotb__zone">The next open day is {long(earliest)}.</p>
            <button type="button" className="slotb__ghost" onClick={() => { setDay(earliest); setView(earliest.slice(0, 7)); setCursor(earliest); }}>Show its times</button>
          </div>
        )}
      </div>
      </div>
    </section>
  );
}

export default SlotBooker;
