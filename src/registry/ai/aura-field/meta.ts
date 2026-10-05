import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "aura-field",
  name: "Aura Field",
  category: "ai",
  description: "A writing field where colour only exists while the AI is touching your text: the edge becomes a turning band of light and the words are rewritten in place, one by one, out of a soft blur.",
  tags: ["ai", "writing-tools", "textarea", "glow", "conic-gradient", "rewrite"],
  traits: ["click", "keyboard", "ambient"],
  source: "original",
  files: ["AuraField.tsx", "aura-field.css"],
  dependencies: [],
  prompt: `Build an AI writing field in a clean, system-UI style (white or near-black surface, 20px radius, SF-like sans, neutral chips). At rest the field has only a hairline edge. Below it sit tool chips — Proofread, Friendlier, Concise — and an undo button.

Running a tool turns the edge into light: the frame is a 1.5px padded wrapper whose background becomes a conic gradient (orange → pink → violet → blue → teal → yellow) rotating via a registered @property --af-angle (3.2s linear), plus a blurred copy of the same gradient behind it as a soft outer bloom (55% opacity). The textarea goes quiet for 700ms while the aura turns, then the new text is streamed in place word by word (38ms apart), each word resolving from blur(6px) with a small iridescent dot as the caret. When finished the aura fades back to the hairline and the text becomes editable again. Undo restores the previous draft. The colour is never decorative at rest — it means 'the AI is working here'. Light and dark themes.`,
  interaction: "Type or edit the draft; choose a tool to rewrite it; undo to go back.",
  animation: "Conic band rotates 3.2s while busy and fades 600ms in/out; words resolve from blur over 420ms, 38ms apart.",
  a11y: "Labelled textarea (disabled while rewriting), a toolbar of real buttons, polite announcements for 'Rewriting…' and 'Rewrite applied'. Reduced motion stops the rotation and word animation; text is applied instantly.",
  responsive: "Fluid up to 34rem; tool chips wrap.",
  touchFallback: "Nothing depends on hover.",
  variants: [
    { id: "light", label: "Light", prompt: "Palette for this theme (Light): --af-bg #ffffff; --af-chip rgb(0 0 0 / 0.05); --af-ink #1c1c1e; --af-line rgb(0 0 0 / 0.1); --af-muted #6e6e73. Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"light\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
    { id: "dark", label: "Dark", prompt: "Palette for this theme (Dark): --af-bg #1c1c1e; --af-chip rgb(255 255 255 / 0.08); --af-ink #f5f5f7; --af-line rgb(255 255 255 / 0.12); --af-muted #98989d. Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"dark\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
  ],
  preview: { bg: "#f2f2f7", mode: "fill" },
  featured: true,
};
