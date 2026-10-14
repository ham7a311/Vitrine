/** Snow settling on the top of a pill: a height per 2px column, limited by how steep the pill is there. */

export const COL = 2;

/** The y of the pill's top edge at x (0 on the flat, rising to h/2 at the very ends). */
export function surface(w: number, r: number, x: number) {
  if (x < r) return r - Math.sqrt(Math.max(0, r * r - (r - x) ** 2));
  if (x > w - r) return r - Math.sqrt(Math.max(0, r * r - (x - (w - r)) ** 2));
  return 0;
}

/** The most snow each column can hold: full on the flat, sliding off as the shoulder steepens. */
export function limits(w: number, r: number, max: number) {
  const n = Math.max(1, Math.round(w / COL));
  return Array.from({ length: n }, (_, i) => {
    const x = (i + 0.5) * COL;
    const slope = Math.abs(surface(w, r, x + 0.5) - surface(w, r, x - 0.5));
    return max * Math.max(0, 1 - slope / 1.6) ** 1.5;
  });
}

/** Drop `amount` of snow at column i, spread over its neighbours. */
export function deposit(cap: number[], lim: number[], i: number, amount: number) {
  for (let k = -3; k <= 3; k++) {
    const j = i + k;
    if (j < 0 || j >= cap.length) continue;
    cap[j] = Math.min(lim[j], cap[j] + amount * Math.exp(-(k * k) / 4) * 0.42);
  }
}

/** Let steep steps slump into their neighbours so the drift stays soft. */
export function settle(cap: number[], lim: number[], step = 1.2) {
  for (let i = 0; i < cap.length - 1; i++) {
    const d = cap[i] - cap[i + 1];
    if (Math.abs(d) > step) {
      const move = (Math.abs(d) - step) / 2 * Math.sign(d);
      cap[i] -= move; cap[i + 1] = Math.min(lim[i + 1], cap[i + 1] + move);
    }
  }
}

export function seeded(seed: number) {
  let s = seed >>> 0 || 1;
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
}
