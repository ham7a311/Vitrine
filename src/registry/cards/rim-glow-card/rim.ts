export type RimTone = { color: string; light: string; tint: string };

/** The three rims from the reference trio: ember orange, electric blue and signal green. */
export const TONES: Record<string, RimTone> = {
  amber: { color: "#ff7a1a", light: "#ffc56b", tint: "#1d0d06" },
  azure: { color: "#3d7bff", light: "#a9cfff", tint: "#0a1026" },
  emerald: { color: "#29d96f", light: "#b9ffd2", tint: "#06190f" },
};

/** Relative luminance of a hex colour (WCAG), used to keep the link legible on a bright rim. */
export function luminance(hex: string): number {
  const v = parseInt(hex.replace("#", ""), 16);
  const ch = [(v >> 16) & 255, (v >> 8) & 255, v & 255].map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * ch[0] + 0.7152 * ch[1] + 0.0722 * ch[2];
}
