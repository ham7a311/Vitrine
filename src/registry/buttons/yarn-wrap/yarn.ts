import { length, pointAt } from "./perimeter";

export type P = { x: number; y: number };

/**
 * A loose coil of yarn laid round the pill from s0: `turns` laps whose distance from the edge drifts
 * in and out on two slow waves, so the laps cross each other like a real wrapped thread.
 */
export function coil(w: number, h: number, r: number, s0: number, dir: 1 | -1, turns = 2.3, step = 3): P[] {
  const L = length(w, h, r), total = L * turns, n = Math.ceil(total / step);
  return Array.from({ length: n + 1 }, (_, k) => {
    const t = (k / n) * total, p = pointAt(w, h, r, s0 + dir * t);
    const off = 7 + 4 * Math.sin((2 * Math.PI * 3.3 * t) / L) + 2 * Math.sin((2 * Math.PI * 7.1 * t) / L + 1);
    return { x: p.x + p.nx * off, y: p.y + p.ny * off };
  });
}

/** Running lengths along a polyline. */
export function lengths(pts: P[]) {
  const out = [0];
  for (let i = 1; i < pts.length; i++) out.push(out[i - 1] + Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y));
  return out;
}

/** The point a distance d along a polyline, with its direction. */
export function along(pts: P[], lens: number[], d: number) {
  const D = Math.max(0, Math.min(lens[lens.length - 1], d));
  let i = 1;
  while (i < lens.length - 1 && lens[i] < D) i++;
  const a = pts[i - 1], b = pts[i], seg = lens[i] - lens[i - 1] || 1, k = (D - lens[i - 1]) / seg;
  return { x: a.x + (b.x - a.x) * k, y: a.y + (b.y - a.y) * k, angle: Math.atan2(b.y - a.y, b.x - a.x) };
}

export const toPath = (pts: P[]) => pts.map((p, i) => `${i ? "L" : "M"}${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join("");
