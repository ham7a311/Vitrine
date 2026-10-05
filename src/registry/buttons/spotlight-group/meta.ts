import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "spotlight-group",
  name: "Spotlight Group",
  category: "buttons",
  description: "A toolbar of buttons that share one light: a soft glow follows the pointer across the whole group and catches the edges of whichever buttons are near, spilling over their neighbours.",
  tags: ["toolbar", "button group", "spotlight", "border", "glow", "toggle", "editor"],
  traits: ["cursor", "hover", "click", "keyboard"],
  source: "original",
  files: ["SpotlightGroup.tsx", "spotlight-group.css"],
  dependencies: [],
  prompt:
    "Build a rich-text formatting toolbar (Bold, Italic, Underline | Link, Quote, List | Code, Image) as square 40px icon buttons in a 16px-radius tray, with thin dividers between groups. On pointermove over the tray, write the pointer's position in tray coordinates to --x/--y.\n\nGive each button a 1px border layer (a ::before with padding 1px and a content-box mask composited with exclude) whose background is radial-gradient(110px circle at calc(--x − --bx) calc(--y − --by), lilac, frost, transparent) over a faint resting rim, where --bx/--by are that button's offsetLeft/offsetTop measured with a ResizeObserver. Every button positions the same light in the same place, so one spot of light moves across the group, lighting the nearest edges brightest and spilling onto the neighbours. A matching soft wash inside each button and a larger, dimmer light on the tray's own border complete it. The light fades in on enter and out on leave.\n\nToggles use aria-pressed and keep a soft lilac-to-frost gradient fill with a tinted ring; actions (Link, Image) don't stay pressed. Icons are 1.7px stroke SVGs.",
  interaction: "Move across the toolbar and the light follows you over every button's edge. Click a toggle to switch it; actions fire once.",
  animation: "The light tracks the pointer directly; it fades in and out over 300ms.",
  a11y: "A labelled role=toolbar of real buttons with one tab stop and arrow-key, Home and End navigation, each named by aria-label (with a matching title tooltip); toggles expose aria-pressed. Focus-visible draws an outline. The light is decorative and needs no motion setting, since it only moves with the pointer.",
  responsive: "Wraps onto a second row on very narrow screens; offsets are re-measured on resize.",
  touchFallback: "Without hover the edges rest at their faint rim; pressed toggles still show their fill.",
  variants: [
    { id: "night", label: "Night", prompt: "Palette for this theme (Night): --spg-bg #121015; --spg-btn #19171d; --spg-ink #c9c2b6; --spg-ink-hot #ffffff; --spg-light #c8b9ea; --spg-light-2 #b9cce4; --spg-rim rgb(239 232 220 / 0.08); --spg-wash rgb(200 185 234 / 0.16). Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"night\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
    { id: "paper", label: "Paper", prompt: "Palette for this theme (Paper): --spg-bg #fffdf8; --spg-btn #f6f3ec; --spg-ink #4a463f; --spg-ink-hot #1b1a17; --spg-light #7c5cc4; --spg-light-2 #2f5fd0; --spg-rim rgb(27 26 23 / 0.08); --spg-wash rgb(124 92 196 / 0.12). Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"paper\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
  ],
  preview: { bg: "#0b0a0d", mode: "fill" },
};
