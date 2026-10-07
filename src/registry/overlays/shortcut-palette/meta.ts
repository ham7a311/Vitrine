import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "shortcut-palette",
  name: "Shortcut Palette",
  category: "overlays",
  description: "A command palette that teaches: type a few letters, run the command, and if it has a keyboard shortcut a quiet line tells you once the action has happened. Fuzzy matching, grouped commands, and a single marker that glides to the active row.",
  tags: ["command palette", "command k", "cmd k", "search", "shortcuts", "keyboard", "combobox", "launcher", "spotlight"],
  traits: ["keyboard", "click"],
  source: "original",
  files: ["ShortcutPalette.tsx", "fuzzy.ts", "shortcut-palette.css"],
  dependencies: [],
  prompt: `Build a command palette whose design goal is that people stop needing it: it teaches the keyboard shortcut of every command they run through it.

Panel: a 36rem sheet, 12px radius, 1px ring, soft long shadow, a light scrim, placed near the top (min(14vh, 7rem)). A 54px borderless input with a mono "esc" kbd at its right, a 1px rule beneath, a scrolling list (max 20rem) and a muted footer "↑↓ move · ↵ run". Opening focuses the input and remembers the previously focused element; closing (140ms exit) restores it. Escape and a scrim click close. Tab is held so focus stays in the one control.

Matching: a pure subsequence matcher. Every typed character (spaces ignored) must appear in order in the label. Score: +9 for a word start, +6 plus a growing bonus for consecutive characters, minus 0.6 per skipped character, +20 when the label starts with the query, minus a little for long labels. Loose keywords also match (ranked 12 below a label match) without being shown. The matched characters of the label are drawn bold in the accent colour.

Listing: with no query it is a menu: commands under mono caps group headings in the order given. With a query it becomes one flat ranked list with each row's group tag in mono at the right. Rows are 40px with the label, and the shortcut as a row of small kbd chips on the right.

Selection: one marker element (a rounded wash) is positioned with transform: translateY to the active row's measured offsetTop and height, transitioning over 120ms, so it glides between rows; scroll the list only for keyboard moves, and let mouse movement set the active row.

Semantics: input role=combobox with aria-controls, aria-expanded, aria-autocomplete=list and aria-activedescendant; the list is a listbox with role=group sections and role=option rows; a status line announces the result count. ArrowUp and ArrowDown wrap, Enter runs.

Teaching: running a command closes the palette, calls onRun, then shows a dark pill centred at the foot of the screen for 3.6 seconds: 'Ran "Deploy to production"' and, if the command has keys, "Next time: ⇧ ⌘ D". It fades in, holds, fades out. ⌘K or Ctrl K toggles the palette, but only while focus is inside a given scope element (or on the window if asked), and it stops the event so it never fights the host page's own shortcut. contained positions inside the nearest positioned parent instead of portalling to the body. Paper and Night themes.`,
  interaction: "Click the demo, press ⌘K or Ctrl K, type “rol” or “ship”, then press Enter and read the line that appears.",
  animation: "Panel rises 6px and fades in 180ms (exit 140ms); the selection marker glides between rows in 120ms; the shortcut line fades in, holds, then fades out over 3.6s.",
  a11y: "A modal dialog containing a combobox bound to a listbox by aria-activedescendant, with grouped options and a live result count. Focus goes to the input on open and returns to the opener on close; Escape closes. Shortcut chips have an accessible name. Reduced motion removes the panel and marker movement.",
  responsive: "The panel is min(36rem, 100%) wide with a 16px gutter and its list scrolls within 52vh; long labels truncate.",
  touchFallback: "Open it from a visible button (the hotkey is optional); rows are 40px tall and tap to run.",
  variants: [
    { id: "paper", label: "Paper" },
    { id: "night", label: "Night" },
  ],
  preview: { bg: "#f6f5f1", mode: "fill", height: 620, frame: [800, 520] },
};
