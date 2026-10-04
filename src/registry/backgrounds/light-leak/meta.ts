import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "light-leak",
  name: "Light Leak",
  category: "backgrounds",
  description: "The look of a roll of film that let some light in: warm leaks bloom from the edges — pale at the heart, burning to red at the fringe — swell and fade, while grain crawls, dust and hairline scratches flash past and the frame weaves in the gate, at a true 24fps. The pointer near an edge lets light in there.",
  tags: ["background", "webgl", "shader", "film", "light leak", "grain", "analog", "cinematic", "retro", "35mm"],
  traits: ["webgl", "cursor", "ambient"],
  source: "original",
  files: ["LightLeak.tsx"],
  dependencies: [],
  prompt: `Build a WebGL film-stock background in one fragment shader.

Base: a dark frame (two near-black tones, faintly lighter off-centre where a subject would be). Leaks: three blooms anchored just outside the left, right and top edges, each a Gaussian of distance stretched along its edge and torn by fbm noise (radius + 0.55·(fbm − 0.5)), each multiplied by its own slow noise clock (smoothstep of fbm(t·0.05–0.07)) so they swell, drift and vanish independently. Colour the summed leak by intensity: the theme's fringe colour at the weak edge, through its main colour, to a hot near-white at the heart, and screen it over the base.

Film: run the loop at 24fps. Each frame: a sub-pixel gate weave (random offset of the sample position), ±3% flicker, fresh grain (hash noise at ~1.4px, strongest in mid-tones), a hairline vertical scratch held for three frames about one time in seven, and up to two dark dust specks. A lens vignette finishes it. Start the clock 20s in so the first frame already has leaks.

The pointer near an edge (within 32% of the frame) adds a fourth leak anchored on the nearest edge, stronger the closer it is, eased in. Render at 70% resolution (50% on touch, no pointer leak), paused offscreen and in hidden tabs; a CSS radial gradient stands in without WebGL; reduced motion draws a single still frame with no weave.`,
  interaction: "Bring the pointer toward an edge to let light leak in there.",
  animation: "24fps film cadence; leaks breathe on 15–20s noise clocks; scratches and dust are random per frame.",
  a11y: "The canvas is aria-hidden and decorative; overlay content sits above it. There are no rapid flashes — flicker is ±3%. Reduced motion shows one still frame.",
  responsive: "The shader works in aspect-corrected coordinates, so leaks keep their shape at any size.",
  touchFallback: "No pointer leak on touch; the film runs the same at lower resolution.",
  variants: [
    { id: "warm", label: "Warm", prompt: "theme=\"warm\": red fringe → orange body → hot white, classic expired-film leaks." },
    { id: "cool", label: "Cool", prompt: "theme=\"cool\": magenta fringe → cyan body → white, like cross-processed film." },
    { id: "mono", label: "Mono", prompt: "theme=\"mono\": colourless leaks from grey to white, black-and-white stock." },
  ],
  preview: { bg: "#0a0706", mode: "fill" },
};
