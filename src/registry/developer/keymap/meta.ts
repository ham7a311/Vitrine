import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "keymap",
  name: "Keymap",
  category: "developer",
  description: "An app's keyboard shortcuts drawn on a keyboard. Pick or physically hold modifiers to see what every key does in that layer, search for an action to find its keys, and spot clashes where two actions claim the same combination. A list view carries the same information as a table.",
  tags: ["shortcuts", "keyboard", "hotkeys", "settings", "documentation", "developer"],
  traits: ["keyboard", "click", "hover"],
  source: "original",
  files: ["Keymap.tsx", "keymap.css"],
  dependencies: [],
  prompt:
    "Build a shortcut reference for an editor ('Qalam shortcuts') shown on a drawn ANSI keyboard, with shortcuts given as data like { keys: 'Mod+Shift+K', action: 'Insert link', group: 'Insert' } where Mod is ⌘ on a Mac and Ctrl elsewhere.\n\nPanel: a 14px-radius light grey panel in Geist. A header row holds the title, a segmented group of modifier toggles (⌘ ⇧ ⌥ on Mac; Ctrl, Shift, Alt elsewhere; the active ones filled dark), a search field 'Find an action', and a Keyboard/List switch.\n\nKeyboard: five rows of keys in a slightly darker tray, sized in key units (Backspace 2u, Tab 1.5u, Caps 1.75u, Enter 2.25u, Shifts 2.25u and 2.75u, a 6.25u space bar, then ⌃ ⌥ ⌘ and arrow keys). Keys are 48px tall, 6px radius, off-white with a darker 3px bottom edge so they read as caps; the legend sits top-left. In the current modifier layer, every key that has an action takes its group's colour as a tint and edge (Text blue, Insert orange, Blocks green, Navigate violet, Edit pink) and shows the action's name in tiny bold type along its bottom. Modifier keys in the drawing light up dark when active and can be clicked. If two actions share the same combination the key turns red and says 'Conflict'. Search outlines the matching keys with a pulsing accent outline and lists the matches ('⌘K · Command menu · Navigate'); clicking a result switches to its layer.\n\nUnder the keyboard a detail card shows every binding of the key being pointed at or focused, across all layers ('⌘K Insert link · Insert', '⌘K Command menu · Conflict'), or a hint when nothing is selected; a legend of group colours and the conflict count closes the panel. The List view is a table per group: action and its keys, with conflicts marked in words.",
  interaction:
    "Toggle modifiers with the header buttons or the drawn modifier keys, or hold the real modifier keys while the component has focus to preview that layer. The keyboard is one tab stop with arrow-key movement between keys (up and down keep the horizontal position). Pointing at or focusing a key fills the detail card.",
  animation: "Keys tint over 140ms when the layer changes; search matches pulse their outline every 900ms; keys press down 1px when clicked. Reduced motion removes the pulse and tints.",
  a11y:
    "Every drawn key is a button named with its key and, when bound, its actions ('K: Insert link, Command menu (conflict)'); modifier keys and toggles expose aria-pressed. The detail card is a polite live region. The List view presents everything as captioned tables for anyone who doesn't want the drawing.",
  responsive: "The keyboard keeps a 40rem minimum width and scrolls horizontally inside its tray on narrow screens; the header wraps.",
  touchFallback: "Tap modifier toggles to change layer and tap keys to see their bindings; the List view needs no keyboard at all.",
  variants: [
    { id: "light", label: "Light", prompt: "Palette for this theme (Light): --kmap-accent #1f5fd6; --kmap-bg #f2f2ef; --kmap-card #ffffff; --kmap-clash #c4321c; --kmap-g1 #1f5fd6; --kmap-g2 #b85a12; --kmap-g3 #1f7a55; --kmap-g4 #8a46c2; --kmap-g5 #a1306a; --kmap-ink #1b1c1e; --kmap-key #fbfbf9; --kmap-key-edge #cfcfca; --kmap-line rgb(27 28 30 / 0.12); --kmap-muted #6c6f75. Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"light\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
    { id: "dark", label: "Dark", prompt: "Palette for this theme (Dark): --kmap-accent #86aaff; --kmap-bg #131416; --kmap-card #1b1c1f; --kmap-clash #ff8a73; --kmap-g1 #86aaff; --kmap-g2 #f0a35e; --kmap-g3 #6fd1a2; --kmap-g4 #c49bff; --kmap-g5 #f28dbd; --kmap-ink #ebebe8; --kmap-key #24262a; --kmap-key-edge #0c0d0e; --kmap-line rgb(255 255 255 / 0.1); --kmap-muted #9a9ea6. Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"dark\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
  ],
  preview: { bg: "#e6e6e2", mode: "center", frame: [1100, 640] },
  isNew: true,
};
