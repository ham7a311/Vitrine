/* Menu aim: is the pointer travelling towards the content pane? If so, crossing another rail item on
   the way shouldn't switch the category under the reader's nose. */

export type Pt = { x: number; y: number };

const cross = (a: Pt, b: Pt, c: Pt) => (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x);

export function inTriangle(p: Pt, a: Pt, b: Pt, c: Pt) {
  const d1 = cross(p, a, b), d2 = cross(p, b, c), d3 = cross(p, c, a);
  const neg = d1 < 0 || d2 < 0 || d3 < 0, pos = d1 > 0 || d2 > 0 || d3 > 0;
  return !(neg && pos);
}

/**
 * `from` is where the pointer was a moment ago, `to` where it is now, `pane` the content pane's box.
 * The pointer is "aiming" when its new position lies inside the triangle from the old position to the
 * pane's near corners (slightly padded), i.e. it is moving into the pane rather than along the rail.
 */
export function aiming(from: Pt, to: Pt, pane: DOMRect, pad = 60) {
  if (to.x <= from.x) return false;
  return inTriangle(to, from, { x: pane.left, y: pane.top - pad }, { x: pane.left, y: pane.bottom + pad });
}
