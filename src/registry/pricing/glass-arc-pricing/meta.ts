import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "glass-arc-pricing",
  name: "Glass Arc Pricing",
  category: "pricing",
  description: "Three plans as dark glass cards on black, standing in front of an enormous word and a twisting ribbon of blue light: it rises behind the word, folds into a white streak behind the cards and falls away below them. The plan to choose has a glowing teal rim.",
  tags: ["pricing", "plans", "tiers", "glass", "glassmorphism", "dark", "blue", "toggle", "saas"],
  traits: ["click", "hover", "keyboard", "touch"],
  source: "original",
  isNew: true,
  files: ["GlassArcPricing.tsx", "glass-arc-pricing.css"],
  dependencies: [],
  prompt: `Build a three-plan pricing section on pure black: an enormous word, a twisting ribbon of blue light behind it, and three dark glass cards in front of both. React, CSS and one inline SVG; no images, no canvas.

Units. Lay everything out in u, one pixel of a 735px-wide design: u = min(1.74px, (container width − 32px) / 596), so the three cards and their gaps fill 596u. All numbers below are in u.

Stage: 596u wide, centred, 76u of padding above and 70u below.

The word. "Pricing" by default, as the section's heading: centred, 130u, weight 600, line-height 0.74, letter-spacing −0.03em. It is filled through background-clip: text with a left-to-right gradient that is lit where the light rises behind it: #0c1a33 to 14%, #0b2448 28%, #0d3a6a 40%, #17639a 52%, #3f93c6 62%, #92cde4 70%, #8cc7df 80%, #4c9fcd 90%, #2a7fbb at the end; over that, fine fractal noise at 50% in overlay, so the lit letters look sprayed. The cards cover its lower third.

The light. An SVG in the design's own 735 × 600 space, positioned so x = 77 is the stage's left edge and y = 0 its top, scaled by u. Blur filters must use userSpaceOnUse regions covering the whole drawing (a region relative to a thin, straight stroke clips its blur). Parts:
1. A dark royal glow: an ellipse at (478, 62), radii 112 × 110, from #0a3f9a to #05286f at 60% and gone at the edge, blurred 20.
2. The upper reach, three stacked filled shapes narrowing as they fall from around y 100 to y 305, centred near x 490: a wide one in #0e64b4 (blur 20), a narrower #3a9fd2 core (blur 11), and a bright #a8dcee spine about 10 wide (blur 6).
3. The fold: a warm white streak from (502, 309) curving down-left to (230, 418), drawn twice: 5 wide in #f1f0e4 (blur 3), and 24 wide in #d9dacf at 40% (blur 11).
4. The lower reach, falling to the bottom below the cards: a bright cyan edge (#92d0e3, 26 wide, blur 6) from (240, 410) curving down to (230, 600); a blue body to its right (#1a8fc6, 64 wide, blur 11); deep navy (#062a6a) further right; and a dim blue glow (#0d3f7a) to its left.
The whole group sways ±1.2 degrees and ±3 units over 18 seconds, alternating. Over the light, and under the cards, a separate grain layer (fractal noise in overlay at 55%) with no stacking context of its own, so it blends with the black and vanishes there but reads as spray on the light. Fade nothing; the section's overflow is hidden.

Cards. Three columns 188u wide, spread across the stage (16u gaps), pulled up 32u into the word. Each card: at least 272u tall, padding 19u 20u 19u, radius 22u, a 1px border of white at 25%, a fill of rgb(13 13 13 / 0.68) and backdrop-filter blur(9u), so the ribbon shows through softly. Contents, top to bottom: the plan name at 14u, weight 400, #ececec; the price at 25u, weight 400, #f2f2f2, written "$11,99/m" (a free plan reads "$0/m"); a description at 6.2u (at least 10px), line-height 1.38, #cdcdcd, max 152u wide and always two lines tall so the lists line up; 10.6u below, five features 23u apart, each a 13u disc in deep blue #14508a with a pale cyan (#a8dcee) tick, taking the light's colour and 6.4u text in #dcdcdc, 9u from the disc; then, 25.4u below the list and centred at the bottom, a white pill button 90u × 21u (at least 34px tall) with "Choose Plan" at 7.4u, weight 500, #111.

The plan to choose: a 1.2u border in #8fb4ba, a fill of rgb(10 14 16 / 0.6), an outer glow of 7u in rgb(122 188 200 / 0.55), and two inner glows (2u in rgb(205 236 241 / 0.7) and 9u in rgb(132 196 208 / 0.55)).

Billing. 20u below the cards, on the left: a switch 31.5u × 16u, white when on (grey #6b6b6b when off), with a 13.2u black knob ringed in white that sits at the right when on; then "Yearly" at 12.5u in #dadada, 7u away. It is a button with role switch, on by default. Turning it changes each paid plan between its yearly and monthly price per month, announced through a visually hidden status line.

States. Card hover: the border brightens to 42% white; the chosen plan's glows grow. Button hover: a 2.5u ring of white at 18%; press: scale 0.97. Focus-visible: a 2px #a8dcee outline, 3px out.

Production behaviour: plans are data (name, monthly and yearly price, description, features, featured, button label) and the price format is a prop; choosing reports the plan and the billing period. Under 700px of container width, one card fills the width (u = (width − 32px) / 188), the cards stack with 14u between them, the word is sized to fit, and the light is centred behind the top of the stack. Reduced motion stops the sway and the transitions; forced colours hides the light and outlines the cards.`,
  interaction: "Flip the Yearly switch to change every price; each card's button reports its plan and billing period. Hovering a card brightens its edge.",
  animation: "The ribbon of light sways a degree either way over 18 seconds. The switch knob slides in 240ms; hover changes take 220ms.",
  a11y: "The big word is the section's real heading. Each plan is a list item with its own heading and a native button named for its plan. Billing is a button with role switch and aria-checked, and the change is announced. White text on the dark glass stays above 4.5:1.",
  responsive: "Everything scales together in one unit up to its full size; under 700px of container width the cards stack and one card fills the width.",
  touchFallback: "Everything is a tap; hover only brightens edges.",
  preview: { bg: "#000000", mode: "page", height: 860 },
};
