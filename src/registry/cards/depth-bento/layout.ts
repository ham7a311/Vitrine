/** A tile's footprint at each breakpoint: [columns, rows]. Missing sizes fall back to the next larger. */
export type Span = { lg?: [number, number]; md?: [number, number]; sm?: [number, number] };

export function columnsFor(width: number) {
  if (width >= 900) return 4;
  if (width >= 560) return 2;
  return 1;
}

/** The span to use for a grid with this many columns, clamped so a tile never overflows the row. */
export function spanFor(span: Span | undefined, cols: number): [number, number] {
  const pick = cols >= 4 ? span?.lg ?? span?.md ?? span?.sm : cols >= 2 ? span?.md ?? span?.sm ?? span?.lg : span?.sm ?? span?.md ?? span?.lg;
  const [c, r] = pick ?? [1, 1];
  return [Math.max(1, Math.min(cols, Math.round(c))), Math.max(1, Math.round(r))];
}

/** Pointer position relative to a box, for the shared light. */
export function local(x: number, y: number, box: { left: number; top: number }) {
  return { x: Math.round(x - box.left), y: Math.round(y - box.top) };
}
