// How much of each line is filled for a given scroll progress: lines fill one after another,
// with a little overlap so the wipe flows from the end of one line into the next.
export function lineFills(progress: number, lines: number, overlap = 0.15) {
  const n = Math.max(1, lines);
  const p = Math.min(1, Math.max(0, progress));
  const span = 1 / (n - (n - 1) * overlap);
  return Array.from({ length: n }, (_, i) => {
    const start = i * span * (1 - overlap);
    return Math.min(1, Math.max(0, (p - start) / span));
  });
}
