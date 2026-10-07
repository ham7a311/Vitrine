/** Which end of the pill the blue mist gathers at. */
export type Side = "left" | "right";

/** One soft blob, by centre and size in percent of the pill. */
export type Blob = { c: string; x: number; y: number; w: number; h: number; o?: number };

/** The mist as drawn for the left side; the right side is its mirror. */
const LEFT: Blob[] = [
  { c: "#1f97f2", x: 12, y: 58, w: 34, h: 180 },
  { c: "#56b8f7", x: 28, y: 26, w: 30, h: 120, o: 0.9 },
  { c: "#6fe6fb", x: 42, y: 58, w: 40, h: 170 },
  { c: "#8ff1fc", x: 54, y: 84, w: 36, h: 100 },
  { c: "#c9f6fd", x: 64, y: 30, w: 30, h: 90, o: 0.8 },
  { c: "#f1fcff", x: 88, y: 50, w: 36, h: 150, o: 0.95 },
];

/** Mirror a blob across the pill's vertical centre line. */
export function mirror(b: Blob): Blob {
  return { ...b, x: 100 - b.x };
}

export function mist(side: Side): Blob[] {
  return side === "left" ? LEFT : LEFT.map(mirror);
}

/** How far (percent of the pill) the mist slides on hover: always toward the other end. */
export function drift(side: Side, amount = 22): number {
  return side === "left" ? amount : -amount;
}

/** CSS box for a blob, in percent: left/top of its corner plus size. */
export function blobBox(b: Blob): { left: string; top: string; width: string; height: string } {
  return { left: `${b.x - b.w / 2}%`, top: `${b.y - b.h / 2}%`, width: `${b.w}%`, height: `${b.h}%` };
}
