import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "search-hits",
  name: "Search Hits",
  category: "highlights",
  description: "Find-in-page done properly: every match is tinted as you type — ignoring case and accents, so \"cafe\" finds \"Café\" — and a solid marker glides from hit to hit as you step through them, scrolling each into view, with a running count.",
  tags: ["highlight", "search", "find", "matches", "mark", "keyboard", "accent-insensitive"],
  traits: ["keyboard", "click"],
  source: "original",
  files: ["SearchHits.tsx", "search.ts", "search-hits.css"],
  dependencies: [],
  prompt: `Build a find-in-article card: a search bar over a scrolling article (four Newsreader paragraphs about the cafés on one street, starting with the query "cafe"), where matches are tinted and a solid marker glides between them.

Matching: text and query are folded — NFD-normalised, combining marks removed, lower-cased — while keeping a map from every folded character back to its original offset, so "cafe" finds "café", "Cafe" and "CAFÉ" and each match is shown on the original letters. Matches are non-overlapping, found per paragraph and numbered in reading order; an empty query matches nothing.

Bar: a search icon, a borderless input (aria-label, placeholder "Find…", autocomplete and spellcheck off), a live count in 12px tabular mono ("2 of 5", "No matches", or nothing for an empty query; aria-live polite), and previous/next buttons (30px, chevrons, disabled with no matches). Enter goes to the next match, Shift+Enter to the previous, both wrapping round; Escape clears the query. A 2px focus underline shows while the bar has focus.

Document: max-height 360px, scrolling inside the card, focusable. Every match is a <mark> with a pale yellow tint (rounded 3px). The active match drops its tint and takes dark text, and a solid yellow marker sits behind it: a single absolutely positioned element in the document's own scroll space (so it scrolls with the text), placed on the active match's first line box and moved with a springy transition (transform 420ms cubic-bezier(.3,1.25,.4,1), size 300ms) — it glides from hit to hit rather than jumping. If the active match is outside the visible area, the document scrolls it to about a third of the way down (smoothly, or instantly with reduced motion). Typing resets to the first match.`,
  interaction: "Type to find; Enter / Shift+Enter or the arrows step through matches; Escape clears.",
  animation: "The marker glides between matches (420ms spring); the document scrolls smoothly to off-screen matches.",
  a11y: "A labelled search field in a search landmark; the count is announced politely; matches are <mark> elements; the step buttons are labelled and disabled when there is nothing to step to. Active text is dark on yellow, and tinted matches keep the paragraph's contrast.",
  responsive: "The card fills its column; the bar keeps its controls on one line and the field shrinks first.",
  variants: [
    { id: "paper", label: "Paper", prompt: "Palette for this theme (Paper): --field #ffffff; --focus #2457d6; --glide #ffcc1f; --hit rgb(255 204 0 / 0.32); --ink #1a191c; --line rgb(26 25 28 / 0.12); --muted rgb(26 25 28 / 0.55); --on-glide #1a1404; --page #fbfaf7. Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"paper\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
    { id: "night", label: "Night", prompt: "Palette for this theme (Night): --field #1d1d21; --focus #8fb2ff; --glide #ffd23f; --hit rgb(255 204 0 / 0.2); --ink #ecebe7; --line rgb(236 235 231 / 0.12); --muted rgb(236 235 231 / 0.55); --on-glide #1a1404; --page #151518. Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"night\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
  ],
  preview: { bg: "#efece5", mode: "fill" },
  isNew: true,
};
