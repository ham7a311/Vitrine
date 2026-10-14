/** Placing event pins without overlaps, and measuring what changed around an event. */

/** Give each pin (sorted by x) the lowest lane where it's at least `gap` px from the last pin in that lane. */
export function lanes(xs: number[], gap: number, max = 3) {
  const ends: number[] = [];
  return xs.map((x) => {
    let lane = ends.findIndex((e) => x - e >= gap);
    if (lane === -1) lane = ends.length < max ? ends.length : ends.indexOf(Math.min(...ends));
    ends[lane] = x;
    return lane;
  });
}

const mean = (a: number[]) => (a.length ? a.reduce((s, v) => s + v, 0) / a.length : NaN);

/** The average over `win` points from i against the `win` points before it. */
export function impact(values: number[], i: number, win: number) {
  const before = mean(values.slice(Math.max(0, i - win), i));
  const after = mean(values.slice(i, Math.min(values.length, i + win)));
  return { before, after, change: after - before, rel: before ? (after - before) / Math.abs(before) : 0 };
}

/** The next visible pin from `from` in direction dir (clamped at the ends). */
export function next<T>(visible: T[], from: T, dir: 1 | -1) {
  const at = visible.indexOf(from);
  if (at === -1) return visible[dir > 0 ? 0 : visible.length - 1];
  return visible[Math.max(0, Math.min(visible.length - 1, at + dir))];
}
