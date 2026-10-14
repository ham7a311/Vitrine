export type Glyph = { ch: string; angle: number };

/**
 * Lay a repeating phrase around a cylinder. Each glyph takes an arc as long as its own width, the
 * phrase repeats a whole number of times so there's no seam, and the radius is solved so the
 * repeats exactly close the circle near the target radius.
 */
export function ring(phrase: string, width: (ch: string) => number, target: number) {
  const chars = [...phrase];
  const unit = chars.reduce((s, c) => s + width(c), 0);
  if (!(unit > 0) || !(target > 0)) return { radius: target, glyphs: [] as Glyph[] };
  const repeats = Math.max(1, Math.round((2 * Math.PI * target) / unit));
  const radius = (repeats * unit) / (2 * Math.PI);
  const glyphs: Glyph[] = [];
  let arc = 0;
  for (let r = 0; r < repeats; r++) {
    for (const ch of chars) {
      const w = width(ch);
      glyphs.push({ ch, angle: ((arc + w / 2) / radius) * (180 / Math.PI) });
      arc += w;
    }
  }
  return { radius, glyphs };
}

/** "01 / 04" */
export const counter = (i: number, n: number) => `${String(i + 1).padStart(2, "0")} / ${String(n).padStart(2, "0")}`;
