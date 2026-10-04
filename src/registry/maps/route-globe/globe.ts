import { landAt } from "./land";

/**
 * A dotted globe in Canvas 2D: land sampled on a Fibonacci sphere (so dots are evenly spaced
 * everywhere, poles included), rotated and drawn in orthographic projection.
 */

export type Vec3 = [number, number, number];

const RAD = Math.PI / 180;

/** Unit vector for a longitude/latitude in degrees (y up, z toward lon 0 at the equator). */
export function toVec(lon: number, lat: number): Vec3 {
  const l = lon * RAD, p = lat * RAD;
  return [Math.cos(p) * Math.sin(l), Math.sin(p), Math.cos(p) * Math.cos(l)];
}

/** Land dots as a flat Float32Array of xyz triples. */
export function landDots(samples = 30000): Float32Array {
  const out: number[] = [];
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < samples; i++) {
    const y = 1 - (2 * (i + 0.5)) / samples;
    const r = Math.sqrt(1 - y * y), a = i * golden;
    const x = Math.cos(a) * r, z = Math.sin(a) * r;
    const lat = Math.asin(y) / RAD, lon = Math.atan2(x, z) / RAD;
    if (landAt(lon, lat) && landAt(lon, lat) !== 7) out.push(x, y, z);
  }
  return new Float32Array(out);
}

/** Rotate by yaw (around y) then tilt (around x). */
export function rotate(v: Vec3 | Float32Array, yaw: number, tilt: number, i = 0): Vec3 {
  const x = v[i], y = v[i + 1], z = v[i + 2];
  const cy = Math.cos(yaw), sy = Math.sin(yaw), ct = Math.cos(tilt), st = Math.sin(tilt);
  const x1 = x * cy - z * sy, z1 = x * sy + z * cy;
  return [x1, y * ct - z1 * st, y * st + z1 * ct];
}

/** Great-circle interpolation between two unit vectors. */
export function slerp(a: Vec3, b: Vec3, t: number): Vec3 {
  const d = Math.max(-1, Math.min(1, a[0] * b[0] + a[1] * b[1] + a[2] * b[2]));
  const w = Math.acos(d);
  if (w < 1e-6) return a;
  const s = Math.sin(w), ka = Math.sin((1 - t) * w) / s, kb = Math.sin(t * w) / s;
  return [a[0] * ka + b[0] * kb, a[1] * ka + b[1] * kb, a[2] * ka + b[2] * kb];
}

export type GlobeView = { cx: number; cy: number; r: number; yaw: number; tilt: number };

/** Draw the dotted globe: faint back dots, then front dots shaded toward the rim. */
export function drawGlobe(ctx: CanvasRenderingContext2D, dots: Float32Array, v: GlobeView, colour: string, dot: number, glow: string) {
  const { cx, cy, r, yaw, tilt } = v;
  // atmosphere
  const g = ctx.createRadialGradient(cx, cy, r * 0.92, cx, cy, r * 1.22);
  g.addColorStop(0, glow);
  g.addColorStop(1, "transparent");
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(cx, cy, r * 1.22, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = colour;
  const cy_ = Math.cos(yaw), sy = Math.sin(yaw), ct = Math.cos(tilt), st = Math.sin(tilt);
  // back
  ctx.globalAlpha = 0.09;
  for (let i = 0; i < dots.length; i += 3) {
    const x = dots[i], y = dots[i + 1], z = dots[i + 2];
    const x1 = x * cy_ - z * sy, z1 = x * sy + z * cy_, y2 = y * ct - z1 * st, z2 = y * st + z1 * ct;
    if (z2 >= 0) continue;
    ctx.fillRect(cx + x1 * r - dot * 0.35, cy - y2 * r - dot * 0.35, dot * 0.7, dot * 0.7);
  }
  // front, brighter toward the middle
  for (let band = 0; band < 4; band++) {
    const lo = band / 4, hi = (band + 1) / 4;
    ctx.globalAlpha = 0.35 + 0.65 * hi;
    for (let i = 0; i < dots.length; i += 3) {
      const x = dots[i], y = dots[i + 1], z = dots[i + 2];
      const x1 = x * cy_ - z * sy, z1 = x * sy + z * cy_, y2 = y * ct - z1 * st, z2 = y * st + z1 * ct;
      if (z2 < lo || z2 >= hi || z2 < 0) continue;
      const s = dot * (0.7 + 0.3 * z2);
      ctx.fillRect(cx + x1 * r - s / 2, cy - y2 * r - s / 2, s, s);
    }
  }
  ctx.globalAlpha = 1;
}
