import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "loom-breaker",
  name: "Loom Breaker",
  category: "sections",
  description: "A section that opens under a band of cloth weaving itself: the warp threads drop into place, each weft row is shuttled across in turn, and the crossings lock over and under as it passes, leaving a short fringe. Copy sits on the left, a checklist and the actions on the right, and a thin selvedge stripe closes the section. Plain, twill or basket weave.",
  tags: ["section", "breaker", "weave", "textile", "pattern", "svg", "scroll", "reveal", "split", "craft"],
  traits: ["scroll"],
  source: "original",
  isNew: true,
  files: ["LoomBreaker.tsx", "loom-breaker.css", "weave.ts"],
  dependencies: [],
  prompt:
    "Build a section that opens under a band of woven cloth. Props: eyebrow, title, lead, primary and secondary links {label, href}, points, weave (plain, twill or basket), palette {ground, warp [two colours], weft [two colours], ink, muted, line, accent, onAccent}, onNavigate and className.\n\nWeaving (pure functions): whether a warp column i lies over weft row j — plain alternates (i + j even), twill steps diagonally (i − j mod 4 < 2), basket pairs both (⌊i/2⌋ + ⌊j/2⌋ even); and a layout for a band of a given width: warps every 30px (24 below 640px), 78% of the pitch wide, centred across the width; four weft rows filling 132px, each 80% of its row; and a patch of warp for every crossing where the warp is on top.\n\nThe band is an SVG as wide as the section (a ResizeObserver): warps first, alternating warp colours, each continuing below the cloth as two short fringe strokes; then the wefts in alternating weft colours; then the over-patches in their warp's colour with a slightly darker hairline so the weave reads. When the section scrolls into view (IntersectionObserver, once), it weaves: warps drop in (scaleY from the top, 9ms apart), each weft slides across from the left (900ms, starting 380ms + 150ms per row), each over-patch appears as its row's weft passes its x, and the fringe draws in last. Without scripting or with reduced motion the cloth is simply there.\n\nBody (container queries): two columns — eyebrow in spaced capitals, a large balanced title and a muted lead on the left; on the right a list of points with plus ticks in the accent on hairline rows, then a filled primary pill and an outlined secondary. One column below 760px. A 10px selvedge of warp and weft stripes closes the section.",
  interaction: "The links work as normal; the cloth weaves itself once when the section scrolls into view.",
  animation: "Warps drop over about 0.9s, then four weft rows shuttle across 150ms apart, each 900ms, with crossings locking as they pass; the fringe draws last. Reduced motion shows the finished cloth.",
  a11y: "A labelled section with real links; the cloth is decorative SVG and hidden. Text and buttons keep 4.5:1 contrast in every palette.",
  responsive: "The band rebuilds for any width with a finer pitch on phones; the body stacks below 760px.",
  touchFallback: "Nothing depends on hover.",
  variants: [
    { id: "indigo", label: "Indigo", prompt: "Plain weave in denim: ground #eef0f4, warp #1f3a6b and #2c4f8c, weft #e9e2d3 and #c7d4ea, ink #111a2c, muted #4b5568, accent #1f3a6b on #f4f6fb." },
    { id: "madras", label: "Madras", prompt: "Twill in madras colours: ground #fbf3e4, warp brick #b8321f and saffron #e8a21e, weft bottle green #1e6b52 and cream #f4e3c1, ink #2a140c, muted #6b5345, accent #b8321f on #fff6ea." },
    { id: "linen", label: "Linen", prompt: "Basket weave in undyed linen on a dark ground: ground #16150f, warp #d9cfb8 and #a99e86, weft #4a4636 and #7a7259, ink #f2eee3, muted #b5ae9c, accent #e7dcc1 on #1a180f." },
  ],
  preview: { bg: "#eef0f4", mode: "fill", frame: [1440, 900] },
};
