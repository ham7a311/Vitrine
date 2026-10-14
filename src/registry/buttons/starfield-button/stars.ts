import { around, length, pointAt } from "./perimeter";

export type Star = { x: number; y: number; size: number; s: number; dist: number; bright: boolean };

const rand = (i: number, k: number) => { const x = Math.sin(i * 91.7 + k * 47.3) * 43758.5453; return x - Math.floor(x); };

/**
 * A ring of stars just outside the outline, spaced unevenly like a real sky, each with its distance
 * round the outline from s0 (for the reveal order). The same seed always gives the same sky.
 */
export function sky(w: number, h: number, r: number, s0: number, count: number, seed = 3): Star[] {
  const L = length(w, h, r), out: Star[] = [];
  for (let i = 0; i < count; i++) {
    const s = ((i + 0.15 + rand(i, seed) * 0.7) / count) * L;
    const p = pointAt(w, h, r, s);
    const off = 9 + rand(i, seed + 1) * 15;
    out.push({ x: p.x + p.nx * off, y: p.y + p.ny * off, size: 1.1 + rand(i, seed + 2) * 1.6, s, dist: Math.abs(around(s0, s, L)), bright: rand(i, seed + 3) > 0.72 });
  }
  return out;
}

/** Which stars to join: neighbours round the outline, skipping a few gaps so it reads as a figure, not a fence. */
export function lines(stars: Star[], seed = 3) {
  const order = [...stars].sort((a, b) => a.s - b.s);
  const pairs: [Star, Star][] = [];
  for (let i = 0; i < order.length; i++) {
    if (rand(i, seed + 9) < 0.28) continue;
    pairs.push([order[i], order[(i + 1) % order.length]]);
  }
  return pairs;
}
