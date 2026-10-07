import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "nebula-pill-button",
  name: "Nebula Pill Button",
  category: "buttons",
  description: "A dark pill with a nebula inside: soft clouds of colour under a little grain and a fine rim, turning slowly at rest and quickening and brightening on hover.",
  tags: ["button", "nebula", "aurora", "blur", "dark", "gradient", "cta", "pill", "grain"],
  traits: ["ambient", "hover"],
  source: "original",
  files: ["NebulaPillButton.tsx", "nebula.ts", "nebula-pill-button.css"],
  dependencies: [],
  prompt: `Build a dark call-to-action pill filled with soft clouds of colour (React + CSS, no libraries).

Geometry in em: min-width 16.2em, height 4em, padding 0 2em, fully rounded, default font-size 20px. The rim is a 0.09em transparent border showing a 90° gradient (border-box) around a solid base colour (padding-box). Label "Get Started" in Poppins 500 (fallback Inter) at 1.08em in near-white with a faint dark text-shadow, then a filled white paper-plane icon 0.75em after it.

Inside, a clipped paint layer holds a clouds layer (inset −12%, blur 0.85em, saturate 1.15) of six to nine elliptical blobs, each radial-gradient(closest-side, colour, colour 30%, transparent) placed by centre and size in percent of the pill; tall blobs (up to 190% of the height) read as soft vertical bands, small pale ones as highlights, dark ones as shadowed pockets. Over the clouds, an SVG fractal-noise grain at 10% in overlay blend.

Motion: blobs swirl on 12–19s alternate loops (translate ±5%, rotate ±8°, scale 0.95–1.08), some in reverse; hover shortens every loop to 5s and lifts saturation and brightness; the plane hops 0.14em up-right; press scales to 0.98. Focus-visible draws a near-white outline. Reduced motion stops the swirl. Props: palette {base, rim[], blobs[]}, size, icon (or false), plus native button props.`,
  interaction: "Hover quickens the clouds and brightens them, and lifts the paper plane; press scales the pill down slightly. Works as a native button.",
  animation: "Clouds swirl on 12–19s alternate loops at rest and 5s on hover; colour lift eases over 0.5s; the plane hops with a 0.45s overshoot.",
  a11y: "A native button with its visible label as the name; paint, grain and icon are aria-hidden. The label carries a soft shadow so it stays readable over the brightest clouds. Visible focus outline. Reduced motion stops the swirl.",
  responsive: "Sized in em from one font-size; at 20px it is 324px wide and fits a 360px phone.",
  touchFallback: "No hover on touch; the clouds keep turning slowly and press feedback still shows.",
  isNew: true,
  variants: [
    { id: "nebula", label: "Nebula", prompt: "Base #1c1e52 and a near-white rim (#efeaf8 to #f4f0fb). Clouds: teal #4fd8d8 top-left, sky #5aa6ef beside it, a gold #e9d77a spark near 36% top, pale lilac low at 39%, blue #3f69ea upper-right of centre, violet #5d3ff0 low in the middle, a deep #151335 pocket bottom-right, a white #f3eefc highlight at the top near 79%, and a dark pocket bottom-left." },
    { id: "dusk", label: "Dusk", prompt: "Base #1b191b and a sage-to-lilac rim (#8e9f88, #9c92b0, #b7a7d6). Clouds: a moss band #3d573d at 30% with a lighter #62804f streak, a brick-rose band #9c4b4d at 62% and a deeper #73373d beside it, an amber #cf8e52 glow rising from under the bottom edge at 54%, and a dim plum #3a2934 at the right end." },
  ],
  preview: { bg: "#000000", mode: "center", height: 260 },
};
