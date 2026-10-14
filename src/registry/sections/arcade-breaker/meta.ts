import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "arcade-breaker",
  name: "Arcade Breaker",
  category: "sections",
  description: "A section that opens under a colonnade: a row of arches, the middle one taller and wider, each a window onto the same sky. As the section scrolls through the viewport the day passes behind them — a pink dawn, a blue noon, a warm dusk — with the sun crossing from arch to arch and soft clouds drifting by. The copy sits centred under the great arch.",
  tags: ["section", "breaker", "arches", "architecture", "sky", "scroll", "parallax", "hospitality", "svg", "serif"],
  traits: ["scroll"],
  source: "original",
  isNew: true,
  promptAllow: ["dusk"],
  files: ["ArcadeBreaker.tsx", "arcade-breaker.css", "sky.ts"],
  dependencies: [],
  prompt:
    "Build a section that opens under a row of arches with a sky behind them. Props: eyebrow, title, lead, primary and secondary links {label, href}, palette {wall, shade, ink, muted, line, accent, onAccent}, onNavigate and className.\n\nSky and arches (pure functions): five sky stops over 0–1 (dawn #3b3f7a → #f4a77f, morning, a blue noon #3d8fe0 → #cfe8fb, afternoon, dusk #24245c → #ee7a52), each a top and bottom colour and a sun colour, blended between the nearest pair; the sun's place — across from 8% to 92% and rising on a sine to its noon height; the arcade's travel up the viewport (0 as its top enters at the bottom, 1 once it's half its height above the top), so dawn breaks as the section arrives and dusk falls as the arches leave; and the arches for a width — 7 (5 below 960px, 3 below 560px) with gaps of 1.8% of the width, the middle one 1.5× wider and taller — each drawn as two straight jambs up to a semicircular head.\n\nThe arcade is as tall as 21% of the width (180–300px). Behind, a sky layer: a vertical gradient from CSS variables, a glowing sun disc and three blurred clouds drifting across over 70–120s. In front, an SVG wall: one even-odd path of the full rectangle with every arch cut out, a darker reveal stroke round each opening, a small keystone over each, and a sill along the bottom. On scroll — of the window or any scrolling ancestor, so a capture-phase listener on the document — (one rAF per frame, listening only while the section is on screen) set the sky colours and sun position as CSS variables on the section — no React re-render per scroll.\n\nThe body continues the wall colour: centred eyebrow in spaced capitals, a large serif title, a muted lead and two pill links — the primary filled in the accent, the secondary outlined. Reduced motion stops the clouds; the sky still follows the scroll position.",
  interaction: "Scroll past it and the day goes by behind the arches; the links work as normal.",
  animation: "Scroll-linked sky and sun; clouds drift continuously. Reduced motion keeps the clouds still.",
  a11y: "A labelled section with real links; the arcade is decorative and hidden. Text keeps 4.5:1 contrast on the wall colour in every palette.",
  responsive: "Seven arches on desktop, five on tablets, three on phones, always with a larger centre arch.",
  touchFallback: "Touch scrolling drives the sky the same way.",
  variants: [
    { id: "terracotta", label: "Terracotta", prompt: "A terracotta wall #9c4528 with shade #7d341c, cream ink #fff4ea and muted #f6dccd, and a cream primary button with dark brown text." },
    { id: "marble", label: "Marble", prompt: "A pale marble wall #ece6dc with shade #d6cdbf, ink #23201b and muted #5d574d, and a dark primary button with ivory text." },
    { id: "dusk", label: "Dusk", prompt: "An indigo wall #1d2240 with shade #141830, ink #eef0fa and muted #b4b9d6, and a warm gold primary button #f2c46d with dark text." },
  ],
  preview: { bg: "#9c4528", mode: "fill", frame: [1440, 900] },
};
