/** One soft blob of colour, placed by its centre and size in percent of the pill. y can sit below 100 so a glow rises from under the edge. */
export type Blob = { c: string; x: number; y: number; w: number; h: number; o?: number };

/** `glow` is the x (percent) of the bright white dome that rises from the bottom edge. */
export type FrostPalette = { base: string; ink: string; rim: string; glow: number; blobs: Blob[] };

/** The four looks from the reference sheet: a cool-left/warm-right study, a mint-to-lilac one, its mirror in peach and blue, and an all-blue one. */
export const PALETTES: Record<string, FrostPalette> = {
  azure: {
    glow: 54,
    base: "#e9ecf6",
    ink: "#12141c",
    rim: "#f4f6fb",
    blobs: [
      { c: "#2f86ff", x: 14, y: 58, w: 46, h: 170 },
      { c: "#8fbcff", x: 36, y: 40, w: 46, h: 140, o: 0.75 },
      { c: "#dcd8f2", x: 66, y: 30, w: 40, h: 120, o: 0.6 },
      { c: "#f7d4ba", x: 91, y: 50, w: 28, h: 150, o: 0.95 },
      { c: "#ffffff", x: 54, y: 100, w: 36, h: 58 },
    ],
  },
  mint: {
    glow: 52,
    base: "#e6e9f3",
    ink: "#12141c",
    rim: "#f4f6fb",
    blobs: [
      { c: "#5eecd6", x: 11, y: 62, w: 38, h: 160 },
      { c: "#aef3ae", x: 33, y: 12, w: 30, h: 90, o: 0.85 },
      { c: "#d6cdee", x: 60, y: 48, w: 40, h: 120, o: 0.8 },
      { c: "#e49ff0", x: 93, y: 55, w: 26, h: 150 },
      { c: "#ffffff", x: 52, y: 100, w: 36, h: 56 },
    ],
  },
  peach: {
    glow: 50,
    base: "#eceef3",
    ink: "#12141c",
    rim: "#f4f6fb",
    blobs: [
      { c: "#f4cdbd", x: 9, y: 48, w: 28, h: 140 },
      { c: "#94e3f7", x: 50, y: 18, w: 40, h: 110, o: 0.8 },
      { c: "#bff3fb", x: 64, y: 86, w: 30, h: 70, o: 0.85 },
      { c: "#3d8dff", x: 91, y: 60, w: 34, h: 170 },
      { c: "#ffffff", x: 50, y: 100, w: 34, h: 56 },
    ],
  },
  sky: {
    glow: 53,
    base: "#cfe1ff",
    ink: "#12141c",
    rim: "#e6efff",
    blobs: [
      { c: "#2a7cff", x: 8, y: 56, w: 34, h: 180 },
      { c: "#2f82ff", x: 94, y: 56, w: 30, h: 180 },
      { c: "#e9f3ff", x: 50, y: 14, w: 52, h: 90, o: 0.95 },
      { c: "#b6f3ff", x: 47, y: 96, w: 40, h: 80, o: 0.9 },
      { c: "#ffffff", x: 53, y: 100, w: 36, h: 60 },
    ],
  },
};

/** How far the paint leans toward a pointer at fraction `px` (0 left, 1 right) across the pill: up to ±`reach` percent. */
export function lean(px: number | null, reach = 6): number {
  if (px == null || Number.isNaN(px)) return 0;
  const t = Math.min(1, Math.max(0, px));
  return Math.round((t - 0.5) * 2 * reach * 100) / 100;
}

/** CSS box for a blob, in percent: left/top of its corner plus size. */
export function blobBox(b: Blob): { left: string; top: string; width: string; height: string } {
  return { left: `${b.x - b.w / 2}%`, top: `${b.y - b.h / 2}%`, width: `${b.w}%`, height: `${b.h}%` };
}
