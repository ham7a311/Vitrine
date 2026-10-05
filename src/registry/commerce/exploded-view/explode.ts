export type Vec = [number, number];

/** How far a part has travelled: the shared amount, or all the way out while it is the one being looked at. */
export function travel(t: number, focused: boolean) {
  return focused ? Math.max(t, 1) : t;
}

export function move(p: Vec, dir: Vec, k: number): Vec {
  return [p[0] + dir[0] * k, p[1] + dir[1] * k];
}

/**
 * Spread callout balloons down one margin: keep each near its part's height,
 * never closer than `gap`, and inside [top, bottom]. Order by height is kept,
 * so leaders never cross within a column.
 */
export function spread(items: { id: string; y: number }[], gap: number, top: number, bottom: number) {
  const s = [...items].sort((a, b) => a.y - b.y).map((i) => ({ ...i }));
  for (let i = 0; i < s.length; i++) s[i].y = Math.max(s[i].y, top + i * gap, i ? s[i - 1].y + gap : -Infinity);
  for (let i = s.length - 1; i >= 0; i--) s[i].y = Math.min(s[i].y, bottom - (s.length - 1 - i) * gap, i < s.length - 1 ? s[i + 1].y - gap : Infinity);
  return Object.fromEntries(s.map((i) => [i.id, i.y])) as Record<string, number>;
}

/** A leader from a balloon to its part: out horizontally, then straight to the anchor. */
export function leader(from: Vec, to: Vec, side: "left" | "right", r: number) {
  const sx = from[0] + (side === "left" ? r : -r);
  const kx = sx + (side === "left" ? 14 : -14);
  return `M${sx} ${from[1]}H${kx}L${to[0]} ${to[1]}`;
}
