import { around, length, pointAt } from "./perimeter";

export type Tick = { x1: number; y1: number; x2: number; y2: number; rank: 0 | 1 | 2; s: number };

/** Ticks every `step` px round the outline, pointing out: a long one every 10th, a mid one every 5th. */
export function ticks(w: number, h: number, r: number, step = 4): Tick[] {
  const L = length(w, h, r), n = Math.floor(L / step);
  return Array.from({ length: n }, (_, i) => {
    const s = i * step, p = pointAt(w, h, r, s);
    const rank: Tick["rank"] = i % 10 === 0 ? 2 : i % 5 === 0 ? 1 : 0;
    const len = [3.5, 6, 9][rank], gap = 3;
    return { x1: p.x + p.nx * gap, y1: p.y + p.ny * gap, x2: p.x + p.nx * (gap + len), y2: p.y + p.ny * (gap + len), rank, s };
  });
}

/** How long after the hover a tick at s draws in: spreading both ways from the entry point. */
export function delay(s: number, s0: number, L: number, msPerPx = 1.1) {
  return Math.round(Math.abs(around(s0, s, L)) * msPerPx);
}

/** Ruler numbers along the top edge's straight part, every `every` px from the left. */
export function marks(w: number, r: number, every = 40) {
  const out: number[] = [];
  for (let x = Math.ceil(r / every) * every; x <= w - r; x += every) out.push(x);
  return out;
}

export { length };
