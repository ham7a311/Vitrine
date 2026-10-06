/** Ranks known paths against a path that doesn't exist, and aligns them so the differences can be shown. */

export type Route = { path: string; title: string };
export type Mark = { ch: string; changed: boolean };
export type Match = { route: Route; distance: number; asked: Mark[]; found: Mark[] };

export const normalise = (p: string) => {
  const clean = p.split(/[?#]/)[0].trim().toLowerCase().replace(/\/{2,}/g, "/");
  return clean.length > 1 ? clean.replace(/\/$/, "") : clean || "/";
};
const last = (p: string) => p.split("/").filter(Boolean).pop() ?? "";

/** Levenshtein table, kept whole so the alignment can be traced back through it. */
function table(a: string, b: string) {
  const d: number[][] = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)]);
  for (let j = 1; j <= b.length; j++) d[0][j] = j;
  for (let i = 1; i <= a.length; i++)
    for (let j = 1; j <= b.length; j++)
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
  return d;
}

export const distance = (a: string, b: string) => table(a, b)[a.length][b.length];

/** Which characters of `a` have no partner in `b`, and which of `b` have none in `a`. */
export function align(a: string, b: string) {
  const d = table(a, b);
  const asked: Mark[] = a.split("").map((ch) => ({ ch, changed: false }));
  const found: Mark[] = b.split("").map((ch) => ({ ch, changed: false }));
  let i = a.length, j = b.length;
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && d[i][j] === d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)) {
      if (a[i - 1] !== b[j - 1]) { asked[i - 1].changed = true; found[j - 1].changed = true; }
      i--; j--;
    } else if (i > 0 && d[i][j] === d[i - 1][j] + 1) { asked[i - 1].changed = true; i--; }
    else { found[j - 1].changed = true; j--; }
  }
  return { asked, found };
}

/** The closest routes, best first. A slug that is nearly right under the wrong section still counts, at a small penalty. */
export function nearest(asked: string, routes: Route[], limit = 3): Match[] {
  const a = normalise(asked);
  return routes
    .map((route) => {
      const p = normalise(route.path);
      const score = Math.min(distance(a, p), distance(last(a), last(p)) + 3);
      return { route, p, score };
    })
    .filter((r) => r.p !== a)
    .filter((r) => r.score <= Math.max(2, Math.ceil(0.25 * Math.max(a.length, r.p.length))))
    .sort((x, y) => x.score - y.score || x.p.length - y.p.length)
    .slice(0, limit)
    .map((r) => ({ route: r.route, distance: distance(a, r.p), ...align(a, r.p) }));
}
