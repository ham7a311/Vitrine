/** Where the flood starts inside a card, as percentages, from the pointer (or the centre for keyboard). */
export function origin(card: { left: number; top: number; width: number; height: number }, point?: { x: number; y: number }) {
  if (!point || !card.width || !card.height) return { x: 50, y: 50 };
  const clamp = (v: number) => Math.max(0, Math.min(100, v));
  return { x: Math.round(clamp(((point.x - card.left) / card.width) * 100)), y: Math.round(clamp(((point.y - card.top) / card.height) * 100)) };
}

/** Next card for an arrow key in a grid of `cols` columns; stays put at the edges. */
export function move(index: number, count: number, cols: number, key: string) {
  const delta = key === "ArrowRight" ? 1 : key === "ArrowLeft" ? -1 : key === "ArrowDown" ? cols : key === "ArrowUp" ? -cols : 0;
  const next = index + delta;
  if (key === "Home") return 0;
  if (key === "End") return count - 1;
  return next >= 0 && next < count ? next : index;
}
