import { length, pointAt } from "./perimeter";

export type Tile = { x: number; y: number; angle: number; i: number; pips: [number, number] };

/** Dominoes stood round the outline every `spacing` px from s0 in direction dir, `out` px outside the edge, each facing outward. */
export function ring(w: number, h: number, r: number, s0: number, dir: 1 | -1, spacing = 11, out = 3): Tile[] {
  const n = Math.max(1, Math.floor(length(w, h, r) / spacing));
  return Array.from({ length: n }, (_, i) => {
    const p = pointAt(w, h, r, s0 + dir * i * spacing);
    // local "up" is the outward normal
    const angle = (Math.atan2(p.ny, p.nx) * 180) / Math.PI + 90;
    return { x: p.x + p.nx * out, y: p.y + p.ny * out, angle, i, pips: [((i * 5) % 6) + 1, ((i * 3 + 2) % 6) + 1] as [number, number] };
  });
}

/** How far a domino leans when it comes to rest on the next one (degrees); the last one lies flat. */
export const lean = (spacing: number, height: number) => (Math.asin(Math.min(1, spacing / height)) * 180) / Math.PI;

/** When each domino starts to fall: the chain speeds up as it goes, like the real thing. */
export function chain(n: number, first = 70, speedup = 0.965, floor = 26) {
  const out: number[] = [];
  let t = 0, step = first;
  for (let i = 0; i < n; i++) { out.push(Math.round(t)); t += step; step = Math.max(floor, step * speedup); }
  return out;
}
