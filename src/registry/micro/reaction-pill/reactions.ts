/** Dock-style magnification: discs swell as the pointer nears them, falling off smoothly. */
export function magnify(centre: number, pointer: number | null, reach = 64, gain = 0.42) {
  if (pointer === null) return 1;
  const d = (pointer - centre) / reach;
  return 1 + gain * Math.exp(-d * d);
}

export type Counts = Record<string, number>;

/** Counts after the viewer changes their reaction from `from` to `to` (either may be null). */
export function tally(counts: Counts, from: string | null, to: string | null): Counts {
  const out = { ...counts };
  if (from && from !== to) out[from] = Math.max(0, (out[from] ?? 0) - 1);
  if (to && from !== to) out[to] = (out[to] ?? 0) + 1;
  return out;
}

/** Total and the three most used reactions, most used first. */
export function summary(counts: Counts) {
  const entries = Object.entries(counts).filter(([, n]) => n > 0).sort((a, b) => b[1] - a[1]);
  return { total: entries.reduce((s, [, n]) => s + n, 0), top: entries.slice(0, 3).map(([k]) => k) };
}

/** "1,284" in the reader's locale, compact above ten thousand: "12K". */
export function shortCount(n: number) {
  return n >= 10000 ? `${Math.floor(n / 1000)}K` : n.toLocaleString("en-US");
}
