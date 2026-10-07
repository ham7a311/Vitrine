/** Hex colour to 0–1 RGB for a shader uniform. Accepts #rgb and #rrggbb. */
export function rgb(hex: string): [number, number, number] {
  let h = hex.trim().replace(/^#/, "");
  if (h.length === 3) h = h.replace(/./g, (c) => c + c);
  const v = parseInt(h, 16);
  if (h.length !== 6 || Number.isNaN(v)) return [0, 0, 0];
  return [((v >> 16) & 255) / 255, ((v >> 8) & 255) / 255, (v & 255) / 255];
}

export const SHELLS = [0.6, 0.72, 0.85, 0.98] as const;

/**
 * The cloud: `perShell` points spread evenly over each unit-direction shell (a Fibonacci lattice
 * with a little jitter, so the shells read as fine membranes), plus `dust` loose points inside.
 * Each point carries its direction (xyz), its shell index (−1 for dust, whose xyz is a position
 * inside radius 0.55) and a seed.
 */
export function bloomPoints(perShell = 8000, dust = 1400, seed = 5): { pos: Float32Array; meta: Float32Array; count: number } {
  let s = seed >>> 0;
  const rnd = () => ((s = (s * 1664525 + 1013904223) >>> 0) / 2 ** 32);
  const count = perShell * SHELLS.length + dust;
  const pos = new Float32Array(count * 3);
  const meta = new Float32Array(count * 2);
  const golden = Math.PI * (3 - Math.sqrt(5));
  let k = 0;
  for (let sh = 0; sh < SHELLS.length; sh++) {
    for (let i = 0; i < perShell; i++, k++) {
      const y = 1 - ((i + 0.5) / perShell) * 2 + (rnd() - 0.5) * (2 / perShell) * 6;
      const yy = Math.max(-1, Math.min(1, y));
      const r = Math.sqrt(1 - yy * yy);
      const a = i * golden + rnd() * 0.08 + sh * 1.3;
      pos[k * 3] = Math.cos(a) * r;
      pos[k * 3 + 1] = yy;
      pos[k * 3 + 2] = Math.sin(a) * r;
      meta[k * 2] = sh;
      meta[k * 2 + 1] = rnd();
    }
  }
  for (let i = 0; i < dust; i++, k++) {
    // uniform inside a ball of radius 0.55
    let x = 0, y = 0, z = 0;
    do {
      x = rnd() * 2 - 1; y = rnd() * 2 - 1; z = rnd() * 2 - 1;
    } while (x * x + y * y + z * z > 1);
    pos[k * 3] = x * 0.55;
    pos[k * 3 + 1] = y * 0.55;
    pos[k * 3 + 2] = z * 0.55;
    meta[k * 2] = -1;
    meta[k * 2 + 1] = rnd();
  }
  return { pos, meta, count };
}
