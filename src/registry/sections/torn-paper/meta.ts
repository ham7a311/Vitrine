import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "torn-paper",
  name: "Torn Paper",
  category: "sections",
  description: "A section that begins where a strip of paper has been ripped away: when it scrolls into view the tear runs across from left to right, the strip curling off as it goes and leaving a ragged edge with its pale core and loose fibres. A centred serif headline with a handwritten note taped beside it. Kraft, newsprint or blueprint.",
  tags: ["section", "breaker", "paper", "torn", "texture", "editorial", "svg", "scroll", "reveal", "handmade"],
  traits: ["scroll"],
  source: "original",
  isNew: true,
  files: ["TornPaper.tsx", "torn-paper.css", "tear.ts"],
  dependencies: [],
  prompt:
    "Build a section whose top edge is torn paper. Props: eyebrow, title, lead, note (a short handwritten aside), primary and secondary links {label, href}, palette {above, paper, core, ink, muted, accent, onAccent, note, noteInk}, seed, onNavigate and className.\n\nTear (pure functions): a seeded jagged line across the width by midpoint displacement — each pass splits every segment and nudges the midpoint by a random amount up to the current roughness (40px to start, shrinking to 68% each pass) — resampled to a point every 4px around 55% of a 64px band; and short fibres, 1.5–5.5px, sticking up from about every third point at random angles.\n\nThe band is an SVG as wide as the section (a ResizeObserver) on the colour above: first the paper's pale core — the edge lifted about 2–4px — with fibres in the core colour, then the paper body below the edge with a faint shadow, so a thin light rim shows along the tear. Over it, the strip still to be torn: the full band in the paper colour. When the section scrolls into view (once) the strip clears from the left with clip-path (1.5s, a slow start), and a small curled flap — a rounded, skewed, shaded piece of paper with a shadow — rides the tear point across and fades at the end. Without scripting or with reduced motion the tear is simply there. A faint two-dot grain lies over the paper.\n\nBody (container queries): centred eyebrow in spaced capitals, a large serif title, and the note on a sticky-note colour with a strip of translucent tape, tilted 4° and hung to the right of the title on wide screens, under it (tilted −2°) below 1100px, set in a handwriting face with cursive fallbacks. Then a muted lead and two pill links — the primary tilts a degree on hover. The section ends in a second, rougher tear back onto the colour above.",
  interaction: "The links work as normal; the paper tears itself once when the section scrolls into view.",
  animation: "The tear runs across in 1.5s with a curling flap riding it. Reduced motion shows the torn edge at once.",
  a11y: "A labelled section with real links; the tear is decorative and hidden; the note is real text. Contrast holds in every palette, including on the note.",
  responsive: "The tear is rebuilt for any width; the note moves under the title on narrower screens.",
  touchFallback: "Nothing depends on hover.",
  variants: [
    { id: "kraft", label: "Kraft", prompt: "Kraft paper #c9a677 with a cream core #ead6b6 torn from a dark brown #2a221b section; dark brown ink #2a1c0f, a dark primary with cream text and a pale yellow note." },
    { id: "newsprint", label: "Newsprint", prompt: "Newsprint #efeae0 with a white core torn from a near-black #1c1c1c section; black ink, a red #c8321f primary and a yellow #ffe066 note." },
    { id: "blueprint", label: "Blueprint", prompt: "Blueprint paper #1f4e8c with a light blue core #5d86c0 torn from an off-white #f2efe8 section; white ink, a white primary with blue text and a white note with blue writing." },
  ],
  preview: { bg: "#2a221b", mode: "fill", frame: [1440, 900] },
};
