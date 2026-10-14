/** Spur gears that really mesh: tooth outlines, a chain laid along an edge, and each gear's turn from the driver's. */

export type Gear = { x: number; y: number; N: number; R: number; k: number; C: number };

/** A gear outline (pitch radius m·N/2) with trapezoid teeth and a hub hole, centred on 0,0; tooth 0 points along +x. */
export function gearPath(N: number, m: number, hole = 0.32) {
  const R = (m * N) / 2, ra = R + m, rf = R - 1.25 * m, step = (2 * Math.PI) / N;
  const pt = (r: number, a: number) => `${(r * Math.cos(a)).toFixed(2)} ${(r * Math.sin(a)).toFixed(2)}`;
  let d = "";
  for (let i = 0; i < N; i++) {
    const c = i * step;
    d += `${i ? "L" : "M"}${pt(rf, c - step * 0.5)}L${pt(rf, c - step * 0.27)}L${pt(ra, c - step * 0.15)}L${pt(ra, c + step * 0.15)}L${pt(rf, c + step * 0.27)}`;
  }
  const h = rf * hole;
  return `${d}Z M${h} 0A${h} ${h} 0 1 0 ${-h} 0A${h} ${h} 0 1 0 ${h} 0Z`;
}

/**
 * Lay gears of `teeth` along a row: each sits so its pitch circle touches the last one's, its centre
 * at height y(R) (so bigger gears can sit higher or lower), starting at x0. Each gear's angle is
 * k·φ + C for the driver's angle φ: neighbours turn opposite ways at the ratio of their teeth, and
 * C lines a gap up opposite each tooth where they meet.
 */
export function chain(teeth: number[], m: number, x0: number, y: (R: number) => number): Gear[] {
  const out: Gear[] = [];
  teeth.forEach((N, i) => {
    const R = (m * N) / 2;
    if (!i) { out.push({ x: x0, y: y(R), N, R, k: 1, C: 0 }); return; }
    const p = out[i - 1], d = p.R + R, yy = y(R), dy = yy - p.y;
    const x = p.x + Math.sqrt(Math.max(0, d * d - dy * dy));
    const a = Math.atan2(dy, x - p.x), q = p.N / N;
    out.push({ x, y: yy, N, R, k: -q * p.k, C: -q * p.C + a + Math.PI - Math.PI / N + q * a });
  });
  return out;
}

/** The angle (radians) of a gear for the driver's angle. */
export const turn = (g: Gear, phi: number) => g.k * phi + g.C;
