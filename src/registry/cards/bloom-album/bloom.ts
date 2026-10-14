export type Slot = { x: number; y: number; rotate: number; delay: number; z: number };

/** A deterministic wobble in [-1, 1] for item i, so the cluster looks hand-placed but never changes. */
const wobble = (i: number, salt: number) => Math.sin(i * 12.9898 + salt * 78.233) * 0.5 + Math.sin(i * 4.1 + salt) * 0.5;

/**
 * Positions around the cover for n cards, as offsets of each card's centre from the cover's centre.
 * Cards sit on an ellipse a little wider than the cover, starting at the top and going clockwise,
 * each tilted slightly and staggered so the bloom unfolds in order.
 */
export function slots(n: number, width: number, height: number, spread = 1): Slot[] {
  const out: Slot[] = [];
  const rx = width * 0.98 * spread, ry = height * 0.86 * spread;
  for (let i = 0; i < n; i++) {
    const a = -Math.PI / 2 + (i / n) * Math.PI * 2 + wobble(i, 1) * 0.12;
    const k = 1 + wobble(i, 2) * 0.06;
    out.push({
      x: Math.round(Math.cos(a) * rx * k),
      y: Math.round(Math.sin(a) * ry * k),
      rotate: Math.round(wobble(i, 3) * 7 * 10) / 10,
      delay: i * 32,
      z: n - Math.round(Math.abs(Math.sin(a)) * n),
    });
  }
  return out;
}

/** The resting pile behind the cover: three cards peeking out above it, tilted alternately. */
export function rest(i: number, size = 340) {
  const k = size / 340;
  const peek = [[-0.16, -0.14, -9], [0.17, -0.1, 7], [0.02, -0.19, -3]];
  if (i >= peek.length) return { x: 0, y: 0, rotate: 0, opacity: 0 };
  const [x, y, r] = peek[i];
  return { x: Math.round(x * 340 * k), y: Math.round(y * 340 * k), rotate: r, opacity: 1 };
}
