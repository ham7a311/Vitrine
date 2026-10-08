import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "source-sweep",
  name: "Source Sweep",
  category: "ai",
  description: "An assistant searching several places in turn — Google, Notion, Reddit, GitHub, Wikipedia — shown as a row of their marks. Three dots circle the one being searched, each settles to a count or says it found nothing, and the line ends as a summary that opens the results grouped by source.",
  tags: ["ai", "search", "sources", "tool use", "status", "assistant", "agent", "google", "notion", "reddit", "github", "wikipedia", "loading"],
  traits: ["click", "keyboard", "ambient"],
  source: "original",
  isNew: true,
  files: ["SourceSweep.tsx", "sources.ts", "source-sweep.css"],
  dependencies: [],
  prompt:
    "Build an AI 'searching several sources' indicator. Props: a query and a list of runs, each { id: google | notion | reddit | github | wikipedia, status: waiting | searching | done, found, results[] } — the caller drives the order. Above it: 'Searching for' + the query (query in the ink colour, weight 500).\n\nEach source is a 44px tile (radius 14px, a 1px inset hairline) holding its 20px mark (Simple Icons paths, CC0; brand colour where it reads on the theme, otherwise the ink colour) with its name under it in 12.5px. Waiting: the mark greyscale at 40%. Searching: the tile scales to 1.08 and three 5px dots of falling size and opacity circle it on a ring 7px outside the tile, 1.15s a turn. Done: the tile springs (0.92 and back) and a count badge pops into its top-right corner; if it found nothing the mark stays grey and the name is struck through, with no badge.\n\nWhile running, a line under the row reads 'Looking in Reddit · 2 of 5' (the source name fades in as it changes). When all are done it becomes a button, 'Searched 5 sources · 23 results', with a chevron that turns; it opens the results grouped by source — a small 26px mark, the source name and its count (or 'nothing found'), then each result's title and a muted meta line.\n\nThe row wraps; under a 360px container the tiles shrink to 38px. A polite status region says what's being searched and the final summary; each tile's name carries its state for screen readers. The dots pause off screen and in hidden tabs; with reduced motion nothing moves and the dots hold still in an arc over the active source.",
  interaction: "Watch it search; when it's done, click the summary (or press Enter/Space) to open the results by source.",
  animation: "Orbit 1.15s per turn on the active source; tile spring 450ms and badge pop 400ms when a source lands; summary fade 300ms. Paused off screen. Reduced motion: no movement, dots held in an arc.",
  a11y: "A polite status region announces the source being searched and the final summary; each source's name includes its state; the summary is a button with aria-expanded and aria-controls.",
  responsive: "Sized by container query: the row of tiles wraps, and below 360px the tiles shrink and the result list loses its indent.",
  touchFallback: "The summary is a normal button.",
  variants: [
    { id: "dark", label: "Dark", prompt: "Palette for this theme (Dark): --srsw-dot #ececec; --srsw-faint #5a5a5a; --srsw-hover #1c1c1c; --srsw-ink #ececec; --srsw-line #2a2a2a; --srsw-muted #8c8c8c; --srsw-tile #1b1b1b. Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"dark\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
    { id: "light", label: "Light", prompt: "Palette for this theme (Light): --srsw-dot #1a1a1a; --srsw-faint #a3a3a3; --srsw-hover #f2f1ee; --srsw-ink #1a1a1a; --srsw-line #e0dfdb; --srsw-muted #6b6b6b; --srsw-tile #f3f2ef. Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"light\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
  ],
  preview: { bg: "#0b0b0b", mode: "fill", frame: [1200, 800] },
};
