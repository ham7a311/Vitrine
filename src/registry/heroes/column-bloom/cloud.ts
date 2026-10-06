/** One glow column, in percentages of the stage. */
export type Column = { x0: number; x1: number; top: number; bottom: number; blur: number; level: number };

/**
 * A symmetric stepped skyline: `steps[0]` is the centre column, then each pair
 * outward. Each step is [relative width, top as % of height, bottom inset %].
 * Columns get softer (more blur) the further out they stand.
 */
export function columns(steps: [number, number, number][], left = 8, right = 92): Column[] {
  const side = steps.slice(1);
  const order = [...side.slice().reverse(), steps[0], ...side];
  const total = order.reduce((a, s) => a + s[0], 0);
  const span = right - left;
  let x = left;
  return order.map((s, i) => {
    const level = Math.abs(i - side.length);
    const w = (s[0] / total) * span;
    const c = { x0: x, x1: x + w, top: s[1], bottom: s[2], blur: level <= 1 ? 0 : (level - 1) * 7, level };
    x += w;
    return c;
  });
}

/** Which column a point falls on, or -1 over open page. Soft edges (tops, and bottoms that stop short) count from a little inside. */
export function columnAt(cols: Column[], x: number, y: number, soften = 4) {
  return cols.findIndex((c) => x >= c.x0 && x < c.x1 && y >= c.top + soften && y <= 100 - c.bottom - (c.bottom ? soften : 0));
}
