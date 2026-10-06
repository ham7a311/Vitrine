// Progress arithmetic.
export const clamp = (v: number, lo = 0, hi = 100) => Math.min(hi, Math.max(lo, Number.isFinite(v) ? v : lo));
