/** A woven band: vertical warp strips, horizontal weft strips, and which strip lies on top at each crossing. */

export type Weave = "plain" | "twill" | "basket";
export type Strip = { x: number; y: number; w: number; h: number; tone: number; i: number };

/** Is the warp (column i) over the weft (row j) here? */
export function over(weave: Weave, i: number, j: number) {
  if (weave === "twill") return (((i - j) % 4) + 4) % 4 < 2;
  if (weave === "basket") return (Math.floor(i / 2) + Math.floor(j / 2)) % 2 === 0;
  return (i + j) % 2 === 0;
}

/** Lay out a band `width` wide: warps every `pitch` px, `rows` wefts filling `height`. */
export function loom(width: number, height: number, weave: Weave, pitch = 30, rows = 4) {
  const cols = Math.ceil(width / pitch) + 1;
  const ww = Math.round(pitch * 0.78), rowH = height / rows, wh = Math.round(rowH * 0.8);
  const warps: Strip[] = Array.from({ length: cols }, (_, i) => ({ x: i * pitch - (cols * pitch - width) / 2 + (pitch - ww) / 2, y: 0, w: ww, h: height, tone: i % 2, i }));
  const wefts: Strip[] = Array.from({ length: rows }, (_, j) => ({ x: 0, y: j * rowH + (rowH - wh) / 2, w: width, h: wh, tone: j % 2, i: j }));
  const overs: (Strip & { j: number })[] = [];
  for (const a of warps) for (const b of wefts) if (over(weave, a.i, b.i) && a.x + a.w > 0 && a.x < width) overs.push({ x: a.x, y: b.y, w: a.w, h: b.h, tone: a.tone, i: a.i, j: b.i });
  return { warps, wefts, overs };
}
