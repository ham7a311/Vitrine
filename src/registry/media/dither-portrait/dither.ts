/**
 * Dithering, three ways. Each takes a grayscale field (0–255, row-major) and returns
 * a 0/1 mask of "ink" cells. Error diffusion keeps tone through clusters of dots;
 * Bayer keeps a fixed, regular pattern that never crawls when the image changes.
 */

export type DitherAlgo = "floyd" | "atkinson" | "bayer";

const BAYER8 = (() => {
  const m = [[0, 2], [3, 1]];
  let b = m;
  for (let n = 2; n < 8; n *= 2) {
    const next: number[][] = [];
    for (let y = 0; y < n * 2; y++) {
      next[y] = [];
      for (let x = 0; x < n * 2; x++) next[y][x] = 4 * b[y % n][x % n] + m[Math.floor(y / n)][Math.floor(x / n)];
    }
    b = next;
  }
  return b.flat().map((v) => (v + 0.5) / 64);
})();

/** Threshold (0–1) of the 8×8 Bayer matrix at a cell. */
export const bayer = (x: number, y: number) => BAYER8[(y & 7) * 8 + (x & 7)];

export function dither(gray: Float32Array | Uint8ClampedArray, w: number, h: number, algo: DitherAlgo = "floyd", threshold = 128, serpentine = true, strength = 1) {
  const out = new Uint8Array(w * h);
  if (algo === "bayer") {
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) out[y * w + x] = gray[y * w + x] / 255 < bayer(x, y) ? 1 : 0;
    return out;
  }
  const e = Float32Array.from(gray);
  for (let y = 0; y < h; y++) {
    const ltr = !serpentine || y % 2 === 0;
    for (let i = 0; i < w; i++) {
      const x = ltr ? i : w - 1 - i, s = ltr ? 1 : -1, idx = y * w + x;
      const old = e[idx];
      const ink = old < threshold;
      out[idx] = ink ? 1 : 0;
      const err = (old - (ink ? 0 : 255)) * strength;
      const add = (dx: number, dy: number, k: number) => {
        const nx = x + dx * s, ny = y + dy;
        if (nx >= 0 && nx < w && ny < h) e[ny * w + nx] += err * k;
      };
      if (algo === "floyd") {
        add(1, 0, 7 / 16);
        add(-1, 1, 3 / 16);
        add(0, 1, 5 / 16);
        add(1, 1, 1 / 16);
      } else {
        const k = 1 / 8;
        add(1, 0, k);
        add(2, 0, k);
        add(-1, 1, k);
        add(0, 1, k);
        add(1, 1, k);
        add(0, 2, k);
      }
    }
  }
  return out;
}

/** Luma of every cell of a canvas, sampled down to w × h. */
export function grayOf(src: CanvasImageSource, w: number, h: number, gamma = 1) {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const ctx = c.getContext("2d", { willReadFrequently: true })!;
  ctx.drawImage(src, 0, 0, w, h);
  const d = ctx.getImageData(0, 0, w, h).data;
  const g = new Float32Array(w * h);
  for (let i = 0; i < w * h; i++) {
    const l = (0.299 * d[i * 4] + 0.587 * d[i * 4 + 1] + 0.114 * d[i * 4 + 2]) / 255;
    g[i] = 255 * Math.pow(l, 1 / gamma);
  }
  return g;
}
