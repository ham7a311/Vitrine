import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "tidefill-button",
  name: "Tidefill",
  category: "buttons",
  description: "A pill that fills like a tide: liquid rises from the bottom with a rolling wave, revealing the ink-coloured label exactly where it reaches.",
  tags: ["button", "hover", "liquid", "fill", "svg", "text-reveal"],
  traits: ["hover", "keyboard", "touch"],
  source: "original",
  files: ["TidefillButton.tsx", "tidefill-button.css"],
  dependencies: [],
  prompt: `Design a pill button (56px, overflow hidden, hairline cream border, near-black plum face, cream label) that fills with liquid on hover. The label is rendered twice: once in cream on the dark face, and once in dark ink inside a liquid layer.

The liquid layer is the same size as the button, translated 101% down. On hover or focus it rises to 0 over 700ms (cubic-bezier(0.16,1,0.3,1)). The ink label sits inside the liquid but is counter-translated by −101% (and animates to 0 with the same timing), so it stays perfectly still in the button while the liquid — which clips it — sweeps over it; the result is that the letters change from cream to ink exactly along the liquid's surface. The liquid's top edge is an SVG wave path twice the button width, sliding left on a 2.6s linear loop so its surface rolls like water. Offer frost, lilac and cream fills. On touch, the liquid rests at ~28% full and floods on press. Reduced motion stops the wave and shortens transitions.`,
  interaction: "Hover/focus floods the button from the bottom; leaving drains it. Press scales to 98.5%.",
  animation: "Fill 700ms ease-out-expo; wave loop 2.6s linear; border 300ms.",
  a11y: "A real <button> whose accessible name is the label text; the duplicated ink label is aria-hidden. Visible focus ring in the fill colour.",
  responsive: "Intrinsic width; 11rem minimum.",
  touchFallback: "Liquid rests partly filled and floods on press.",
  preview: { bg: "#0b080d", mode: "fill" },
};
