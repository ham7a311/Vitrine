export type Pt = { x: number; y: number };

export const sum = (a: number[]) => a.reduce((s, v) => s + v, 0);

/** Relative change from previous to current, or null when there's nothing to compare against. */
export function delta(cur: number, prev: number) {
  return prev ? (cur - prev) / Math.abs(prev) : null;
}

/** A round axis maximum at or above v that splits into four round steps (600 → 1.2k → 1.8k → 2.4k). */
export function niceMax(v: number, steps = 4) {
  if (v <= 0) return steps;
  const raw = v / steps, p = 10 ** Math.floor(Math.log10(raw)), m = raw / p;
  const step = [1, 2, 2.5, 3, 4, 5, 6, 8, 10].find((c) => c >= m - 1e-9)! * p;
  return step * steps;
}

/** Stretch or squeeze a series to n points by linear interpolation (used to morph between ranges). */
export function resample(a: number[], n: number) {
  if (a.length === n) return a.slice();
  if (a.length === 1) return Array(n).fill(a[0]);
  return Array.from({ length: n }, (_, i) => {
    const t = (i / Math.max(1, n - 1)) * (a.length - 1), lo = Math.floor(t), hi = Math.min(a.length - 1, lo + 1);
    return a[lo] + (a[hi] - a[lo]) * (t - lo);
  });
}

/** The index nearest to x across a width split into n points. */
export function nearest(x: number, width: number, n: number) {
  if (n <= 1) return 0;
  return Math.max(0, Math.min(n - 1, Math.round((x / width) * (n - 1))));
}

/** A smooth path through points that never overshoots between them (monotone cubic, Fritsch–Carlson). */
export function monotone(p: Pt[]) {
  const n = p.length;
  if (n === 0) return "";
  if (n < 3) return p.map((q, i) => `${i ? "L" : "M"}${q.x.toFixed(2)},${q.y.toFixed(2)}`).join("");
  const dx: number[] = [], m: number[] = [];
  for (let i = 0; i < n - 1; i++) { dx.push(p[i + 1].x - p[i].x); m.push((p[i + 1].y - p[i].y) / (dx[i] || 1)); }
  const t = [m[0]];
  for (let i = 1; i < n - 1; i++) t.push(m[i - 1] * m[i] <= 0 ? 0 : (3 * (dx[i - 1] + dx[i])) / ((2 * dx[i] + dx[i - 1]) / m[i - 1] + (dx[i] + 2 * dx[i - 1]) / m[i]));
  t.push(m[n - 2]);
  let d = `M${p[0].x.toFixed(2)},${p[0].y.toFixed(2)}`;
  for (let i = 0; i < n - 1; i++) {
    const h = dx[i] / 3;
    d += `C${(p[i].x + h).toFixed(2)},${(p[i].y + t[i] * h).toFixed(2)} ${(p[i + 1].x - h).toFixed(2)},${(p[i + 1].y - t[i + 1] * h).toFixed(2)} ${p[i + 1].x.toFixed(2)},${p[i + 1].y.toFixed(2)}`;
  }
  return d;
}

export const compact = (n: number) =>
  Math.abs(n) >= 1e6 ? `${+(n / 1e6).toFixed(1)}M` : Math.abs(n) >= 1e3 ? `${+(n / 1e3).toFixed(1)}k` : `${Math.round(n)}`;

export const pct = (d: number | null) => (d === null ? "—" : `${d >= 0 ? "+" : "−"}${Math.abs(d * 100).toFixed(1)}%`);
