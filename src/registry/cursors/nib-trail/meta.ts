import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "nib-trail",
  name: "Nib Trail",
  category: "cursors",
  description: "The pointer is a broad-nib pen. Its trail is ink swept by a nib held at a fixed angle, so strokes come out thick and thin like real lettering, spreading a little when fresh and drying away. Hold the button for wetter ink that stays long enough to sign your name.",
  tags: ["cursor", "trail", "calligraphy", "ink", "pen", "canvas", "lettering", "signature"],
  traits: ["cursor", "canvas", "click"],
  source: "original",
  files: ["NibTrail.tsx", "nib-trail.css"],
  dependencies: [],
  prompt: `Build a scoped cursor trail that behaves like a broad-nib calligraphy pen, drawn on a canvas over the wrapper's children.

The nib is a line segment of width W held at a fixed angle θ (prop, default 38°; 70° for naskh). For each pair of consecutive points A → B, fill the quad A−h, A+h, B+h, B−h where h is the nib's half-vector (cos θ, −sin θ) × W/2. Because the angle never changes, neighbouring quads share their edges exactly — no joins to patch — and the thick-and-thin comes from geometry: moving across the nib gives full width, moving along it gives nothing, so also stroke a 0.9px centre line as the hairline. Points come from getCoalescedEvents() so fast curves stay smooth, with each point's own timestamp. W shrinks up to 32% with speed; a pen's pressure scales it 0.55–1.45×. Fresh ink is 16% wider for its first 140ms (it spreads, then settles). A stroke begins with a zero-width anchor, so hover strokes taper in.

Life: hover ink (W × 0.72) fades out over 900ms, oldest first; held ink (button down, W × 1.22, slightly more opaque) lasts 4.2s and starts with a small elliptical pool along the nib. Double-click wipes everything with a 260ms fade. Strokes break at pointerleave, on release and over links, buttons and fields (where the pen 'lifts' and the mark becomes a small point). selectstart is cancelled while writing and the host is user-select:none. The rAF loop runs only while ink is still drying.

Rendering: the canvas sits above the content with mix-blend-mode multiply on light themes (ink into the page) and screen on dark ones, at devicePixelRatio ≤ 2, resized by ResizeObserver. Coordinates are host-local, corrected for scaled hosts. The cursor is a DOM nib — a 1.2W × 3px bar at the nib angle with a light keyline — positioned in the pointermove handler. Under (any-hover: hover) and (any-pointer: fine) only; cursor:none inside, native cursor in fields. Demo: a lettering practice pad with ascender, x-height, baseline and slant guides, a faint italic word to trace, and a radiogroup for nib angle (38°, 50°, 70°).`,
  interaction: "Move to sketch with ink that dries in a second. Hold the button to write ink that stays; double-click to wipe. Change the nib angle above the pad.",
  animation: "Hover ink fades over 900ms, held ink over 4.2s; fresh ink spreads for 140ms; wipe 260ms. Nib mark 160ms on press.",
  a11y: "The canvas and nib are aria-hidden decoration; the page's text and controls are untouched and keyboard-operable (the nib angle is a real radiogroup). Reduced motion turns off the hover trail entirely: only held strokes draw, and they stay still until you double-click instead of fading.",
  responsive: "The canvas follows the host's size with a ResizeObserver; guides scale with the viewport.",
  touchFallback: "Touch draws nothing and scrolling is untouched. A pen (pointerType pen) writes with pressure.",
  promptAllow: ["night", "paper"],
  variants: [
    { id: "paper", label: "Iron-gall", prompt: "Iron-gall ink: theme=\"paper\", ink #1d2b4f (blue-black) on cream (#f5f0e4), multiply blend; guides in faint navy with red-brown slant lines." },
    { id: "night", label: "Gold", prompt: "Gold ink: theme=\"night\", ink #e6c27a on a near-black sheet (#0f0e0c, text #ece4d2), screen blend; guides in faint gold." },
  ],
  preview: { bg: "#f5f0e4", mode: "fill" },
};
