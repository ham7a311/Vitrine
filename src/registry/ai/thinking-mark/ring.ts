import { bolt } from "./bolt";
import type { Vec } from "./geometry";

/**
 * An arc riding the ring (centre c, radius r) from angle a0 through `span` radians, sampled every `gap` px and
 * jittered across the ring by up to `rough`. A sine taper pins both ends to the ring.
 */
export function ride(c: Vec, r: number, a0: number, span: number, rough: number, gap: number, rand: () => number): Vec[] {
  const n = Math.max(3, Math.round((Math.abs(span) * r) / gap));
  const pts: Vec[] = [];
  for (let i = 0; i <= n; i++) {
    const k = i / n, a = a0 + span * k, o = (rand() - 0.5) * 2 * rough * Math.sin(Math.PI * k);
    pts.push({ x: c.x + Math.cos(a) * (r + o), y: c.y + Math.sin(a) * (r + o) });
  }
  return pts;
}

/** A spark leaving the ring at angle a, outwards, `reach` px long. */
export function spark(c: Vec, r: number, a: number, reach: number, rand: () => number): Vec[] {
  const lean = a + (rand() - 0.5) * 0.7;
  const p = { x: c.x + Math.cos(a) * r, y: c.y + Math.sin(a) * r };
  return bolt(p, { x: p.x + Math.cos(lean) * reach, y: p.y + Math.sin(lean) * reach }, reach * 0.35, 3, rand);
}
