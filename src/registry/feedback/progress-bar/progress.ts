// Progress arithmetic shared by every look.
export const clamp = (v: number, lo = 0, hi = 100) => Math.min(hi, Math.max(lo, Number.isFinite(v) ? v : lo));

/** How full each of `steps` equal segments is (0–1) at `value` percent. */
export function segments(value: number, steps: number) {
  const n = Math.max(1, Math.round(steps)), v = (clamp(value) / 100) * n;
  return Array.from({ length: n }, (_, i) => clamp(v - i, 0, 1));
}

/** stroke-dashoffset for a ring of radius r at `value` percent. */
export function ringOffset(r: number, value: number) {
  const c = 2 * Math.PI * r;
  return c * (1 - clamp(value) / 100);
}

/** "7.2 GB of 10 GB" style amounts; whole numbers stay whole. */
export function amount(value: number, total: number, unit: string) {
  const used = (clamp(value) / 100) * total;
  const f = (n: number) => (Number.isInteger(n) ? String(n) : n.toFixed(1));
  return `${f(Math.round(used * 10) / 10)} ${unit} of ${f(total)} ${unit}`;
}
