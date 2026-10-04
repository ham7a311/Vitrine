import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "feral-title",
  name: "Feral Title",
  category: "type",
  description: "A brutal condensed wordmark — heartbeat in the dark, letters slam in, a gash tears through and the word bleeds.",
  tags: ["title", "wordmark", "cinematic", "horror", "reveal", "svg-filter"],
  traits: ["ambient", "click"],
  source: "original",
  files: ["FeralTitle.tsx", "feral-title.css"],
  dependencies: [],
  prompt: `Build a film-title wordmark for a name (default "HAMZA"). Set it in Anton, uppercase, scaled 1.32× vertically so the letters read tall and brutal, filled with a top-to-bottom two-colour gradient (colors prop) on a near-black field (background prop) with a moving film-grain overlay (an SVG turbulence data-URI in overlay blend, stepped every 0.9s).

Roughen the edges by running the word through an SVG filter: feTurbulence (fractalNoise, 0.035/0.05, 3 octaves) feeding feDisplacementMap at scale 7. Change the turbulence seed every 160ms so the edges shiver.

Sequence: (1) two heartbeat pulses — a radial vignette in the top colour fading in and out twice over ~1.2s; (2) letters slam in one at a time (scale 1.5 → 1 with 10px blur resolving, overshoot easing) 0.24s apart, and at each impact the whole word shudders through the Web Animations API (±5px, 220ms); (3) after the last letter a jagged gash line, rotated -2.2°, tears left to right with a glow; (4) a darker "bleed" copy of the word (blood prop) is clip-path revealed downward from the gash, while seven thin drips grow from the same line; (5) the word settles into a slow 4.2s breathing drop-shadow glow. A Replay button remounts the whole thing.`,
  interaction: "Plays on mount. The Replay button restarts the sequence.",
  animation: "Heartbeat vignette, staggered letter slams with WAAPI shudder, gash scaleX, clip-path bleed, drip growth, then a breathing glow and jittering displacement seed.",
  a11y: "The h2 carries the full word as an aria-label; individual letters, bleed and drips are aria-hidden. Reduced motion renders the finished, bled state with no motion.",
  responsive: "Type size uses clamp(4rem, 17vw, 11rem); the word never wraps.",
  promptAllow: ["blood"],
  variants: [
    { id: "blood", label: "Blood", prompt: "Defaults: colors [#c1121f, #7a0000] — red to deep maroon — on #050303, with a red bleed." },
    { id: "ash", label: "Ash", prompt: "colors=[\"#f1ece2\", \"#8e8a80\"] (bone white to grey), blood=\"#3b3a36\", background=\"#070707\" — a colourless, ashen version." },
    { id: "rust", label: "Rust", prompt: "colors=[\"#d2691e\", \"#6b2a0c\"] (rust orange to brown), blood=\"#3d1707\", background=\"#0a0604\"." },
  ],
  preview: { bg: "#050303", mode: "fill" },
  featured: true,
};
