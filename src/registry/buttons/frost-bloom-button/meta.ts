import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "frost-bloom-button",
  name: "Frost Bloom Button",
  category: "buttons",
  description: "A frosted pill tinted from inside by soft blobs of colour, with a white glow rising from under its bottom edge; the colour drifts, leans toward the pointer, and the paper plane lifts off on hover.",
  tags: ["button", "frosted", "glass", "gradient", "blur", "aurora", "pastel", "cta", "pill"],
  traits: ["cursor", "hover", "ambient"],
  source: "original",
  files: ["FrostBloomButton.tsx", "bloom.ts", "frost-bloom-button.css"],
  dependencies: [],
  prompt: `Build a large call-to-action pill (React + CSS, no libraries) that looks like frosted glass lit from inside by soft colour.

Geometry in em so one font-size scales it: min-width 16.2em, height 4em, padding 0 2em, fully rounded, overflow hidden. Default font-size 20px (a 324×80 pill). Label "Get Started" in Poppins 500 (fallback Inter), near-black #12141c, followed 0.8em later by a filled paper-plane icon (1.05em, two triangles with a hairline fold between them, pointing up-right).

Surface: a pale base colour, a rim drawn as an inset 0.075em shadow in a near-white, and an inset top highlight. Inside, an absolutely positioned paint layer (inset −10%, blur 0.55em) holds five elliptical blobs, each a radial-gradient(closest-side, colour, colour 35%, transparent) placed by centre and size in percent of the pill: a strong blob on the left, a lighter wash next to it, a soft blob toward the right, the right-hand colour, and a white ellipse centred about 112% down so a white-hot glow rises from under the bottom edge. Blobs may be taller than the pill so colour fills it top to bottom like soft vertical bands.

Motion: each blob drifts on its own 11–15s alternate loop (translate up to 6%, scale to 1.08) and the under-glow breathes over 6s. On a fine pointer the paint layer leans up to ±6% toward the pointer (eased 0.8s); on hover the plane hops 0.14em up-right with a slight overshoot and the glow brightens; press scales to 0.98. Focus-visible draws a 0.1em ink outline offset 0.2em. Reduced motion stops the drift and the transitions. Props: palette {base, ink, rim, blobs[]}, size, icon (or false), plus native button props.`,
  interaction: "Hover leans the colour toward the pointer and lifts the paper plane; press scales the pill down slightly. Works as a native button.",
  animation: "Blobs drift on 11–15s alternate loops; the under-glow breathes over 6s; pointer lean eases over 0.8s; the plane hops with a 0.45s overshoot.",
  a11y: "A native button with its visible label as the name; the icon and paint layers are aria-hidden. Near-black text on a pale surface stays above 7:1. Visible focus outline. Reduced motion stops all drift.",
  responsive: "Sized in em from one font-size; at 20px it is 324px wide, which fits a 360px phone. Pass a smaller size for compact layouts.",
  touchFallback: "No pointer lean on touch; the colour keeps drifting on its own and the press feedback still shows.",
  isNew: true,
  variants: [
    { id: "azure", label: "Azure", prompt: "Base #e9ecf6. Blobs: #2f86ff at (12%, 58%) 40×160, #8fbcff wash at (36%, 40%) 46×140 at 75%, #dcd8f2 at (66%, 30%) 40×120 at 60%, #f7d4ba at (91%, 50%) 28×150, white glow at (54%, 112%) 34×76. Vivid blue on the left fading to warm apricot on the right." },
    { id: "mint", label: "Mint", prompt: "Base #e6e9f3. Blobs: #5eecd6 at (11%, 62%) 38×160, #aef3ae at (33%, 12%) 30×90, #d6cdee at (60%, 48%) 40×120, #e49ff0 at (93%, 55%) 26×150, white glow at (52%, 112%) 34×72. Aqua and spring green on the left into soft lilac-pink." },
    { id: "peach", label: "Peach", prompt: "Base #eceef3. Blobs: #f4cdbd at (9%, 48%) 28×140, #94e3f7 at (50%, 18%) 40×110, #bff3fb at (64%, 86%) 30×70, #3d8dff at (91%, 60%) 34×170, white glow at (50%, 112%) 30×64. Warm peach on the left into ice cyan and a strong blue on the right." },
    { id: "sky", label: "Sky", prompt: "Base #cfe1ff. Blobs: #2a7cff at both ends (8% and 94%, 56%) about 32×180, #e9f3ff haze at (50%, 14%) 52×90, #b6f3ff at (47%, 96%) 40×80, white glow at (53%, 114%) 30×64. Saturated blue edges around a pale, glowing middle." },
  ],
  preview: { bg: "#000000", mode: "center", height: 260 },
};
