import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "snap-frame",
  name: "Snap Frame",
  category: "cursors",
  description: "An adaptive pointer. A soft dot at rest; over a control it becomes a highlight in that control's own shape and corner radius, with the control leaning toward you. Over text it turns into a caret the height of the type, snapped to the line. Tab moves the same frame.",
  tags: ["cursor", "pointer", "adaptive", "magnetic", "morph", "ipad", "focus", "spring"],
  traits: ["cursor", "click", "keyboard"],
  source: "original",
  files: ["SnapFrame.tsx", "snap-frame.css"],
  dependencies: [],
  prompt: `Build a scoped adaptive pointer: one drawn shape that changes what it is depending on what it is over, inside a wrapper component.

Scope: the host gets data-live only under (hover: hover) and (pointer: fine); that sets cursor:none (with !important) on it and every descendant, fields included, because the component draws its own caret. An aria-hidden, pointer-events:none layer above the children holds a single absolutely-positioned div. Coordinates are host-local CSS pixels, corrected by rect.width / offsetWidth so it works when the host is drawn scaled.

The shape is five springs — centre x, y, width, height and corner radius — slightly under-damped (k 520, ζ 0.86) so a morph lands with life but never wobbles; one rAF loop runs only while a spring is moving. It has three modes, chosen from the element under the pointer:
• Dot: 16px circle (12px while pressed) at the pointer, ink at 26% with a hairline. Its position is written in the pointermove handler, not on the next frame.
• Frame: over a[href], buttons, role=button/tab/radio/menuitem or [data-snap]. Measure the control's untranslated rect and computed border-top-left-radius (clamped to half its height). The shape grows to the rect plus 4px each side with radius + 4, as an 8% ink highlight with a 1px ring and a faint 4px halo, blended with multiply on paper and plus-lighter on night so text stays readable through it. Magnetic: from the pointer's offset from the centre (−1..1 on each axis) the control leans up to 4px (2.8px vertically) via the translate property, on its own spring per element so it eases home after you leave; the highlight leans further (×1.7, ×1.2), so it feels like light under your finger. Pressing scales the control to 0.97 and the frame to 0.96.
• Beam: over p, headings, li, label, input, textarea or [data-snap-text]. A 2.5px caret with height = font-size × 1.18, centred on the line box under the pointer: top of the text box plus padding, then floor((y − top) / line-height) + ½. Inputs centre it vertically. Accent colour.

Keyboard: on focusin of a :focus-visible control the frame wraps it (no lean), so Tab moves the frame; on focusout it hides unless the pointer is inside. The pointer appears at its entry point (springs snapped), fades out on leave, and re-measures on scroll or resize. Paper and Night themes.`,
  interaction: "Move between the toolbar, tabs, links and buttons; rest over the paragraph to get the caret; press Tab to walk the frame through the controls.",
  animation: "Five springs (k 520, ζ 0.86) for x, y, width, height and radius; per-control lean springs (k 380); colours 180ms.",
  a11y: "The drawn shape is aria-hidden and never takes focus; every control keeps its own focus-visible outline, and the frame follows keyboard focus too. Reduced motion (the media query or motion=\"reduced\") jumps between shapes with no springs or lean.",
  responsive: "Measurements are host-local and re-taken on scroll and resize; works at any size and inside scaled previews.",
  touchFallback: "Coarse pointers draw nothing and keep the system cursor; focus-following still works for keyboards.",
  variants: [
    { id: "paper", label: "Paper", prompt: "Palette for this theme (Paper): --snap-frame-beam #2f6fed; --snap-frame-blend multiply; --snap-frame-ink #1d1c19. Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"paper\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
    { id: "night", label: "Night", prompt: "Palette for this theme (Night): --snap-frame-beam #8ab4ff; --snap-frame-blend plus-lighter; --snap-frame-ink #f3f1ec. Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"night\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
  ],
  preview: { bg: "#f4f2ed", mode: "fill" },
};
