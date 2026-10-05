/**
 * Working hours across time zones, measured on one reference day. Each
 * person's local working window is converted to minutes of the reference
 * zone's day (it may wrap past midnight, or spill from the day before),
 * then the windows are intersected.
 */
export type Person = { id: string; name: string; tz: string; start: string; end: string; workdays?: number[] };
export type Span = [number, number];

const fmts = new Map<string, Intl.DateTimeFormat>();
function parts(tz: string, at: number) {
  let f = fmts.get(tz);
  if (!f) { f = new Intl.DateTimeFormat("en-US", { timeZone: tz, hourCycle: "h23", year: "numeric", month: "numeric", day: "numeric", hour: "numeric", minute: "numeric", weekday: "short" }); fmts.set(tz, f); }
  return Object.fromEntries(f.formatToParts(at).map((p) => [p.type, p.value])) as Record<string, string>;
}
export function offset(tz: string, at: number) {
  const p = parts(tz, at);
  return (Date.UTC(+p.year, +p.month - 1, +p.day, +p.hour % 24, +p.minute) - Math.floor(at / 60000) * 60000) / 60000;
}
/** The instant a wall-clock time happens in a zone. */
export function instant(tz: string, y: number, m: number, d: number, minutes: number) {
  const guess = Date.UTC(y, m - 1, d, 0, minutes);
  let t = guess - offset(tz, guess) * 60000;
  t = guess - offset(tz, t) * 60000;
  return t;
}
const mins = (hhmm: string) => { const [h, m] = hhmm.split(":").map(Number); return h * 60 + m; };
const WD = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/** The reference day [from, to) as instants. */
export function dayRange(ref: string, ymd: [number, number, number]): [number, number] {
  const [y, m, d] = ymd;
  return [instant(ref, y, m, d, 0), instant(ref, y, m, d + 1, 0)];
}

/** A person's working time inside the reference day, as minutes from its start. */
export function windows(p: Person, ref: string, ymd: [number, number, number]): Span[] {
  const [from, to] = dayRange(ref, ymd);
  const out: Span[] = [];
  const [y, m, d] = ymd;
  for (const shift of [-1, 0, 1]) {
    const day = new Date(Date.UTC(y, m - 1, d + shift));
    const wd = day.getUTCDay();
    if (p.workdays && !p.workdays.includes(wd)) continue;
    let a = instant(p.tz, day.getUTCFullYear(), day.getUTCMonth() + 1, day.getUTCDate(), mins(p.start));
    let b = instant(p.tz, day.getUTCFullYear(), day.getUTCMonth() + 1, day.getUTCDate(), mins(p.end) + (mins(p.end) <= mins(p.start) ? 1440 : 0));
    a = Math.max(a, from); b = Math.min(b, to);
    if (b > a) out.push([(a - from) / 60000, (b - from) / 60000]);
  }
  return out;
}

export function intersect(a: Span[], b: Span[]): Span[] {
  const out: Span[] = [];
  for (const [a1, a2] of a) for (const [b1, b2] of b) { const s = Math.max(a1, b1), e = Math.min(a2, b2); if (e > s) out.push([s, e]); }
  return out.sort((x, y) => x[0] - y[0]);
}

/** Times when everyone works; if none, the best spans and who they leave out. */
export function overlap(people: Person[], ref: string, ymd: [number, number, number]) {
  const each = people.map((p) => windows(p, ref, ymd));
  const all = each.reduce((acc, w) => intersect(acc, w), [[0, 1440]] as Span[]);
  if (all.length || people.length < 2) return { all, best: all, missing: [] as string[] };
  let best: Span[] = [], missing: string[] = [];
  for (let skip = 0; skip < people.length; skip++) {
    const w = each.filter((_, i) => i !== skip).reduce((acc, x) => intersect(acc, x), [[0, 1440]] as Span[]);
    const len = w.reduce((s, [a, b]) => s + b - a, 0), cur = best.reduce((s, [a, b]) => s + b - a, 0);
    if (len > cur) { best = w; missing = [people[skip].name]; }
  }
  return { all, best, missing };
}

/** Local wall time and weekday for a person at a minute of the reference day. */
export function localAt(p: Person, ref: string, ymd: [number, number, number], minute: number) {
  const [from] = dayRange(ref, ymd);
  const t = from + minute * 60000;
  const q = parts(p.tz, t);
  return { hh: +q.hour % 24, mm: +q.minute, weekday: q.weekday, dayShift: WD.indexOf(q.weekday) - new Date(Date.UTC(ymd[0], ymd[1] - 1, ymd[2])).getUTCDay() };
}
