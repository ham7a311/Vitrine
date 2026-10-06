import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "corner-cut-button",
  name: "Corner Cut Button",
  category: "buttons",
  description: "Chamfered, instrument-panel buttons with a true border: the outline is drawn to the measured shape so cut edges are exactly as crisp as straight ones, and an accent band sweeps in on hover. One corner, two, all four, or square with corner brackets that close in.",
  tags: ["button", "chamfer", "corner cut", "notch", "hud", "sci-fi", "brackets", "clip-path", "mono"],
  traits: ["click", "keyboard", "hover"],
  source: "original",
  files: ["CornerCutButton.tsx", "corner-cut-button.css", "notch.ts"],
  dependencies: [],
  prompt:
    "Build an instrument-panel button in the single shape selected below, in a filled and a hairline tone and three sizes (36px, 46px, 54px tall; 16, 24, 30px side padding). Type: a monospace stack at 600, uppercase, 0.08em tracking, 12 to 14.5px. An optional arrow icon after the label slides 3px on hover.\n\nPalette (light / dark): ink #0d0d0e / #f1f1ef, page #ffffff / #0b0b0c, accent signal orange #ff5a1f with near-black text / acid lime #c6ff3d with near-black text, accent wash at 10%. Focus: a 2px accent outline 3px out (the button itself isn't clipped, so the ring always shows).\n\nTones: filled is an ink slab with page-coloured text; on hover or keyboard focus an accent band, slanted -30°, sweeps across from the left in 0.38s, the text turns near-black and the edge accent. Hairline is transparent with a 1.5px ink edge; on hover the band is the 10% wash and the edge turns accent. Press moves it down 1px.\n\nShow a large filled 'Launch' with an arrow, a hairline 'View specs' and a small filled 'Arm', on a #efefec panel and a #0b0b0c panel side by side.",
  interaction: "A normal button: click, Enter or Space. Hover and keyboard focus show the same accent state.",
  animation: "0.38s slanted sweep, 0.2s colour and edge changes, a 3px icon slide, a 1px press. Reduced motion makes them instant.",
  a11y: "Native button; the outline and sweep are decorative; the focus ring sits outside the shape; text keeps 4.5:1 on every fill.",
  responsive: "Buttons keep their size and wrap in rows; the outline is re-measured whenever the button resizes.",
  touchFallback: "Nothing depends on hover; the press gives touch feedback.",
  variants: [
    { id: "one", label: "One corner", prompt: "One corner: the bottom-right corner is cut at 45° (7, 11 or 14px by size). Clip only an inner fill layer to the polygon with clip-path (calc() against a --cut custom property), and draw the 1.5px outline as an SVG polygon from the button's measured size (ResizeObserver), pulled in by half the stroke; where the cut is, move its ends along the sides by inset × tan(22.5°) so the diagonal stays exactly parallel and the same weight." },
    { id: "two", label: "Two corners", prompt: "Two corners: the top-left and bottom-right corners are cut at 45° (7, 11 or 14px by size), a diagonal pair. Clip only an inner fill layer to the polygon with clip-path (calc() against a --cut custom property), and draw the 1.5px outline as an SVG polygon from the measured size (ResizeObserver), pulled in by half the stroke, moving each cut's ends along the sides by inset × tan(22.5°) so the diagonals stay parallel and the same weight." },
    { id: "all", label: "All corners", prompt: "All corners: all four corners cut at 45° (7, 11 or 14px by size), an octagonal slab. Clip only an inner fill layer to the eight-point polygon with clip-path (calc() against a --cut custom property), and draw the 1.5px outline as an SVG polygon from the measured size (ResizeObserver), pulled in by half the stroke, moving each cut's ends along the sides by inset × tan(22.5°) so the diagonals stay parallel and the same weight." },
    { id: "brackets", label: "Corner brackets", prompt: "Corner brackets: a square button with no outline, just four L-shaped brackets (1.5px, 10px arms, in ink at 55%) sitting 5px outside its corners; the filled tone gets a faint 7% ink wash instead of a slab. On hover or focus the brackets close onto the corners and grow to 14px arms in the accent, the button washes with the accent at 10%, and the label's tracking opens from 0.08em to 0.12em, together over 0.3s." },
  ],
  preview: { bg: "#efefec", mode: "fill", frame: [1000, 420] },
  isNew: true,
};
