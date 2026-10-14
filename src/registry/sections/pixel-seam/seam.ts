/** A pixel seam: squares that thicken towards one side, laid out by ordered (Bayer) dithering. */

const BAYER = [
  [0, 8, 2, 10],
  [12, 4, 14, 6],
  [3, 11, 1, 9],
  [15, 7, 13, 5],
];

export function seeded(seed: number) {
  let s = seed >>> 0 || 1;
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
}

/** How full row r of `rows` is, from nearly empty at row 0 to nearly solid at the last row. */
export const density = (r: number, rows: number) => ((r + 0.5) / rows) ** 1.2;

/**
 * The filled squares of a seam `cols` wide and `rows` deep, densest in the last row. Each square
 * has a delay: the densest rows first (70ms a row), plus a little seeded scatter so it dissolves.
 */
export function seam(cols: number, rows: number, seed = 1) {
  const rand = seeded(seed);
  const out: { c: number; r: number; delay: number }[] = [];
  for (let r = 0; r < rows; r++)
    for (let c = 0; c < cols; c++) {
      const jitter = (rand() - 0.5) * 0.14;
      if ((BAYER[r % 4][c % 4] + 0.5) / 16 + jitter < density(r, rows)) out.push({ c, r, delay: Math.round((rows - 1 - r) * 70 + rand() * 260) });
    }
  return out;
}

/** A count-up value at progress k (0–1), easing out. */
export const countAt = (to: number, k: number) => to * (1 - (1 - Math.max(0, Math.min(1, k))) ** 3);
