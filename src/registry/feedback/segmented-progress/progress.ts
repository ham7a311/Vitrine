// Progress arithmetic.
export const clamp = (v: number, lo = 0, hi = 100) => Math.min(hi, Math.max(lo, Number.isFinite(v) ? v : lo));

/** How full each of `steps` equal segments is (0–1) at `value` percent. */
export function segments(value: number, steps: number) {
  const n = Math.max(1, Math.round(steps)), v = (clamp(value) / 100) * n;
  return Array.from({ length: n }, (_, i) => clamp(v - i, 0, 1));
}
