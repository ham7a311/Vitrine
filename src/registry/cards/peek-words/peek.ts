export type Box = { left: number; top: number; width: number; height: number };

/**
 * Where the card goes: centred over the word with a gap, flipped below when there isn't room above,
 * and slid sideways so it never leaves the bounds. Coordinates are relative to the bounds' origin.
 */
export function place(word: Box, card: { width: number; height: number }, bounds: { width: number; height: number }, gap = 12, margin = 8) {
  const roomAbove = word.top - gap - margin;
  const roomBelow = bounds.height - (word.top + word.height) - gap - margin;
  const side: "above" | "below" = roomAbove >= card.height || roomAbove >= roomBelow ? "above" : "below";
  const top = side === "above" ? word.top - gap - card.height : word.top + word.height + gap;
  const centre = word.left + word.width / 2;
  const left = Math.max(margin, Math.min(bounds.width - margin - card.width, centre - card.width / 2));
  // where the word sits along the card, so the card can grow out of it
  const origin = Math.max(0, Math.min(card.width, centre - left));
  return { left: Math.round(left), top: Math.round(top), side, origin: Math.round(origin) };
}
