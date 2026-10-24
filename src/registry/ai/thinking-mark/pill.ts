import type { Contour } from "./geometry";

/** The outline of a w × h pill (fully rounded ends) whose top-left is at (ox, oy), sampled every `step` px. */
export function pill(w: number, h: number, ox: number, oy: number, step = 1): Contour {
  const r = h / 2, flat = Math.max(0, w - h), len = 2 * flat + 2 * Math.PI * r;
  const n = Math.max(16, Math.round(len / step));
  const c: Contour = { x: new Float32Array(n), y: new Float32Array(n), nx: new Float32Array(n), ny: new Float32Array(n), step: len / n, len };
  for (let i = 0; i < n; i++) {
    // Walk clockwise from the top-left end of the top edge.
    let s = (i / n) * len, x: number, y: number, nx: number, ny: number;
    if (s < flat) { x = r + s; y = 0; nx = 0; ny = -1; }
    else if ((s -= flat) < Math.PI * r) { const a = -Math.PI / 2 + s / r; x = r + flat + Math.cos(a) * r; y = r + Math.sin(a) * r; nx = Math.cos(a); ny = Math.sin(a); }
    else if ((s -= Math.PI * r) < flat) { x = r + flat - s; y = h; nx = 0; ny = 1; }
    else { s -= flat; const a = Math.PI / 2 + s / r; x = r + Math.cos(a) * r; y = r + Math.sin(a) * r; nx = Math.cos(a); ny = Math.sin(a); }
    c.x[i] = ox + x; c.y[i] = oy + y; c.nx[i] = nx; c.ny[i] = ny;
  }
  return c;
}
