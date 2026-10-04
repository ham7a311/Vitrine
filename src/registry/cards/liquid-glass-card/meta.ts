import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "liquid-glass-card",
  name: "Liquid Glass Card",
  category: "cards",
  description: "A now-playing card of thick glass: clear in the middle, bending the scene behind it more and more toward its edges, with a highlight that rides the rim toward your pointer.",
  tags: ["card", "glass", "liquid glass", "media player", "refraction", "backdrop-filter", "svg filter"],
  traits: ["cursor", "click", "keyboard"],
  source: "original",
  files: ["LiquidGlassCard.tsx", "liquid-glass-card.css"],
  dependencies: [],
  prompt:
    "Build a now-playing card (22.5rem, 28px radius) made of thick glass over a colourful scene. Base glass: 8% white, backdrop blur and saturation, an inner top highlight, a faint inner ring and a soft lower inner glow.\n\nIn Chromium, add real edge refraction. Measure the card with a ResizeObserver and build a displacement map as an SVG data URL at exactly that size: black, a left→right red gradient, a top→bottom blue gradient blended with difference, and a neutral grey rounded rect inset 22px and blurred, so the middle maps to 'no shift' and the offsets ramp up only across the bezel. Feed it through feImage into feDisplacementMap (scale −64, R for x, B for y) and apply it with backdrop-filter: url(#lens) blur(5px) saturate(1.7). Other browsers keep the plain blur.\n\nA 1.25px rim, made with a content-box mask, carries a radial highlight placed at the pointer, with a matching soft caustic inside. Content: a gradient artwork tile, 'Now playing' in mono caps, title and artist, a slim range scrubber whose filled part is a gradient stop at --p, elapsed and remaining times, back 15 / play-pause / forward 30, and an 'Up next' line. The play button is a smaller drop of glass that squashes (1.12 × 0.86, springing back) when pressed.",
  interaction: "Move over the card and the rim's highlight follows you. Play and pause, skip, or drag the scrubber.",
  animation: "Rim highlight tracks the pointer directly; play squish 620ms spring.",
  a11y: "An article named 'Now playing: title by artist'. The scrubber is a native range with a spoken value like '1:12 of 3:48'; every control is a labelled button. Reduced motion removes the squish.",
  responsive: "Up to 22.5rem wide, shrinking to fit; the lens map is rebuilt whenever the size changes.",
  touchFallback: "The rim highlight rests at the top-left; everything else works by tap.",
  variants: [
    { id: "dusk", label: "Dusk", prompt: "Dusk scene: base #140c1d behind blurred blobs of coral #ff7a59, violet #8b5cf6, gold #f5c26b and pink #e0457b; default warm gradient artwork." },
    { id: "lagoon", label: "Lagoon", prompt: "Lagoon scene: base #06141c behind blobs of teal #14b8a6, blue #3b82f6, lime #a3e635 and cyan #22d3ee; artwork a teal-to-navy linear gradient with a pale sun dot." },
  ],
  preview: { bg: "#140c1d", mode: "fill" },
};
