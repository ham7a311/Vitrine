/** Scroll-spy maths: which section you're reading and how far through each chapter you are. */

/** The section being read: the last one whose top is at or above `pos`, with how far through it you are (0–1). */
export function spy(tops: number[], pos: number, end: number) {
  if (!tops.length) return { index: -1, frac: 0 };
  let i = 0;
  for (let k = 0; k < tops.length; k++) if (tops[k] <= pos) i = k;
  if (pos < tops[0]) return { index: 0, frac: 0 };
  const next = i + 1 < tops.length ? tops[i + 1] : end;
  return { index: i, frac: Math.max(0, Math.min(1, (pos - tops[i]) / Math.max(1, next - tops[i]))) };
}

/** How full each section's piece of the rail is: read ones full, the current one partly, the rest empty. */
export function fills(count: number, at: { index: number; frac: number }) {
  return Array.from({ length: count }, (_, k) => (k < at.index ? 1 : k === at.index ? at.frac : 0));
}

/** Progress through a chapter given the fills of its sections. */
export const progress = (f: number[]) => (f.length ? f.reduce((s, v) => s + v, 0) / f.length : 0);

/** Split text around case-insensitive matches of q, for highlighting. */
export function marks(text: string, q: string) {
  const query = q.trim().toLowerCase();
  if (!query) return [{ text, hit: false }];
  const out: { text: string; hit: boolean }[] = [];
  const lower = text.toLowerCase();
  let i = 0;
  for (let j = lower.indexOf(query); j !== -1; j = lower.indexOf(query, i)) {
    if (j > i) out.push({ text: text.slice(i, j), hit: false });
    out.push({ text: text.slice(j, j + query.length), hit: true });
    i = j + query.length;
  }
  if (i < text.length) out.push({ text: text.slice(i), hit: false });
  return out;
}
