/** Equal visual weight for marks of any shape: size by area, clamped to the slot. */
export function balance(ratio: number, area: number, maxW: number, maxH: number) {
  const r = Number.isFinite(ratio) && ratio > 0 ? ratio : 3;
  let h = Math.sqrt(area / r), w = h * r;
  if (w > maxW) { w = maxW; h = w / r; }
  if (h > maxH) { h = maxH; w = h * r; }
  return { width: Math.round(w), height: Math.round(h) };
}

/** A tier's cards: its sponsors, then its open places (one if the tier has no limit). */
export function cards<T>(sponsors: T[], capacity?: number): ({ kind: "filled"; sponsor: T } | { kind: "open" })[] {
  const open = capacity === undefined ? 1 : Math.max(0, capacity - sponsors.length);
  return [...sponsors.map((sponsor) => ({ kind: "filled" as const, sponsor })), ...Array.from({ length: open }, () => ({ kind: "open" as const }))];
}

/** Whole-dollar money, e.g. "$2,450". */
export function money(cents: number, currency = "USD", locale = "en-US") {
  return new Intl.NumberFormat(locale, { style: "currency", currency, maximumFractionDigits: 0 }).format(Math.round(cents / 100));
}

/** Share of the goal raised, 0–1, never above 1 even when the goal is passed. */
export function progress(raised: number, goal: number) {
  if (!(goal > 0)) return 0;
  return Math.max(0, Math.min(1, raised / goal));
}

/** Up to `max` people to draw, and how many more there are. */
export function crowd<T>(people: T[], total: number | undefined, max: number) {
  const shown = people.slice(0, max);
  const all = Math.max(total ?? people.length, people.length);
  return { shown, more: all - shown.length };
}
