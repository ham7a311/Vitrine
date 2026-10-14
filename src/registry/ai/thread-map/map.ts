/** A conversation minimap: ticks scaled from the real turn heights, the visible window, and search. */

export type Turn = { id: string; role: "user" | "assistant"; text: string; code?: string; tool?: string };

/** Each turn's tick on a rail `railH` tall, from the turns' real tops and heights in a thread `total` tall. */
export function ticks(tops: number[], heights: number[], total: number, railH: number, gap = 2) {
  const k = total > 0 ? railH / total : 0;
  return tops.map((t, i) => ({ y: t * k, h: Math.max(3, heights[i] * k - gap) }));
}

/** The visible part of the thread as a box on the rail. */
export function view(scrollTop: number, clientH: number, total: number, railH: number) {
  if (total <= 0) return { y: 0, h: railH };
  const h = Math.max(18, (clientH / total) * railH);
  return { y: Math.min(railH - h, (scrollTop / total) * railH), h };
}

/** Where to scroll so the window centres on a point of the rail. */
export function scrollFor(railY: number, railH: number, clientH: number, total: number) {
  return Math.max(0, Math.min(total - clientH, (railY / railH) * total - clientH / 2));
}

/** Indices of turns whose text, code or tool mentions q (case-insensitive). */
export function search(turns: Turn[], q: string) {
  const s = q.trim().toLowerCase();
  if (!s) return [];
  return turns.flatMap((t, i) => (`${t.text} ${t.code ?? ""} ${t.tool ?? ""}`.toLowerCase().includes(s) ? [i] : []));
}

/** The turn being read: the last one whose top is within a third of the way down the view. */
export function current(tops: number[], scrollTop: number, clientH: number) {
  let at = 0;
  for (let i = 0; i < tops.length; i++) if (tops[i] <= scrollTop + clientH / 3) at = i;
  return at;
}
