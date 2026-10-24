/** The 4×4 ordered-dither (Bayer) matrix, as thresholds in (0, 1). */
export const BAYER = [
  [0, 8, 2, 10],
  [12, 4, 14, 6],
  [3, 11, 1, 9],
  [15, 7, 13, 5],
].map((row) => row.map((v) => (v + 0.5) / 16));

/**
 * Whether the cell in column i (of cols) and row j is inked at progress p (0–1). A dithered front
 * 35% of the width wide sweeps left to right; behind it the fill is solid, except the last 14% of the
 * width, which keeps a fade from solid to a quarter density — the far end stays printed-looking.
 */
export function inked(i: number, j: number, cols: number, p: number) {
  const x = (i + 0.5) / cols;
  const front = Math.min(1, Math.max(0, (p * 1.35 - x) / 0.35));
  const tail = x > 0.86 ? 1 - ((x - 0.86) / 0.14) * 0.75 : 1;
  return BAYER[j % 4][i % 4] < Math.min(front, tail);
}

/** How far (0–1 of the width) the fill is already solid at progress p: everything left of the front. */
export const solidTo = (p: number) => Math.min(1, Math.max(0, p * 1.35 - 0.35));

/** Ease-out cubic, for the sweep. */
export const ease = (t: number) => 1 - Math.pow(1 - Math.min(1, Math.max(0, t)), 3);
