import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "signal-tiles",
  name: "Signal Tiles",
  category: "cards",
  description: "A grid of quiet black service tiles that switch on when you point at them: a field of dots twinkles up around the pointer, a lit blue arc slides round the border to the nearest edge, and the icon and label come up to white.",
  tags: ["cards", "services", "grid", "hover", "dots", "glow", "border", "dark", "agency"],
  traits: ["hover", "keyboard", "canvas"],
  source: "original",
  files: ["SignalTiles.tsx", "signal-tiles.css", "edge.ts", "icons.tsx"],
  dependencies: [],
  prompt:
    "Build a services section on pure black (a fictional 'Masar studio', ten services). Header: a large 600-weight headline left ('What the Masar studio makes.', about 76px, tight tracking, balanced) and two 48px pills right: 'All services' in white with black text, 'Start a project' in dark grey.\n\nGrid: five square tiles per row (three, then two, then one as the container narrows), 20px gaps. Each tile is black with a 1px rgba(255,255,255,0.1) border and a 14px radius, a centred 44px solid white glyph, and a two-line grey label (#8b8b8f, about 22px, max 12ch) under it.\n\nHover: a canvas behind the content draws a grid of 1.8px dots every 10px. Each dot twinkles on its own phase and speed (brightness cubed so most sit dim and a few flare), about a third tinted blue and the rest cool grey, and dots near the pointer are lifted by a Gaussian of 140px. The field fades in and out over about 250ms. A lit border arc: a conic gradient (transparent, blue, near-white, blue, transparent over 120°) is shown only in a 1.5px ring using a content-box mask, aimed at the angle from the tile centre to the pointer, eased round the shorter way; a 3px blurred copy gives it glow, so it pools at the edge or corner nearest the pointer. Label and icon go to white; the icon lifts 2px. Only the hovered tile animates.",
  interaction: "Each tile is a link. Pointer position steers the dots and the arc. Keyboard focus switches the tile on with the arc resting on the bottom-right corner.",
  animation: "Dots twinkle and the arc follows the pointer while a tile is hovered; everything stops when it is left. Reduced motion shows a still dot field and a fixed arc.",
  a11y: "Tiles are links with visible text; the dot canvas and the arc are aria-hidden. Focus uses the same lit state as hover, so it is clearly visible.",
  responsive: "Five, three, then two columns by container width (one below 16rem); tile padding and icon size step down on small screens.",
  touchFallback: "A tap lights the tile at the touch point before following the link.",
  variants: [
    { id: "dark", label: "Dark", prompt: "Palette for this theme (Dark): --sigt-beam #3b82f6; --sigt-beam-hot #cfe0ff; --sigt-bg #000000; --sigt-edge rgb(255 255 255 / 0.1); --sigt-focus #60a5fa; --sigt-icon #f4f4f5; --sigt-ink #ffffff; --sigt-muted #8b8b8f; --sigt-pill #ffffff; --sigt-pill-ink #0a0a0a; --sigt-pill2 #1d1d20; --sigt-pill2-ink #f4f4f5; --sigt-tile #000000. Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"dark\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
    { id: "light", label: "Light", prompt: "Palette for this theme (Light): --sigt-beam #2563eb; --sigt-beam-hot #1d4ed8; --sigt-bg #f4f4f2; --sigt-edge rgb(10 10 10 / 0.1); --sigt-focus #2563eb; --sigt-icon #111113; --sigt-ink #0a0a0a; --sigt-muted #6b6b70; --sigt-pill #0a0a0a; --sigt-pill-ink #ffffff; --sigt-pill2 #e4e4e1; --sigt-pill2-ink #0a0a0a; --sigt-tile #ffffff. Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"light\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
  ],
  preview: { bg: "#000000", mode: "fill", frame: [1400, 860] },
  isNew: true,
};
