/** Hex colour to 0–1 RGB for a shader uniform. Accepts #rgb and #rrggbb. */
export function rgb(hex: string): [number, number, number] {
  let h = hex.trim().replace(/^#/, "");
  if (h.length === 3) h = h.replace(/./g, (c) => c + c);
  const v = parseInt(h, 16);
  if (h.length !== 6 || Number.isNaN(v)) return [0, 0, 0];
  return [((v >> 16) & 255) / 255, ((v >> 8) & 255) / 255, (v & 255) / 255];
}

/**
 * Points on a sphere shell, crowded toward both poles and thinned around the equator, each with a
 * random seed. Returns xyz in a flat array (radius about 1, jittered by `jitter`) and one seed per
 * point. Deterministic for a given seed.
 */
export function spherePoints(count = 9000, jitter = 0.035, bias = 1.7, seed = 11): { pos: Float32Array; seeds: Float32Array } {
  let s = seed >>> 0;
  const rnd = () => ((s = (s * 1664525 + 1013904223) >>> 0) / 2 ** 32);
  const pos = new Float32Array(count * 3);
  const seeds = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    const side = i % 2 === 0 ? 1 : -1;
    // |y| near 1 is likelier than near 0, so the poles fill in and the middle stays sparse.
    const y = side * (1 - Math.pow(rnd(), bias));
    const a = rnd() * Math.PI * 2;
    const ring = Math.sqrt(Math.max(0, 1 - y * y));
    const r = 1 + (rnd() - 0.5) * 2 * jitter;
    pos[i * 3] = Math.cos(a) * ring * r;
    pos[i * 3 + 1] = y * r;
    pos[i * 3 + 2] = Math.sin(a) * ring * r;
    seeds[i] = rnd();
  }
  return { pos, seeds };
}
