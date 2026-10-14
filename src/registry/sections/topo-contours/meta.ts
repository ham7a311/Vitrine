import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "topo-contours",
  name: "Topo Contours",
  category: "sections",
  description: "A section that opens under a strip of survey map: contour lines are traced across it as it scrolls into view, every fifth one heavier and labelled with its height. Move the pointer over the map and a hill rises under it, the lines gathering round it as you go. Right-aligned copy with its figures inline.",
  tags: ["section", "breaker", "topographic", "contours", "map", "outdoors", "generative", "canvas", "interactive", "data"],
  traits: ["scroll", "cursor", "canvas"],
  source: "original",
  promptAllow: ["night"],
  isNew: true,
  files: ["TopoContours.tsx", "topo-contours.css", "topo.ts"],
  dependencies: [],
  prompt:
    "Build a section that opens under a band of topographic contour lines. Props: eyebrow, title, lead, stats [{value, label}], primary and secondary links {label, href}, palette {ground, line, index, ink, muted, rule, accent, onAccent}, seed, onNavigate and className.\n\nField and contours (pure functions): smooth value noise (a hashed lattice with smoothstep interpolation) summed over three octaves at 160, 70 and 30px, sampled at every corner of a 10px grid, plus any Gaussian hills; contour levels every 0.045 between the field's extremes; and marching squares — for each cell, a 4-bit case from which corners are above the level, the crossing points interpolated linearly along each edge, one segment per case and two for the saddle cases.\n\nThe band is a 250px canvas as wide as the section (a ResizeObserver, DPR ≤ 2). Every level is stroked as one path of segments — 0.8px in the line colour, every fifth level 1.4px in the index colour — and each index line is labelled with a height in small monospace (\"1,240\") on a stretch that's nearly level, at most every 340px, knocked out of the lines with a patch of ground colour. When the section scrolls into view (once) the map is traced in from the left over 1.4s by widening a clip. Moving the pointer over the band raises a Gaussian hill under it (radius 80px) that eases in and out, and the contours are recomputed each frame while it moves, so the lines crowd round the pointer; leaving lets it sink. The loop only runs while something changes. Reduced motion shows the finished map without the hill.\n\nBody (container queries): right-aligned — a monospace eyebrow, a heavy title, a muted lead, the stats inline (each a value over its label under a rule in the index colour), and the actions with the primary on the far right. Left-aligned below 700px.",
  interaction: "Move the pointer over the map and a hill rises under it; the links work as normal.",
  animation: "The map traces in over 1.4s on scroll-in; the pointer's hill eases in and out over about a quarter of a second. Reduced motion shows the finished map.",
  a11y: "A labelled section with real links and a definition list of figures; the map canvas is decorative and hidden. Text keeps 4.5:1 in both palettes.",
  responsive: "The map is rebuilt for any width; the body moves to the left on narrow screens.",
  touchFallback: "Touch scrolls the page normally; dragging across the map raises the hill where a pointer can track.",
  variants: [
    { id: "survey", label: "Survey", prompt: "An ordnance-survey look: paper #f1ece0, contours #c08a5c, index lines and labels #7d4a22, ink #2b1d10 and a dark primary button." },
    { id: "night", label: "Night", prompt: "A night map: ground #0d1614, contours #2f8f6e, index lines and labels in mint #8ef0c4, ink #e8f6ef and a mint primary button with dark text." },
  ],
  preview: { bg: "#f1ece0", mode: "fill", frame: [1440, 900] },
};
