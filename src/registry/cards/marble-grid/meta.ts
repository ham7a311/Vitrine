import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "marble-grid",
  name: "Marble Grid",
  category: "cards",
  description: "A quiet grid of dark feature cards. Point at one and it floods with slowly folding liquid marble in its own colour — light swirls, deep shade and dark veins — spreading out from where your pointer came in, while the other cards step back.",
  tags: ["features", "grid", "cards", "marble", "liquid", "hover", "webgl", "gradient"],
  traits: ["webgl", "hover", "keyboard", "touch"],
  source: "original",
  isNew: true,
  files: ["MarbleGrid.tsx", "marble-grid.css", "grid.ts", "gl.ts"],
  dependencies: [],
  prompt:
    "Build a grid of feature cards where the active one fills with liquid marble. Props: items [{id, title, body, icon, color}], theme and motion.\n\nThree columns (two below 900px of width, one below 560px) with 18px gaps; cards are at least 300px tall with 28px corners, a near-black fill and a 1px hairline, the icon in a 56px rounded chip at the top-left (tinted in the card's colour) and the title (up to 1.9rem, 600) and a muted line at the bottom.\n\nOne WebGL canvas serves the whole grid: it lives in a layer that's moved under the active card (positioned to the card's offset box, same radius, behind it) and its colour uniform switches to that card's colour, so there's only ever one context. The shader is a liquid marble: Inigo-Quilez-style double domain warp of four-octave value-noise fBm at a broad scale drifting slowly, mapped from 22% of the colour through the colour to 55% towards white in the brightest folds, with thin dark veins where the second warp field crosses its midpoint, and soft light from the top left.\n\nActivating a card (pointer enter, focus or tap) moves the layer there and floods it in with a clip-path circle that grows from where the pointer entered (the centre for keyboard) over 850ms; the card's background turns transparent so the marble shows, its icon chip turns white, its text turns white, and every other card fades to 55%. Leaving the grid (or focus leaving it) clears it. Arrow keys move focus across the grid, Home and End jump. Pause the canvas offscreen and in hidden tabs, draw a still frame under reduced motion (no flood, a short fade instead), and fall back to a CSS radial gradient without WebGL.",
  interaction: "Point at, focus or tap a card to flood it with marble; arrow keys move between cards; leave the grid to clear it.",
  animation: "The marble floods in from the pointer's entry point over 850ms and folds slowly while active; other cards dim over 350ms; the icon chip pops to white. Reduced motion: a 150ms fade over a still marble.",
  a11y: "Cards are focusable articles with headings; focus shows the same state as hover and arrow keys move between cards. The canvas is decorative; text on the marble is white with a soft shadow.",
  responsive: "Three, two or one columns from the container's width; the marble layer follows the active card's box at every size.",
  touchFallback: "Tap a card to flood it.",
  variants: [
    { id: "night", label: "Night", prompt: "Palette for this theme (Night): --mgrid-card #111112; --mgrid-chip #2a2a2c; --mgrid-ink #f3f3f1; --mgrid-line rgba(255, 255, 255, 0.06); --mgrid-muted #9a9a95. Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"night\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
    { id: "paper", label: "Paper", prompt: "Palette for this theme (Paper): --mgrid-card #ffffff; --mgrid-chip #efeee9; --mgrid-ink #151513; --mgrid-line rgba(20, 20, 18, 0.08); --mgrid-muted #5c5a54. Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"paper\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
  ],
  preview: { bg: "#000000", mode: "fill", frame: [1440, 860] },
};
