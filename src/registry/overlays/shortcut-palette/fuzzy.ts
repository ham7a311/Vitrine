/** A small subsequence matcher: every typed character must appear in order. Returns a score and the matched positions. */

export type Hit = { score: number; at: number[] };

export function fuzzy(query: string, text: string): Hit | null {
  const q = query.toLowerCase().replace(/\s+/g, "");
  if (!q) return { score: 0, at: [] };
  const t = text.toLowerCase();
  const at: number[] = [];
  let score = 0, from = 0, run = 0;
  for (const ch of q) {
    const i = t.indexOf(ch, from);
    if (i === -1) return null;
    const startOfWord = i === 0 || /[\s\-_/.]/.test(t[i - 1]);
    // Reward word starts and unbroken runs; charge for distance covered.
    if (i === from && at.length) { run++; score += 6 + run; } else run = 0;
    if (startOfWord) score += 9;
    score -= (i - from) * 0.6;
    at.push(i);
    from = i + 1;
  }
  if (t.startsWith(q)) score += 20;
  return { score: score - text.length * 0.08, at };
}

/** Best match across a label (highlightable) and loose keywords (not highlightable). */
export function rank<T extends { label: string; keywords?: string }>(query: string, items: T[]) {
  return items
    .map((item, order) => {
      const label = fuzzy(query, item.label);
      const kw = !label && item.keywords ? fuzzy(query, item.keywords) : null;
      return { item, order, at: label?.at ?? [], score: label ? label.score : kw ? kw.score - 12 : -Infinity };
    })
    .filter((r) => r.score > -Infinity)
    .sort((a, b) => b.score - a.score || a.order - b.order);
}
