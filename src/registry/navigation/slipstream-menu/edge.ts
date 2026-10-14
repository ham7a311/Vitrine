/** Which edge of a row the pointer crossed: the nearer of top and bottom. */
export function edge(pointerY: number, row: { top: number; height: number }): "top" | "bottom" {
  return pointerY - row.top < row.height / 2 ? "top" : "bottom";
}

/** Where the band starts (or ends) for an edge, as a translateY percentage. */
export const offset = (side: "top" | "bottom") => (side === "top" ? -101 : 101);
