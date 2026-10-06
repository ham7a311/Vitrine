import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "refraction-blob",
  name: "Refraction Blob",
  category: "heroes",
  description: "A personal hero on a quiet ruled page: a large name, and in front of it a lumpy drop of glass that reads the name through itself, bending and magnifying it. Scrolling turns the drop; scroll back and it turns the other way, and it keeps drifting in whichever way you last went.",
  tags: ["hero", "portfolio", "glass", "refraction", "blob", "webgl", "shader", "scroll", "personal"],
  traits: ["webgl", "scroll", "ambient"],
  source: "original",
  files: ["RefractionBlob.tsx", "refraction-blob.css", "blob.ts", "../../media/helix-showcase/helix.ts"],
  dependencies: [],
  prompt:
    "Build a portfolio hero (a fictional designer, Rami Nasser) in a section two viewports tall with a sticky full-height stage.\n\nPage: white, with 1px #ececec side rules inset 4.5%, three dashed #f1f1f1 column guides at the quarter points, and a nav row (about 88px) with a hairline under it: a round line-drawn logo on the left; links on the right in #5a5a5a at about 21px, the current one ('Work') in ink and underlined. The name sits across the middle in Inter at about 150px (weight 450, -0.035em) and a small grey label ('Product designer') sits above it at 37% height. Bottom right, from the third guide: a 1px vertical rule, the line 'I make hard things feel kind.' and an underlined 'More about me →'.\n\nGlass: one WebGL canvas over the stage, clear except where the drop is. Raymarch (56 steps, orthographic) a sphere whose surface is pushed in and out by two octaves of 3D value noise (amplitudes 0.12 and 0.04), rotated by a matrix that turns with the scroll. Where the ray hits, take the normal and read a 2D-canvas copy of the page's text (painted from the real elements' rects and computed fonts, so it lines up) through it: magnified a touch toward the centre (×0.93 sampling), bent gently by the normal and more at the rim, and split very slightly into colour, so the name stays readable through it. Cloud it with a little milky white, deepen it at the rim, darken a thin ring where the glass turns away, and add a tight highlight from the upper left. Anti-alias the outline from the nearest distance the ray passed. Radius about 27% of the height (about a quarter of the width on phones, so the name always runs out past both sides), drifting slightly right and growing 8% through the section.\n\nScroll: progress through the section gives a velocity; the spin target is a slow drift (0.35 rad/s) in the last direction scrolled plus the velocity × 9, capped at 6 rad/s, and the actual spin eases toward it; noise flow follows the spin. Scroll down and it turns one way; scroll up and it swings round the other way and keeps drifting that way.",
  interaction: "Scroll through the section to turn the glass; reverse the scroll and it reverses. Links work as normal; the glass never takes the pointer.",
  animation: "Continuous slow drift plus scroll-driven spin, eased; rendering pauses off-screen and in hidden tabs. Reduced motion or motion={false} renders one still frame.",
  a11y: "All text is real (an h1 with the label and name, a nav, a paragraph and link); the canvas is aria-hidden. Without WebGL a frosted CSS lens stands in.",
  responsive: "Type and spacing scale with the stage; below 44rem the outer guides hide, the name steps down and the about block moves to the bottom.",
  touchFallback: "Touch scrolling drives the spin the same way.",
  variants: [
    { id: "light", label: "Light" },
    { id: "dark", label: "Dark" },
  ],
  preview: { bg: "#ffffff", mode: "scroll", frame: [1440, 780], height: 760 },
  isNew: true,
};
