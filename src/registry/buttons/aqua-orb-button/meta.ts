import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "aqua-orb-button",
  name: "Aqua Orb Button",
  category: "buttons",
  description: "A round, glossy icon button like a drop of tinted glass set in a white ring: pale at the rim, deeper toward the middle, with a fine line of colour along its lower edge. It deepens on hover, its icon lifts, and a press pushes it in.",
  tags: ["button", "icon button", "round", "glossy", "aqua", "gel", "send", "skeuomorphic", "css"],
  traits: ["hover", "click", "keyboard", "touch"],
  source: "original",
  isNew: true,
  files: ["AquaOrbButton.tsx", "aqua-orb-button.css"],
  dependencies: [],
  prompt: `Build a round, glossy icon button that looks like a drop of tinted glass set in a white ring, for a light interface. Pure CSS; no images.

Structure. A native button, a perfect circle 40px across by default, the size of a send button (28px small, 56px large; one size number scales everything, including hairlines and shadows), holding two layers: the glass face and the icon. It needs an aria-label, since it shows only an icon; the default icon is an upward arrow.

The ring. The button's own background is the ring: a 150-degree linear gradient from pure white at 18% through #f4faff at 50% to a pale tint of the glass colour at the lower right. Round it sits a hairline 1.2% of the size (at least half a pixel) in grey-blue at 55% (rgb 120 146 168), a second one offset 1.2% down and slightly darker so the lower edge reads as the underside, and a short soft shadow (0, 6%, blur 12%, spread −5% of the size, blue-grey at 32%).

The glass. A circle inset 5.5% from the ring. Its fill is a radial gradient centred at 50% 60%: the core colour at the centre, the mid colour at 40%, the pale colour at 82%, white at the very edge. Over it, a soft white highlight across the top: an ellipse 120% wide and 60% tall centred just above the top edge, white at 75% fading out by 62%. Along the inside of its lower edge, a fine line in the line colour (inset shadow 0, −2.5%, blur 3% of the size), plus a 0.5px inner outline in the same colour at 45%.

The icon. White, 40% of the button's width, drawn with 2.4-unit round-capped strokes on a 24-unit grid, with a small drop shadow (1.2% down) in a darker tone of the glass colour so it reads as sitting in the glass.

States. Hover: the glass saturates by 22% and darkens 3%, and the icon rises 7% of its height on a springy 220ms curve. Pressed: the whole button scales to 0.955 in 80ms, the glass darkens further with an inner shadow from the top, and the icon returns to rest. Focus-visible: a 2px outline in the line colour, 3px out. Disabled: mostly desaturated at 60% opacity, no hover response.

Production behaviour: reduced motion removes the transitions; forced-colours mode shows a plain bordered button with the icon in the system text colour.`,
  interaction: "Hover and the glass deepens while the icon lifts; press and the button pushes in. Tab reaches it; Enter or Space activates it.",
  animation: "Icon lift 220ms on a springy curve; colour changes 200ms; press 80ms.",
  a11y: "A native button that needs an aria-label, since it shows only an icon. Focus is a 2px outline. Reduced motion removes the transitions.",
  responsive: "One size number sets the diameter (40px by default); every proportion, hairline and shadow is relative to it. Give it a 44px hit area on touch screens.",
  touchFallback: "A press pushes it in; nothing depends on hover.",
  variants: [
    { id: "sky", label: "Sky", prompt: "Colours: core #55c0fa, mid #8ed8fd, pale #dbf2ff, lower-edge line #58b6ee: the reference blue. Select it with the tone option set to \"sky\"." },
    { id: "mint", label: "Mint", prompt: "Colours: core #3fd4a5, mid #88e8c9, pale #dffaf0, lower-edge line #37bb90. Select it with the tone option set to \"mint\"." },
    { id: "rose", label: "Rose", prompt: "Colours: core #ff7da3, mid #ffaec6, pale #ffe8ef, lower-edge line #ee6d95. Select it with the tone option set to \"rose\"." },
  ],
  preview: { bg: "#f3f3f3", mode: "center", height: 460 },
};
