/** Which way the blob turns: it follows the last real scroll direction and keeps turning that way when the page is still. */
export function direction(prev: 1 | -1, velocity: number, threshold = 0.02): 1 | -1 {
  if (velocity > threshold) return 1;
  if (velocity < -threshold) return -1;
  return prev;
}

/** Target spin speed (rad/s): an idle drift in the current direction, plus a push from the scroll itself, capped. */
export function spinTarget(dir: 1 | -1, velocity: number, idle = 0.35, gain = 9, max = 6) {
  const v = dir * idle + velocity * gain;
  return Math.max(-max, Math.min(max, v));
}

/** Frame-rate independent approach of `current` toward `target` (rate per second). */
export function approach(current: number, target: number, dt: number, rate = 4) {
  return target + (current - target) * Math.exp(-rate * dt);
}

/** Baseline y for one line of text set in a box, from the font's ascent and descent. */
export function baseline(top: number, height: number, ascent: number, descent: number) {
  return top + (height - (ascent + descent)) / 2 + ascent;
}

/** The blob's size and place for a stage of w × h: it grows a little with progress; phones give it a larger share of the width. */
export function lens(w: number, h: number, progress: number) {
  const r = Math.min(w * (w < 700 ? 0.26 : 0.15), h * 0.27) * (1 + progress * 0.08);
  return { r, x: w * (0.5 + (progress - 0.5) * 0.06), y: h * 0.5 };
}
