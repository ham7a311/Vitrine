import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "lozenge-button",
  name: "Lozenge Button",
  category: "buttons",
  description: "A glossy button that is a pill on one end and a soft square on the other, made to sit in the corner of a panel with its round end facing in. Inside a pale ring, colour pools at the top and a white glow rises from the bottom.",
  tags: ["button", "glossy", "pill", "asymmetric", "gel", "primary", "corner", "css"],
  traits: ["hover", "click", "keyboard", "touch"],
  source: "original",
  isNew: true,
  files: ["LozengeButton.tsx", "lozenge-button.css"],
  dependencies: [],
  prompt: `Build a glossy primary button with an asymmetric shape: a full pill on one end, a softly squared corner on the other. It is meant to sit in the bottom corner of a dark panel, round end facing into the panel and square end tucked toward the corner. Pure CSS; no images.

Shape. A native button 40px tall by default (small 32px, large 48px), with side padding of half its height. Every measurement below follows the height, so the button keeps its proportions at any size. The round end has a radius of half the height on both its corners; the other end has a radius of 17% of the height on both corners. An option chooses which end is round (left by default).

Ring. The button's own background is a ring 5.5% of the height (at least 1.5px): a 100-degree linear gradient from pure white at the round end, through the ring colour at 38%, to a paler tint of the body colour at the square end. A soft shadow in the deep colour sits beneath (0, 14%, blur 30%, spread −18% of the height, at 70%).

Face. A pseudo-element inset by the ring width, with the same shape (its small radius reduced by the ring width). Three layers, top first: a white glow rising from the bottom, an ellipse 52% wide and 62% tall centred just below the bottom edge at 82% opacity; a pool of the deep colour at the top, an ellipse 46% wide and 78% tall centred just above the top edge; and a horizontal gradient that is the pale colour at both ends and the body colour from 30% to 70%. A hairline inner outline of white at 35% and a soft inner highlight along the top finish it.

Label. Medium weight at 36% of the height (about 14px at the default size) in the dark ink colour, with room for an icon beside it.

States. Hover: the bottom glow rises to full opacity over 260ms (animate a registered number property) and the face saturates 12%. Pressed: the button moves down 1px and scales to 0.985, the glow drops to 55%, and an inner shadow from the top appears. Focus-visible: a 2px outline in the ring colour, 3px out. Disabled: mostly desaturated at 60% opacity.

Production behaviour: reduced motion removes the transitions; forced-colours mode shows a plain bordered button.`,
  interaction: "Hover and the glow at the bottom brightens; press and the button dips. Tab reaches it.",
  animation: "The glow changes over 260ms; the press takes 150ms.",
  a11y: "A native button with real text in a dark ink on the bright face. Focus is a 2px outline. Reduced motion removes the transitions.",
  responsive: "Three sizes, 32, 40 and 48px tall; the radii, ring, label and shadows all follow the height.",
  touchFallback: "A press dips it; nothing depends on hover.",
  variants: [
    { id: "azure", label: "Azure", prompt: "Colours: deep #2a86ff, body #62a6f9, pale #b6d5fc, ring #dcebff, label #123b7a: the reference blue. Select it with the tone option set to \"azure\"." },
    { id: "violet", label: "Violet", prompt: "Colours: deep #7a4dff, body #9c80fb, pale #d6cbfd, ring #ebe5ff, label #2c1a6e. Select it with the tone option set to \"violet\"." },
    { id: "jade", label: "Jade", prompt: "Colours: deep #12b886, body #58d3ad, pale #bdeedd, ring #e0f8ef, label #0a4634. Select it with the tone option set to \"jade\"." },
  ],
  preview: { bg: "#020409", mode: "center", height: 460 },
};
