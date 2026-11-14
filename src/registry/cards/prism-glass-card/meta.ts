import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "prism-glass-card",
  name: "Prism Glass Card",
  category: "cards",
  description: "A card cut from a slab of clear glass. The face stays clear for the content; the thick edge works as a lens, and at two opposite corners it shows ink split into colours. Animated, the two fringes travel round the rim at a steady pace.",
  tags: ["card", "glass", "liquid glass", "refraction", "chromatic", "prism", "dispersion", "webgl"],
  traits: ["webgl", "ambient"],
  source: "original",
  isNew: true,
  files: ["PrismGlassCard.tsx", "prism-glass-card.css", "../../buttons/prism-glass-button/prism.ts"],
  dependencies: [],
  promptAllow: ["none", "lines", "lines still"],
  prompt: `Build a content card that looks cut from a slab of clear glass with a thick, polished edge, in light and dark versions. The face is clear and holds ordinary content; all the colour is at the edge.

Layout. A card up to 340px wide with no background of its own. Corner radius 44px (never more than 16% of the short side), rim width 11px, lens depth 36px, canvas margin 48px. Content sits above the glass with 44px padding at the top and 40px elsewhere, so it keeps clear of the rim: an 11px mono eyebrow in capitals, a 28px semibold title with −0.03em tracking, a 15px muted paragraph, a short list of label–value rows divided by hairlines, and a 46px pill action filled with the text colour. One lap of the fringes takes 7 seconds by default.

The glass. Draw it with one WebGL fragment shader on a canvas that is larger than the element by a margin, so the shadow and outer shell can sit outside the edge; output premultiplied alpha and leave the face fully transparent, so the slab works on any ground. Use a rounded-box signed distance d (negative inside). Rim: a flat band of the stated width just inside the edge, tinted white at 10% on light glass and 3% on dark, bounded by two fine lines (the outer edge and an inner bevel) that are brighter on the side facing a light from the top left. Light glass adds a soft shadow below it (black, 13%, falling off over a fifth of the lens depth). Dark glass adds instead a second, fainter outline outside the first, visible only on the left and right flanks.

The fringes. Keep a unit "lean" direction, at rest pointing to the top right, so the lens favours the top-right and bottom-left corners. For each pixel take its position within the corner region (0 at the middle of an edge, 1 at the corner, per axis, signed), normalise it, and let w = smoothstep(0.76, 1, |dot(that, lean)|): 1 where the edge faces along the lean, falling to 0 away from it. The fringe is as thick as w^1.7 × the lens depth, varied by ±14% with a slow sine along the edge so it never reads as a ruled band. Across that thickness, s runs 0 at the outer edge to 1 at the inner side: colour is a four-stop gradient read from the outer stop at s = 0 to the inner stop at s = 1; a solid core of ink (near-black on light glass, near-white on dark) covers s 0.16–0.68 with soft ends, and only where the fringe is thick, so the thin tails are colour alone; opacity fades from s = 0.5 to 1. The result is one colour hugging the outer edge, a solid core, and a second colour bleeding softly into the face, tapering to a point along each edge.

Motion. The only animation is the fringes travelling round the rim: rotate the lean direction at a constant rate, one full turn per lap, advancing by elapsed time (capped at 50ms a frame) so the pace is the same at any frame rate. Because the lens favours both ends of the lean, there are always two fringes, opposite each other, and they slide along the edges and round the corners together. Nothing follows the pointer and nothing eases or pulses. With motion set to "still", or under reduced motion, draw one frame with the fringes at the top-right and bottom-left corners and never animate.

Edge lines. By default the card is drawn without its edge lines: no rim band, no outer edge line, no inner bevel, no highlight lines along the edge and, on dark glass, no outer shell line. The fringes, their colours and motion, the shadow and the soft glow are as described. With lines set to "full" all of those lines are drawn as described above.

Production behaviour: the content is a slot; nothing in the card depends on the glass, and the card does not react to the pointer. Pause the loop off screen and in hidden tabs, and resume from where the fringes were. Without WebGL fall back to plain inset rings. In forced-colours mode hide the canvas and give the card a border.`,
  interaction: "None: the card does not react to the pointer.",
  animation: "Two fringes travel round the rim at a constant pace, one lap in seven seconds.",
  a11y: "The glass is a decorative canvas behind ordinary content; text keeps full contrast because the face is clear. Reduced motion draws one still frame.",
  responsive: "Fluid up to 340px; padding tightens under 420px and the glass follows the card's box.",
  touchFallback: "Nothing depends on hover.",
  variants: [
    { id: "spectrum-still", label: "Spectrum · still", prompt: "Fringe colours are the reference colours: cyan #3fd8ff innermost, deep blue #1a34ff, magenta #ff2aa0, and red #ff4530 against the outer edge. This version does not move at all: the fringes rest at the top-right and bottom-left corners. Drawn without edge lines: no rim band, outer edge line or inner bevel. Select it with palette \"spectrum\" and motion \"still\"." },
    { id: "spectrum", label: "Spectrum · animated", prompt: "Fringe colours are the reference colours: cyan #3fd8ff innermost, deep blue #1a34ff, magenta #ff2aa0, and red #ff4530 against the outer edge. This version moves: the two fringes travel round the rim at a steady pace, one lap every 7 seconds, and nothing else animates. Drawn without edge lines: no rim band, outer edge line or inner bevel. Select it with palette \"spectrum\" and motion \"full\"." },
    { id: "aurora-still", label: "Aurora · still", prompt: "Fringe colours are mint #7dffc8 innermost, teal #00b8a4, violet #7a52ff, and pink #ff86dc against the outer edge. This version does not move at all: the fringes rest at the top-right and bottom-left corners. Drawn without edge lines: no rim band, outer edge line or inner bevel. Select it with palette \"aurora\" and motion \"still\"." },
    { id: "aurora", label: "Aurora · animated", prompt: "Fringe colours are mint #7dffc8 innermost, teal #00b8a4, violet #7a52ff, and pink #ff86dc against the outer edge. This version moves: the two fringes travel round the rim at a steady pace, one lap every 7 seconds, and nothing else animates. Drawn without edge lines: no rim band, outer edge line or inner bevel. Select it with palette \"aurora\" and motion \"full\"." },
    { id: "solar-still", label: "Solar · still", prompt: "Fringe colours are yellow #ffe45a innermost, orange #ff8a1f, crimson #e3245f, and plum #7a2bd0 against the outer edge. This version does not move at all: the fringes rest at the top-right and bottom-left corners. Drawn without edge lines: no rim band, outer edge line or inner bevel. Select it with palette \"solar\" and motion \"still\"." },
    { id: "solar", label: "Solar · animated", prompt: "Fringe colours are yellow #ffe45a innermost, orange #ff8a1f, crimson #e3245f, and plum #7a2bd0 against the outer edge. This version moves: the two fringes travel round the rim at a steady pace, one lap every 7 seconds, and nothing else animates. Drawn without edge lines: no rim band, outer edge line or inner bevel. Select it with palette \"solar\" and motion \"full\"." },
    { id: "lines-still", label: "Lines · still", prompt: "Fringe colours are the reference colours: cyan #3fd8ff innermost, deep blue #1a34ff, magenta #ff2aa0, and red #ff4530 against the outer edge. This version does not move at all: the fringes rest at the top-right and bottom-left corners. The edge lines are drawn: the rim band, the outer edge line with its highlight, the inner bevel and, on dark glass, the faint outer shell on the flanks. Select it with motion \"still\" and lines \"full\"." },
    { id: "lines", label: "Lines · animated", prompt: "Fringe colours are the reference colours: cyan #3fd8ff innermost, deep blue #1a34ff, magenta #ff2aa0, and red #ff4530 against the outer edge. The two fringes travel round the rim at a steady pace, one lap every 7 seconds. The edge lines are drawn: the rim band, the outer edge line with its highlight, the inner bevel and, on dark glass, the faint outer shell on the flanks. Select it with motion \"full\" and lines \"full\"." },
  ],
  preview: { bg: "#ececec", mode: "fill", height: 640 },
};
