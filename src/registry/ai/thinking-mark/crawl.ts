import { bolt } from "./bolt";
import { at, type Contour, type Vec } from "./geometry";

/**
 * An arc crawling along a contour from s0 for `len`, sampled every `gap`, standing `out` off the edge and jittered
 * across it by up to `rough`. A sine taper pins both ends to the edge, so the arc grows out of the mark and back in.
 */
export function crawl(c: Contour, s0: number, len: number, out: number, rough: number, gap: number, rand: () => number): Vec[] {
  const n = Math.max(3, Math.round(len / gap));
  const pts: Vec[] = [];
  for (let i = 0; i <= n; i++) {
    const k = i / n, p = at(c, s0 + k * len), taper = Math.sin(Math.PI * k);
    const o = out * taper + (rand() - 0.5) * 2 * rough * taper;
    pts.push({ x: p.x + p.nx * o, y: p.y + p.ny * o });
  }
  return pts;
}

/**
 * A short bolt leaving the contour at s, half along the edge's normal and half straight away from the mark's
 * centre, so it flies off the mark instead of into a neighbouring spoke. It leans a little to one side.
 */
export function fork(c: Contour, s: number, reach: number, centre: Vec, rand: () => number): Vec[] {
  const p = at(c, s), side = (rand() - 0.5) * 0.9;
  const rx = p.x - centre.x, ry = p.y - centre.y, rl = Math.hypot(rx, ry) || 1;
  let dx = p.nx + rx / rl, dy = p.ny + ry / rl;
  const dl = Math.hypot(dx, dy) || 1;
  dx /= dl; dy /= dl;
  const end = { x: p.x + (dx - dy * side) * reach, y: p.y + (dy + dx * side) * reach };
  return bolt({ x: p.x, y: p.y }, end, reach * 0.35, 3, rand);
}
