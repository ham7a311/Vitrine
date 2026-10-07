/** A rim: colour stops across the pill from left to right, plus the dark interior it wraps. */
export type PrismRim = { stops: string[]; inside: [string, string]; sheen: string };

export const RIMS: Record<string, PrismRim> = {
  spectrum: { stops: ["#5fe0d4", "#a6e7a2", "#ebe36c", "#e98f7a", "#d85ad6", "#ee6f8e"], inside: ["#161112", "#1f1819"], sheen: "#3a2626" },
  twilight: { stops: ["#dcd5f7", "#bcaef2", "#8c97f1", "#4d8af4", "#2f86ff"], inside: ["#121216", "#18171d"], sheen: "#2b2833" },
};

/** Evenly spaced stops for a linear-gradient, repeated once so the rim can flow along without a seam. */
export function rimGradient(stops: string[], angle = 90): string {
  if (stops.length === 0) return "transparent";
  if (stops.length === 1) return stops[0];
  const all = [...stops, ...stops.slice(0, -1).reverse()];
  const step = 100 / (all.length - 1);
  return `linear-gradient(${angle}deg, ${all.map((c, i) => `${c} ${Math.round(i * step * 100) / 100}%`).join(", ")})`;
}
