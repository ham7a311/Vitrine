/** Move through a list of `count` items by `delta`, wrapping at both ends. */
export function step(index: number, delta: number, count: number): number {
  if (count <= 0) return -1;
  return (((index + delta) % count) + count) % count;
}

/** Where a menu key moves the active row, or null if the key isn't a movement key. */
export function moveKey(key: string, index: number, count: number): number | null {
  if (key === "ArrowDown") return step(index, 1, count);
  if (key === "ArrowUp") return step(index, -1, count);
  if (key === "Home") return 0;
  if (key === "End") return count - 1;
  return null;
}

/** Height for an auto-growing textarea: its content height, held between a minimum and a maximum number of lines. */
export function fitHeight(scrollHeight: number, lineHeight: number, minLines = 1, maxLines = 8, padding = 0): number {
  const min = minLines * lineHeight + padding;
  const max = maxLines * lineHeight + padding;
  return Math.min(max, Math.max(min, scrollHeight));
}

/** How strongly a glyph cell glows: a soft ellipse round each anchor, the stronger one wins. */
export function glow(x: number, y: number, anchors: { x: number; y: number; rx: number; ry: number }[]): { value: number; which: number } {
  let value = 0;
  let which = -1;
  anchors.forEach((a, i) => {
    const dx = (x - a.x) / a.rx;
    const dy = (y - a.y) / a.ry;
    const v = Math.exp(-(dx * dx + dy * dy));
    if (v > value) {
      value = v;
      which = i;
    }
  });
  return { value, which };
}

export const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789σπμλβΩ∗@&+.*";
