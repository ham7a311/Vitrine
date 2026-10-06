/** Reads a date written in words. Pure and dependency-free; returns local midnight, or null. */

const DAYS = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
const MONTHS = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];

export const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
export const addDays = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
export const sameDay = (a: Date, b: Date) => a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

/** Index of the name that `word` abbreviates (at least three letters), or -1. */
const lookup = (word: string, names: string[]) => (word.length >= 3 ? names.findIndex((n) => n.startsWith(word)) : -1);

function addMonths(d: Date, n: number) {
  const t = new Date(d.getFullYear(), d.getMonth() + n, 1);
  // Clamp: 31 Jan plus a month is 28 Feb, not 3 March.
  t.setDate(Math.min(d.getDate(), new Date(t.getFullYear(), t.getMonth() + 1, 0).getDate()));
  return t;
}

/** A real calendar date or null: new Date(2026, 1, 31) would quietly become 3 March. */
function make(y: number, m: number, d: number) {
  const t = new Date(y, m, d);
  return t.getFullYear() === y && t.getMonth() === m && t.getDate() === d ? t : null;
}

/** The next time day/month comes round, this year if it hasn't passed. */
function nextOccurrence(today: Date, m: number, d: number) {
  const y = today.getFullYear();
  return [make(y, m, d), make(y + 1, m, d)].find((x) => x && x >= today) ?? null;
}

export function parseDate(input: string, today: Date): Date | null {
  const t = startOfDay(today);
  const s = input.trim().toLowerCase().replace(/[,.]/g, " ").replace(/\s+/g, " ");
  if (!s) return null;

  if (s === "today" || s === "now") return t;
  if (s === "tomorrow" || s === "tmrw" || s === "tmr") return addDays(t, 1);
  if (s === "next week") return addDays(t, 7);
  if (s === "next month") return addMonths(t, 1);

  let m: RegExpMatchArray | null;

  // "in 3 days", "in 2 weeks", "in a month", "2 weeks"
  if ((m = s.match(/^(?:in )?(\d+|a|an|one|two|three|four) (day|week|month)s?(?: from now)?$/))) {
    const n = /^\d+$/.test(m[1]) ? +m[1] : ({ a: 1, an: 1, one: 1, two: 2, three: 3, four: 4 } as Record<string, number>)[m[1]];
    return m[2] === "day" ? addDays(t, n) : m[2] === "week" ? addDays(t, n * 7) : addMonths(t, n);
  }

  // "fri", "friday", "next fri", "this fri"
  if ((m = s.match(/^(?:(next|this) )?([a-z]{3,9})$/))) {
    const wd = lookup(m[2], DAYS);
    if (wd >= 0) {
      const ahead = (wd - t.getDay() + 7) % 7;
      if (m[1] === "next") {
        // The named day in the week after this one (weeks run Monday to Sunday).
        const toNextMonday = ((8 - t.getDay()) % 7) || 7;
        return addDays(t, toNextMonday + ((wd + 6) % 7));
      }
      return addDays(t, ahead);
    }
  }

  // "2026-10-16"
  if ((m = s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/))) return make(+m[1], +m[2] - 1, +m[3]);

  // "16/10", "16/10/2026", "16-10-26": day first
  if ((m = s.match(/^(\d{1,2})[/-](\d{1,2})(?:[/-](\d{2}|\d{4}))?$/))) {
    if (m[3]) return make(m[3].length === 2 ? 2000 + +m[3] : +m[3], +m[2] - 1, +m[1]);
    return nextOccurrence(t, +m[2] - 1, +m[1]);
  }

  // "12 mar", "12 march 2027", "12th of march"
  if ((m = s.match(/^(\d{1,2})(?:st|nd|rd|th)?(?: of)? ([a-z]{3,9})(?: (\d{4}))?$/))) {
    const mo = lookup(m[2], MONTHS);
    if (mo >= 0) return m[3] ? make(+m[3], mo, +m[1]) : nextOccurrence(t, mo, +m[1]);
  }

  // "mar 12", "march 12 2027"
  if ((m = s.match(/^([a-z]{3,9}) (\d{1,2})(?:st|nd|rd|th)?(?: (\d{4}))?$/))) {
    const mo = lookup(m[1], MONTHS);
    if (mo >= 0) return m[3] ? make(+m[3], mo, +m[2]) : nextOccurrence(t, mo, +m[2]);
  }

  return null;
}

export function formatReading(d: Date, today: Date) {
  const opts: Intl.DateTimeFormatOptions = { weekday: "long", day: "numeric", month: "long" };
  const far = Math.abs(d.getTime() - today.getTime()) > 150 * 86400000 || d.getFullYear() !== today.getFullYear();
  return d.toLocaleDateString("en-GB", far ? { ...opts, year: "numeric" } : opts);
}

export const formatField = (d: Date) => d.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", year: "numeric" });
