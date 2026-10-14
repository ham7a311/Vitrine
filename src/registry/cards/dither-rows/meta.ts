import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "dither-rows",
  name: "Dither Rows",
  category: "cards",
  description: "A quiet feature list where the row you point at lights up on a grainy ordered-dither colour field. The field slides from row to row like a selection, changing colour as it goes, and the row's round icon turns solid.",
  tags: ["list", "features", "dither", "hover", "selection", "rows", "webgl", "menu"],
  traits: ["webgl", "hover", "keyboard", "touch"],
  source: "original",
  isNew: true,
  files: ["DitherRows.tsx", "dither-rows.css", "rows.ts", "gl.ts"],
  dependencies: [],
  prompt:
    "Build a feature list whose selected row reveals a dithered colour field. Props: rows [{id, title, body, icon, color}], defaultActive, cell (dither cell in CSS pixels, default 2), theme and motion.\n\nRows are at least 150px tall (112px in narrow containers), separated by 1px hairlines, with a title (up to 2rem, 500) and a muted line on the left and a 60px round icon chip on the right. Unselected rows are dim grey on the ground; the selected row's text turns white with a soft shadow and its chip turns white with the icon in the row's colour, popping slightly.\n\nThe field is one WebGL canvas in a band behind the list that's moved to the selected row with translateY and height (450ms, cubic-bezier(0.2, 0, 0, 1)), so it slides from row to row; its colour uniform switches to that row's colour. The shader: a warped five-octave value-noise field drifting slowly, stretched horizontally and quieter on the left where the title sits, quantised into four tones of the colour (12%, 42%, the colour, and halfway to white) through an 8×8 Bayer matrix on 2px cells.\n\nThe list is a listbox: rows are options with aria-selected and roving focus; pointer enter, focus or a tap selects, and the arrow keys (with Home and End) move the selection. Pause the canvas offscreen and in hidden tabs, draw a still frame under reduced motion with the band jumping instead of sliding, and fall back to a CSS gradient in the row's colour without WebGL.",
  interaction: "Point at, focus or tap a row to select it; arrow keys, Home and End move the selection.",
  animation: "The band slides between rows over 450ms; text and icon colours change over 300ms; the field drifts continuously. Reduced motion: the band jumps and the field is still.",
  a11y: "A labelled listbox of options with aria-selected and roving focus. The canvas is decorative; the selected row's text is white with a soft shadow over the darker left side of the field.",
  responsive: "Rows fill the width; padding, type and icon size step down in narrow containers.",
  touchFallback: "Tap a row to select it.",
  variants: [
    { id: "night", label: "Night", prompt: "Palette for this theme (Night): --drows-chip #1c1c1e; --drows-dim #8e8e89; --drows-ground #000000; --drows-ink #f4f4f1; --drows-line rgba(255, 255, 255, 0.1). Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"night\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
    { id: "paper", label: "Paper", prompt: "Palette for this theme (Paper): --drows-chip #e6e4de; --drows-dim #5f5d57; --drows-ground #f3f2ee; --drows-ink #151513; --drows-line rgba(20, 20, 18, 0.12). Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"paper\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
  ],
  preview: { bg: "#000000", mode: "fill", frame: [1440, 800] },
};
