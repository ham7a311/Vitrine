/** Columns for a container width: 4 from 1180px, 3 from 860px, 2 from 560px, else 1. */
export function columnsFor(width: number) {
  if (width >= 1180) return 4;
  if (width >= 860) return 3;
  if (width >= 560) return 2;
  return 1;
}

/**
 * Place items, in order, into the currently shortest column (ties go left). Each column keeps its items in
 * list order, so reading down a column never goes backwards in time.
 */
export function place(heights: number[], columns: number, gap = 0): number[][] {
  const n = Math.max(1, columns);
  const cols: number[][] = Array.from({ length: n }, () => []);
  const sum = new Array(n).fill(0);
  heights.forEach((h, i) => {
    let best = 0;
    for (let c = 1; c < n; c++) if (sum[c] < sum[best] - 0.5) best = c;
    cols[best].push(i);
    sum[best] += (Number.isFinite(h) && h > 0 ? h : 160) + (cols[best].length > 1 ? gap : 0);
  });
  return cols;
}

/** A height guess before anything is measured: header, footer and wrapped lines of body text. */
export function estimate(text: string, width: number) {
  const perLine = Math.max(18, Math.floor((width - 56) / 8.6));
  const lines = text.split("\n").reduce((n, para) => n + Math.max(1, Math.ceil(para.length / perLine)), 0);
  return 128 + Math.min(lines, 9) * 27;
}

/** "Mar 4, 2026" in the reader's locale, stable on the server by using UTC. */
export function shortDate(iso: string, locale?: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString(locale, { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });
}
