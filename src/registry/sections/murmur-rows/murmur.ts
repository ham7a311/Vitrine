/** Deal quotes into rows round-robin, so neighbours in the list never sit side by side in one row. */
export function split<T>(items: T[], rows: number): T[][] {
  const n = Math.max(1, Math.min(rows, items.length || 1));
  const out: T[][] = Array.from({ length: n }, () => []);
  items.forEach((item, i) => out[i % n].push(item));
  return out;
}

/** Copies of one measured sequence needed to cover the viewport with a spare for the wrap. */
export function copiesFor(viewport: number, period: number) {
  if (!(period > 0)) return 2;
  return Math.max(2, Math.ceil(viewport / period) + 1);
}

/** Advance a loop offset, clamping long frames (a backgrounded tab) so it never jumps. */
export function advance(offset: number, seconds: number, speed: number, period: number) {
  if (!(period > 0)) return 0;
  const dt = Math.min(Math.max(seconds, 0), 0.064);
  return (offset + dt * speed) % period;
}

/** Translate for a row: leftward rows move from 0 to -period, rightward rows from -period to 0. */
export function shift(offset: number, period: number, direction: "left" | "right") {
  return direction === "left" ? -offset : offset - period;
}
