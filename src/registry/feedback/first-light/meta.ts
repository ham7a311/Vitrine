import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "first-light",
  name: "First Light",
  category: "feedback",
  description: "An empty state that is the first object, not yet filled in: a dashed ghost sits exactly where the first project, message, tile or item will live. Its dashes close up as you point at it, and activating it creates the real thing in place.",
  tags: ["empty state", "onboarding", "zero state", "create", "drop zone", "dashboard"],
  traits: ["hover", "click", "keyboard", "touch"],
  source: "original",
  files: ["FirstLight.tsx", "first-light.css"],
  dependencies: [],
  prompt: `Build an empty-state primitive that replaces the illustration + heading + paragraph + button stack.

The empty surface draws a ghost of the first object at its real size, in the slot where it will appear, plus one or two fainter 'future' outlines for the slots after it. The ghost's outline is an SVG rect with stroke-dasharray 5 6. On hover or focus it takes 'first light': the dash gap transitions to 0 so the dashes close into a solid edge, the stroke warms toward the accent, and the transparent ghost fills to the surface colour with a soft shadow (420–520ms). Its call ('+ Your first project') darkens and the plus tile inverts.

Activating the ghost (it is a real button named 'Create your first project') swaps its face for an inline editor inside the same outline. Type the project name into the card and it becomes the real card, while a new, quieter ghost ('Another project') takes the next slot. Escape or Cancel returns focus to the ghost, and creation is announced.

One primitive, four presets:
- Projects: a card grid.
- Conversation: a ghost message bubble aligned where your first message will sit, which opens starters plus a field.
- Dashboard: a ghost tile with sketched bars, which opens a metric picker and turns into a real tile with a sparkline.
- Collection: a ghost that is also a drop zone. Drop a file or paste a link while it's focused, or click to type one.

It is monochrome apart from the single accent on the lit outline. Paper and Night themes.`,
  interaction: "Point at the ghost, then click it and create the first object where it will live. Switch presets at the top.",
  animation: "The dashes close and the surface fills over 420–520ms; the editor fades in over 260ms.",
  a11y: "The ghost is a labelled button that says what it creates. The editor's first field takes focus, Escape or Cancel returns focus to the ghost, and a status region announces creation. Future outlines are aria-hidden. Reduced motion makes first light an instant colour change.",
  responsive: "Grids collapse to one column and the future outlines hide on small screens, leaving just the first ghost.",
  touchFallback: "Tap the ghost to create; in Collection, a tap opens the link field.",
  variants: [
    { id: "paper", label: "Paper" },
    { id: "night", label: "Night" },
  ],
  preview: { bg: "#f4f2ed", mode: "fill" },
};
