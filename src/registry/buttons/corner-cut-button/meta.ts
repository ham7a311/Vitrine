import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "corner-cut-button",
  name: "Corner Cut Button",
  category: "buttons",
  description: "Chamfered, instrument-panel buttons with a true border: the outline is drawn to the measured shape so cut edges are exactly as crisp as straight ones, and a slanted accent band sweeps in on hover. Shown with one corner cut, two, and all four.",
  tags: ["button", "chamfer", "corner cut", "notch", "hud", "sci-fi", "clip-path", "mono", "octagon"],
  traits: ["click", "keyboard", "hover"],
  source: "original",
  files: ["CornerCutButton.tsx", "corner-cut-button.css", "notch.ts"],
  dependencies: [],
  prompt:
    "Build instrument-panel buttons with 45° chamfered corners, in a filled and a hairline tone and three sizes (36px, 46px, 54px tall; 16, 24, 30px side padding). Type: a monospace stack at 600, uppercase, 0.08em tracking, 12 to 14.5px. An optional arrow icon after the label slides 3px on hover.\n\nShapes: one corner (the bottom right), two corners (top left and bottom right) and all four corners (an octagon), each cut 7, 11 or 14px by size. Clip only an inner fill layer to the polygon with clip-path (calc() against a --cut custom property), so the button itself isn't clipped and its focus ring still shows. Draw the 1.5px outline as an SVG polygon from the button's measured size (ResizeObserver), pulled in by half the stroke; where a corner is cut, move its ends along the sides by inset × tan(22.5°) so the diagonal stays exactly parallel and the same weight as the straight edges.\n\nPalette (light / dark): ink #0d0d0e / #f1f1ef, page #efefec / #0b0b0c, accent signal orange #ff5a1f with near-black text / acid lime #c6ff3d with near-black text, accent wash at 10%. Focus: a 2px accent outline.\n\nTones: filled is an ink slab with page-coloured text; on hover or keyboard focus an accent band, slanted -30°, sweeps across from the left in 0.38s, the text turns near-black and the edge accent. Hairline is transparent with a 1.5px ink edge; on hover the band is the 10% wash and the edge turns accent. Press moves it down 1px.\n\nShow three rows (one corner, two, all four), each with a large filled 'Launch' with an arrow, a hairline 'View specs' and a small filled 'Arm', centred on the page colour.",
  interaction: "A normal button: click, Enter or Space. Hover and keyboard focus show the same accent state.",
  animation: "A 0.38s slanted sweep, 0.2s colour and edge changes, a 3px icon slide, a 1px press. Reduced motion makes them instant.",
  a11y: "Native button; the outline and sweep are decorative; the focus ring sits outside the shape; text keeps 4.5:1 on every fill.",
  responsive: "Buttons keep their size and wrap in rows; the outline is re-measured whenever the button resizes.",
  touchFallback: "Nothing depends on hover; the press gives touch feedback.",
  variants: [
    { id: "light", label: "Light", prompt: "Palette for this theme (Light): --ccut-accent #ff5a1f; --ccut-accent-ink #160600; --ccut-focus #ff5a1f; --ccut-ink #0d0d0e; --ccut-line #0d0d0e; --ccut-paper #ffffff; --ccut-wash rgb(255 90 31 / 0.1). Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"light\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
    { id: "dark", label: "Dark", prompt: "Palette for this theme (Dark): --ccut-accent #c6ff3d; --ccut-accent-ink #0b0f00; --ccut-focus #c6ff3d; --ccut-ink #f1f1ef; --ccut-line #f1f1ef; --ccut-paper #0b0b0c; --ccut-wash rgb(198 255 61 / 0.1). Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"dark\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
  ],
  preview: { bg: "#efefec", mode: "fill", frame: [900, 420] },
};
