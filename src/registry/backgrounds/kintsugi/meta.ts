import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "kintsugi",
  name: "Kintsugi",
  category: "backgrounds",
  description: "A glazed surface mended with gold. Fine seams run out from one point, the way a bowl breaks, and fill with gold from the centre outward; now and then light runs along them. Most of the surface stays flat, so content sits on it easily.",
  tags: ["background", "hero", "gold", "ceramic", "cracks", "kintsugi", "generative", "canvas", "dark"],
  traits: ["canvas", "ambient"],
  source: "original",
  isNew: true,
  files: ["Kintsugi.tsx", "kintsugi.css"],
  dependencies: [],
  prompt: `Build a background that looks like glazed ceramic repaired with gold: a few fine gold seams on a flat, dark surface.

The glaze (CSS only). The body colour, with two soft highlights over it: a radial gradient 120% × 90% at 22% 8% in a lighter sheen colour fading out by 62%, and a fainter one at 92% 96%. Over that, fine fractal-noise speckle at 7% in overlay.

The break. Seams start from one origin (default 70% across, 40% down). Send out 4 to 6 primary seams at roughly even angles with ±0.35 radians of scatter. A seam is a wandering line: each step is 16 to 38px long and turns by up to ±0.35 radians, then is pulled 22% of the way back toward the seam's original heading, so it wanders without ever curling back; it ends when it leaves the section. At each step there is a 6% chance of a fork, which leaves at 0.5 to 1.2 radians to either side, is 60% as wide, and may fork once more; forks have a growing chance of stopping short of the edge. Primary seams are 1.4 to 2.3px wide. Record for each seam how far along the break it begins, in pixels from the origin. Generate from a seeded random source so a given seed always breaks the same way.

Drawing (2D canvas, device pixel ratio up to 2, round caps and joins). Three passes over every seam: a glow in gold at 13% opacity and 7px wider; a body in dark gold 1.1px wider; the seam itself in gold.

Motion. Pouring: over 7 seconds the gold travels outward from the origin (ease-out, power 2.2), and only the part of each seam within that distance is drawn; the leading 46px is drawn again in a bright gold, like a wet edge. Holding, 16 seconds: every 6.5 seconds a 70px glint in bright gold runs from the origin to the far edge over 2.6 seconds. Then everything fades over 2.5 seconds, a new seed is taken and the piece is mended again somewhere new. Draw every other frame.

Production behaviour: a children slot above the canvas; place content away from the origin. Pause off screen and in hidden tabs. Under reduced motion, or with motion set to "still", draw the whole mend once with no pour, glint or change.`,
  interaction: "None: it is ambient.",
  animation: "Gold pours outward for 7 seconds, holds for 16 with a glint every 6.5, fades for 2.5, then a new break is mended.",
  a11y: "Decorative canvas, hidden from assistive technology; the seams are hairlines on a flat surface, so text contrast is unaffected. Reduced motion shows one finished mend.",
  responsive: "Fills its container and breaks afresh to fit when it is resized.",
  touchFallback: "Nothing to touch.",
  variants: [
    { id: "ink", label: "Ink", prompt: "Colours: glaze #0d1317 with sheen #1b2830; gold #d8b468, dark gold #8a6a2c, bright gold #fff1c9; text #eef1f2: blue-black tenmoku. Select it with the palette option set to \"ink\"." },
    { id: "celadon", label: "Celadon", prompt: "Colours: glaze #c3d3c8 with sheen #e3ede4; gold #b98a34, dark gold #8f6a22, bright gold #f6dc9a; text #1c2a23: pale green celadon, the light version. Select it with the palette option set to \"celadon\"." },
    { id: "oxblood", label: "Oxblood", prompt: "Colours: glaze #2a0d10 with sheen #54191d; gold #e0bb72, dark gold #96702c, bright gold #fff3d2; text #f6eae6: deep copper-red. Select it with the palette option set to \"oxblood\"." },
  ],
  preview: { bg: "#0d1317", mode: "fill", height: 560 },
};
