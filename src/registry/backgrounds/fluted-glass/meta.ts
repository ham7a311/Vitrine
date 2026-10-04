import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "fluted-glass",
  name: "Fluted Glass",
  category: "backgrounds",
  description: "Slow colour seen through reeded glass: every reed squeezes and mirrors the strip behind it, catches a thin highlight and falls into shadow at the groove, and your pointer slides a warm light along behind them.",
  tags: ["background", "webgl", "shader", "glass", "reeded", "fluted", "refraction", "ambient"],
  traits: ["webgl", "cursor", "ambient"],
  source: "original",
  files: ["FlutedGlass.tsx"],
  dependencies: [],
  prompt: `Write a WebGL1 fragment-shader background that looks like a panel of reeded (fluted) glass in front of soft drifting colour.

Behind the glass: a base colour with three large Gaussian blobs of colour drifting on slow, unrelated sine paths, in aspect-corrected space, plus a warm blob that follows the pointer (eased) and fades in and out as it enters and leaves.

The glass: divide the width into reeds of a fixed CSS width (default 54px). Within each reed let s run from −0.5 to 0.5. Each reed is a cylinder lens, so sample the field at x = (cell + 0.5 − 1.8·s) / N — a squeezed, mirrored slice slightly wider than the reed — and bend y very slightly with s². Sample red, green and blue at tiny opposite offsets proportional to s for a faint chromatic edge. Shade with 0.8 + 0.2·cos(πs), add a crisp highlight on one shoulder and a softer one on the other, and darken the groove where |s| > 0.44. Finish with a soft vignette and one-step dither against banding.

Render near full resolution (reed edges must stay crisp), at ~60fps on desktop and ~30 on touch, stop requesting frames entirely when offscreen or the tab is hidden, and draw one frame under reduced motion. Fall back to a CSS radial-gradient approximation without WebGL. Colours are a prop: [base, blob 1, blob 2, blob 3, pointer blob].`,
  interaction: "A warm light follows the pointer behind the glass, breaking into strips across the reeds.",
  animation: "Colour blobs drift on 17–37s sine paths; the pointer light eases at 6% per frame and fades in over about half a second.",
  a11y: "The canvas is aria-hidden and decorative; content renders above it. Reduced motion draws one still frame.",
  responsive: "Reeds keep their CSS width, so a phone shows fewer, the same size. The canvas follows its container.",
  touchFallback: "No pointer light on touch; the colour still drifts behind the reeds.",
  variants: [
    { id: "amber", label: "Amber", prompt: "Colours [#140c08 base, #d9733a, #8a3b2a, #f0b37a, #ffd7a0 pointer]: warm orange and rust behind the reeds, a pale apricot glow under the cursor." },
    { id: "sea", label: "Sea", prompt: "Colours [#04121a base, #1f7a8c, #2f5fd0, #7fd1c4, #e9f7ff pointer]: teal and ultramarine behind the reeds, an icy white glow under the cursor." },
    { id: "mono", label: "Mono", prompt: "Colours [#0c0c0d base, #5b5b60, #2a2a2e, #b8b6b0, #f4f1ea pointer]: greys only, so the reeds read as pure form; a warm-white glow under the cursor." },
  ],
  preview: { bg: "#140c08", mode: "fill" },
};
