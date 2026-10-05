import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "lightbox-compare",
  name: "Lightbox Compare",
  category: "pricing",
  description: "A plan comparison on a light table: the grid sits dim until you point at a plan, then a lamp slides beneath its column and marks what that plan adds over the one before.",
  tags: ["pricing", "comparison", "table", "plans", "features", "saas"],
  traits: ["hover", "click", "keyboard", "touch"],
  source: "original",
  files: ["LightboxCompare.tsx", "lightbox-compare.css"],
  dependencies: [],
  prompt:
    "Build a full plan comparison as a real table (caption, scoped column and row headers, one tbody per feature group: Build / Collaborate / Operate). The table sits on a panel like film on a light table: every plan column is dim (about 35% ink).\n\nBehind the table, one 'lamp' — a rounded, warm, softly glowing rectangle — is absolutely positioned to the measured left and width of the lit plan's column header, and slides between columns (left/width, 480ms expo-out). The lit column's header and cells come up to full ink. The lit plan is whichever column the pointer is over or whose button has focus, falling back to the selected plan, so the lamp rests on your choice when you look away.\n\nIn the lit column, every feature the plan adds over the plan to its left (included where it wasn't, or a bigger value) gets a small mono 'New in Team' tag in the accent colour, fading in. Each header has the plan name in mono caps, a serif price, a note and a 'Choose' button (the plan name is in its accessible label) (aria-pressed; the chosen one reads 'Selected' and is filled).\n\nUnder 680px the table is replaced by a plan radiogroup and one glowing sheet for the chosen plan: its features grouped, with the same 'New in' tags and unavailable lines dimmed, and a full-width 'Choose' button.",
  interaction: "Point at or tab to a plan to light its column; choose a plan to keep the lamp on it. On phones, switch plans with the tabs.",
  animation: "Lamp slides 480ms; columns brighten 300ms; 'New in' tags fade in 420ms; the phone sheet rises 420ms when the plan changes.",
  a11y: "A semantic table with caption, scope and grouped rows; ticks and dashes have text alternatives. Focusing a plan's button lights it exactly as hovering does. The narrow layout replaces the table instead of duplicating it for assistive tech. Reduced motion moves the lamp instantly.",
  responsive: "Fixed table layout down to 680px of container width, then one plan at a time.",
  variants: [
    { id: "paper", label: "Paper", prompt: "Palette for this theme (Paper): --lb-accent #b4541f; --lb-dim rgb(27 26 23 / 0.38); --lb-film rgb(255 255 255 / 0.35); --lb-focus #2f5fd0; --lb-glow rgb(255 236 190 / 0.9); --lb-ink #1b1a17; --lb-light #fffdf6; --lb-line rgb(27 26 23 / 0.08); --lb-muted #6f6a62; --lb-panel #e9e6df. Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"paper\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
    { id: "night", label: "Night", prompt: "Palette for this theme (Night): --lb-accent #f0b37a; --lb-dim rgb(239 232 220 / 0.32); --lb-film rgb(255 255 255 / 0.02); --lb-focus #b9cce4; --lb-glow rgb(185 204 228 / 0.22); --lb-ink #efe8dc; --lb-light #24222a; --lb-line rgb(239 232 220 / 0.07); --lb-muted #9c96a1; --lb-panel #141318. Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"night\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
  ],
  preview: { bg: "#f4f2ed", mode: "fill", height: 640 },
};
