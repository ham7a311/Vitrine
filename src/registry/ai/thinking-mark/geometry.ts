export type Vec = { x: number; y: number };

/** One closed piece of an outline, resampled at even spacing: point i is at distance i * step, with outward normals. */
export type Contour = { x: Float32Array; y: Float32Array; nx: Float32Array; ny: Float32Array; step: number; len: number };
export type Outline = { contours: Contour[]; total: number };

/** The point and outward normal at distance s along a contour (wrapping round). */
export function at(c: Contour, s: number) {
  const n = c.x.length;
  const f = ((s / c.step) % n + n) % n;
  const i = Math.floor(f), j = (i + 1) % n, k = f - i;
  return {
    x: c.x[i] + (c.x[j] - c.x[i]) * k,
    y: c.y[i] + (c.y[j] - c.y[i]) * k,
    nx: c.nx[i] + (c.nx[j] - c.nx[i]) * k,
    ny: c.ny[i] + (c.ny[j] - c.ny[i]) * k,
  };
}

/** A contour picked in proportion to its length, so long edges carry more of the current. */
export function pick(o: Outline, r: number): number {
  let t = r * o.total;
  for (let i = 0; i < o.contours.length; i++) {
    t -= o.contours[i].len;
    if (t <= 0) return i;
  }
  return o.contours.length - 1;
}
