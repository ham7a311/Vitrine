/** A deck of questions: helpful ones are cleared, unclear ones are kept for support, skipped ones go to the back. */

export type Card = { id: string; topic: string; q: string; a: string };
export type Deck = { queue: string[]; helped: string[]; unclear: string[] };
export type Verdict = "helpful" | "unclear" | "skip";

export const start = (cards: Card[]): Deck => ({ queue: cards.map((c) => c.id), helped: [], unclear: [] });

export function judge(d: Deck, v: Verdict): Deck {
  const [top, ...rest] = d.queue;
  if (!top) return d;
  if (v === "skip") return rest.length ? { ...d, queue: [...rest, top] } : d;
  return v === "helpful" ? { ...d, queue: rest, helped: [...d.helped, top] } : { ...d, queue: rest, unclear: [...d.unclear, top] };
}

/** Whether a drag has gone far enough to count, and which way. */
export function release(dx: number, threshold = 110): Verdict | null {
  if (dx > threshold) return "helpful";
  if (dx < -threshold) return "unclear";
  return null;
}

export const answered = (d: Deck) => d.helped.length + d.unclear.length;
