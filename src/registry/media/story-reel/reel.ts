/** Where a story viewer is: which person, which of their stories, and how far through it. */

export type Pos = { p: number; s: number; t: number };

/** Move on by dt seconds of a `dur`-second story; past the end it goes to the next story (and person, looping). */
export function tick(pos: Pos, dt: number, counts: number[], dur: number): Pos {
  const t = pos.t + dt / dur;
  return t >= 1 ? next(pos, counts) : { ...pos, t };
}

export function next(pos: Pos, counts: number[]): Pos {
  if (pos.s + 1 < counts[pos.p]) return { p: pos.p, s: pos.s + 1, t: 0 };
  return { p: (pos.p + 1) % counts.length, s: 0, t: 0 };
}

/** Back: a little way into a story, it restarts; at its start, the previous story (or the previous person's last). */
export function prev(pos: Pos, counts: number[]): Pos {
  if (pos.t > 0.15) return { ...pos, t: 0 };
  if (pos.s > 0) return { p: pos.p, s: pos.s - 1, t: 0 };
  const p = (pos.p - 1 + counts.length) % counts.length;
  return { p, s: counts[p] - 1, t: 0 };
}

/** Jump to someone's first story. */
export const person = (p: number, counts: number[]): Pos => ({ p: ((p % counts.length) + counts.length) % counts.length, s: 0, t: 0 });

/** How full each progress bar is for the current person. */
export const bars = (pos: Pos, count: number) => Array.from({ length: count }, (_, i) => (i < pos.s ? 1 : i === pos.s ? pos.t : 0));
