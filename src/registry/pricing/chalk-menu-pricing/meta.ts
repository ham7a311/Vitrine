import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "chalk-menu-pricing",
  name: "Chalk Menu Pricing",
  category: "pricing",
  description: "Plans written up like the board in a good café: names in a loose serif, what's in them underneath, prices at the end of a dotted line. Switch to yearly and a hand strikes through each monthly price in chalk and writes the new one beside it, a little dust falling from the stick.",
  tags: ["pricing", "menu", "chalkboard", "editorial", "handwritten", "playful", "plans"],
  traits: ["click", "keyboard"],
  source: "original",
  files: ["ChalkMenuPricing.tsx", "chalk-menu-pricing.css"],
  dependencies: [],
  prompt: `Build a pricing section designed as a café menu board.

Board: a 14px frame (a border-box background) around the writing surface (padding-box), with an feTurbulence grain tile and an inner shadow.

Chalk: an inline SVG filter — fractal noise displacing the source, then intersected with a second, finer noise turned into a mask — applied through a CSS variable to every piece of writing, so edges look grainy and slightly broken.

Content: a big italic serif title, a spaced small-caps subtitle, and a Monthly / Yearly radiogroup; the chosen word gets a hand-drawn loop (an SVG path drawn with stroke-dashoffset over 520ms, redrawn on every switch). Each plan is a row — serif name, a dotted leader (3px dotted border) and the price — then an italic one-line blurb, the inclusions joined with middots, and an "Order …" text button with a chalk underline. The favourite plan has a margin note ("most teams order this") with a hand-drawn arrow.

Yearly: for each price in turn (260ms apart), a wobbly strike path (unique per row) is drawn through the monthly price in the strike colour (340ms), the old price fades to the soft ink, and the yearly price is written in beside it — clip-path inset revealing left to right over 560ms — while six dust specks fall and fade beneath it. Switching back fades the strike away. Screen readers hear "Was OMR 15 a month; now OMR 12 a month, billed yearly", and each Order button includes the current price. Under 600px the toggle moves under the title and the note sits under its plan. Reduced motion shows everything at once.`,
  interaction: "Switch between Monthly and Yearly to watch each price struck through and rewritten in chalk.",
  animation: "Loop 520ms; strike 340ms and write 560ms per row, 260ms apart; dust 900ms; old price fades 400ms.",
  a11y: "Billing is a radiogroup; prices are real text, with hidden text giving the old and new price in words when yearly; each Order button includes the plan and price; the chalk filter, strikes, dust and note are decorative. Reduced motion skips the writing.",
  responsive: "The board scales its type with the viewport; under 600px the header stacks and the margin note moves inline.",
  touchFallback: "Identical on touch.",
  promptAllow: ["chalk"],
  variants: [
    { id: "chalk", label: "Chalkboard", prompt: "theme=\"chalk\": a wood-grain frame around a dark slate with soft smudges (two faint radial gradients), chalk-white writing displaced 2.2px, on #2b2520." },
    { id: "whiteboard", label: "Whiteboard", prompt: "theme=\"whiteboard\": a brushed-aluminium frame, a glossy white surface with a diagonal sheen, marker-blue ink with a red strike and green new prices, a gentler 0.8px displacement, on #e9e6df." },
  ],
  preview: { bg: "#2b2520", mode: "fill" },
};
