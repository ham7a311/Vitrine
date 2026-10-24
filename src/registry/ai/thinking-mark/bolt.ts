import type { Vec } from "./geometry";

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
    pts = next;
    amp *= 0.55;
  }
  return pts;
}
