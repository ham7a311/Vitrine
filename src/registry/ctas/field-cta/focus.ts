/** The centre of `target` as a 0–1 point across and down `host` (clamped inside it). */
export function centreIn(target: { left: number; top: number; width: number; height: number }, host: { left: number; top: number; width: number; height: number }) {
  const x = (target.left + target.width / 2 - host.left) / Math.max(1, host.width);
  const y = (target.top + target.height / 2 - host.top) / Math.max(1, host.height);
  return { x: Math.min(1, Math.max(0, x)), y: Math.min(1, Math.max(0, y)) };
}
