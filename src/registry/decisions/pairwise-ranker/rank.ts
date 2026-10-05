/**
 * Ranking by binary insertion: each new item is placed into the ranked list
 * by asking "this or that?" against the middle of the range it could still go.
 * Every state is rebuilt from the item order plus the answers so far, so undo
 * is just "replay one answer fewer".
 */
export type RankState = {
  ids: string[];
  /** Ranked so far, best first. */
  ranked: string[];
  /** Still to place, in order. */
  queue: string[];
  /** The item being placed and the slice of `ranked` it could still land in. */
  current: string | null;
  lo: number;
  hi: number;
  answers: Answer[];
  /** The id placed by the latest answer, if that answer finished placing one. */
  placed: string | null;
};
/** The id that won, or "tie" when they matter about the same. */
export type Answer = string;

const settle = (s: RankState): RankState => {
  if (s.current && s.lo >= s.hi) {
    const ranked = [...s.ranked.slice(0, s.lo), s.current, ...s.ranked.slice(s.lo)];
    return settle({ ...s, ranked, placed: s.current, current: null });
  }
  if (!s.current && s.queue.length) {
    const [current, ...queue] = s.queue;
    return settle({ ...s, current, queue, lo: 0, hi: s.ranked.length });
  }
  return s;
};

export function start(ids: string[]): RankState {
  return settle({ ids, ranked: ids.slice(0, 1), queue: ids.slice(1), current: null, lo: 0, hi: 0, answers: [], placed: null });
}

/** The two items to compare now, with sides alternating so neither position is favoured. */
export function pair(s: RankState): [string, string] | null {
  if (!s.current) return null;
  const other = s.ranked[(s.lo + s.hi) >> 1];
  return s.answers.length % 2 ? [other, s.current] : [s.current, other];
}

export function answer(s: RankState, winner: Answer): RankState {
  const p = pair(s);
  if (!p || (winner !== "tie" && !p.includes(winner))) return s;
  const mid = (s.lo + s.hi) >> 1;
  let { lo, hi } = s;
  if (winner === "tie") lo = hi = mid + 1;
  else if (winner === s.current) hi = mid;
  else lo = mid + 1;
  return settle({ ...s, lo, hi, answers: [...s.answers, winner], placed: null });
}

export function undo(s: RankState): RankState {
  return s.answers.slice(0, -1).reduce(answer, start(s.ids));
}

/** Most questions still possible: what's left for the current item plus each queued insert. */
export function remaining(s: RankState): number {
  const lg = (n: number) => Math.ceil(Math.log2(n + 1));
  let n = s.current ? lg(s.hi - s.lo) : 0;
  let size = s.ranked.length + (s.current ? 1 : 0);
  for (let i = 0; i < s.queue.length; i++, size++) n += lg(size);
  return n;
}

export const done = (s: RankState) => !s.current && !s.queue.length;
