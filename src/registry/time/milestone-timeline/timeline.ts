// Dates for a feed: grouping by day and short relative times. Everything is read in one time zone
// (UTC unless given) against a passed-in "now", so the server and the browser print the same words.
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const fmt = new Map<string, Intl.DateTimeFormat>();

/** Calendar parts of a moment in a time zone. */
export function parts(d: Date, tz = "UTC") {
  let f = fmt.get(tz);
  if (!f) { f = new Intl.DateTimeFormat("en-GB", { timeZone: tz, year: "numeric", month: "numeric", day: "numeric", hour: "numeric", minute: "numeric", hourCycle: "h23" }); fmt.set(tz, f); }
  const o: Record<string, number> = {};
  for (const p of f.formatToParts(d)) if (p.type !== "literal") o[p.type] = Number(p.value);
  const y = o.year, m = o.month - 1, day = o.day;
  return { y, m, day, h: o.hour, min: o.minute, wd: new Date(Date.UTC(y, m, day)).getUTCDay(), ord: Date.UTC(y, m, day) / 86_400_000 };
}

/** "4 Oct". */
export const shortDate = (d: Date, tz = "UTC") => { const p = parts(d, tz); return `${p.day} ${MONTHS[p.m]}`; };

/** Progress along a row of milestones: the index of the current one plus how far into the gap after it. */
export function railProgress(dates: Date[], now: Date) {
  const t = now.getTime();
  if (!dates.length) return 0;
  if (t <= dates[0].getTime()) return 0;
  for (let i = 0; i < dates.length - 1; i++) {
    const a = dates[i].getTime(), b = dates[i + 1].getTime();
    if (t < b) return i + (t - a) / (b - a);
  }
  return dates.length - 1;
}
