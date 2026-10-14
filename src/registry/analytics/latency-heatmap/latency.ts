/** Log-spaced latency buckets, percentiles from a histogram, and region sums for a latency heatmap. */

/** n buckets between lo and hi ms, spaced evenly on a log scale: n + 1 edges. */
export function edges(lo: number, hi: number, n: number) {
  const a = Math.log(lo), b = Math.log(hi);
  return Array.from({ length: n + 1 }, (_, i) => Math.exp(a + ((b - a) * i) / n));
}

/** The latency below which a share p (0–1) of the requests fall, interpolated on the log scale inside its bucket. */
export function percentile(hist: number[], e: number[], p: number) {
  const total = hist.reduce((s, v) => s + v, 0);
  if (!total) return null;
  const want = p * total;
  let cum = 0;
  for (let i = 0; i < hist.length; i++) {
    if (cum + hist[i] >= want && hist[i] > 0) {
      const k = (want - cum) / hist[i];
      return Math.exp(Math.log(e[i]) + (Math.log(e[i + 1]) - Math.log(e[i])) * k);
    }
    cum += hist[i];
  }
  return e[e.length - 1];
}

/** Requests in columns c0..c1 and buckets r0..r1 (inclusive, either order). */
export function region(grid: number[][], c0: number, c1: number, r0: number, r1: number) {
  const [ca, cb] = c0 <= c1 ? [c0, c1] : [c1, c0], [ra, rb] = r0 <= r1 ? [r0, r1] : [r1, r0];
  let n = 0, all = 0;
  for (let c = ca; c <= cb; c++) for (let r = 0; r < grid[c].length; r++) { all += grid[c][r]; if (r >= ra && r <= rb) n += grid[c][r]; }
  return { n, all, share: all ? n / all : 0 };
}

/** 0–1 shade for a count, on a log scale so quiet cells still show. */
export const level = (v: number, max: number) => (v > 0 && max > 0 ? Math.log1p(v) / Math.log1p(max) : 0);

export function ms(v: number) {
  if (v < 1000) return `${v < 10 ? v.toFixed(1) : Math.round(v)} ms`;
  return `${(v / 1000).toFixed(v < 10000 ? 1 : 0)} s`;
}
