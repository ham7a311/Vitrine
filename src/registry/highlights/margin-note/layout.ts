/** A card wants to sit level with its phrase; cards never overlap, so later ones are pushed down. */
export function stack(wanted: number[], heights: number[], gap = 14) {
  const order = wanted.map((_, i) => i).sort((a, b) => wanted[a] - wanted[b]);
  const tops = new Array<number>(wanted.length).fill(0);
  let floor = -Infinity;
  for (const i of order) {
    tops[i] = Math.max(wanted[i], floor);
    floor = tops[i] + heights[i] + gap;
  }
  return tops;
}

/** A connector from the end of a phrase to the side of its card: level at both ends, curving between. */
export function connector(x1: number, y1: number, x2: number, y2: number) {
  const mid = x1 + (x2 - x1) * 0.55;
  return `M${x1.toFixed(1)} ${y1.toFixed(1)}C${mid.toFixed(1)} ${y1.toFixed(1)} ${(x2 - (x2 - x1) * 0.25).toFixed(1)} ${y2.toFixed(1)} ${x2.toFixed(1)} ${y2.toFixed(1)}`;
}
