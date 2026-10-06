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

export const clock = (d: Date, tz = "UTC") => { const p = parts(d, tz); return `${String(p.h).padStart(2, "0")}:${String(p.min).padStart(2, "0")}`; };

/** "just now", "4m ago", "3h ago", then the clock time for anything older. */
export function ago(at: Date, now: Date, tz = "UTC") {
  const s = Math.max(0, Math.round((now.getTime() - at.getTime()) / 1000));
  if (s < 45) return "just now";
  if (s < 3600) return `${Math.max(1, Math.round(s / 60))}m ago`;
  if (s < 6 * 3600) return `${Math.round(s / 3600)}h ago`;
  return clock(at, tz);
}

/** Newest first, grouped under day labels, keeping the order within a day. */
export function groupByDay<T extends { at: Date }>(items: T[], now: Date, tz = "UTC") {
  const sorted = [...items].sort((a, b) => b.at.getTime() - a.at.getTime());
  const groups: { label: string; items: T[] }[] = [];
  for (const it of sorted) {
    const label = dayLabel(it.at, now, tz);
    const last = groups[groups.length - 1];
    if (last && last.label === label) last.items.push(it); else groups.push({ label, items: [it] });
  }
  return groups;
}
