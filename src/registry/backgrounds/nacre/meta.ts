import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "nacre",
  name: "Nacre",
  category: "backgrounds",
  description: "Mother-of-pearl in slow silky folds, coloured by real thin-film interference: the shell's thickness and your viewing angle decide which colours are reinforced and which cancel. Pointing tilts the shell, so the colours slide across it.",
  tags: ["background", "iridescent", "pearl", "holographic", "thin film", "pastel", "webgl", "shader"],
  traits: ["webgl", "ambient", "cursor"],
  source: "original",
  isNew: true,
  files: ["Nacre.tsx", "nacre.css", "gl.ts"],
  dependencies: [],
  // "mother-of-pearl" is the subject, not the option.
  promptAllow: ["pearl"],
  prompt:
    "Write a WebGL1 full-screen fragment shader background (no libraries): mother-of-pearl. Build a film-thickness field from twice-domain-warped four-octave value-noise fBm at a broad scale, drifting very slowly, so it forms wide silky folds. Take a fairly strong normal from its finite differences so the folds have glossy ridges.\n\nColour by thin-film interference, not a palette: thickness in nanometres = base thickness (about 360nm) + 240 × the field + 70 × sin(26 × the field), the last term laying fine banding along the folds like stacked platelets; optical path difference = 2 × 1.53 × thickness × cos θ, where θ is the angle between the normal and a view direction that leans a little towards the edges of the screen; for red, green and blue at 650, 532 and 450nm take 0.5 + 0.5·cos(2π·OPD/λ + π) (the half-wave flip at the top surface). Nacre only returns a little of the light as colour, so keep it low-contrast: colour = base × (1 + (interference − 0.5) × strength), with strength about 0.38. Shade the thinnest parts slightly towards a shade colour and add a soft specular sheen on the fold ridges from a light to the upper left.\n\nThe pointer tilts the shell: it leans the view direction and nudges the thickness, easing in with a slow 0.05 lerp, so the colours slide across the surface as you move. An optional fleck mode scatters rare tiny cells that flash saturated colours as they catch the light.\n\nRender at 0.7× device pixels (lower and about 30fps on touch), pause offscreen and in hidden tabs, draw one still frame under reduced motion, and fall back to a pastel CSS conic gradient without WebGL. Children sit above the canvas.",
  interaction: "Move the pointer to tilt the shell; the colours slide across it.",
  animation: "The folds drift very slowly; the tilt follows the pointer with a 0.05 lerp and eases out when it leaves. Reduced motion draws one still frame.",
  a11y: "Decorative and hidden from assistive tech. The pearl and opal looks are light: use dark text on them; the abalone look is mid-dark and needs a scrim for white text.",
  responsive: "Fills its container at any aspect ratio; device pixel ratio capped at 2.",
  touchFallback: "No tilt on touch; the folds keep drifting.",
  variants: [
    { id: "pearl", label: "Pearl", prompt: "Pearl base #f1eef2, shade #cfcbdb, strength 0.38, base thickness 360nm: soft pastel pinks, mints and lilacs on white." },
    { id: "abalone", label: "Abalone", prompt: "Base #7fa3b8, shade #1d3a4f, strength 0.9, base thickness 430nm: deep blues, greens and violets like the inside of an abalone shell." },
    { id: "opal", label: "Opal", prompt: "Base #eef0f2, shade #c4ccd6, strength 0.26, base thickness 300nm, with flecks at 0.9: milky white with rare sparks of saturated colour." },
  ],
  preview: { bg: "#f3f0f4", mode: "fill", height: 600 },
};
