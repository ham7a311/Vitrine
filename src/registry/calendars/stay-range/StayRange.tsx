"use client";

import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";
import "./stay-range.css";

/**
 * Stay Range
 * Pick check-in and check-out. The stay is one continuous ribbon that wraps across the week rows, and the
 * rules are drawn on the calendar instead of arriving as an error: once you choose a check-in, the nights
 * that are too soon are marked, and every day past the next booked night is closed off.
 */

export type Stay = { from: string; to: string; nights: number; total: number };
export type StayRangeProps = {
  /** Nights that are already taken, as "YYYY-MM-DD". */
  booked?: string[];
  /** The first day that can be picked. Pass a fixed value when rendering on a server. */
  today?: string;
  minNights?: number;
  /** The price of one night. */
  rate?: (night: string) => number;
  currency?: string;
  theme?: "light" | "dark";
  onChange?: (stay: Stay | null) => void;
  onReserve?: (stay: Stay) => void;
  className?: string;
};

const DAY = 86_400_000;
const FLAT = () => 120;
const WEEKDAYS = ["M", "T", "W", "T", "F", "S", "S"];
const key = (y: number, m: number, d: number) => new Date(Date.UTC(y, m, d)).toISOString().slice(0, 10);
const shift = (iso: string, days: number) => new Date(Date.parse(iso) + days * DAY).toISOString().slice(0, 10);
const between = (a: string, b: string) => Math.round((Date.parse(b) - Date.parse(a)) / DAY);
const fmt = (iso: string, opts: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat("en-GB", { timeZone: "UTC", ...opts }).format(new Date(iso));
const short = (iso: string) => fmt(iso, { weekday: "short", day: "numeric", month: "short" });

/** The last day a stay starting on `from` may end: the first booked night after it. */
export function lastCheckout(from: string, booked: Set<string>, horizon = 366) {
  let day = from;
  for (let i = 0; i < horizon && !booked.has(day); i++) day = shift(day, 1);
  return day;
}

export function StayRange({ booked = [], today = new Date().toISOString().slice(0, 10), minNights = 2, rate = FLAT, currency = "USD", theme = "light", onChange, onReserve, className = "" }: StayRangeProps) {
  const taken = useMemo(() => new Set(booked), [booked]);
  const [view, setView] = useState(today.slice(0, 7));
  const [from, setFrom] = useState<string | null>(null);
  const [to, setTo] = useState<string | null>(null);
  const [hover, setHover] = useState<string | null>(null);
  const [cursor, setCursor] = useState(today);
  const root = useRef<HTMLDivElement>(null);
  const refocus = useRef(false);
  useEffect(() => {
    if (refocus.current) root.current?.querySelector<HTMLButtonElement>(`[data-day="${cursor}"]`)?.focus();
    refocus.current = false;
  }, [cursor, view]);

  const limit = from ? lastCheckout(from, taken) : null;
  const earliest = from ? shift(from, minNights) : null;
  // What a day is, given what has been chosen so far.
  const state = (iso: string) => {
    if (iso < today) return "past";
    if (from && !to) {
      if (iso === from) return "open";
      if (iso < from) return taken.has(iso) ? "booked" : "open";
      if (iso > limit!) return "closed";
      if (iso < earliest!) return "short";
      return "open";
    }
    return taken.has(iso) ? "booked" : "open";
  };
  const end = to ?? (from && hover && hover > from && state(hover) === "open" ? hover : null);
  const money = (n: number) => new Intl.NumberFormat("en-US", { style: "currency", currency, maximumFractionDigits: 0 }).format(n);
  const stay = useMemo<Stay | null>(() => {
    if (!from || !to) return null;
    const nights = between(from, to);
    let total = 0;
    for (let i = 0; i < nights; i++) total += rate(shift(from, i));
    return { from, to, nights, total };
  }, [from, to, rate]);
  useEffect(() => { onChange?.(stay); }, [stay]); // eslint-disable-line react-hooks/exhaustive-deps

  const pick = (iso: string) => {
    const s = state(iso);
    if (s === "past" || s === "closed" || s === "short") return;
    if (!from || to || iso <= from) {
      if (taken.has(iso)) return;
      setFrom(iso);
      setTo(null);
    } else setTo(iso);
  };
  const clear = () => { setFrom(null); setTo(null); setHover(null); };

  const [y, m] = view.split("-").map(Number);
  const second = key(y, m, 1).slice(0, 7);
  const move = (target: string) => {
    if (target < today) return;
    refocus.current = true;
    setCursor(target);
    const month = target.slice(0, 7);
    if (month < view) setView(month);
    else if (month > second) setView(key(Number(month.slice(0, 4)), Number(month.slice(5)) - 2, 1).slice(0, 7));
  };
  const onKey = (e: KeyboardEvent) => {
    if (e.key === "Escape" && from) { e.preventDefault(); return clear(); }
    const col = (new Date(cursor).getUTCDay() + 6) % 7;
    const target = { ArrowLeft: shift(cursor, -1), ArrowRight: shift(cursor, 1), ArrowUp: shift(cursor, -7), ArrowDown: shift(cursor, 7), Home: shift(cursor, -col), End: shift(cursor, 6 - col), PageUp: shift(cursor, -28), PageDown: shift(cursor, 28) }[e.key];
    if (!target) return;
    e.preventDefault();
    move(target);
  };

  const month = (ym: string) => {
    const [yy, mm] = ym.split("-").map(Number);
    const lead = (new Date(Date.UTC(yy, mm - 1, 1)).getUTCDay() + 6) % 7;
    const length = new Date(Date.UTC(yy, mm, 0)).getUTCDate();
    return (
      <div className="stayr__month" key={ym}>
        <h4 className="stayr__name">{fmt(`${ym}-01`, { month: "long", year: "numeric" })}</h4>
        <div className="stayr__week" aria-hidden="true">{WEEKDAYS.map((w, i) => <span key={i}>{w}</span>)}</div>
        <div className="stayr__grid">
          {Array.from({ length: lead }, (_, i) => <span key={`b${i}`} />)}
          {Array.from({ length }, (_, i) => {
            const iso = key(yy, mm - 1, i + 1), s = state(iso);
            const inRange = !!from && !!end && iso >= from && iso <= end;
            const part = !inRange ? (iso === from ? "only" : undefined) : iso === from ? "start" : iso === end ? "end" : "mid";
            const what = s === "booked" ? "booked" : s === "short" ? `minimum stay is ${minNights} nights` : s === "closed" ? "past the next booking" : s === "past" ? "past" : `${money(rate(iso))} a night`;
            return (
              <button
                key={iso}
                type="button"
                data-day={iso}
                className="stayr__day"
                data-state={s}
                data-part={part}
                data-pending={part && !to ? "" : undefined}
                aria-pressed={iso === from || iso === to}
                aria-disabled={s !== "open"}
                aria-label={`${fmt(iso, { weekday: "long", day: "numeric", month: "long" })}, ${iso === from ? "check-in" : iso === to ? "check-out" : what}`}
                tabIndex={iso === cursor ? 0 : -1}
                onFocus={() => { setCursor(iso); setHover(iso); }}
                onPointerEnter={() => setHover(iso)}
                onClick={() => pick(iso)}
              >
                <span>{i + 1}</span>
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  const pendingNights = from && end ? between(from, end) : 0;
  return (
    <section ref={root} className={`stayr stayr--${theme} ${className}`} aria-label="Choose your dates" onKeyDown={onKey} onPointerLeave={() => setHover(null)}>
      <header className="stayr__head">
        <div className="stayr__dates">
          <div data-on={!from || !!to}><small>Check-in</small><b>{from ? short(from) : "Add date"}</b></div>
          <span aria-hidden="true">→</span>
          <div data-on={!!from && !to}><small>Check-out</small><b>{to ? short(to) : from && end ? short(end) : "Add date"}</b></div>
        </div>
        <div className="stayr__nav">
          <button type="button" onClick={() => setView(key(y, m - 2, 1).slice(0, 7))} disabled={view <= today.slice(0, 7)} aria-label="Earlier months">‹</button>
          <button type="button" onClick={() => setView(second)} aria-label="Later months">›</button>
        </div>
      </header>
      <div className="stayr__months">{[view, second].map(month)}</div>
      <footer className="stayr__foot">
        <p className="stayr__sum" aria-live="polite">
          {stay ? <><b>{money(stay.total)}</b> for {stay.nights} nights <span>about {money(Math.round(stay.total / stay.nights))} a night</span></>
            : from ? (pendingNights ? <><b>{pendingNights} night{pendingNights > 1 ? "s" : ""}</b> so far <span>choose a check-out</span></> : <>Choose a check-out <span>at least {minNights} nights, up to {short(limit!)}</span></>)
            : <>Choose a check-in <span>{minNights}-night minimum</span></>}
        </p>
        <div className="stayr__actions">
          {from && <button type="button" className="stayr__clear" onClick={clear}>Clear</button>}
          <button type="button" className="stayr__go" disabled={!stay} onClick={() => stay && onReserve?.(stay)}>Reserve</button>
        </div>
      </footer>
      <ul className="stayr__key" aria-hidden="true">
        <li><i data-k="booked" />Booked</li>
        <li><i data-k="short" />Under the minimum</li>
        <li><i data-k="closed" />Past the next booking</li>
      </ul>
    </section>
  );
}

export default StayRange;
