/**
 * Five-field cron (minute hour day-of-month month day-of-week): parse with
 * errors per field, describe in English, and find the next runs in a time zone.
 * Day-of-month and day-of-week follow standard cron: when both are restricted,
 * a day matches if either does.
 */
export type FieldName = "minute" | "hour" | "dom" | "month" | "dow";
export type Cron = { minute: number[]; hour: number[]; dom: number[]; month: number[]; dow: number[]; domAny: boolean; dowAny: boolean };
export type CronError = { field: FieldName | "all"; message: string };

export const FIELDS: { name: FieldName; label: string; min: number; max: number; names?: string[] }[] = [
  { name: "minute", label: "minute", min: 0, max: 59 },
  { name: "hour", label: "hour", min: 0, max: 23 },
  { name: "dom", label: "day of month", min: 1, max: 31 },
  { name: "month", label: "month", min: 1, max: 12, names: ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"] },
  { name: "dow", label: "weekday", min: 0, max: 7, names: ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"] },
];
const MACROS: Record<string, string> = { "@yearly": "0 0 1 1 *", "@annually": "0 0 1 1 *", "@monthly": "0 0 1 * *", "@weekly": "0 0 * * 0", "@daily": "0 0 * * *", "@midnight": "0 0 * * *", "@hourly": "0 * * * *" };

export function parse(text: string): { ok: true; cron: Cron } | { ok: false; errors: CronError[] } {
  const src = MACROS[text.trim().toLowerCase()] ?? text.trim();
  const parts = src.split(/\s+/).filter(Boolean);
  if (parts.length !== 5) return { ok: false, errors: [{ field: "all", message: `A schedule needs five fields (minute hour day month weekday); this has ${parts.length}.` }] };
  const errors: CronError[] = [];
  const out: Partial<Record<FieldName, number[]>> = {};
  FIELDS.forEach((f, k) => {
    const set = new Set<number>();
    const num = (s: string) => {
      const i = f.names?.indexOf(s.toUpperCase().slice(0, 3)) ?? -1;
      if (i >= 0 && /^[a-z]{3}$/i.test(s)) return f.name === "month" ? i + 1 : i;
      return /^\d+$/.test(s) ? Number(s) : NaN;
    };
    for (const item of parts[k].split(",")) {
      const m = /^(\*|[a-z0-9]+(?:-[a-z0-9]+)?)(?:\/(\d+))?$/i.exec(item);
      if (!m) { errors.push({ field: f.name, message: `"${item}" isn't a valid ${f.label}.` }); continue; }
      const step = m[2] ? Number(m[2]) : 1;
      if (step < 1) { errors.push({ field: f.name, message: `The ${f.label} step must be at least 1.` }); continue; }
      let lo: number, hi: number;
      if (m[1] === "*") { lo = f.min; hi = f.name === "dow" ? 6 : f.max; }
      else {
        const [a, b] = m[1].split("-");
        lo = num(a); hi = b !== undefined ? num(b) : m[2] ? (f.name === "dow" ? 6 : f.max) : lo;
        if (Number.isNaN(lo) || Number.isNaN(hi)) { errors.push({ field: f.name, message: `"${item}" isn't a valid ${f.label}.` }); continue; }
        const bad = [lo, hi].find((v) => v < f.min || v > f.max);
        if (bad !== undefined) { errors.push({ field: f.name, message: `${f.label[0].toUpperCase() + f.label.slice(1)} ${bad} is out of range (${f.min}–${f.name === "dow" ? "6, or 7 for Sunday" : f.max}).` }); continue; }
        if (hi < lo) { errors.push({ field: f.name, message: `The ${f.label} range ${lo}–${hi} runs backwards.` }); continue; }
      }
      for (let v = lo; v <= hi; v += step) set.add(f.name === "dow" && v === 7 ? 0 : v);
    }
    out[f.name] = [...set].sort((a, b) => a - b);
  });
  if (errors.length) return { ok: false, errors };
  return { ok: true, cron: { ...(out as Record<FieldName, number[]>), domAny: parts[2] === "*" || parts[2] === "?", dowAny: parts[4] === "*" || parts[4] === "?" } };
}

const pad = (n: number) => String(n).padStart(2, "0");
const DAY = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const MONTH = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const ord = (n: number) => n + (n % 100 >= 11 && n % 100 <= 13 ? "th" : ["th", "st", "nd", "rd"][n % 10] ?? "th");
const and = (xs: string[]) => (xs.length < 2 ? xs.join("") : `${xs.slice(0, -1).join(", ")} and ${xs[xs.length - 1]}`);
const step = (xs: number[], min: number, max: number) => {
  if (xs.length < 2) return 0;
  const d = xs[1] - xs[0];
  return xs[0] === min && xs.every((x, i) => x === xs[0] + i * d) && xs[xs.length - 1] + d > max ? d : 0;
};

const contiguous = (xs: number[]) => xs.every((x, i) => i === 0 || x === xs[i - 1] + 1);

/** Plain English for a parsed schedule, e.g. "Every weekday at 09:15". */
export function describe(c: Cron): string {
  const allM = c.minute.length === 60, allH = c.hour.length === 24;
  let time: string;
  if (allM && allH) time = "every minute";
  else if (step(c.minute, 0, 59) && allH) time = `every ${step(c.minute, 0, 59)} minutes`;
  else if (allM) time = `every minute during ${and(c.hour.map((h) => `${pad(h)}:00`))}`;
  else if (allH) time = c.minute.length === 1 ? `every hour at :${pad(c.minute[0])}` : `every hour at ${and(c.minute.map((m) => `:${pad(m)}`))}`;
  else if (step(c.hour, 0, 23) && c.minute.length === 1) time = `every ${step(c.hour, 0, 23)} hours at :${pad(c.minute[0])}`;
  else if (contiguous(c.hour) && c.hour.length > 1 && step(c.minute, 0, 59)) time = `every ${step(c.minute, 0, 59)} minutes from ${pad(c.hour[0])}:00 to ${pad(c.hour[c.hour.length - 1])}:${pad(c.minute[c.minute.length - 1])}`;
  else if (contiguous(c.hour) && c.hour.length > 2 && c.minute.length === 1) time = `every hour from ${pad(c.hour[0])}:${pad(c.minute[0])} to ${pad(c.hour[c.hour.length - 1])}:${pad(c.minute[0])}`;
  else if (c.hour.length * c.minute.length <= 6) time = `at ${and(c.hour.flatMap((h) => c.minute.map((m) => `${pad(h)}:${pad(m)}`)))}`;
  else time = `at minute ${and(c.minute.map(String))} past ${and(c.hour.map(pad))}`;

  const dows = c.dow.join();
  const dayText = (): string => {
    const dowText = dows === "1,2,3,4,5" ? "on weekdays" : dows === "0,6" ? "on weekends" : `on ${and(c.dow.map((d) => DAY[d]))}`;
    const domText = `on the ${and(c.dom.map(ord))}`;
    if (c.domAny && c.dowAny) return "";
    if (c.domAny) return dowText;
    if (c.dowAny) return `${domText}${c.month.length === 12 ? " of every month" : ""}`;
    return `${domText} or ${dowText}`;
  };
  // "Every weekday at 09:15" reads better than "At 09:15 on weekdays" when only weekdays are set.
  if (c.domAny && !c.dowAny && c.month.length === 12 && time.startsWith("at ")) {
    const who = dows === "1,2,3,4,5" ? "weekday" : dows === "0,6" ? "weekend day" : and(c.dow.map((d) => DAY[d]));
    return `Every ${who} ${time}`;
  }
  const days = dayText();
  const months = c.month.length === 12 ? "" : `in ${and(c.month.map((m) => MONTH[m - 1]))}`;
  const daily = !days && !months && !time.startsWith("every");
  const s = [daily ? `every day ${time}` : time, days, months].filter(Boolean).join(" ");
  return s[0].toUpperCase() + s.slice(1);
}

/** Offset of `tz` from UTC, in minutes, at the given instant. */
const formats = new Map<string, Intl.DateTimeFormat>();
function offset(tz: string, at: number) {
  let f = formats.get(tz);
  if (!f) { f = new Intl.DateTimeFormat("en-US", { timeZone: tz, hourCycle: "h23", year: "numeric", month: "numeric", day: "numeric", hour: "numeric", minute: "numeric" }); formats.set(tz, f); }
  const p = Object.fromEntries(f.formatToParts(at).map((x) => [x.type, x.value]));
  return (Date.UTC(+p.year, +p.month - 1, +p.day, +p.hour % 24, +p.minute) - Math.floor(at / 60000) * 60000) / 60000;
}
/** The instant a wall-clock time in `tz` happens, or null inside a daylight-saving gap. */
function instant(tz: string, y: number, mo: number, d: number, h: number, mi: number) {
  const guess = Date.UTC(y, mo - 1, d, h, mi);
  let t = guess - offset(tz, guess) * 60000;
  t = guess - offset(tz, t) * 60000;
  const back = offset(tz, t);
  return Date.UTC(y, mo - 1, d, h, mi) - back * 60000 === t ? t : null;
}

/** The next `n` run instants strictly after `from`, looking at most `years` ahead. */
export function next(c: Cron, from: number, n: number, tz = "UTC", until = Infinity, years = 6): number[] {
  const out: number[] = [];
  const startLocal = from + offset(tz, from) * 60000;
  const s = new Date(startLocal);
  let day = Date.UTC(s.getUTCFullYear(), s.getUTCMonth(), s.getUTCDate());
  const last = day + years * 366 * 86_400_000;
  const months = new Set(c.month), doms = new Set(c.dom), dows = new Set(c.dow);
  for (; day <= last && out.length < n; day += 86_400_000) {
    const d = new Date(day);
    const y = d.getUTCFullYear(), mo = d.getUTCMonth() + 1, dm = d.getUTCDate(), wd = d.getUTCDay();
    if (!months.has(mo)) continue;
    const domOk = doms.has(dm), dowOk = dows.has(wd);
    const ok = c.domAny && c.dowAny ? true : c.domAny ? dowOk : c.dowAny ? domOk : domOk || dowOk;
    if (!ok) continue;
    for (const h of c.hour) for (const mi of c.minute) {
      const t = instant(tz, y, mo, dm, h, mi);
      if (t === null || t <= from) continue;
      if (t > until) return out;
      out.push(t);
      if (out.length >= n) return out;
    }
  }
  return out;
}
