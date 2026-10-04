import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "search-lens",
  name: "Search Lens",
  category: "data",
  description: "Search that filters the page you're on, in place. Matches stay exactly where they were and everything else folds to a hairline at its own position, so the page becomes a map of where the matches sit. Escape unfolds it again.",
  tags: ["search", "filter", "combobox", "facets", "operators", "keyboard", "find"],
  traits: ["keyboard", "click", "touch"],
  source: "original",
  files: ["SearchLens.tsx", "search-lens.css"],
  dependencies: [],
  prompt: `Build a search that works as a lens over the page's own information instead of a floating command menu.

The page is a project view with sectioned lists (Issues, Docs, People). Its header holds the title and a compact search field with a '/' hint.

Focusing the field makes the title give way (max-width to 0, fade) while the field grows to the full header width (flex-basis, 380ms). Once there is a query, the typed text is set larger and heavier: the query is the page's heading now.

As you type, the page filters in place:
- Matching rows stay exactly where they were, with the matched substrings marked.
- Every other row folds (grid-template-rows 1fr → 0fr) down to a 5px slot showing a 1px hairline, so the list becomes a density map of where the matches sit in the whole. Nothing reorders and nothing moves except what didn't match.
- Section headers switch to 'Issues 3 / 8'.

Under the field, facet chips fold open: one per section, with match counts, that can be toggled off. Typing a known operator ('owner:', 'status:', 'is:') swaps the facets for value suggestions (Tab accepts), and 'key:value ' followed by a space becomes an inline chip in the field; Backspace on an empty field removes the last chip.

A remote group ('Elsewhere in GUtech Studio') loads after a short debounce with a 1px scanning line, then lists its hits with their place. The empty state names the query and offers Clear search / Remove filters.

Keyboard: '/' focuses from anywhere. ↑/↓ moves an active match in place (aria-activedescendant, scrolled into view, a 2px accent edge). Enter unfolds that row's detail inline. Escape clears and unfolds the page, and a second Escape leaves. Paper and Night themes.`,
  interaction: "Press / (or click the field), type 'deploy', add 'owner:hamza ', then ↑↓ and Enter. Esc restores the page.",
  animation: "Header hand-over 360–380ms; rows fold to hairlines in 320ms; facets fold 320ms; the remote scanning line runs 1.1s.",
  a11y: "The field is a combobox controlling the page, which becomes a listbox of options while searching. aria-activedescendant tracks the active match, and hidden rows are aria-hidden. A polite live region reports the match count and remote progress. Chips have labelled remove buttons, and facets are toggle buttons with aria-pressed. Reduced motion removes the fold, header and scanning animations but keeps the hairline map.",
  responsive: "Fluid to 280px. Facets scroll horizontally and the header field shrinks to 9rem until focused.",
  touchFallback: "Tap the field; tap a facet or suggestion; tap a match to unfold it.",
  variants: [
    { id: "paper", label: "Paper" },
    { id: "night", label: "Night" },
  ],
  preview: { bg: "#f3f1ec", mode: "fill" },
};
