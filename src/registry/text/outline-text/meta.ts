import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "outline-text",
  name: "Outline Text",
  category: "text",
  description: "Big hairline lettering that fills with ink: word by word under the pointer, line by line as you scroll, as a stack of outlines that lean away from the pointer, or in rows of outline and solid words sliding past each other.",
  tags: ["outline", "stroke", "text", "typography", "headline", "scroll", "marquee", "hover", "echo", "poster"],
  traits: ["hover", "scroll", "cursor", "ambient"],
  source: "original",
  files: ["OutlineText.tsx", "outline-text.css", "fill.ts", "../../media/helix-showcase/helix.ts"],
  dependencies: [],
  prompt:
    "Build big poster lettering drawn as hairlines (transparent text with a 1.5px -webkit-text-stroke in the ink colour) that fills with solid ink, in the single effect selected below. Inter 800, uppercase, -0.035em, 0.95 leading, sized from the container width.\n\nPalette (light / dark): ink #111214 / #f1f0ec, page #f4f3ef / #0b0b0c, accent signal orange #ff4d1c / acid lime #d4ff3a. In forced-colours mode drop the stroke and show plain text.\n\nShow it on a #f4f3ef panel above a #0b0b0c panel.",
  interaction: "Depends on the effect: point, scroll, move the pointer, or hover a row to pause it. The text is always real and readable.",
  animation: "Clip-path wipes, a scroll-linked fill, an eased lean and a linear slide. Reduced motion removes the intro, the lean's easing and the slide; scroll fill still follows the scroll.",
  a11y: "Hover and scroll render one real heading; the echo and marquee copies are aria-hidden and the section is labelled with the words once. Filled copies are aria-hidden duplicates of visible text.",
  responsive: "Type scales with the container (cqi), lines wrap at word boundaries where allowed, and the marquee and echo never cause horizontal page scroll.",
  touchFallback: "Hover plays its fill once on view; echo sways on its own; marquee keeps sliding; scroll works with touch scrolling.",
  variants: [
    { id: "hover", label: "Hover fill", prompt: "Hover fill: a two-line headline ('Quiet tools / for loud ideas'), each word a span carrying its text in data-text; a filled copy in ::after is clipped to inset(0 100% 0 0) and wipes open to the right on hover over 0.5s (every third word fills in the accent). The first time it scrolls into view, the words fill and clear once in sequence, 110ms apart (1.6s each: wipe in, hold, wipe out to the right)." },
    { id: "scroll", label: "Scroll fill", prompt: "Scroll fill: a section 2.2 viewports tall with a sticky full-height stage holding three lines ('Every pixel / earns its / place.') at up to 176px. Each line has a filled copy over its outline clipped to its own fill (inset from the right by (1 − f) × 100%); progress through the section fills the lines one after another with a 15% overlap, so the wipe flows from the end of one line into the next. The last line fills in the accent. Measure progress against the real scrolling element (the nearest scrolling ancestor, else the page)." },
    { id: "echo", label: "Echo", prompt: "Echo: one huge word ('SIGNAL', 900 weight, up to 260px) in solid ink with five hairline copies stacked behind it, each offset by k × (dx, dy) and fading by 14% per step; the furthest copy's stroke is the accent. dx/dy rest at 6px and sway slowly (±3px) on their own; with a mouse they point away from the pointer (up to ±13px per step), easing over 0.55s." },
    { id: "marquee", label: "Marquee", prompt: "Marquee: two rows of words (Design, Build, Ship, Listen / Measure, Repeat, Prototype, Iterate), up to 128px, alternating hairline and solid words with a small accent ✦ between them; each row is its content twice in a track sliding by -50% (38s left, 44s right for the second row) so it loops seamlessly. Hovering a row pauses it." },
  ],
  preview: { bg: "#f4f3ef", mode: "fill", frame: [1200, 760] },
  isNew: true,
};
