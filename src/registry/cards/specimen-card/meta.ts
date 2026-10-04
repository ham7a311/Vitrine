import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "specimen-card",
  name: "Specimen Card",
  category: "cards",
  description: "An object mounted under glass: hover lifts the pane with a sweep of reflection and swings out a paper catalogue tag.",
  tags: ["card", "product", "glass", "3d", "hover", "museum"],
  traits: ["hover", "cursor", "keyboard"],
  source: "original",
  files: ["SpecimenCard.tsx", "specimen-card.css"],
  dependencies: [],
  prompt: `Design a product/feature card that presents its subject like a specimen in a museum case. The card is a velvet mount — deep plum with a soft pool of light behind the object and a darker hem — pinned at its top corners with two tiny brass pins. The object (an illustration or product shot) sits in the centre with a real drop shadow; below it, a caption separated by a hairline: a brass mono catalogue number, a serif title and a muted one-line description.

Over the whole mount lies a pane of glass: a barely-there diagonal gradient, a crisp 1px inner edge and a brighter top edge. The card tilts gently toward the pointer (±6–7°, 600ms ease-out-expo), with the object parallaxing the opposite way, so you feel the depth between object and glass.

On hover or keyboard focus: the glass lifts off the mount (translateZ 28px, drifting with the pointer) and casts a soft shadow onto it, a single band of reflection sweeps across the pane over 1.1s, and a paper catalogue tag — a pennant with a punched hole, tied to a thin thread from the top-right pin — swings out from behind the case on a springy overshoot (cubic-bezier(0.34,1.56,0.64,1)) and settles at 5°, revealing mono details (catalogued date, origin, condition). On touch devices the tag rests half out so the details are discoverable. Reduced motion removes tilt, lift and sweep but keeps the tag.`,
  interaction: "Pointer tilts the case and parallaxes the object; hover/focus lifts the glass, sweeps a reflection and swings out the tag.",
  animation: "Tilt/lift 600ms ease-out-expo; reflection sweep 1100ms; tag swing 700ms spring overshoot.",
  a11y: "The whole card is one link with a real <h3>; tag details are a <dl> in the DOM (always read by screen readers). Focus-visible mirrors hover plus a frost ring. Decorative object is aria-hidden — describe it in the subtitle.",
  responsive: "Fluid up to 21rem wide; the object keeps its aspect ratio.",
  touchFallback: "Tag rests partly out; no tilt without a mouse.",
  preview: { bg: "#0b080d", mode: "fill", height: 620 },
  featured: true,
};
