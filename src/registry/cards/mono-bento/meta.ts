import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "mono-bento",
  name: "Mono Bento",
  category: "cards",
  description: "A black-and-white editorial bento on a hairline grid: square corners, numbered tiles and no colour at all. A huge count-up figure over a baseline of dots, ninety days of uptime as dot columns, a type specimen stepping through its weights, keys that press themselves, a running changelog and a real switch. Pointing at a tile inverts it with a wipe that starts where you came in.",
  tags: ["bento", "grid", "features", "black and white", "monochrome", "editorial", "minimal", "invert", "dashboard"],
  traits: ["hover", "keyboard", "scroll"],
  source: "original",
  isNew: true,
  files: ["MonoBento.tsx", "mono-bento.css", "layout.ts", "mono.ts", "tiles.tsx"],
  dependencies: [],
  prompt:
    "Build a strictly black-and-white feature bento. Props: tiles [{id, title, body, visual, span {lg, md, sm} as [columns, rows], href}], kicker, title, lede, theme, rowHeight (232) and onNavigate.\n\nHeader: a mono uppercase running head over a 1px rule in the ink colour, with the tile range on the right ('(01—06)'); a very large title (up to 6rem, weight 500, line-height 0.94, −0.055em, 14ch); a muted lede.\n\nGrid: 4 columns at 900px and over, 2 from 560px, 1 below, measured with a ResizeObserver; spans clamp to the column count. The tiles share hairlines — 1px gap over a line-coloured grid background, with a 1px border round the whole grid — and have square corners and no shadows. Each tile shows its two-digit index in mono at the top left, the visual in the middle, and the title and a muted line at the bottom. A tile with a link stretches the link over the whole tile.\n\nThe inversion: every tile holds a white layer in mix-blend-mode: difference above its content, clipped to circle(0%) at the point where the pointer entered (stored as percentages on the tile on pointerenter and pointerleave). On hover it grows to circle(150%) over 560ms, so the tile turns inside out — white on black becomes black on white — from where you came in, and shrinks back towards where you left. Keyboard focus on anything inside does the same from the centre.\n\nVisuals:\n- A huge figure (up to 9.5rem, weight 600, −0.065em, tabular) that counts up with an ease-out cubic over 1.4s the first time it scrolls into view, compacted ('4.21M'), with the full value for screen readers, a mono caption, and a baseline of dot columns.\n- Ninety days of uptime as columns of three small blocks: clear days solid, degraded days with the top block hollow, down days all hollow. Pointing at a day shows its date and figure in a mono readout; otherwise it shows the period and the overall figure.\n- A specimen 'Aa' stepping through weights 400–700 every 1.6s with the active weight underlined.\n- Two keycaps (⌘ K) with a thick bottom border that press in turn on a 2.4s loop.\n- A changelog in mono tags that scrolls slowly upward on a loop (the list doubled, translateY −50%), faded top and bottom, paused on hover.\n- A square switch (role switch) with a hatched track when on.\n\nTwo themes: white on black, and black on white. Reduced motion: no wipe animation, no count-up (the final figure), no loops.",
  interaction: "Point at a tile and it inverts from where the pointer came in. Focus inside a tile inverts it from the centre. Point at a day to read its uptime; flip the switch.",
  animation: "Inversion wipe 560ms; count-up 1.4s on first view; specimen steps every 1.6s; keys press on a 2.4s loop; the changelog scrolls over 22s and pauses on hover. Reduced motion removes all of it.",
  a11y: "A labelled section; each tile is an article labelled by its title. The count-up figure is hidden from screen readers, which get the final value. The uptime strip is an image with a summary and a live readout. The switch is a real switch. Links are real links stretched over their tile with a visible focus ring.",
  responsive: "Four, two or one columns from the grid's own width; spans clamp to fit.",
  touchFallback: "Without hover the tiles stay as they are; tap targets (links, switch) work normally.",
  variants: [
    { id: "night", label: "Night", prompt: "Palette for this theme (Night): --mb-ground #000; --mb-ink #fff; --mb-line rgba(255, 255, 255, 0.2); --mb-muted #8f8f8f. Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"night\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
    { id: "paper", label: "Paper", prompt: "Palette for this theme (Paper): --mb-ground #fff; --mb-ink #000; --mb-line rgba(0, 0, 0, 0.18); --mb-muted #666. Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"paper\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
  ],
  preview: { bg: "#000000", mode: "fill", frame: [1440, 1100] },
};
