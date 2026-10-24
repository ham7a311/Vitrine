import type { Vec } from "./geometry";
import { seeded } from "./random";

/** One trace: a polyline out from the mark, its cumulative lengths, and the pad at its far end. */
export type Trace = { pts: Vec[]; cum: number[]; len: number; pad: Vec; angle: number };

/**
 * Traces radiating from a mark at the centre of a `box` square, routed like a circuit board: a short radial lead
 * from r0 to r1, then octilinear (multiples of 45°) to r2, then one 45° turn out to r3, where it ends in a pad.
 */
export function route(box: number, count: number, r0: number, r1: number, r2: number, r3: number, seed: number): Trace[] {
  const rand = seeded(seed), c = { x: box / 2, y: box / 2 }, out: Trace[] = [];
  const at = (a: number, r: number) => ({ x: c.x + Math.cos(a) * r, y: c.y + Math.sin(a) * r });
  for (let i = 0; i < count; i++) {
    const a = ((i + 0.5 + (rand() - 0.5) * 0.4) / count) * Math.PI * 2;
    const p0 = at(a, r0), p1 = at(a, r1);
    const d1 = Math.round(a / (Math.PI / 4)) * (Math.PI / 4);
    // Run along d1 until reaching radius r2 (solve |p1 + t·u| = r2 for t ≥ 0).
    const reach = (from: Vec, d: number, r: number) => {
      const ux = Math.cos(d), uy = Math.sin(d), fx = from.x - c.x, fy = from.y - c.y;
      const b = fx * ux + fy * uy, t = -b + Math.sqrt(Math.max(0, b * b - (fx * fx + fy * fy - r * r)));
      return { x: from.x + ux * t, y: from.y + uy * t };
    };
    const p2 = reach(p1, d1, r2);
    const turn = (a - d1 >= 0 ? 1 : -1) * (Math.PI / 4);
    const p3 = reach(p2, d1 + turn, r3);
    const pts = [p0, p1, p2, p3], cum = [0];
    for (let k = 1; k < pts.length; k++) cum.push(cum[k - 1] + Math.hypot(pts[k].x - pts[k - 1].x, pts[k].y - pts[k - 1].y));
    out.push({ pts, cum, len: cum[cum.length - 1], pad: p3, angle: a });
  }
  return out;
}

/** The point at distance s along a trace. */
export function along(t: Trace, s: number): Vec {
  const d = Math.max(0, Math.min(t.len, s));
  let k = 1;
  while (k < t.cum.length - 1 && t.cum[k] < d) k++;
  const a = t.pts[k - 1], b = t.pts[k], f = (d - t.cum[k - 1]) / (t.cum[k] - t.cum[k - 1] || 1);
  return { x: a.x + (b.x - a.x) * f, y: a.y + (b.y - a.y) * f };
}

/** SVG path data for a trace. */
export const pathOf = (t: Trace) => t.pts.map((p, i) => `${i ? "L" : "M"}${p.x.toFixed(2)} ${p.y.toFixed(2)}`).join(" ");
