export type Motif = "wave" | "arch" | "step";

/** One tile each, drawn on a 100 × 100 grid and stretched to the tile's shape. */
export const MOTIFS: Record<Motif, string> = {
  // a leaning leaf with two rounded corners; side by side, the gaps between them read as waves
  wave: "M0 100V56C0 25 22 0 53 0H100V44C100 75 78 100 47 100Z",
  // a round-headed arch with a doorway through it
  arch: "M0 100V50A50 50 0 0 1 100 50V100H73V55A23 23 0 0 0 27 55V100Z",
  // three steps climbing to the right
  step: "M0 100V67H33V34H67V0H100V100Z",
};

/** Delay (ms) for a tile, so the band flips in as a diagonal wave from the top-left. */
export const delay = (col: number, row: number, step = 26) => (col + row * 2) * step;
