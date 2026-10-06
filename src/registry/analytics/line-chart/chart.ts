// Chart arithmetic shared by the line, bar and donut charts: scales, ticks, curves, stacks and arcs.

/** A linear map from one range to another. */
export const scale = (d0: number, d1: number, r0: number, r1: number) => (v: number) => (d1 === d0 ? (r0 + r1) / 2 : r0 + ((v - d0) / (d1 - d0)) * (r1 - r0));

/** Round axis ticks (1, 2, 2.5 or 5 × 10ⁿ) covering [lo, hi], starting at zero when the data is all positive. */
export function niceTicks(lo: number, hi: number, count = 4) {
  if (!(hi > lo)) hi = lo + 1;
  const raw = (hi - lo) / Math.max(1, count);
  const mag = Math.pow(10, Math.floor(Math.log10(raw)));
  const step = [1, 2, 2.5, 5, 10].map((m) => m * mag).find((s) => s >= raw) ?? 10 * mag;
  const start = Math.floor(lo / step) * step, end = Math.ceil(hi / step) * step;
  const ticks: number[] = [];
  for (let v = start; v <= end + step * 1e-9; v += step) ticks.push(+v.toFixed(10));
  return { ticks, lo: start, hi: end, step };
}

/** Slopes for a monotone cubic through the points (Fritsch–Carlson), so the curve never overshoots the data. */
function slopes(p: [number, number][]) {
  const n = p.length, d: number[] = [], m: number[] = new Array(n).fill(0);
  for (let i = 0; i < n - 1; i++) d.push((p[i + 1][1] - p[i][1]) / (p[i + 1][0] - p[i][0] || 1));
  if (n < 2) return m;
  m[0] = d[0]; m[n - 1] = d[n - 2];
  for (let i = 1; i < n - 1; i++) m[i] = d[i - 1] * d[i] <= 0 ? 0 : (d[i - 1] + d[i]) / 2;
  for (let i = 0; i < n - 1; i++) {
    if (d[i] === 0) { m[i] = 0; m[i + 1] = 0; continue; }
    const a = m[i] / d[i], b = m[i + 1] / d[i], s = a * a + b * b;
    if (s > 9) { const t = 3 / Math.sqrt(s); m[i] = t * a * d[i]; m[i + 1] = t * b * d[i]; }
  }
  return m;
}

/** An SVG path through the points as a monotone cubic. */
export function monotonePath(p: [number, number][]) {
  if (!p.length) return "";
  if (p.length === 1) return `M${p[0][0]},${p[0][1]}`;
  const m = slopes(p), f = (v: number) => +v.toFixed(2);
  let s = `M${f(p[0][0])},${f(p[0][1])}`;
  for (let i = 0; i < p.length - 1; i++) {
    const h = (p[i + 1][0] - p[i][0]) / 3;
    s += `C${f(p[i][0] + h)},${f(p[i][1] + m[i] * h)} ${f(p[i + 1][0] - h)},${f(p[i + 1][1] - m[i + 1] * h)} ${f(p[i + 1][0])},${f(p[i + 1][1])}`;
  }
  return s;
}

/** Evaluate the same monotone curve at `n` evenly spaced x positions (for animating between datasets of different lengths). */
export function sampleMonotone(p: [number, number][], n: number): [number, number][] {
  if (p.length < 2) return Array.from({ length: n }, (_, i) => [p[0]?.[0] ?? i, p[0]?.[1] ?? 0]);
  const m = slopes(p), x0 = p[0][0], x1 = p[p.length - 1][0], out: [number, number][] = [];
  let k = 0;
  for (let i = 0; i < n; i++) {
    const x = x0 + ((x1 - x0) * i) / (n - 1);
    while (k < p.length - 2 && x > p[k + 1][0]) k++;
    const h = p[k + 1][0] - p[k][0] || 1, t = (x - p[k][0]) / h;
    const t2 = t * t, t3 = t2 * t;
    const y = (2 * t3 - 3 * t2 + 1) * p[k][1] + (t3 - 2 * t2 + t) * h * m[k] + (-2 * t3 + 3 * t2) * p[k + 1][1] + (t3 - t2) * h * m[k + 1];
    out.push([x, y]);
  }
  return out;
}

/** Index of the x closest to `x` in a sorted list. */
export function nearest(xs: number[], x: number) {
  let lo = 0, hi = xs.length - 1;
  if (hi < 0) return -1;
  while (hi - lo > 1) { const mid = (lo + hi) >> 1; if (xs[mid] <= x) lo = mid; else hi = mid; }
  return Math.abs(xs[lo] - x) <= Math.abs(xs[hi] - x) ? lo : hi;
}

/** Stacked offsets: for each category, the running [start, end] of every series. */
export function stack(series: number[][]) {
  const n = series[0]?.length ?? 0;
  return series.map((_, s) => Array.from({ length: n }, (_, i) => {
    let start = 0;
    for (let k = 0; k < s; k++) start += series[k][i];
    return [start, start + series[s][i]] as [number, number];
  }));
}

/** Angles for a donut: each value's [start, end] in radians from 12 o'clock, clockwise, leaving `gap` radians between parts. */
export function arcs(values: number[], gap = 0) {
  const total = values.reduce((a, b) => a + Math.max(0, b), 0);
  if (!total) return values.map(() => [0, 0] as [number, number]);
  const live = values.filter((v) => v > 0).length;
  const room = Math.PI * 2 - (live > 1 ? gap * live : 0);
  let a = 0;
  return values.map((v) => {
    const sweep = (Math.max(0, v) / total) * room;
    const out: [number, number] = [a, a + sweep];
    a += sweep + (v > 0 && live > 1 ? gap : 0);
    return out;
  });
}

/** An annular sector path, angles from 12 o'clock clockwise. */
export function arcPath(cx: number, cy: number, r0: number, r1: number, a0: number, a1: number) {
  const pt = (r: number, a: number) => `${+(cx + r * Math.sin(a)).toFixed(2)},${+(cy - r * Math.cos(a)).toFixed(2)}`;
  const large = a1 - a0 > Math.PI ? 1 : 0;
  return `M${pt(r1, a0)}A${r1},${r1} 0 ${large} 1 ${pt(r1, a1)}L${pt(r0, a1)}A${r0},${r0} 0 ${large} 0 ${pt(r0, a0)}Z`;
}

/** 1,240 · 12.4k · 1.2M, for axis labels and readouts. */
export function short(n: number) {
  const a = Math.abs(n);
  if (a >= 1e6) return `${+(n / 1e6).toFixed(a >= 1e7 ? 0 : 1)}M`;
  if (a >= 1e4) return `${+(n / 1e3).toFixed(a >= 1e5 ? 0 : 1)}k`;
  return n.toLocaleString("en-US", { maximumFractionDigits: 1 });
}
