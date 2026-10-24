export function seeded(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const f = (n: number) => n.toFixed(1);

/**
 * A strip of tape torn off by hand, w × h px: the long edges are the roll's clean cut, the two ends
 * are torn into small uneven teeth.
 */
export function tapePath(w: number, h: number, seed = 1) {
  const r = seeded(seed);
  const tear = Math.max(2, h * 0.09);
  const teeth = Math.max(5, Math.round(h / 4.5));
  const end = (x: number, dir: 1 | -1, down: boolean) =>
    Array.from({ length: teeth + 1 }, (_, i) => {
      const k = down ? i : teeth - i;
      const y = (h * k) / teeth;
      // Alternate in and out, unevenly, like fibres giving way.
      return [x + dir * (i % 2 ? tear * (0.6 + r() * 0.8) : r() * tear * 0.35), y] as const;
    });
  const right = end(w - tear, 1, true);
  const left = end(tear, -1, false);
  const pts = [[tear, 0] as const, ...right, ...left];
  return "M" + pts.map(([x, y]) => `${f(x)} ${f(y)}`).join("L") + "Z";
}
