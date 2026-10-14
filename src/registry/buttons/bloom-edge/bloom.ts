import { length, pointAt } from "./perimeter";

/** An SVG path following the outline `out` px outside it, from s0 for `run` px in direction dir. */
export function vine(w: number, h: number, r: number, s0: number, dir: 1 | -1, run: number, out: number, wobble = 1.6) {
  const pts: string[] = [];
  const n = Math.max(2, Math.ceil(run / 4));
  for (let i = 0; i <= n; i++) {
    const s = s0 + dir * (i / n) * run, p = pointAt(w, h, r, s);
    const o = out + Math.sin(i * 0.55) * wobble; // a gentle meander, like a real stem
    pts.push(`${i ? "L" : "M"}${(p.x + p.nx * o).toFixed(1)} ${(p.y + p.ny * o).toFixed(1)}`);
  }
  return pts.join(" ");
}

export type Spot = { x: number; y: number; angle: number; dist: number; i: number };

/** Where things grow along both halves of the outline, nearest the start first. */
export function spots(w: number, h: number, r: number, s0: number, gap: number, out: number): Spot[] {
  const L = length(w, h, r), half = L / 2, list: Spot[] = [];
  let i = 0;
  for (let d = gap * 0.6; d < half - gap * 0.3; d += gap) {
    for (const dir of [1, -1] as const) {
      const p = pointAt(w, h, r, s0 + dir * d);
      list.push({ x: p.x + p.nx * out, y: p.y + p.ny * out, angle: (Math.atan2(p.ny, p.nx) * 180) / Math.PI + 90, dist: d, i: i++ });
    }
  }
  return list.sort((a, b) => a.dist - b.dist);
}

/** A seeded wobble in [−1, 1] so each spot looks hand-placed but stays stable. */
export const jitter = (i: number, k = 1) => { const x = Math.sin(i * 12.9898 + k * 78.233) * 43758.5453; return (x - Math.floor(x)) * 2 - 1; };
