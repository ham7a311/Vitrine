/** One soft blob of colour, placed by its centre and size in percent of the card. */
export type Blob = { c: string; x: number; y: number; w: number; h: number; o?: number };

/** `foot` is the colour of the white-hot band along the bottom edge. */
export type AuroraLook = { glow: string; tint: string; foot: string; blobs: Blob[] };

/** Four blooms, each a dark card whose lower half catches fire in its own colours, with a white-hot band at the very bottom. */
export const LOOKS: Record<string, AuroraLook> = {
  magenta: {
    foot: "#f4f0ff",
    glow: "#c42bd8",
    tint: "#14163a",
    blobs: [
      { c: "#ff3d6e", x: 88, y: 36, w: 40, h: 34, o: 0.55 },
      { c: "#3826ff", x: 8, y: 66, w: 46, h: 40 },
      { c: "#7a2bff", x: 32, y: 74, w: 40, h: 34 },
      { c: "#ff1aa8", x: 64, y: 76, w: 52, h: 36 },
      { c: "#ff2a55", x: 90, y: 62, w: 38, h: 40 },
      { c: "#bfe6ff", x: 12, y: 98, w: 40, h: 22 },
      { c: "#ffffff", x: 55, y: 101, w: 110, h: 24 },
    ],
  },
  lime: {
    foot: "#f4fff2",
    glow: "#1ed84f",
    tint: "#0c1a12",
    blobs: [
      { c: "#11c94a", x: 18, y: 70, w: 54, h: 40 },
      { c: "#8cff2a", x: 44, y: 76, w: 46, h: 32 },
      { c: "#f2ff4d", x: 58, y: 86, w: 46, h: 24 },
      { c: "#2fe0b4", x: 84, y: 80, w: 40, h: 34 },
      { c: "#d9fff6", x: 78, y: 98, w: 40, h: 20 },
      { c: "#ffffff", x: 48, y: 101, w: 100, h: 22 },
    ],
  },
  iris: {
    foot: "#f1eeff",
    glow: "#5a3cff",
    tint: "#0d0e24",
    blobs: [
      { c: "#7a3cff", x: 84, y: 44, w: 34, h: 50, o: 0.9 },
      { c: "#2b3dff", x: 22, y: 70, w: 50, h: 38 },
      { c: "#4fc6ff", x: 30, y: 86, w: 44, h: 26 },
      { c: "#8a5cff", x: 72, y: 80, w: 44, h: 30 },
      { c: "#e9e4ff", x: 50, y: 100, w: 112, h: 26 },
    ],
  },
  ember: {
    foot: "#fff7dc",
    glow: "#ff5a1a",
    tint: "#1c0d07",
    blobs: [
      { c: "#b0201a", x: 86, y: 36, w: 36, h: 36, o: 0.55 },
      { c: "#ff2a1a", x: 8, y: 80, w: 36, h: 36 },
      { c: "#ff6a00", x: 30, y: 78, w: 48, h: 34 },
      { c: "#ffd21a", x: 62, y: 82, w: 46, h: 30 },
      { c: "#ff9a1a", x: 86, y: 70, w: 38, h: 34 },
      { c: "#fff6c8", x: 62, y: 101, w: 100, h: 22 },
    ],
  },
};

/** CSS box for a blob, in percent. */
export function blobBox(b: Blob): { left: string; top: string; width: string; height: string } {
  return { left: `${b.x - b.w / 2}%`, top: `${b.y - b.h / 2}%`, width: `${b.w}%`, height: `${b.h}%` };
}
