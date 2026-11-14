import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "prism-glass-button",
  name: "Prism Glass Button",
  category: "buttons",
  description: "A button cut from a slab of clear glass. Its thick edge works as a lens: at two opposite corners it shows ink split into colours, red against the edge, a dark core, blue within. Animated, the two fringes travel round the rim at a steady pace.",
  tags: ["button", "glass", "liquid glass", "refraction", "chromatic", "prism", "dispersion", "webgl"],
  traits: ["webgl", "ambient", "click", "keyboard", "touch"],
  source: "original",
  isNew: true,
  files: ["PrismGlassButton.tsx", "prism.ts", "prism-glass-button.css"],
  dependencies: [],
  promptAllow: ["none"],
  prompt: `Build a button that looks cut from a slab of clear glass with a thick, polished edge, in light and dark versions. The face is clear; all the colour is at the edge.

Layout. A native button with a transparent background. Pill: height = size (64px by default), horizontal padding 62% of the size, corner radius 42% of it. Tile: a square of the size with a 27% radius, for a single icon. The label is ordinary text above the glass, 17px semibold, near-black on light glass and near-white on dark. Rim width 6.2% of the short side; lens depth 30% of it (24% on a tile); canvas margin 34%. One lap of the fringes takes 6 seconds by default.

The glass. Draw it with one WebGL fragment shader on a canvas that is larger than the element by a margin, so the shadow and outer shell can sit outside the edge; output premultiplied alpha and leave the face fully transparent, so the slab works on any ground. Use a rounded-box signed distance d (negative inside). Rim: a flat band of the stated width just inside the edge, tinted white at 10% on light glass and 3% on dark, bounded by two fine lines (the outer edge and an inner bevel) that are brighter on the side facing a light from the top left. Light glass adds a soft shadow below it (black, 13%, falling off over a fifth of the lens depth). Dark glass adds instead a second, fainter outline outside the first, visible only on the left and right flanks.

The fringes. Keep a unit "lean" direction, at rest pointing to the top right, so the lens favours the top-right and bottom-left corners. For each pixel take its position within the corner region (0 at the middle of an edge, 1 at the corner, per axis, signed), normalise it, and let w = smoothstep(0.76, 1, |dot(that, lean)|): 1 where the edge faces along the lean, falling to 0 away from it. The fringe is as thick as w^1.7 × the lens depth, varied by ±14% with a slow sine along the edge so it never reads as a ruled band. Across that thickness, s runs 0 at the outer edge to 1 at the inner side: colour is a four-stop gradient read from the outer stop at s = 0 to the inner stop at s = 1; a solid core of ink (near-black on light glass, near-white on dark) covers s 0.16–0.68 with soft ends, and only where the fringe is thick, so the thin tails are colour alone; opacity fades from s = 0.5 to 1. The result is one colour hugging the outer edge, a solid core, and a second colour bleeding softly into the face, tapering to a point along each edge.

Motion. The only animation is the fringes travelling round the rim: rotate the lean direction at a constant rate, one full turn per lap, advancing by elapsed time (capped at 50ms a frame) so the pace is the same at any frame rate. Because the lens favours both ends of the lean, there are always two fringes, opposite each other, and they slide along the edges and round the corners together. Nothing follows the pointer and nothing eases or pulses. With motion set to "still", or under reduced motion, draw one frame with the fringes at the top-right and bottom-left corners and never animate.

States. Pressed: the whole button scales to 0.96 for the length of the press; the glass itself does not react. Focus-visible: a 2px outline in the label colour, 6px out. Disabled: 45% opacity.

Edge lines. With lines set to "none" the slab is drawn exactly the same except that the edge lines are left out: no rim band, no outer edge line, no inner bevel, no highlight lines along the edge and, on dark glass, no outer shell line. The fringes, their colours and motion and the light glass's shadow are unchanged. Dark glass without lines would vanish on black, so it gets a faint lift instead: white at 7.5% over the whole face, and its soft outer glow widens (falloff 0.22 of the lens depth instead of 0.1) and strengthens (26% instead of 10%).

Production behaviour: pause the loop off screen and in hidden tabs, and resume from where the fringes were. Without WebGL fall back to plain inset rings with the same proportions. In forced-colours mode hide the canvas and give the button a border.`,
  interaction: "Nothing follows the pointer; a press scales the button slightly.",
  animation: "Two fringes travel round the rim at a constant pace, one lap in six seconds.",
  a11y: "A native button with real text; the glass is a decorative canvas. Focus shows a 2px outline. Reduced motion draws one still frame.",
  responsive: "Sized by one number; every proportion of the glass follows the button's box.",
  touchFallback: "Nothing depends on hover.",
  variants: [
    { id: "spectrum-still", label: "Spectrum · still", prompt: "Fringe colours are the reference colours: cyan #3fd8ff innermost, deep blue #1a34ff, magenta #ff2aa0, and red #ff4530 against the outer edge. This version does not move at all: the fringes rest at the top-right and bottom-left corners. Select it with palette \"spectrum\" and motion \"still\"." },
    { id: "spectrum", label: "Spectrum · animated", prompt: "Fringe colours are the reference colours: cyan #3fd8ff innermost, deep blue #1a34ff, magenta #ff2aa0, and red #ff4530 against the outer edge. This version moves: the two fringes travel round the rim at a steady pace, one lap every 6 seconds, and nothing else animates. Select it with palette \"spectrum\" and motion \"full\"." },
    { id: "aurora-still", label: "Aurora · still", prompt: "Fringe colours are mint #7dffc8 innermost, teal #00b8a4, violet #7a52ff, and pink #ff86dc against the outer edge. This version does not move at all: the fringes rest at the top-right and bottom-left corners. Select it with palette \"aurora\" and motion \"still\"." },
    { id: "aurora", label: "Aurora · animated", prompt: "Fringe colours are mint #7dffc8 innermost, teal #00b8a4, violet #7a52ff, and pink #ff86dc against the outer edge. This version moves: the two fringes travel round the rim at a steady pace, one lap every 6 seconds, and nothing else animates. Select it with palette \"aurora\" and motion \"full\"." },
    { id: "solar-still", label: "Solar · still", prompt: "Fringe colours are yellow #ffe45a innermost, orange #ff8a1f, crimson #e3245f, and plum #7a2bd0 against the outer edge. This version does not move at all: the fringes rest at the top-right and bottom-left corners. Select it with palette \"solar\" and motion \"still\"." },
    { id: "solar", label: "Solar · animated", prompt: "Fringe colours are yellow #ffe45a innermost, orange #ff8a1f, crimson #e3245f, and plum #7a2bd0 against the outer edge. This version moves: the two fringes travel round the rim at a steady pace, one lap every 6 seconds, and nothing else animates. Select it with palette \"solar\" and motion \"full\"." },
    { id: "bare-still", label: "No lines · still", prompt: "Fringe colours are the reference colours: cyan #3fd8ff innermost, deep blue #1a34ff, magenta #ff2aa0, and red #ff4530 against the outer edge. This version does not move at all: the fringes rest at the top-right and bottom-left corners. The edge lines are left out (no rim band, outer edge line, inner bevel or outer shell line); the fringes, colours and shadow are exactly as in the version with lines; on dark glass the face is lifted with white at 7.5% and the outer glow strengthened so the shape still reads on black. Select it with motion \"still\" and lines \"none\"." },
    { id: "bare", label: "No lines · animated", prompt: "Fringe colours are the reference colours: cyan #3fd8ff innermost, deep blue #1a34ff, magenta #ff2aa0, and red #ff4530 against the outer edge. The two fringes travel round the rim at a steady pace, one lap every 6 seconds. The edge lines are left out (no rim band, outer edge line, inner bevel or outer shell line); the fringes, colours and shadow are exactly as in the version with lines; on dark glass the face is lifted with white at 7.5% and the outer glow strengthened so the shape still reads on black. Select it with motion \"full\" and lines \"none\"." },
  ],
  preview: { bg: "#ececec", mode: "fill", height: 520 },
};
