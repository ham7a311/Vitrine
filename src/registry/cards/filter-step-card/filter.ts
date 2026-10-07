export type Event = { km: number; price: number; day: number };
/** `from`/`to` are null when that end of the price range is left open. */
export type Filters = { radius: number; from: number | null; to: number | null; days: number[] };

export const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;
export const MAX_KM = 60;
export const DEFAULTS: Filters = { radius: 25, from: 0, to: 720, days: [3, 4, 5, 6] };
export const CLEARED: Filters = { radius: MAX_KM, from: null, to: null, days: [] };

/** A small deterministic list of events, so the count is real and the same on every render. */
export function seedEvents(n = 560, seed = 59): Event[] {
  let s = seed >>> 0;
  const rnd = () => ((s = (s * 1664525 + 1013904223) >>> 0) / 2 ** 32);
  return Array.from({ length: n }, () => ({
    km: Math.round(rnd() ** 1.4 * MAX_KM * 10) / 10,
    price: Math.round(rnd() ** 2 * 1200),
    day: Math.floor(rnd() * 7),
  }));
}

/** How many events pass every filter. An open end doesn't filter; a "to" below "from" is read as the two swapped. */
export function matches(events: Event[], f: Filters): number {
  const a = f.from ?? 0, b = f.to ?? Infinity;
  const lo = Math.min(a, b), hi = Math.max(a, b);
  const days = new Set(f.days);
  return events.filter((e) => e.km <= f.radius && e.price >= lo && e.price <= hi && (days.size === 0 || days.has(e.day))).length;
}

/** The small count on each tab: how many constraints that tab is applying. */
export function badges(f: Filters): { place: number; price: number; date: number } {
  return {
    place: f.radius < MAX_KM ? 1 : 0,
    price: (f.from != null ? 1 : 0) + (f.to != null ? 1 : 0),
    date: f.days.length,
  };
}

/** Read a money field like "$1,200" as a whole number, clamped to the price range. */
export function parseMoney(raw: string, max = 1200): number | null {
  const digits = raw.replace(/[^0-9]/g, "");
  if (!digits) return null;
  return Math.min(max, Number(digits));
}
