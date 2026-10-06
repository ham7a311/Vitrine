import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "nearest-page",
  name: "Nearest Page",
  category: "feedback",
  description: "A 404 that does the looking for you: it ranks real pages by edit distance from the address that failed and shows the closest few with the differing characters marked on both sides, so a typo reads as a typo.",
  tags: ["404", "not found", "error page", "typo", "search", "routes", "levenshtein", "fallback"],
  traits: ["click", "keyboard"],
  source: "original",
  files: ["NearestPage.tsx", "nearest.ts", "nearest-page.css"],
  dependencies: [],
  prompt: `Build a not-found page that behaves like a helpful librarian instead of an apology.

Inputs: the path that failed ("/work/walley") and the list of real pages (path and title). Everything is computed from those two.

Ranking: normalise the path (lowercase, strip the query and hash, collapse slashes, drop a trailing slash). For each real page the score is the smaller of the Levenshtein distance between the full paths and the distance between their last segments plus 3, so a nearly right slug under the wrong section still surfaces. Keep pages scoring at most max(2, 25% of the longer path), best first, at most three; ties go to the shorter path. If nothing is close, say so and offer the first three pages as "Start here".

Showing the difference: build the whole Levenshtein table and trace it back to align the two strings. Characters of the asked path that have no partner in the match are shown struck through in the danger colour; characters of the match that you didn't type are underlined 2px in the accent. Show the asked path in mono at about 20px; then a ruled ordered list where each row is a mono number ("01", accent for the best), the match path in mono with its marks, the page title in a 20px serif, and "1 character off" in mono caps. Rows rise in with a 60ms stagger over 320ms.

Layout: mono caps eyebrow "404 · Not found", a serif headline ("That address doesn't exist.", clamp(2.25rem, 8cqi, 3.75rem)), the asked path, the list, and under it a labelled "Or search the site" input with a hairline rule; typing replaces the list with substring matches over titles and paths ("Nothing matches" when empty, aria-live polite). Rows are real links, or call onNavigate for client routing. Below 38rem each row stacks inside its grid. Paper and Night themes.`,
  interaction: "Pick a mistyped path in the demo and read what was struck and what was added; then try the search field.",
  animation: "Rows rise in over 320ms with a 60ms stagger; the search field rule darkens in 160ms.",
  a11y: "A main landmark with a single h1; the list is an ordered list labelled by its caption and announced politely as it changes. The differences are marked with strike-through and underline as well as colour. Reduced motion removes the rise.",
  responsive: "Container-based type; below 38rem each row stacks path, title and distance under the number.",
  touchFallback: "Every row is a full-width link with a generous hit area; the search box is a native input.",
  variants: [
    { id: "paper", label: "Paper", prompt: "Palette for this theme (Paper): --np-accent #2f6bff; --np-ink #1b1a17; --np-line rgb(27 26 23 / 0.14); --np-miss #b42318; --np-muted #6b6861. Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"paper\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
    { id: "night", label: "Night", prompt: "Palette for this theme (Night): --np-accent #7aa2ff; --np-ink #ececea; --np-line rgb(255 255 255 / 0.14); --np-miss #f0766e; --np-muted #8d8f95. Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"night\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
  ],
  preview: { bg: "#f6f5f1", mode: "scroll", height: 640 },
  isNew: true,
};
