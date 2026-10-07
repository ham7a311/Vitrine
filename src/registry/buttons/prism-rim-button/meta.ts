import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "prism-rim-button",
  name: "Prism Rim Button",
  category: "buttons",
  description: "A dark pill held in a hairline of graded colour; on hover the colour flows round the rim and a faint glow spills from each end.",
  tags: ["button", "gradient", "border", "rim", "dark", "spectrum", "cta", "pill"],
  traits: ["hover"],
  source: "original",
  files: ["PrismRimButton.tsx", "rim.ts", "prism-rim-button.css"],
  dependencies: [],
  prompt: `Build a dark call-to-action pill with a gradient hairline border (React + CSS, no libraries).

Geometry in em: min-width 16.2em, height 4em, padding 0 2em, a 0.1em transparent border, fully rounded, default font-size 20px. Label "Get Started" in Poppins 500 (fallback Inter) at 1.08em in #f5f4f7, then a filled white paper-plane icon (1.15em) 0.75em after it.

Layers on one element with background-clip boxes: (1) a soft radial sheen (60% × 120% at 52% 50%) in a warm or cool tint over (2) a dark horizontal gradient interior (edge colour → slightly lighter middle → edge colour), both on padding-box, over (3) the rim gradient on border-box. The rim is a 90° linear-gradient of evenly spaced stops, mirrored back on itself and sized 200% wide so it can scroll without a seam.

Hover: the rim gradient flows (background-position to −200% over 3.2s, linear, infinite) and a glow spills off each end (box-shadows −0.6em/+0.6em, 1.8em blur, −0.7em spread, in the first and last rim colours); the plane hops 0.14em up-right with overshoot. Press scales to 0.98. Focus-visible thickens the border to 0.14em and adds a soft white ring. Reduced motion keeps the rim still. Props: rim {stops[], inside[a, b], sheen}, size, icon (or false), plus native button props.`,
  interaction: "Hover sets the rim's colour flowing and brightens the glow at each end; press scales down slightly. Works as a native button.",
  animation: "Rim flow 3.2s linear loop on hover; end glows ease over 0.5s; the plane hops with a 0.45s overshoot.",
  a11y: "A native button with its visible label as the name; the icon is aria-hidden. White text on a near-black interior is above 15:1. Focus-visible thickens the rim and adds a ring. Reduced motion stops the flow.",
  responsive: "Sized in em from one font-size; at 20px it is 324px wide and fits a 360px phone.",
  touchFallback: "No hover on touch; the rim stays as a still spectrum and press feedback still shows.",
  isNew: true,
  variants: [
    { id: "spectrum", label: "Spectrum", prompt: "Rim stops #5fe0d4, #a6e7a2, #ebe36c, #e98f7a, #d85ad6, #ee6f8e (aqua through yellow and coral to magenta and rose); interior #161112 to #1f1819 with a #3a2626 sheen, a warm brown-black." },
    { id: "twilight", label: "Twilight", prompt: "Rim stops #dcd5f7, #bcaef2, #8c97f1, #4d8af4, #2f86ff (pale lilac to bright blue); interior #121216 to #18171d with a #2b2833 sheen, a cool graphite." },
  ],
  preview: { bg: "#000000", mode: "center", height: 260 },
};
