// Where each bar sits, in percentages of the plot, for grouped or stacked bars in either orientation.

export type Box = { cat: number; s: number; v: number; along: number; size: number; from: number; to: number; top: boolean };

/**
 * along/size: position and thickness on the category axis (0–100).
 * from/to: extent on the value axis (0–100). top: the segment that ends the bar (gets the rounded end).
 */
export function layout(series: number[][], max: number, mode: "grouped" | "stacked", pad = 0.28): Box[] {
  const S = series.length, n = series[0]?.length ?? 0, band = 100 / Math.max(1, n);
  const out: Box[] = [];
  const pct = (v: number) => (max > 0 ? (v / max) * 100 : 0);
  if (mode === "stacked") {
    const thick = band * (1 - pad) * 0.62;
    for (let i = 0; i < n; i++) {
      let last = -1, run = 0;
      for (let s = 0; s < S; s++) if (series[s][i] > 0) last = s;
      for (let s = 0; s < S; s++) { const v = series[s][i]; out.push({ cat: i, s, v, along: band * i + (band - thick) / 2, size: thick, from: pct(run), to: pct(run + v), top: s === last }); run += v; }
    }
  } else {
    const inner = band * (1 - pad), each = inner / Math.max(1, S);
    for (let i = 0; i < n; i++) for (let s = 0; s < S; s++) out.push({ cat: i, s, v: series[s][i], along: band * i + (band - inner) / 2 + each * s, size: each, from: 0, to: pct(series[s][i]), top: true });
  }
  return out;
}

/** The value-axis maximum: the tallest bar, or the tallest stack. */
export const peak = (series: number[][], mode: "grouped" | "stacked") =>
  mode === "stacked" ? Math.max(0, ...(series[0] ?? []).map((_, i) => series.reduce((a, s) => a + s[i], 0))) : Math.max(0, ...series.flat());

/** Roving focus across a grid of categories × series. */
export function move(cat: number, s: number, key: string, n: number, S: number): [number, number] | null {
  switch (key) {
    case "ArrowRight": return [Math.min(n - 1, cat + 1), s];
    case "ArrowLeft": return [Math.max(0, cat - 1), s];
    case "ArrowUp": return [cat, Math.min(S - 1, s + 1)];
    case "ArrowDown": return [cat, Math.max(0, s - 1)];
    case "Home": return [0, s];
    case "End": return [n - 1, s];
    default: return null;
  }
}
