/* Dial geometry. Angles are degrees clockwise from twelve o'clock; the usable sweep is centred on top. */

export const SWEEP = 240;

/** Where each detent sits for a ring with n options. */
export function detents(n: number): number[] {
  if (n <= 1) return [0];
  return Array.from({ length: n }, (_, i) => -SWEEP / 2 + (i * SWEEP) / (n - 1));
}

/** Pointer position → angle around the centre, in (-180, 180]. */
export function angleAt(cx: number, cy: number, x: number, y: number): number {
  const a = (Math.atan2(x - cx, cy - y) * 180) / Math.PI;
  return a <= -180 ? a + 360 : a;
}

/** Keep the knob inside the sweep (with a little give at the ends). */
export const clampAngle = (a: number, give = 8) => Math.max(-SWEEP / 2 - give, Math.min(SWEEP / 2 + give, a));

/** The detent closest to an angle. */
export function nearest(a: number, n: number): number {
  const d = detents(n);
  let best = 0;
  for (let i = 1; i < d.length; i++) if (Math.abs(d[i] - a) < Math.abs(d[best] - a)) best = i;
  return best;
}

/** A point on a circle, for drawing. */
export function polar(cx: number, cy: number, r: number, deg: number) {
  const t = (deg * Math.PI) / 180;
  return { x: cx + r * Math.sin(t), y: cy - r * Math.cos(t) };
}

/** An SVG arc path from one angle to another along a circle. */
export function arc(cx: number, cy: number, r: number, from: number, to: number) {
  const a = polar(cx, cy, r, from), b = polar(cx, cy, r, to);
  const large = Math.abs(to - from) > 180 ? 1 : 0;
  const sweep = to > from ? 1 : 0;
  return `M${a.x.toFixed(2)} ${a.y.toFixed(2)}A${r} ${r} 0 ${large} ${sweep} ${b.x.toFixed(2)} ${b.y.toFixed(2)}`;
}
