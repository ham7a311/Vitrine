import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "chladni-plate",
  name: "Chladni Plate",
  category: "backgrounds",
  description: "Sand on a plate being played like an instrument: thousands of grains collect on the lines where the plate stands still, and re-form into a new figure each time the note glides on. Move across it to bow the plate.",
  tags: ["particles", "sand", "chladni", "resonance", "cymatics", "canvas", "physics", "generative", "background"],
  traits: ["canvas", "cursor", "touch", "ambient"],
  source: "original",
  isNew: true,
  files: ["ChladniPlate.tsx", "chladni.ts", "chladni-plate.css"],
  dependencies: [],
  prompt: `Build a full-bleed Canvas 2D background that simulates a Chladni figure: sand on a vibrating plate.

The plate. A standing wave on a square plate is a(u, v) = cos(nπu)·cos(mπv) − cos(mπu)·cos(nπv), with u and v running 0…1 across one side and n, m real numbers (they need not be whole). One plate side is 1.08 × the frame's shorter side, centred; the same formula simply continues beyond it, so a wide frame shows more of the figure.

The sand. About 13 grains per 1,000 square pixels (at least 900, at most 16,000), scattered evenly at the start. Every frame, each grain: (1) measures the plate's movement f under it and the slope of f by sampling one pixel right and one pixel down; (2) takes 10% of Newton's step to the nearest still line, −f·∇f / |∇f|², capped at 5px; (3) is thrown in a random direction a distance of rand × rand × 2 × (min(1, |f|)·2.6px + 1.5px × loose), where loose = clamp(typical slope / local slope, 0.35, 3.6), so grains are held tightly where the plate's slope is steep and spread into soft clouds where it is shallow; (4) keeps 86% of its last throw as momentum. Grains that leave the frame land back just inside the edge. The result is fuzzy bright lines where f = 0, thickest where the slope is shallow.

The note. Hold a figure for 7 seconds, then glide n and m to the next figure over 3.4 seconds with smoothstep easing; during the glide the shake rises by up to 3.2px (a sine over the glide) so the sand visibly loosens and re-forms. Cycle through (2.35, 5.2), (3, 5), (1.6, 4.4), (4, 7), (2, 6.5), (3.5, 6).

Drawing. Clear the canvas each frame and draw every grain as a square 1.3 device pixels wide (at least 1px) at 84% opacity, every ninth one 1.55× larger, in one flat colour: no glow, no trails. Cap the device pixel ratio at 2, or 1.5 above 900,000 square pixels.

Pointer. Moving across the frame bows the plate: grains within 16% of the shorter side jump away from the pointer with a force that falls off with the square of distance, then walk back to their lines.

Content. Accept children, drawn above the sand, and a calm option (left, centre, right) that masks the sand to about 15% where text will sit.

Production behaviour: pause when off screen or in a hidden tab and resume the note where it stopped; re-fit on resize keeping each grain's relative place. Under reduced motion settle the first figure out of sight (about 170 steps with a fixed random seed) and show it as a still frame.`,
  interaction: "Move the pointer or a finger across the plate to scatter the sand there; it finds its lines again. Left alone, the figure changes every ten seconds or so.",
  animation: "Grains walk 10% of the way to the nearest still line each frame with a 2.6px shake where the plate moves. Figures hold 7s and glide for 3.4s with smoothstep easing.",
  a11y: "Decorative: the canvas is hidden from assistive technology and content placed over it is ordinary markup. Reduced motion shows one settled figure with no animation.",
  responsive: "Fills its container. Grain count scales with area and the plate with the shorter side, so a phone shows a tighter figure with fewer grains.",
  touchFallback: "Dragging a finger scatters the sand like the pointer does; vertical page scrolling still works.",
  variants: [
    { id: "gold", label: "Gold", prompt: "Palette [#0c0b08 ground, #efe4c4 grain]: pale gold sand on a warm black plate." },
    { id: "copper", label: "Copper", prompt: "Palette [#110a07 ground, #e9a877 grain]: copper filings on a dark umber plate." },
    { id: "ash", label: "Ash", prompt: "Palette [#e9e4d8 ground, #2b2723 grain]: dark ash on unbleached paper, for light pages." },
  ],
  preview: { bg: "#0c0b08", mode: "fill", height: 600 },
};
