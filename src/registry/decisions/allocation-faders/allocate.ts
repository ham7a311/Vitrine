export type Channel = { id: string; label: string; value: number };

/**
 * Move one channel to `target` and rebalance the others so the sum stays `total`.
 * Locked channels never change. The difference is shared across the unlocked
 * others in proportion to their current values (equally when they are all zero),
 * rounded to `step` by largest remainder so the sum is exact.
 */
export function move(channels: Channel[], id: string, target: number, locked: ReadonlySet<string>, total: number, step = 1): Channel[] {
  const units = (n: number) => Math.round(n / step);
  const T = units(total);
  const lockedSum = channels.reduce((a, c) => a + (c.id !== id && locked.has(c.id) ? units(c.value) : 0), 0);
  const free = channels.filter((c) => c.id !== id && !locked.has(c.id));
  if (!free.length) return channels;
  const own = Math.max(0, Math.min(T - lockedSum, units(target)));
  const remaining = T - lockedSum - own;
  const shares = split(remaining, free.map((c) => units(c.value)));
  const next = new Map(free.map((c, i) => [c.id, shares[i]]));
  return channels.map((c) => ({
    ...c,
    value: (c.id === id ? own : next.has(c.id) ? next.get(c.id)! : units(c.value)) * step,
  }));
}

/** Largest-remainder split of `amount` across `weights`; equal shares when every weight is zero. */
export function split(amount: number, weights: number[]): number[] {
  const sum = weights.reduce((a, b) => a + b, 0);
  const w = sum > 0 ? weights : weights.map(() => 1);
  const ws = sum > 0 ? sum : weights.length;
  const raw = w.map((x) => (amount * x) / ws);
  const out = raw.map(Math.floor);
  let left = amount - out.reduce((a, b) => a + b, 0);
  const order = raw.map((r, i) => [r - Math.floor(r), i] as const).sort((a, b) => b[0] - a[0] || a[1] - b[1]);
  for (let k = 0; left > 0; k = (k + 1) % order.length, left--) out[order[k][1]]++;
  return out;
}

/** Scale arbitrary starting values so they sum to `total` (used once, on mount). */
export function normalize(channels: Channel[], total: number, step = 1): Channel[] {
  const units = split(Math.round(total / step), channels.map((c) => Math.max(0, c.value)));
  return channels.map((c, i) => ({ ...c, value: units[i] * step }));
}
