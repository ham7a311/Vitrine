import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "squiggle-underline",
  name: "Squiggle Underline",
  category: "highlights",
  description: "Hand-drawn underlines for running text, drawn in under each line at writing speed when the words come into view. Point at a wavy one and the wave starts to travel; point at any other and it draws itself again.",
  tags: ["highlight", "underline", "squiggle", "hand-drawn", "editorial", "multi-line", "svg"],
  traits: ["hover", "scroll"],
  source: "original",
  files: ["SquiggleUnderline.tsx", "squiggle.ts", "squiggle-underline.css"],
  dependencies: [],
  prompt: `Build hand-drawn underlines for running text: a Newsreader headline "Books that are [worth reading twice]." and a paragraph with a second, longer underlined phrase that wraps, each phrase in its own colour, on warm off-white paper.

Geometry: the underlined words stay real inline text. Their line rectangles come from Range.getClientRects(), merged per line and measured relative to a zero-size anchor at the wrapper's origin; re-measured on the block's resize, window resize and fonts.ready. For each line an SVG path is drawn just under the baseline (92% down the line box), from .03em before the words to .03em after, with round caps and a stroke of about 6% of the font size (at least 2px). The wrapper adds .08em of bottom padding so the line never meets the next line's ascenders.

Shapes, chosen with a kind prop: a strictly periodic wave of quadratic curves (wavelength .44em, amplitude .055em) that runs two wavelengths past the start so it can be shifted by exactly one period and loop without a seam; a zigzag of straight segments (.15em steps, ±.065em, with small seeded jitter in spacing and height); two quick strokes, the second .13em lower, starting later and stopping sooner, each gently wandering (smoothed through a few seeded points); and a row of cursive loops like joined "e"s (a prolate cycloid, loop radius .09em, pitch .27em, smoothed).

Motion: each line's path is clipped to a rectangle that grows left to right (scaleX from 0, transform-box fill-box) at writing speed — about 1.1ms per pixel, 260–700ms per line, lines one after another with 60ms between — when the phrase is fully in view; a delay prop orders several. Pointing at a wave sets it travelling: the path translates by one wavelength on a 760ms linear loop inside its clip, so the surface flows while the ends stay put. Pointing at the other shapes redraws them from the left, without the opening delay. Reduced motion shows them drawn and still.`,
  interaction: "Point at a wavy underline to set it flowing; point at the others to redraw them.",
  animation: "Drawn per line at writing speed (260–700ms each); the wave travels one period every 760ms while pointed at.",
  a11y: "Underlines are aria-hidden SVG; the words stay ordinary selectable text, unchanged in colour, so contrast is the paragraph's own.",
  responsive: "Measured from the text, so the underline follows the words through every rewrap; strokes scale with the font size.",
  touchFallback: "Underlines draw in on view; there is no hover motion.",
  variants: [
    { id: "wave", label: "Wave", prompt: "Use the periodic wave: coral #ff5a36 for the headline and blue #2f6bff for the paragraph; pointing at it sets it travelling." },
    { id: "zigzag", label: "Zigzag", prompt: "Use the zigzag of straight, slightly uneven segments: raspberry #e8366f for the headline and green #0f9d74 for the paragraph; pointing at it redraws it." },
    { id: "double", label: "Double", prompt: "Use two quick, slightly wandering strokes, the lower one shorter: blue #1f5bd8 for the headline and orange #e2531d for the paragraph; pointing at it redraws it." },
    { id: "scribble", label: "Scribble", prompt: "Use the row of cursive loops like joined e's: violet #7b3fe4 for the headline and amber #d48a00 for the paragraph; pointing at it redraws it." },
  ],
  promptAllow: ["wave", "zigzag"],
  preview: { bg: "#fbfaf6", mode: "fill" },
  isNew: true,
};
