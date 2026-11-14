import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "edge-lit-button",
  name: "Edge-Lit Button",
  category: "buttons",
  description: "A slab of dark acrylic with an engraved label, lit like an engraved sign: light enters through the edge nearest the pointer and the letters brighten as it reaches them. Keyboard focus lights the whole edge.",
  tags: ["button", "acrylic", "engraved", "edge light", "glow", "dark", "css"],
  traits: ["hover", "cursor", "click", "keyboard", "touch"],
  source: "original",
  isNew: true,
  files: ["EdgeLitButton.tsx", "edge-lit-button.css"],
  dependencies: [],
  prompt: `Build a button that looks like a slab of dark acrylic with an engraved label, lit the way engraved acrylic signs are: light enters through the edge, and only the edge and the engraving catch it. CSS does all the drawing; a few lines of script only report where the pointer is.

Slab. A native button, 48px tall with 26px side padding and a 12px radius (large: 60px, 36px, 15px). Fill #14161a with a faint lighter band across the top half. A short hard shadow beneath and a soft wide one. The label span fills the whole button and carries the padding, so the label and the edge share one coordinate space.

Pointer. On pointer move and pointer down, write the pointer's position inside the button to two custom properties (x, y, in pixels). A third registered number property, "on", is 0 at rest, 1 on hover and 1.5 while pressed, and transitions over 260ms.

Edge. A 1.5px rim drawn with the mask-exclude technique (a padded box whose content area is masked out). Its background is two layers: a faint white gradient all the way round (13% to 5%), and over it a radial gradient 90px in radius centred on the pointer, in the light colour at opacity "on" × 100% (capped at 100%), fading to nothing. So the stretch of edge nearest the pointer is bright and the rest stays dim.

Engraving. The label text is transparent and shows its background through background-clip: text: a flat grey (#8b9099), and over it a radial gradient 120px in radius centred on the pointer in the light colour at opacity "on". Letters near the pointer are fully lit; letters farther away fall back to grey. Three drop-shadows finish it: a 1px white highlight at 7% below and a 1px black shadow at 70% above (so it reads as cut in, not printed), and a soft glow in the light colour whose blur is "on" × 5px.

Inside the slab, one more radial gradient at the pointer in the light colour at "on" × 9%, fading by 70% of 120px: a trace of light carrying into the material, never a blob.

States. Rest: dim rim, grey letters, nothing moving. Hover: light at the pointer. Pressed: "on" rises to 1.5 and the button moves down 1px. Focus-visible: no outline; instead the whole rim and every letter take the light colour. Disabled: 55% opacity and the light stays off.

Production behaviour: reduced motion removes the transitions; forced-colours mode drops the effects and shows plain button text with a border.`,
  interaction: "Move across the button: the edge nearest the pointer lights and the letters brighten as the light reaches them. Press to push more light in. Tab lights the whole edge.",
  animation: "The light fades in and out over 260ms and follows the pointer directly.",
  a11y: "A native button with real text. Focus is shown by lighting the entire edge and label, a stronger change than hover. Forced-colours mode falls back to a plain bordered button.",
  responsive: "Two sizes; the light's reach is fixed in pixels so it reads the same on a short or a long label.",
  touchFallback: "A touch puts the light where the finger lands for as long as it is held.",
  variants: [
    { id: "ice", label: "Ice", prompt: "The light is a cold cyan, #7fe7ff. Select it with the light option set to \"ice\"." },
    { id: "amber", label: "Amber", prompt: "The light is a warm amber, #ffb85c, like a sodium lamp. Select it with the light option set to \"amber\"." },
    { id: "rose", label: "Rose", prompt: "The light is a rose pink, #ff7fa8. Select it with the light option set to \"rose\"." },
  ],
  preview: { bg: "#0a0b0d", mode: "center", height: 420 },
};
