// The outline of a button with some corners cut at 45°.
export type Corner = "tl" | "tr" | "br" | "bl";

/** Polygon points (in px) for a w×h box with the given corners cut by c, pulled in by `inset` (half a stroke) so a stroke sits inside the box. */
export function outline(w: number, h: number, c: number, corners: Corner[], inset = 0) {
  const cut = (k: Corner) => (corners.includes(k) ? Math.max(0, Math.min(c, w / 2, h / 2)) : 0);
  // Pulled in by `inset`, a 45° edge's ends move along the sides by inset·tan(22.5°).
  const t = inset * Math.tan(Math.PI / 8);
  const a = inset, r = w - inset, b = h - inset;
  const pts: [number, number][] = [];
  const tl = cut("tl"), tr = cut("tr"), br = cut("br"), bl = cut("bl");
  if (tl) pts.push([a, tl + t], [tl + t, a]); else pts.push([a, a]);
  if (tr) pts.push([w - tr - t, a], [r, tr + t]); else pts.push([r, a]);
  if (br) pts.push([r, h - br - t], [w - br - t, b]); else pts.push([r, b]);
  if (bl) pts.push([bl + t, b], [a, h - bl - t]); else pts.push([a, b]);
  return pts.map(([x, y]) => `${+x.toFixed(2)},${+y.toFixed(2)}`).join(" ");
}

/** The same shape as a CSS clip-path, sized by a custom property so it follows the element. */
export function clip(corners: Corner[], v = "var(--ccut-c)") {
  const has = (k: Corner) => corners.includes(k);
  return `polygon(${[
    has("tl") ? `0 ${v}, ${v} 0` : "0 0",
    has("tr") ? `calc(100% - ${v}) 0, 100% ${v}` : "100% 0",
    has("br") ? `100% calc(100% - ${v}), calc(100% - ${v}) 100%` : "100% 100%",
    has("bl") ? `${v} 100%, 0 calc(100% - ${v})` : "0 100%",
  ].join(", ")})`;
}

export const CUTS: Record<"one" | "two" | "all", Corner[]> = { one: ["br"], two: ["tl", "br"], all: ["tl", "tr", "br", "bl"] };
