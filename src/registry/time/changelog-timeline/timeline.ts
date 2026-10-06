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

/** "Today", "Yesterday", or "Mon 4 Oct". */
export function dayLabel(at: Date, now: Date, tz = "UTC") {
  const a = parts(at, tz), n = parts(now, tz), diff = n.ord - a.ord;
  if (diff === 0) return "Today";
  if (diff === 1) return "Yesterday";
  return `${DAYS[a.wd]} ${a.day} ${MONTHS[a.m]}`;
}
