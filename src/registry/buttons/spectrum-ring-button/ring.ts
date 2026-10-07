/** Ring colour sets: each a run of hues that the ring cycles through, broken by dark gaps. */
export const RINGS: Record<string, string[]> = {
  spectrum: ["#2f6bff", "#ffffff", "#ffb347", "#ff4d3d", "#7a3cff", "#2fb7ff", "#3dff9a", "#ffe14d", "#ff5f6d"],
  ice: ["#3ad7ff", "#ffffff", "#8fa8ff", "#b46bff", "#5ef0ff", "#e8fbff", "#6b8cff"],
  ember: ["#ff7a1a", "#fff1d6", "#ffd23d", "#ff3d2e", "#ff9f3d", "#ffffff", "#ff5a1f"],
};

/**
 * A conic gradient for the ring: the colours spread evenly round the circle, with a short dark
 * gap after every `gapEvery` colours so the ring reads as broken light rather than a smooth wheel.
 */
export function ringGradient(colors: string[], gapEvery = 3, gap = 4): string {
  if (colors.length === 0) return "transparent";
  const n = colors.length;
  const span = 360 / n;
  const parts: string[] = [];
  colors.forEach((c, i) => {
    const a = i * span;
    parts.push(`${c} ${round(a)}deg`);
    if ((i + 1) % gapEvery === 0) {
      const g0 = a + span - gap * 1.5;
      parts.push(`${c} ${round(g0 - gap)}deg`, `#05060a ${round(g0)}deg`, `#05060a ${round(g0 + gap)}deg`);
    }
  });
  parts.push(`${colors[0]} 360deg`);
  return `conic-gradient(from var(--sprb-a), ${parts.join(", ")})`;
}

const round = (v: number) => Math.round(v * 10) / 10;
