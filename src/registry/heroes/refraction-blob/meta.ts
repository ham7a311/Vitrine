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
    "Build a portfolio hero (a fictional designer and engineer, Rami Nasser) in a section two viewports tall with a sticky full-height stage.\n\nPage: white, with 1px #ececec side rules inset 4.5% and three dashed #f1f1f1 column guides at the quarter points. A floating nav row 14–28px from the top, in three columns: a monogram ('RN') in a 46px ink square with 12px corners on the left; in the centre a pill (5px padding, page colour at 82% with a 10px backdrop blur, a #ececec hairline and a soft shadow) holding the links at about 16px in #5a5a5a, the current one ('Work') a filled ink chip with white text; on the right a 'Say hello' pill with a hairline that turns ink on hover and lifts 1px. The name sits across the middle in Inter at about 150px (weight 450, -0.035em) and a small grey label ('Design engineer') sits above it at 37% height. Bottom left, 8% up: a status line with a green dot in a soft green halo ('Available for work', ink, 500 weight) over a one-line tagline in #5a5a5a.\n\nGlass: one WebGL canvas over the stage, clear except where the drop is. Raymarch (56 steps, orthographic) a sphere whose surface is pushed in and out by two octaves of 3D value noise (amplitudes 0.12 and 0.04), rotated by a matrix that turns with the scroll. Where the ray hits, take the normal and read a 2D-canvas copy of the page's text (painted from the real elements' rects and computed fonts, so it lines up) through it: magnified a touch toward the centre (×0.93 sampling), bent gently by the normal and more at the rim, and split very slightly into colour, so the name stays readable through it. Cloud it with a little milky white, deepen it at the rim, darken a thin ring where the glass turns away, and add a tight highlight from the upper left. Anti-alias the outline from the nearest distance the ray passed. Radius about 27% of the height (about a quarter of the width on phones, so the name always runs out past both sides), drifting slightly right and growing 8% through the section.\n\nScroll: progress through the section gives a velocity; the spin target is a slow drift (0.35 rad/s) in the last direction scrolled plus the velocity × 9, capped at 6 rad/s, and the actual spin eases toward it; noise flow follows the spin. Scroll down and it turns one way; scroll up and it swings round the other way and keeps drifting that way.",
  interaction: "Scroll through the section to turn the glass; reverse the scroll and it reverses. Links work as normal; the glass never takes the pointer.",
  animation: "Continuous slow drift plus scroll-driven spin, eased; rendering pauses off-screen and in hidden tabs. Reduced motion or motion={false} renders one still frame.",
  a11y: "All text is real (an h1 with the label and name, a labelled nav with aria-current on the current link, a contact link and a paragraph); the canvas is aria-hidden. Without WebGL a frosted CSS lens stands in.",
  responsive: "Type and spacing scale with the stage; below 44rem the outer guides hide, the contact pill hides and the link pill moves right of the monogram, the name steps down and the caption spans the bottom.",
  touchFallback: "Touch scrolling drives the spin the same way.",
  variants: [
    { id: "light", label: "Light", prompt: "Palette for this theme (Light): --rblob-focus #1b1b1b; --rblob-guide #f1f1f1; --rblob-ink #1b1b1b; --rblob-label #8a8a8a; --rblob-line #ececec; --rblob-page #ffffff; --rblob-soft #5a5a5a. Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"light\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
    { id: "dark", label: "Dark", prompt: "Palette for this theme (Dark): --rblob-focus #ececec; --rblob-guide #18181a; --rblob-ink #ececec; --rblob-label #8c8c8c; --rblob-line #1f1f21; --rblob-page #0c0c0d; --rblob-soft #a3a3a3. Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"dark\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
  ],
  preview: { bg: "#ffffff", mode: "scroll", frame: [1440, 780], height: 760 },
  isNew: true,
};
