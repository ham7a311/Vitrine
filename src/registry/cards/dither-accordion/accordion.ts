/** The next panel for an arrow key, wrapping at the ends; Home and End jump. */
export function step(index: number, count: number, key: string, vertical = false) {
  const back = vertical ? "ArrowUp" : "ArrowLeft", next = vertical ? "ArrowDown" : "ArrowRight";
  if (key === next) return (index + 1) % count;
  if (key === back) return (index - 1 + count) % count;
  if (key === "Home") return 0;
  if (key === "End") return count - 1;
  return index;
}

/** Panel rectangles in canvas pixels with a bottom-left origin, packed for a vec4 uniform array. */
export function pack(rects: { left: number; top: number; width: number; height: number }[], origin: { left: number; top: number; height: number }, scale: number, max = 6) {
  const out = new Array(max * 4).fill(0);
  rects.slice(0, max).forEach((r, i) => {
    out[i * 4] = (r.left - origin.left) * scale;
    out[i * 4 + 1] = (origin.top + origin.height - (r.top + r.height)) * scale;
    out[i * 4 + 2] = r.width * scale;
    out[i * 4 + 3] = r.height * scale;
  });
  return out;
}
