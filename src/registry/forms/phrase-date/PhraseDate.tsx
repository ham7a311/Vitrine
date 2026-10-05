"use client";

import { useEffect, useId, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { addDays, formatField, formatReading, parseDate, sameDay, startOfDay } from "./parse";
import "./phrase-date.css";

/**
 * Phrase Date
 * A date field you can simply write in: "next fri", "in 2 weeks", "12 mar". Under it
 * a line reads back what it understood, in full, before you commit. A month
 * grid sits behind a button and agrees with the text in both directions: what
 * you type moves the grid, and what you pick writes the text.
 */

type Props = {
  label: string;
  value?: Date | null;
  onChange?: (d: Date | null) => void;
  /** Earliest selectable day. Earlier days are shown but cannot be picked. */
  min?: Date;
  /** Today, for stable demos. Defaults to the real date. */
  today?: Date;
  /** First day of the week: 0 Sunday, 1 Monday, 6 Saturday. */
  weekStart?: 0 | 1 | 6;
  placeholder?: string;
  theme?: "paper" | "night";
  motion?: "auto" | "reduced";
  className?: string;
};

const MONTH = (d: Date) => d.toLocaleDateString("en-GB", { month: "long", year: "numeric" });

export function PhraseDate({ label, value, onChange, min, today: todayProp, weekStart = 1, placeholder = "next fri, in 2 weeks, 12 mar", theme = "paper", motion = "auto", className = "" }: Props) {
  const uid = useId();
  const today = useMemo(() => startOfDay(todayProp ?? new Date()), [todayProp]);
  const floor = min ? startOfDay(min) : undefined;
  const [inner, setInner] = useState<Date | null>(value ?? null);
  const selected = value === undefined ? inner : value;
  const [draft, setDraft] = useState(selected ? formatField(selected) : "");
  const [open, setOpen] = useState(false);
  const [touched, setTouched] = useState(false);
  const [cursor, setCursor] = useState<Date>(selected ?? today);
  const input = useRef<HTMLInputElement>(null);
  const grid = useRef<HTMLTableElement>(null);
  const wrap = useRef<HTMLDivElement>(null);

  const parsed = useMemo(() => parseDate(draft, today), [draft, today]);
  const blocked = (d: Date) => !!floor && d < floor;
  const readable = parsed && !blocked(parsed) ? parsed : null;

  // The grid follows what is being typed.
  useEffect(() => { if (parsed) setCursor(parsed); }, [parsed]);

  const commit = (d: Date | null) => {
    if (d && blocked(d)) return;
    setInner(d);
    onChange?.(d);
    setDraft(d ? formatField(d) : "");
    if (d) setCursor(d);
  };

  const focusDay = (d: Date) => {
    setCursor(d);
    requestAnimationFrame(() => grid.current?.querySelector<HTMLElement>(`[data-day="${d.getTime()}"]`)?.focus());
  };

  const onInputKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") { e.preventDefault(); if (readable) commit(readable); else setTouched(true); }
    else if (e.key === "ArrowDown") { e.preventDefault(); setOpen(true); focusDay(readable ?? selected ?? today); }
    else if (e.key === "Escape") { if (open) { e.stopPropagation(); setOpen(false); } else setDraft(selected ? formatField(selected) : ""); }
  };

  // Month grid: the standard keys.
  const onGridKey = (e: KeyboardEvent) => {
    const step: Record<string, number> = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 };
    let next: Date | null = null;
    if (e.key in step) next = addDays(cursor, step[e.key]);
    else if (e.key === "PageUp" || e.key === "PageDown") {
      const dir = e.key === "PageUp" ? -1 : 1;
      const m = e.shiftKey ? 12 * dir : dir;
      const t = new Date(cursor.getFullYear(), cursor.getMonth() + m, 1);
      t.setDate(Math.min(cursor.getDate(), new Date(t.getFullYear(), t.getMonth() + 1, 0).getDate()));
      next = t;
    } else if (e.key === "Home" || e.key === "End") {
      const off = (cursor.getDay() - weekStart + 7) % 7;
      next = addDays(cursor, e.key === "Home" ? -off : 6 - off);
    } else if (e.key === "Escape") { e.preventDefault(); e.stopPropagation(); setOpen(false); input.current?.focus(); return; }
    else return;
    e.preventDefault();
    focusDay(next);
  };

  useEffect(() => {
    if (!open) return;
    const away = (e: PointerEvent) => { if (!wrap.current?.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("pointerdown", away);
    return () => document.removeEventListener("pointerdown", away);
  }, [open]);

  // Six rows of seven, starting on the week's first day, always, so the panel never changes height.
  const first = new Date(cursor.getFullYear(), cursor.getMonth(), 1);
  const lead = (first.getDay() - weekStart + 7) % 7;
  const days = Array.from({ length: 42 }, (_, i) => addDays(first, i - lead));
  const heads = Array.from({ length: 7 }, (_, i) => addDays(new Date(2023, 0, 1), weekStart + i).toLocaleDateString("en-GB", { weekday: "short" }));

  const bad = touched && draft.trim() !== "" && !readable;
  const msg = !draft.trim()
    ? "Write it the way you'd say it."
    : readable ? <>Reads as <b key={readable.getTime()}>{formatReading(readable, today)}</b></>
    : parsed ? "That day has passed." : bad ? "I can't read that yet. Try “next fri” or “12 mar”." : "…";

  return (
    <div
      ref={wrap}
      className={`phrase-date phrase-date--${theme} ${className}`}
      data-open={open || undefined}
      data-motion={motion === "reduced" ? "reduced" : undefined}
    >
      <label className="phrase-date__label" htmlFor={`${uid}-in`}>{label}</label>
      <div className="phrase-date__field" data-invalid={bad || undefined}>
        <input
          ref={input}
          id={`${uid}-in`}
          value={draft}
          placeholder={placeholder}
          autoComplete="off"
          spellCheck={false}
          aria-describedby={`${uid}-msg`}
          aria-invalid={bad || undefined}
          onChange={(e) => { setDraft(e.target.value); setTouched(false); }}
          onBlur={() => { setTouched(true); if (readable && !open) commit(readable); }}
          onKeyDown={onInputKey}
        />
        <button type="button" className="phrase-date__toggle" aria-expanded={open} aria-controls={`${uid}-grid`} aria-label={open ? "Close calendar" : "Open calendar"} onClick={() => setOpen((o) => !o)}>
          <svg viewBox="0 0 16 16" aria-hidden="true"><rect x="2.5" y="3.5" width="11" height="10" rx="1.5" /><path d="M2.5 6.75h11M5.5 2v3M10.5 2v3" /></svg>
        </button>
      </div>
      <p id={`${uid}-msg`} className="phrase-date__reading" data-bad={bad || undefined} role="status">{msg}</p>

      <div className="phrase-date__fold" id={`${uid}-grid`}>
        <div>
          <div className="phrase-date__panel">
            <div className="phrase-date__head">
              <span className="phrase-date__month" aria-live="polite">{MONTH(cursor)}</span>
              <button type="button" aria-label="Previous month" onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1))}><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M10 3.5L5.5 8l4.5 4.5" /></svg></button>
              <button type="button" aria-label="Next month" onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1))}><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M6 3.5L10.5 8 6 12.5" /></svg></button>
            </div>
            <table ref={grid} className="phrase-date__grid" role="grid" aria-label={MONTH(cursor)} onKeyDown={onGridKey}>
              <thead><tr>{heads.map((h) => <th key={h} scope="col" abbr={h}>{h.slice(0, 2)}</th>)}</tr></thead>
              <tbody key={`${cursor.getFullYear()}-${cursor.getMonth()}`}>
                {Array.from({ length: 6 }, (_, r) => (
                  <tr key={r}>
                    {days.slice(r * 7, r * 7 + 7).map((d) => {
                      const out = d.getMonth() !== cursor.getMonth();
                      const dis = blocked(d);
                      return (
                        <td key={d.getTime()} role="gridcell" aria-selected={selected ? sameDay(d, selected) : false}>
                          <button
                            type="button"
                            data-day={d.getTime()}
                            data-out={out || undefined}
                            data-today={sameDay(d, today) || undefined}
                            data-selected={selected && sameDay(d, selected) ? "" : undefined}
                            data-reading={readable && sameDay(d, readable) && !(selected && sameDay(d, selected)) ? "" : undefined}
                            tabIndex={sameDay(d, cursor) ? 0 : -1}
                            aria-disabled={dis || undefined}
                            aria-label={d.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
                            onClick={() => { if (dis) return; commit(d); setOpen(false); input.current?.focus(); }}
                            onKeyDown={(e) => { if ((e.key === "Enter" || e.key === " ") && !dis) { e.preventDefault(); commit(d); setOpen(false); input.current?.focus(); } }}
                          >
                            {d.getDate()}
                          </button>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
