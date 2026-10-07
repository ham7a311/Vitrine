/** One soft blob of colour, placed by its centre and size in percent of the pill. */
export type Blob = { c: string; x: number; y: number; w: number; h: number; o?: number };

export type NebulaPalette = { base: string; rim: string[]; blobs: Blob[] };

/** A muted dusk of moss, brick and amber, and a vivid nebula of teal, gold and violet. */
export const PALETTES: Record<string, NebulaPalette> = {
  dusk: {
    base: "#1b191b",
    rim: ["#8e9f88", "#9c92b0", "#b7a7d6"],
    blobs: [
      { c: "#3d573d", x: 30, y: 50, w: 26, h: 190, o: 0.95 },
      { c: "#62804f", x: 35, y: 28, w: 12, h: 120, o: 0.6 },
      { c: "#9c4b4d", x: 62, y: 38, w: 22, h: 180, o: 0.9 },
      { c: "#73373d", x: 72, y: 55, w: 18, h: 160, o: 0.6 },
      { c: "#cf8e52", x: 54, y: 104, w: 40, h: 60, o: 0.95 },
      { c: "#3a2934", x: 90, y: 50, w: 22, h: 160, o: 0.7 },
    ],
  },
  nebula: {
    base: "#1c1e52",
    rim: ["#efeaf8", "#e6e0f6", "#f4f0fb"],
    blobs: [
      { c: "#55e2dc", x: 10, y: 34, w: 40, h: 140 },
      { c: "#5aa6ef", x: 28, y: 30, w: 36, h: 120, o: 0.9 },
      { c: "#e9d77a", x: 36, y: 22, w: 14, h: 60, o: 0.9 },
      { c: "#cbc4ec", x: 39, y: 86, w: 16, h: 50, o: 0.75 },
      { c: "#4470ee", x: 62, y: 30, w: 40, h: 130, o: 0.95 },
      { c: "#5d3ff0", x: 56, y: 84, w: 34, h: 100 },
      { c: "#121030", x: 90, y: 80, w: 30, h: 130 },
      { c: "#f3eefc", x: 79, y: 8, w: 14, h: 46, o: 0.75 },
      { c: "#101126", x: 8, y: 98, w: 26, h: 70 },
    ],
  },
};

/** CSS box for a blob, in percent: left/top of its corner plus size. */
export function blobBox(b: Blob): { left: string; top: string; width: string; height: string } {
  return { left: `${b.x - b.w / 2}%`, top: `${b.y - b.h / 2}%`, width: `${b.w}%`, height: `${b.h}%` };
}
