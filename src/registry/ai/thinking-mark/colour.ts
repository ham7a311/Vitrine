/** Linear blend of two #rrggbb colours. */
export function mix(a: string, b: string, t: number) {
  const pa = parseInt(a.slice(1), 16), pb = parseInt(b.slice(1), 16), k = Math.max(0, Math.min(1, t));
  const ch = (s: number) => Math.round(((pa >> s) & 255) + (((pb >> s) & 255) - ((pa >> s) & 255)) * k);
  return `#${((ch(16) << 16) | (ch(8) << 8) | ch(0)).toString(16).padStart(6, "0")}`;
}

/** The wire's colour at heat h (0–1): a dull ember of the mark's colour, then its glow, then white-hot core. */
export function heatColour(ember: string, glow: string, core: string, h: number) {
  return h < 0.5 ? mix(ember, glow, h / 0.5) : mix(glow, core, (h - 0.5) / 0.5);
}
