import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "prism-light",
  name: "Prism",
  category: "backgrounds",
  description: "A white beam crosses a dark room, enters a glass prism and fans out as a spectrum across the far wall — worked out with Snell's law for every wavelength, so moving the light swings and spreads the colours the way a real prism does. Dust glows where it drifts through the beam.",
  tags: ["background", "canvas", "prism", "spectrum", "light", "refraction", "physics", "rainbow", "dark"],
  traits: ["canvas", "cursor", "ambient"],
  source: "original",
  files: ["PrismLight.tsx"],
  dependencies: [],
  prompt: `Build a canvas 2D background of light through a prism, computed rather than drawn.

Scene: a dark wall falling into a floor (a hard gradient stop at 70%), an equilateral prism (side min(30% W, 50% H)) slightly right of centre, clear glass: a faint gradient fill, a hairline edge and a brighter highlight on the left face, and a faint reflection on the floor.

Optics: the light source sits low on the left (breathing slightly) or follows the pointer, clamped to the left of the prism. The white ray aims at a point just above the middle of the left face. For 72 wavelengths from 400 to 700nm compute n(λ) with Cauchy's equation for crown glass (A 1.5046, B 0.0042 µm², the B term scaled ×7 so the fan reads at screen scale), refract at the left face with Snell's law in vector form (t = ηd + (η cos i − √k) n; null on total internal reflection), follow the inner ray to the face it reaches and refract into air — or, past the critical angle, reflect internally and continue (up to three bounces), so the light always leaves somewhere, as in real glass.

Drawing (additive "lighter" compositing): the white beam as four widening translucent quads that fade in from the source; a faint fan inside the glass; then for each wavelength a wedge from its exit point to far beyond the canvas, spanning halfway to its neighbours' far points, so adjacent colours overlap and blend into a continuous spectrum — once spanning ±2.3 neighbours and once ±4.2, faint, for bloom. Wavelength → RGB uses the standard piecewise approximation with intensity falling at the ends. A soft hot spot where the beam enters. ~160 dust motes drift; each is drawn only when inside the white beam or inside the fan's angular range, in the colour there.

One rAF loop while visible (~33fps on touch); the source eases toward its target. Reduced motion: one still frame.`,
  interaction: "Move the pointer on the left to move the light; the spectrum swings and spreads accordingly.",
  animation: "Source eases at 6/s; the resting light breathes on a ~18s cycle; dust drifts.",
  a11y: "The canvas is aria-hidden and decorative; overlay content sits above it. Reduced motion draws one still frame.",
  responsive: "The prism is sized from the canvas and centred on narrow screens; everything is recomputed on resize.",
  touchFallback: "Drag a finger on the left to move the light; it drifts back when you let go. ~33fps.",
  variants: [
    { id: "night", label: "Night", prompt: "theme=\"night\": a near-black wall and floor, so the spectrum glows at full contrast." },
    { id: "studio", label: "Studio", prompt: "theme=\"studio\": a mid-grey photo-studio room, softer and more product-like; the same optics." },
  ],
  preview: { bg: "#05060a", mode: "fill" },
};
