import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "jacobs-ladder",
  name: "Jacob's Ladder",
  category: "backgrounds",
  description: "A high-voltage arc climbing between two rails that open into a V: it strikes at the narrow bottom, rises with the heated air, stretches and bows as the rails part, then snaps and strikes again. Every strike crackles along a new path, and the pointer pulls the arc towards it.",
  tags: ["background", "electric", "arc", "plasma", "lightning", "pillar", "webgl", "shader"],
  traits: ["webgl", "ambient", "cursor"],
  source: "original",
  isNew: true,
  files: ["JacobsLadder.tsx", "jacobs-ladder.css", "gl.ts"],
  dependencies: [],
  prompt:
    "Write a WebGL1 full-screen fragment shader background (no libraries): a Jacob's ladder. Two thin metal rails rise from the bottom centre and open into a V (half-gap 3.5% of the height at the bottom, widening by 24% of the height per unit of height).\n\nAn arc runs between the rails on a cycle (default 2.6s). Each cycle it strikes at the bottom with a brief flash, then climbs, accelerating like heated air (height = 5% + 86% × phase^1.45), bowing upward in the middle more as it rises, and fades out in the last 7% before the next strike. Its path is jagged: three layers of 1D value noise along x, two of them re-seeded many times a second so it crackles, with a new seed every strike. Draw it as a hot white Gaussian core (about 0.2% of the height), a coloured glow falling off exponentially, and a wide faint haze, clipped softly at the rails; add four fading copies a moment behind so it leaves a trail as it climbs, and flicker the whole arc slightly. Behind it, a soft vertical column of glow brightest at the arc's height. The rails are brushed metal that light up near the arc. Tone-map the result with 1 − exp(−x) and vignette the corners.\n\nThe pointer bends the arc towards it, in a soft neighbourhood of the pointer's x, easing in and out.\n\nRender at 0.85× device pixels (lower and about 30fps on touch), pause offscreen and in hidden tabs, draw one still frame mid-climb under reduced motion, and fall back to a soft CSS glow column without WebGL. Children sit above the canvas.",
  interaction: "Move the pointer near the arc to pull it towards you.",
  animation: "A strike every 2.6 seconds: flash, climb, stretch, fade; the arc's path flickers many times a second. The pointer's pull eases in and out. Reduced motion draws one still frame mid-climb, with no flicker.",
  a11y: "Decorative and hidden from assistive tech. It flickers, but softly, at low contrast and never as a full-screen flash; reduced motion removes all movement. Keep text away from the centre column.",
  responsive: "Fills its container; the ladder stays centred at the same proportions; device pixel ratio capped at 2.",
  touchFallback: "No pointer effect on touch; the arc keeps climbing on its own.",
  variants: [
    { id: "violet", label: "Violet", prompt: "Palette { ground #0b0716, glow #9a6bff, core #f6efff, metal #8c8a99 }: a violet arc in a dark lab." },
    { id: "cobalt", label: "Cobalt", prompt: "Palette { ground #040a16, glow #4f97ff, core #eef6ff, metal #86909e }: an electric blue arc." },
    { id: "sodium", label: "Sodium", prompt: "Palette { ground #120804, glow #ff9a3d, core #fff3e2, metal #9a8f86 }: a warm orange arc like a sodium flame." },
  ],
  preview: { bg: "#0b0716", mode: "fill", height: 600 },
};
