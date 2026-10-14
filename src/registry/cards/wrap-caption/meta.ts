import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "wrap-caption",
  name: "Wrap Caption",
  category: "cards",
  description: "A photo card with two lines of huge type wrapped around it on an invisible cylinder: the words curve away at the sides, pass behind the picture and turn slowly in opposite directions. Step through the photos and the words change with them.",
  tags: ["photo", "caption", "3d text", "marquee", "carousel", "travel", "editorial", "cylinder"],
  traits: ["ambient", "click", "keyboard", "touch"],
  source: "original",
  isNew: true,
  files: ["WrapCaption.tsx", "wrap-caption.css", "ring.ts"],
  dependencies: [],
  prompt:
    "Build a photo card with captions that wrap around it in 3D. Props: slides [{id, picture element or src, alt, place, lines: [top phrase, bottom phrase]}], accent (default #4a7be0) and turn (seconds per revolution, default 70).\n\nA dark stage (about 54% of the width tall, 440–780px) with a 1700px perspective. In the middle, a 4:5 picture about 30% of the width (220–440px), with a mono caption row under it: the counter ('01 / 04') on the left, two small round previous/next buttons in the middle and the place name on the right, all in the accent colour, uppercase and tracked.\n\nBehind the picture, each phrase circles on its own cylinder: set the upper-case phrase plus a ' · ' separator in a heavy grotesk at about 8.5% of the width (40–170px), measure every glyph's width with a canvas, and give each glyph an arc as long as itself; repeat the phrase a whole number of times and solve the radius so the repeats close the circle exactly (no seam) near 80% of the width. Place each glyph with rotateY(its angle) translateZ(radius), centred on its own box, with its back face hidden, inside a container pushed back by the radius — so the front of the cylinder sits just behind the picture plane and the picture hides the middle of the words while they curve away on both sides. The upper line sits at 34% of the stage height and the lower at 58%; they turn in opposite directions (the lower a little slower) with a linear CSS animation, paused offscreen, in hidden tabs and under reduced motion.\n\nChanging photos (buttons, or the arrow keys when the region has focus) cross-fades the picture and the words over 600ms; the counter and a visually hidden line announce the new place and phrases politely. Every slide keeps alt text.",
  interaction: "Use the arrow buttons, or focus the card and press ← and →, to change photos; the words around it change with them.",
  animation: "Both lines turn continuously in opposite directions (70s and about 80s a revolution); changing photos cross-fades the picture and the words over 600ms. Everything stops offscreen and under reduced motion.",
  a11y: "A labelled carousel region with real previous and next buttons and arrow keys; each photo has alt text; the counter and a hidden line announce the place and phrases. The circling glyphs are hidden from assistive tech.",
  responsive: "Type size, radius and picture size all follow the container's width; below 640px the picture takes 60% of the width and the two lines circle above and below it, larger, instead of across it.",
  touchFallback: "Tap the arrow buttons to change photos.",
  variants: [
    { id: "cobalt", label: "Cobalt", prompt: "Accent #4a7be0: cobalt blue type and labels on near-black." },
    { id: "coral", label: "Coral", prompt: "Accent #ef6a4f: warm coral type and labels on near-black." },
    { id: "lime", label: "Lime", prompt: "Accent #b9e05a: acid lime type and labels on near-black." },
  ],
  preview: { bg: "#09090b", mode: "fill", frame: [1440, 800] },
};
