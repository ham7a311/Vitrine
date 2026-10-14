import { length, pointAt } from "./perimeter";

export type Animal = "pup" | "cat" | "bird";
export type Gait = { stride: number; ms: number; spread: number; out: number; pairs: boolean; size: number };

/** How each animal walks: distance per step, time per step, how far apart the feet are and how far outside the edge. */
export const GAITS: Record<Animal, Gait> = {
  pup: { stride: 21, ms: 170, spread: 6, out: 15, pairs: false, size: 15 },
  cat: { stride: 17, ms: 150, spread: 4, out: 13, pairs: false, size: 12 },
  bird: { stride: 30, ms: 260, spread: 5, out: 13, pairs: true, size: 13 },
};

export type Print = { x: number; y: number; angle: number; side: -1 | 1 };

/**
 * The prints for step `n` of a walk starting at distance s0 round a w × h pill (corner radius r),
 * going clockwise (dir 1) or anticlockwise (dir −1). Walkers alternate feet; hoppers land both at once.
 */
export function step(n: number, s0: number, dir: 1 | -1, w: number, h: number, r: number, g: Gait): Print[] {
  const s = s0 + dir * n * g.stride;
  const p = pointAt(w, h, r, s);
  const angle = (Math.atan2(p.ty * dir, p.tx * dir) * 180) / Math.PI + 90;
  const place = (side: -1 | 1): Print => {
    // feet sit either side of a line just outside the edge; "left" is the walker's left
    const off = g.out + side * dir * g.spread;
    return { x: p.x + p.nx * off, y: p.y + p.ny * off, angle, side };
  };
  if (g.pairs) return [place(-1), place(1)];
  return [place(n % 2 === 0 ? -1 : 1)];
}

/** Steps in one lap. */
export const lap = (w: number, h: number, r: number, g: Gait) => Math.max(1, Math.round(length(w, h, r) / g.stride));
