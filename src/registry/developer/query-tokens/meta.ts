import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "query-tokens",
  name: "Query Tokens",
  category: "developer",
  description: "A filter bar that speaks a small syntax (status:open -label:docs updated:>2026-06 \"offline sync\") without giving up plain-text editing. Terms are highlighted in place, keys and values are suggested as you type, mistakes get a 'did you mean', and a row of readable chips says what the query means.",
  tags: ["search", "filter", "query", "syntax", "issues", "autocomplete", "developer"],
  traits: ["keyboard", "click"],
  source: "original",
  files: ["QueryTokens.tsx", "query-tokens.css", "query.ts"],
  dependencies: [],
  prompt:
    "Build a structured search bar for an issue list that keeps the query as editable text while showing its structure. Syntax: key:value terms, quoted values (label:\"needs review\"), negation with a leading minus (-label:docs), comparisons for dates and numbers (updated:>2026-08, priority:>=2) and bare words or quoted phrases for full-text search.\n\nThe bar is a 44px white field with a 10px radius, a search icon and a clear button; focus adds an accent border and a soft 3px accent ring. The text is a real input in 14px JetBrains Mono with transparent text over a pixel-aligned overlay that repeats the same characters: each recognised term sits on a light blue chip with its key in blue, negated terms on a light red chip with a red key, free text on a grey chip, and an unknown key or value has no chip and a wavy red underline. Chip backgrounds use a spread shadow, never padding, so the overlay never drifts from the caret.\n\nAs you type, a listbox under the bar suggests keys at the start of a term (status:, owner:, label:, with their labels muted on the right) and values after a colon (open, closed, draft); arrows move, Enter or Tab accepts, Escape closes. Under the bar, any problem reads 'No filter called “stauts”. Did you mean status:?' with the suggestion as a button (edit distance). Below that, every term becomes a readable pill: 'status is open', 'label is not docs', 'updated after 2026-08', 'contains “sync”', each with a × that removes that term from the text.",
  interaction:
    "Typing edits the text directly; the overlay and suggestions follow the caret. Accepting a suggestion replaces only the term under the caret. onChange(tokens, text) fires on every edit, and the exported matchesQuery(tokens, record, keys) applies the same rules (dates compare as prefixes, so >2026-08 means after August) for client-side filtering.",
  animation: "The suggestion list drops in 4px over 140ms; the focus ring fades over 140ms. Reduced motion removes both.",
  a11y:
    "The input is a combobox with aria-expanded, aria-controls and aria-activedescendant on a listbox of options. The overlay is aria-hidden; the readable pills are the accessible description of the query, and each remove button names its term. Problems are announced through a status region.",
  responsive: "The bar fills its container; long queries scroll horizontally with the overlay kept in step; pills wrap.",
  touchFallback: "Tap a suggestion to accept it; pills have their own remove buttons.",
  variants: [
    { id: "light", label: "Light" },
    { id: "dark", label: "Dark" },
  ],
  preview: { bg: "#eef0f3", mode: "fill", frame: [1000, 720] },
  isNew: true,
};
