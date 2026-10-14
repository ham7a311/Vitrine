/**
 * Geometry for walking round a rounded rectangle (0,0)–(w,h) with corner radius r, clockwise,
 * starting where the top edge's straight part begins. Screen coordinates: y grows downward.
 */
export type Point = { x: number; y: number; /** unit tangent, clockwise */ tx: number; ty: number; /** unit normal, outward */ nx: number; ny: number };

const clampR = (w: number, h: number, r: number) => Math.max(0, Math.min(r, w / 2, h / 2));

export function length(w: number, h: number, r: number) {
  const R = clampR(w, h, r);
  return 2 * (w - 2 * R) + 2 * (h - 2 * R) + 2 * Math.PI * R;
}

/** The point, tangent and outward normal at distance s along the outline (s wraps). */
export function pointAt(w: number, h: number, r: number, s: number): Point {
  const R = clampR(w, h, r), L = length(w, h, r);
  let d = ((s % L) + L) % L;
  const sw = w - 2 * R, sh = h - 2 * R, arc = (Math.PI / 2) * R;
  const out = (x: number, y: number, tx: number, ty: number): Point => ({ x, y, tx, ty, nx: ty, ny: -tx });
  const corner = (cx: number, cy: number, a0: number, t: number) => {
    const a = a0 + (R > 0 ? t / R : 0); // angle measured clockwise on screen
    return out(cx + R * Math.cos(a), cy + R * Math.sin(a), -Math.sin(a), Math.cos(a));
  };
  if (d < sw) return out(R + d, 0, 1, 0); d -= sw;
  if (d < arc) return corner(w - R, R, -Math.PI / 2, d); d -= arc;
  if (d < sh) return out(w, R + d, 0, 1); d -= sh;
  if (d < arc) return corner(w - R, h - R, 0, d); d -= arc;
  if (d < sw) return out(w - R - d, h, -1, 0); d -= sw;
  if (d < arc) return corner(R, h - R, Math.PI / 2, d); d -= arc;
  if (d < sh) return out(0, h - R - d, 0, -1); d -= sh;
  return corner(R, R, Math.PI, Math.min(d, arc));
}

/** The distance along the outline closest to (x, y). */
export function nearest(w: number, h: number, r: number, x: number, y: number) {
  const L = length(w, h, r);
  let best = 0, bd = Infinity;
  const steps = 240;
  for (let i = 0; i < steps; i++) {
    const s = (i / steps) * L, p = pointAt(w, h, r, s), d = (p.x - x) ** 2 + (p.y - y) ** 2;
    if (d < bd) { bd = d; best = s; }
  }
  // refine around the best sample
  const span = L / steps;
  for (let k = 0; k < 2; k++) {
    for (const s of [best - span / 2, best + span / 2]) {
      const p = pointAt(w, h, r, s), d = (p.x - x) ** 2 + (p.y - y) ** 2;
      if (d < bd) { bd = d; best = s; }
    }
  }
  return ((best % L) + L) % L;
}

/** Shortest signed distance from a to b round a loop of length L. */
export function around(a: number, b: number, L: number) {
  let d = ((b - a) % L + L) % L;
  if (d > L / 2) d -= L;
  return d;
}
