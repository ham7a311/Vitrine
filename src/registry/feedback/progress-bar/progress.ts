// Progress arithmetic.
export const clamp = (v: number, lo = 0, hi = 100) => Math.min(hi, Math.max(lo, Number.isFinite(v) ? v : lo));

/** "7.2 GB of 10 GB" style amounts; whole numbers stay whole. */
export function amount(value: number, total: number, unit: string) {
  const used = (clamp(value) / 100) * total;
  const f = (n: number) => (Number.isInteger(n) ? String(n) : n.toFixed(1));
  return `${f(Math.round(used * 10) / 10)} ${unit} of ${f(total)} ${unit}`;
}
