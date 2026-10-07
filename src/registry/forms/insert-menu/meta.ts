import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "insert-menu",
  name: "Insert Menu",
  category: "forms",
  description: "A page of plain-text blocks where typing / opens a filterable menu of block types under the line; Enter turns the line into a heading, to-do, list, quote, callout or divider.",
  tags: ["editor", "slash command", "blocks", "combobox", "document", "notes"],
  traits: ["keyboard", "click"],
  source: "original",
  files: ["InsertMenu.tsx", "insert-menu.css"],
  dependencies: [],
  prompt:
    "Build a minimal block editor in a calm document style: white page, warm near-black ink #37352f, Inter 16px/1.5, no visible field chrome. Each block is a row with an optional 26px marker column and an auto-growing borderless textarea. Block types: text, Heading 1 (30px, 700), Heading 2 (24px, 600), to-do (a native checkbox; checked rows go faint and struck through), bulleted list (a • marker), quote (3px left rule), callout (a ✳ marker in orange on a warm grey #f7f6f3 panel with 4px corners) and divider (a 1px hairline). The focused block gets a barely-there warm tint; placeholders only show on the focused line ('Write, or press / to insert a block'), but headings always show theirs.\n\nTyping '/' at the start of a line or after a space opens a menu 4px under the line: 20rem wide, white, 8px radius, a three-layer soft shadow with a 1px hairline ring. A small grey group label ('Basic blocks', or 'Blocks matching “he”' while filtering), then options as 48px rows: a 40px bordered tile with a glyph (Aa, H1, H2, ☐, •, ❝, ✳, —), the name in 14px and a 12px grey hint beneath. The active row has a 8% ink background. Filter by name prefix, then word prefix, then keywords; show 'No blocks match. Press Esc to keep the text.' when empty. Choosing removes the '/query' text and converts the line, keeping the caret where the slash was; Divider inserts a rule and a fresh line below.",
  interaction:
    "Type / then filter; ↑/↓ move through options, Enter or Tab choose, Esc closes and keeps what you typed, and a space or moving the caret before the slash closes it too. Enter splits a block (lists and to-dos continue; Enter on an empty item ends the list), Backspace at the start turns a styled block back into text, removes a divider above, or joins the line onto the previous one, and ↑/↓ at a line's edge move between blocks. onChange receives the block array.",
  animation: "The menu fades in and drops 3px over 140ms; nothing else moves. Reduced motion removes the menu transition.",
  a11y:
    "Each textarea is a combobox with aria-expanded, aria-controls and aria-activedescendant pointing into a listbox of options with aria-selected, so focus never leaves the text. A polite live region announces how many block types match. To-dos use real checkboxes labelled 'Done'.",
  responsive: "The menu caps at the column width on narrow containers; textareas wrap and grow with their content at any width.",
  touchFallback: "Tap an option to choose it; options are 48px tall. Typing / on a touch keyboard opens the same menu.",
  variants: [
    { id: "light", label: "Light", prompt: "Light theme: page #ffffff, ink #37352f, muted #787774, faint #a5a29a, hover rgb(55 53 47 / 0.06), active option rgb(55 53 47 / 0.08), hairlines rgb(55 53 47 / 0.12), callout #f7f6f3, checkbox accent #2383e2, menu shadow 0 0 0 1px rgb(15 15 15 / 0.05), 0 3px 6px rgb(15 15 15 / 0.1), 0 9px 24px rgb(15 15 15 / 0.2)." },
    { id: "dark", label: "Dark", prompt: "Dark theme: page #191919, ink #e3e2e0, muted #9b9a97, faint #6f6e69, hover rgb(255 255 255 / 0.055), active option rgb(255 255 255 / 0.08), hairlines rgb(255 255 255 / 0.09), tiles and callout #252525, checkbox accent #529cca, deeper black menu shadow with a white 8% ring." },
  ],
  preview: { bg: "#ffffff", mode: "fill", frame: [900, 620] },
};
