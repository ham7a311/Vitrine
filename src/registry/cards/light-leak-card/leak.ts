/** Where the light leak sits, in percent of the card, eased toward a pointer by at most `reach` percent. */
export function leakCentre(px: number | null, py: number | null, reach = 8): { x: number; y: number } {
  const clamp = (v: number) => Math.min(1, Math.max(0, v));
  if (px == null || py == null || Number.isNaN(px) || Number.isNaN(py)) return { x: 50, y: 0 };
  const x = 50 + (clamp(px) - 0.5) * 2 * reach;
  const y = 0 + clamp(py) * reach * 0.5;
  return { x: Math.round(x * 10) / 10, y: Math.round(y * 10) / 10 };
}
