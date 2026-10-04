import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "tidal-lines",
  name: "Tidal Lines",
  category: "backgrounds",
  description: "Two bands of hairline waveforms drifting sideways at different speeds — a tide chart quietly breathing.",
  tags: ["background", "svg", "animated", "waves", "lines", "css-only"],
  traits: ["ambient"],
  source: "original",
  files: ["TidalLines.tsx", "tidal-lines.css"],
  dependencies: [],
  prompt: `Make a calm section background from hairline waveforms. Generate each line as an SVG polyline (140 segments over a 1200×400 viewBox) whose y is the sum of five sines at different frequencies (0.0085–0.063) and weights (0.12–0.42 of the amplitude), each offset by the line's phase — irregular enough to look like a measured signal, not a sine wave.

Arrange six lines in two bands: an upper band (top 58%) and a lower band (bottom 55%), three lines each, with decreasing amplitude (26 → 12) and opacity (0.14 → 0.08) toward the centre so the middle of the section stays open for content. Stroke them 1.25px in a single accent colour with vector-effect: non-scaling-stroke, and stretch the SVG to 200% width with preserveAspectRatio="none".

Each line contains its path twice, the copy offset by the viewBox width, and its group slides −50% on a linear infinite loop — 42 to 74 seconds, every line a different speed, with alternating directions (the middle upper line and the even lower lines run in reverse), so the waves slip past one another like water. Pure CSS animation. Under reduced motion, show a single still set.`,
  interaction: "None — ambient.",
  animation: "Six independent linear translate loops, 42–74s, alternating direction.",
  a11y: "Entire field is aria-hidden; content sits above on its own layer. Reduced motion removes the drift.",
  responsive: "Bands scale with the container; the SVG height clamps between 220px and 360px per band.",
  variants: [
    { id: "phosphor", label: "Phosphor", prompt: "Lines in #86efac (phosphor green) on pure black #000000; the eyebrow uses the line colour." },
    { id: "frost", label: "Frost", prompt: "Lines in #b9cce4 (frost blue) on blue-black #07090d." },
    { id: "lilac", label: "Lilac", prompt: "Lines in #c8b9ea (lilac) on violet-black #0b0810." },
    { id: "cream", label: "Cream", prompt: "Lines in #efe8dc (warm cream) on warm black #0e0d0b." },
  ],
  preview: { bg: "#000000", mode: "fill" },
};
