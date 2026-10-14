import { around, length, pointAt } from "./perimeter";

export type Pt = { x: number; y: number; s: number };

/** A groove `d` px outside the pill's edge, sampled n times round it (each point keeps its outline distance s). */
export function groove(w: number, h: number, r: number, d: number, n = 160): Pt[] {
  const L = length(w, h, r);
  return Array.from({ length: n + 1 }, (_, i) => {
    const s = (i / n) * L, p = pointAt(w, h, r, s);
    return { x: p.x + p.nx * d, y: p.y + p.ny * d, s };
  });
}

/** Push a point away from c, strongest at c and fading over `radius` — how sand lines part round a stone. */
export function bend(p: { x: number; y: number }, c: { x: number; y: number }, radius: number, amount: number) {
  const dx = p.x - c.x, dy = p.y - c.y, dist = Math.hypot(dx, dy) || 1;
  const k = amount * Math.exp(-((dist / radius) ** 2));
  return { x: p.x + (dx / dist) * k, y: p.y + (dy / dist) * k };
}

/** Is outline distance s raked yet, when the rake has spread `progress` (0–1) both ways from s0? */
export const raked = (s: number, s0: number, L: number, progress: number) => Math.abs(around(s0, s, L)) <= (progress * L) / 2 + 1e-9;
