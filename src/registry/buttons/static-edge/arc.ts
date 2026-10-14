import { length, pointAt } from "./perimeter";

export type Vec = { x: number; y: number };

export function seeded(seed: number) {
  let s = seed >>> 0 || 1;
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
}

/** A jagged bolt from a to b by midpoint displacement: 2^depth + 1 points, ends fixed. */
export function bolt(a: Vec, b: Vec, rough: number, depth: number, rand: () => number): Vec[] {
  let pts = [a, b];
  let amp = rough;
  for (let d = 0; d < depth; d++) {
    const next: Vec[] = [pts[0]];
    for (let i = 0; i < pts.length - 1; i++) {
      const p = pts[i], q = pts[i + 1];
      const dx = q.x - p.x, dy = q.y - p.y, len = Math.hypot(dx, dy) || 1;
      const off = (rand() - 0.5) * 2 * amp;
      next.push({ x: (p.x + q.x) / 2 - (dy / len) * off, y: (p.y + q.y) / 2 + (dx / len) * off }, q);
    }
    pts = next; amp *= 0.55;
  }
  return pts;
}

/** An arc crawling along the outline from s0 for `len` px, `out` px outside it, jittered across the edge and pinned to it at both ends. */
export function crawl(w: number, h: number, r: number, s0: number, len: number, out: number, rough: number, rand: () => number): Vec[] {
  const n = Math.max(4, Math.round(len / 4));
  const pts: Vec[] = [];
  for (let i = 0; i <= n; i++) {
    const k = i / n, p = pointAt(w, h, r, s0 + k * len);
    const taper = Math.sin(Math.PI * k);
    const o = out * taper + (rand() - 0.5) * 2 * rough * taper;
    pts.push({ x: p.x + p.nx * o, y: p.y + p.ny * o });
  }
  return pts;
}

/** A fork leaving `from` outwards along the normal at s, `reach` px long. */
export function fork(w: number, h: number, r: number, s: number, reach: number, rand: () => number): Vec[] {
  const p = pointAt(w, h, r, s), side = (rand() - 0.5) * 1.2;
  const end = { x: p.x + (p.nx + p.tx * side) * reach, y: p.y + (p.ny + p.ty * side) * reach };
  return bolt({ x: p.x, y: p.y }, end, reach * 0.35, 3, rand);
}

export { length, pointAt };
