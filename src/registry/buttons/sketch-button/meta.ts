import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "sketch-button",
  name: "Sketch Button",
  category: "buttons",
  description: "A hand-drawn button: two loose pencil outlines that boil like hand animation while you point at it, with a quick highlighter hatch drawing in behind the label.",
  tags: ["button", "border", "sketch", "hand-drawn", "svg", "playful", "notebook"],
  traits: ["hover", "keyboard"],
  source: "original",
  files: ["SketchButton.tsx", "sketch-button.css"],
  dependencies: [],
  prompt:
    "Build a button drawn by hand, for a sketchbook or prototype tone. From the measured size, generate a loose rounded rectangle: points every 18px along the long sides and 12px along the short ones, each jittered by a seeded random amount, joined with quadratic curves through their midpoints, starting a little before the first point and overshooting past it at the end, as a pen does. Draw two such outlines with different seeds (1.5px and a fainter 1px), so the lines never quite agree.\n\nWhile hovered or focused, regenerate both outlines with new seeds 8 times a second \u2014 the 'boil' of hand-drawn animation \u2014 and draw in a zigzag hatch behind the label (pathLength 1, dashoffset 1 \u2192 0, 420ms). Leaving stops the boil on the resting drawing and rubs the hatch out. The label is Instrument Serif italic; press tilts it a degree.",
  interaction: "Hover or focus to make the outline boil and hatch the fill in; press to act.",
  animation: "Outline redrawn at 8fps while hovered; hatch draws in over 420ms.",
  a11y: "A real button with a text label and a dashed focus outline; the drawing is decorative. Reduced motion keeps the outline still (the hatch appears without drawing).",
  responsive: "The drawing is generated from the measured size.",
  variants: [
    { id: "paper", label: "Notebook", prompt: "theme=\"paper\" (notebook): dark pen ink #24211c on paper with a yellow highlighter hatch #f2c94c; label \"Try the beta\"." },
    { id: "night", label: "Chalkboard", prompt: "theme=\"night\" (chalkboard): chalk-white lines #f1ede4 on green board with a blue chalk hatch #6fa8dc." },
  ],
  preview: { bg: "#fbf8f0", mode: "fill" },
};
