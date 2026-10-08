/* A deterministic ASCII "plate" for each project: the same name always prints the same picture. */

const RAMP = " .:-=+*#%";

function hash(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return h >>> 0;
}

/** Three kinds of field — swell, rings, strata — picked and tuned by the project's name. */
export function plate(name: string, cols = 58, rows = 9): string[] {
  const h = hash(name);
  const kind = h % 3;
  const a = 0.18 + ((h >>> 3) % 10) / 60;
  const b = 0.5 + ((h >>> 7) % 10) / 14;
  const ph = ((h >>> 11) % 628) / 100;
  const cx = cols * (0.3 + ((h >>> 15) % 40) / 100);
  const cy = rows * (0.3 + ((h >>> 19) % 40) / 100);
  const out: string[] = [];
  for (let y = 0; y < rows; y++) {
    let line = "";
    for (let x = 0; x < cols; x++) {
      let v: number;
      if (kind === 0) v = Math.sin(x * a + ph + Math.sin(y * b) * 1.6) * 0.5 + 0.5 - y / rows / 2.4;
      else if (kind === 1) {
        const d = Math.hypot((x - cx) / 2.1, y - cy);
        v = Math.cos(d * b * 0.9 + ph) * 0.5 + 0.5 - d / (cols / 1.6);
      } else v = Math.sin((x * a + y * b * 1.3) + ph) * Math.cos(y * 0.9 - x * 0.05) * 0.5 + 0.5;
      // Fade the edges so the plate sits on the page like a print.
      const edge = Math.min(x, cols - 1 - x, (y + 0.5) * 3, (rows - 0.5 - y) * 3) / 6;
      v *= Math.min(1, edge + 0.35);
      line += RAMP[Math.max(0, Math.min(RAMP.length - 1, Math.floor(v * RAMP.length)))];
    }
    out.push(line);
  }
  return out;
}
