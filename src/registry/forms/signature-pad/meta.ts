import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "signature-pad",
  name: "Signature Pad",
  category: "forms",
  description: "A signature field whose nib behaves like ink — fast is thin, slow pools — and whose Clear button rewinds the signature, last point first.",
  tags: ["signature", "sign", "form", "draw", "pen", "svg", "input", "ink"],
  traits: ["click", "touch", "keyboard"],
  source: "original",
  files: ["SignaturePad.tsx", "signature-pad.css"],
  dependencies: [],
  prompt: `Build a signature field drawn in SVG (viewBox 600×220) with a nib that behaves like ink. Collect pointer points with getCoalescedEvents() so fast curves stay smooth, each with its own timestamp. For every new point: speed v = distance / ms; target width = thick − (thick − thin)·clamp(v / 1.6) (4.2 → 1.1 units), scaled by pen pressure when there is a pen; then w += (target − w)·0.35, so the width eases and one quick frame can't notch the line. Each segment is its own path — a quadratic from the previous midpoint, through the previous point, to the new midpoint — with its own stroke-width and round caps, so the line swells and thins continuously. A stroke starts with a small dot where the nib lands.

Clear doesn't wipe: it rewinds, rendering only the first total·(1 − ease(k)) segments over up to ~1.1s (cubic in-out), so the signature un-draws last point first. Undo removes the last stroke; Save SVG downloads the drawing. The pad sits on a soft card with a mono label, a baseline with an × and an italic "Sign here" that disappears once signed, a polite status line ("2 strokes"), and a "Type your name instead" link that swaps the pad for a text input set in a script face on the same baseline. The live stroke is appended to the DOM directly instead of through React state, so drawing never waits for a render.`,
  interaction: "Draw with a mouse, finger or pen; Undo removes the last stroke, Clear rewinds the whole signature, Save SVG downloads it, or switch to typing your name.",
  animation: "Width lerp 0.35 per point; Clear rewinds over 260ms + 2.2ms per segment (max 1.1s), cubic in-out.",
  a11y: "The pad is labelled and described by a polite status line; every action is a real button, disabled when there's nothing to act on. Keyboard users can type their name instead, and the typed field shares the same label. Reduced motion clears instantly.",
  responsive: "The pad keeps its 600:220 ratio and scales with the card (max 38rem); the footer stacks under 480px.",
  touchFallback: "Touch and pen draw directly (touch-action none on the pad only); pen pressure varies the width.",
  variants: [
    { id: "paper", label: "Paper", prompt: "Palette for this theme (Paper): --sp-bg #fbf8f1; --sp-fg #1b1a17; --sp-line rgb(27 26 23 / 0.16); --sp-muted #7a7366. Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"paper\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
    { id: "night", label: "Night", prompt: "Palette for this theme (Night): --sp-bg #15140f; --sp-fg #efe9da; --sp-line rgb(239 233 218 / 0.14); --sp-muted #8f8778. Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"night\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
  ],
  preview: { bg: "#ebe5d8", mode: "fill", height: 560 },
};
