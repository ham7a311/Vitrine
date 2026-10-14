/** A climb to a goal: a ridge that rises to a summit, and where along it a value sits. */

export type P = { x: number; y: number };

export function seeded(seed: number) {
  let s = seed >>> 0 || 1;
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
}

/** A ridge of n points from the base (x 0, y 0) to the summit (x 1, y 1): an eased rise with a few false summits. */
export function ridge(n = 48, seed = 3): P[] {
  const rand = seeded(seed);
  const bumps = Array.from({ length: 4 }, () => ({ at: 0.15 + rand() * 0.7, w: 0.05 + rand() * 0.06, h: 0.04 + rand() * 0.06 }));
  return Array.from({ length: n + 1 }, (_, i) => {
    const x = i / n;
    let y = x ** 1.35;
    for (const b of bumps) y += b.h * Math.exp(-(((x - b.at) / b.w) ** 2)) - b.h * 0.6 * Math.exp(-(((x - b.at - b.w * 1.6) / b.w) ** 2));
    return { x, y: i === 0 ? 0 : i === n ? 1 : Math.min(0.97, Math.max(0, y)) };
  });
}

/** The ridge's height at x (0–1), interpolated. */
export function heightAt(r: P[], x: number) {
  const k = Math.max(0, Math.min(1, x)) * (r.length - 1), i = Math.min(r.length - 2, Math.floor(k));
  return r[i].y + (r[i + 1].y - r[i].y) * (k - i);
}

/** How far a value is towards the goal (0–1). */
export const progress = (value: number, goal: number) => (goal > 0 ? Math.max(0, Math.min(1, value / goal)) : 0);

/** The part of a ridge up to x, as points. */
export const upTo = (r: P[], x: number) => [...r.filter((p) => p.x < x), { x, y: heightAt(r, x) }];
