/** A height field from smooth noise plus hills, and its contour lines by marching squares. */

function hash(x: number, y: number, seed: number) {
  const s = Math.sin(x * 127.1 + y * 311.7 + seed * 74.7) * 43758.5453;
  return s - Math.floor(s);
}
function noise(x: number, y: number, seed: number) {
  const ix = Math.floor(x), iy = Math.floor(y), fx = x - ix, fy = y - iy;
  const u = fx * fx * (3 - 2 * fx), v = fy * fy * (3 - 2 * fy);
  const a = hash(ix, iy, seed), b = hash(ix + 1, iy, seed), c = hash(ix, iy + 1, seed), d = hash(ix + 1, iy + 1, seed);
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
}

export type Hill = { x: number; y: number; r: number; h: number };

/** Heights at every grid corner (cols+1 × rows+1), `cell` px apart: three octaves of noise plus any hills. */
export function field(cols: number, rows: number, cell: number, seed: number, hills: Hill[] = []) {
  const out = new Float32Array((cols + 1) * (rows + 1));
  for (let j = 0; j <= rows; j++)
    for (let i = 0; i <= cols; i++) {
      const x = i * cell, y = j * cell;
      let v = noise(x / 160, y / 160, seed) * 0.6 + noise(x / 70, y / 70, seed + 1) * 0.28 + noise(x / 30, y / 30, seed + 2) * 0.12;
      for (const h of hills) v += h.h * Math.exp(-(((x - h.x) ** 2 + (y - h.y) ** 2) / (h.r * h.r)));
      out[j * (cols + 1) + i] = v;
    }
  return out;
}

/** Line segments where the field crosses `level`, as [x1, y1, x2, y2] in px. */
export function march(f: Float32Array, cols: number, rows: number, cell: number, level: number) {
  const segs: number[][] = [], W = cols + 1;
  const lerp = (a: number, b: number) => (level - a) / (b - a || 1e-9);
  for (let j = 0; j < rows; j++)
    for (let i = 0; i < cols; i++) {
      const a = f[j * W + i], b = f[j * W + i + 1], c = f[(j + 1) * W + i + 1], d = f[(j + 1) * W + i];
      const idx = (a > level ? 8 : 0) | (b > level ? 4 : 0) | (c > level ? 2 : 0) | (d > level ? 1 : 0);
      if (idx === 0 || idx === 15) continue;
      const x = i * cell, y = j * cell;
      const T = [x + lerp(a, b) * cell, y], R = [x + cell, y + lerp(b, c) * cell], B = [x + lerp(d, c) * cell, y + cell], L = [x, y + lerp(a, d) * cell];
      const add = (p: number[], q: number[]) => segs.push([p[0], p[1], q[0], q[1]]);
      switch (idx) {
        case 1: case 14: add(L, B); break;
        case 2: case 13: add(B, R); break;
        case 3: case 12: add(L, R); break;
        case 4: case 11: add(T, R); break;
        case 6: case 9: add(T, B); break;
        case 7: case 8: add(T, L); break;
        case 5: add(T, L); add(B, R); break;
        case 10: add(T, R); add(L, B); break;
      }
    }
  return segs;
}

/** Contour levels every `step` between the field's lowest and highest values. */
export function levels(f: Float32Array, step: number) {
  let lo = Infinity, hi = -Infinity;
  for (const v of f) { if (v < lo) lo = v; if (v > hi) hi = v; }
  const out: number[] = [];
  for (let l = Math.ceil(lo / step) * step; l < hi; l += step) out.push(+l.toFixed(6));
  return out;
}
