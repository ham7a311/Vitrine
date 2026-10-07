import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "glyph-halo-composer",
  name: "Glyph Halo Composer",
  category: "ai",
  description: "A dark prompt box lit from both ends: a warm glow bleeds from its left, a cold one from its right, falling across a field of drifting characters, with attach, a reply-style menu, a thinking-mode menu, voice and send.",
  tags: ["ai", "chat", "composer", "prompt", "input", "menu", "dropdown", "glow", "glyph", "voice"],
  traits: ["canvas", "ambient", "keyboard"],
  source: "original",
  files: ["GlyphHaloComposer.tsx", "composer.ts", "glyph-halo-composer.css"],
  dependencies: [],
  prompt: `Build an AI prompt box (React + CSS + canvas 2D, no libraries) that glows from both ends over a field of drifting characters.

Scale everything in em from a 20px root; the box is min(100%, 44.8em) wide. The wrapper has padding 6.5em top and 8.5em bottom so the light and menus have room, and is a size container: below 640px the box drops to 15px, below 420px to 13px, the chips drop their chevrons and the voice chip loses its word; the toolbar may wrap as a last resort.

Box: background #0a0b0e, radius 1.4em, padding 1.35em 0.8em 0.85em, a 0.075em rim drawn as a border-box gradient from the warm glow colour (left) through pink and violet to the cold glow colour (right), plus a masked rim overlay that makes the top-left corner and the bottom-right corner burn brighter. Behind the box, two blurred radial glows: the warm one centred over the top-left corner (10.5 × 6.4em pushed 2.4em out, blur 0.9em) and the cold one over the bottom-right corner (12.5 × 6.6em pushed 2.6em out), plus matching coloured box-shadows thrown off each end, breathing slowly out of phase.

Glyph field: a canvas filling the wrapper, DPR-capped at 2, drawing monospace characters (A–Z, digits, σ π μ λ β Ω ∗ @ & + .) at 0.72em on a 1.35em × 1.6em grid. Each cell's strength is the larger of two soft ellipses, one round each glowing corner (about 0.3–0.33 of the box width wide and 1.15–1.2 box heights tall); cells under 6% are skipped and about a fifth are left empty, the rest drawn at 62% of their strength in the matching glow colour. About 3% of the cells re-roll every 85ms; it pauses offscreen and in hidden tabs, and reduced motion draws it once.

Content: an auto-growing textarea (one to eight lines) with placeholder "Ask anything…" in #8b8d97; Enter sends, Shift+Enter breaks a line, IME composition is respected. Toolbar (gap 0.7em): a round + button (opens a file picker; attached files appear as removable chips), a reply-style chip (feather icon, "Normal", chevron) and a thinking-mode chip (bulb icon, "DeepThink", chevron), then on the right a "Voice" chip with a waveform icon (a toggle; the waveform pulses while on) and a 2.4em circular send button with a 135° pink → violet → blue gradient and a filled white plane. Chips are 2.3em pills, #18191e with a #2b2c34 hairline and #b8bac3 text, lighter on hover.

Menus: each chip opens a menu 0.5em below it (min-width 12.6em, #15161b, hairline, 0.75em radius, deep shadow) of menuitemradio rows (2.4em, icon + label; the active row filled #23242c; the chosen one in white, weight 500). The thinking modes are Quick answer (bolt), Balanced (scale), DeepThink (bulb) and Research (flask); the reply styles are Normal, Concise, Explanatory and Formal. Arrow keys move and wrap, Home/End jump, Enter or click chooses, Escape closes and returns focus to the chip, Tab or a click outside closes. The chip shows the choice. onSubmit receives { text, style, mode, voice, files }. Props: placeholder, styles, modes, defaultStyle, defaultMode, glows [warm, cold], onSubmit.`,
  interaction: "Type and press Enter to send (Shift+Enter for a new line). The + attaches files; the two chips open menus to choose a reply style and a thinking mode; Voice toggles listening. Menus work fully from the keyboard.",
  animation: "Glyphs re-roll every 85ms; the two glows breathe on a 5s loop out of phase; menus pop in over 0.16s; the voice waveform pulses while listening; chevrons flip when open.",
  a11y: "The textarea has a label; chips expose aria-haspopup, aria-expanded and their current choice; menus use role menu with menuitemradio rows and roving focus; Escape returns focus. Voice is a toggle with aria-pressed; send is disabled until there is text. The canvas and glows are aria-hidden. Reduced motion stops the glyphs, glows and pulses.",
  responsive: "The box is min(100%, 44.8em); a container query shrinks the whole thing at 640px and 420px, where the voice chip becomes an icon. Menus stay anchored under their chips.",
  touchFallback: "Everything is a tap target; menus close on a tap outside, and the glyph field keeps drifting without a pointer.",
  isNew: true,
  variants: [
    { id: "ember", label: "Ember", prompt: "Glows #ff6a3d (warm coral, left) and #3d6bff (electric blue, right) on a #101115 page." },
    { id: "aurora", label: "Aurora", prompt: "Glows #18d6a3 (mint, left) and #8a5cff (violet, right) on a #101115 page." },
    { id: "dawn", label: "Dawn", prompt: "Glows #ff4f8b (rose, left) and #ffb23d (amber, right) on a #101115 page." },
  ],
  preview: { bg: "#101115", mode: "fill", height: 620 },
};
