import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "dither-accordion",
  name: "Dither Accordion",
  category: "cards",
  description: "A row of tall feature panels on slow, ordered-dither colour fields — blue, violet, crimson, green, amber — that read like grainy prints. Point at a panel and it opens wide with its title and line while the others narrow to their names on end.",
  tags: ["accordion", "features", "dither", "cards", "expanding", "panels", "webgl", "gradient"],
  traits: ["webgl", "hover", "keyboard", "touch", "ambient"],
  source: "original",
  isNew: true,
  files: ["DitherAccordion.tsx", "dither-accordion.css", "accordion.ts", "gl.ts"],
  dependencies: [],
  prompt:
    "Build a horizontal accordion of feature panels with dithered colour backgrounds. Props: panels [{id, title, body, color, icon}] (up to six), height (default 520px), defaultOpen, cell (dither cell size in CSS pixels, default 2), theme and motion.\n\nLayout: a flex row with 12px gaps; each panel has 22px corners and grows from flex 1 to 4.6 when open (600ms, cubic-bezier(0.2, 0, 0, 1)). Every panel shows a 52px white rounded icon chip at the top-left with the icon in the panel's colour. Closed panels show their title on end — vertical, reading upwards, 1.5rem/600 at the foot — which fades as the panel opens; the open panel shows a large title (up to 2.6rem, −0.03em) and a line of body text at the bottom-left, fading and rising in after a 220ms delay at a fixed width so the text never reflows while the panel grows.\n\nBackgrounds: one WebGL canvas behind the whole row, not one per panel. Every frame, pass each panel's rectangle (in canvas pixels, bottom-left origin) and colour as uniform arrays; in the shader find which rounded rectangle the pixel is in (a rounded-box SDF with 1px anti-aliasing) and draw the ground colour in the gaps. Inside a panel take a domain-warped five-octave value-noise field drifting slowly (pinned to the canvas, so it doesn't stretch as panels resize), darken it towards the foot of the panel for legible text, then quantise it into four tones of the panel's colour (14% of it, 48%, the colour itself, and 55% towards white) through an 8×8 Bayer ordered-dither matrix on 2px cells, so it reads as a grainy print.\n\nPanels open on pointer enter, focus, a tap, or the arrow keys (with Home and End), with roving tab focus. Below 640px of width the row becomes a vertical stack: closed panels are 76px bars with the icon and a horizontal title, and the open one is 340px tall. Pause the canvas offscreen and in hidden tabs, draw a still frame under reduced motion (and redraw it when the open panel changes), and fall back to a CSS gradient per panel without WebGL.",
  interaction: "Point at, focus or tap a panel to open it; use the arrow keys, Home and End to move between panels.",
  animation: "Panels grow and shrink over 600ms; the open panel's text fades and rises in after 220ms; the dither fields drift continuously. Reduced motion: panels switch instantly over a still field.",
  a11y: "Each panel is a focusable control with aria-expanded and roving focus; closed panels are named by their title and the open panel's text is exposed. The canvas is decorative. White text sits on the darkened foot of each field with a soft shadow.",
  responsive: "A row from 640px of width, a vertical stack of bars below it; one canvas follows every layout change.",
  touchFallback: "Tap a panel to open it.",
  variants: [
    { id: "night", label: "Night", prompt: "Palette for this theme (Night): --dacc-chip #ffffff; --dacc-ground #000000; --dacc-ink #ffffff. Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"night\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
    { id: "paper", label: "Paper", prompt: "Palette for this theme (Paper): --dacc-chip #ffffff; --dacc-ground #f2f1ec; --dacc-ink #ffffff. Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"paper\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
  ],
  preview: { bg: "#000000", mode: "fill", frame: [1440, 700] },
};
