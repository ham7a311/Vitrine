import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "gradient-bloom-button",
  name: "Gradient Bloom Button",
  category: "buttons",
  description: "A hairline of slowly turning gradient at rest; cross the edge and that gradient blooms into the button from the exact point you came in, with the label inverting precisely along the circle.",
  tags: ["button", "gradient", "conic", "border", "direction-aware", "clip-path", "primary"],
  traits: ["hover", "cursor", "keyboard", "ambient", "touch"],
  source: "original",
  files: ["GradientBloomButton.tsx", "gradient-bloom-button.css"],
  dependencies: [],
  prompt:
    "Combine a turning gradient border with a direction-aware fill. Register --angle with @property and turn a conic gradient (frost, lilac, amber, mint on night; cobalt, violet, orange, green on paper) once every 7s. At rest the pill shows only a 1.5px band of it: a layer with the gradient as background, padding 1.5px, and a content-box mask composited with exclude.\n\nA full-size bloom layer holds the same gradient and a second copy of the label in ink, in an identical box. Clip it with clip-path: circle(0% at var(--ex) var(--ey)). On pointerenter, write the entry point as percentages to --ex/--ey and open to 140% (680ms expo-out); on pointerleave, move the point to the exit and close on an ease-in curve (520ms). The gradient keeps turning inside the bloom, and the label inverts exactly along the circle's edge. Focus blooms from the centre; touch blooms from the finger and fades after a moment.",
  interaction: "Enter from any side and the gradient blooms from that point; leave and it drains toward the exit.",
  animation: "Gradient turns every 7s; bloom 680ms expo-out, drain 520ms ease-in.",
  a11y: "A real button; the inverted label copy is aria-hidden. Focus shows the bloom and an outline. Reduced motion stops the turning and makes the bloom instant.",
  responsive: "Intrinsic width from its label, 10rem minimum.",
  touchFallback: "Blooms from your finger on press, then drains.",
  variants: [
    { id: "night", label: "Night" },
    { id: "paper", label: "Paper" },
  ],
  preview: { bg: "#0b0a0d", mode: "fill" },
};
