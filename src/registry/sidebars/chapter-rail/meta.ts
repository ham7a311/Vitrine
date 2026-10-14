import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "chapter-rail",
  name: "Chapter Rail",
  category: "sidebars",
  description: "A docs sidebar that knows where you are: the page you're reading lights up and a rail beside the pages fills as you scroll, so every chapter shows how far through it you are, with a ring round its icon. A filter narrows the pages and highlights the matches, and the whole thing folds into an icon rail that keeps the rings.",
  tags: ["sidebar", "docs", "navigation", "scrollspy", "table of contents", "progress", "filter", "collapsible", "reading"],
  traits: ["scroll", "click", "keyboard"],
  source: "original",
  isNew: true,
  files: ["ChapterRail.tsx", "chapter-rail.css", "spy.ts"],
  dependencies: [],
  prompt:
    "Build a documentation sidebar with reading progress. Props: name, version, chapters [{id, title, icon, sections [{id, title}]}], scrollRoot (a ref to the scrolling element; the window if absent), line (how far down the viewport counts as reading, 0.28), defaultCollapsed, theme and className.\n\nScroll-spy (pure functions): given every section's top and the reading position (scroll + viewport height × line), the section being read is the last one whose top is at or above it, with how far through it you are (0–1) up to the next section's top. Each section's piece of the rail is full if read, partly full if current, empty otherwise; a chapter's progress is the mean of its pieces. At the very bottom of the scroll, everything counts as read. Measure the real positions on scroll (throttled to one rAF) and resize.\n\nLayout: a 272px nav (aria-label \"Tidewater documentation\") with a brand row — a letter mark, the name and a version chip — and a fold button (aria-expanded) that collapses it to a 64px icon rail over 260ms. A filter field with a / shortcut hint (pressing / anywhere focuses it; Escape clears it). Then the chapters: each a button with its icon inside a 22px progress ring (a stroke-dashoffset circle), its title, the percentage read or a tick, and a chevron that turns when open. Pages expand under it by animating grid-template-rows from 0fr to 1fr. Each page link has its own 2px rail segment on the left that fills from the top with its read amount; read pages are brighter, and the current one is highlighted in the accent with aria-current=\"location\". Opening follows the reader: reaching a new chapter expands it.\n\nFiltering shows only matching pages (or all of a chapter whose title matches), expands those chapters and wraps matches in <mark>; nothing matching shows a status line. Clicking a page scrolls to its section smoothly (instantly with reduced motion) and updates the hash. Collapsed, each chapter is an icon with its ring; it has a label and tooltip with its title and percentage, and clicking scrolls to its first page.\n\nTwo themes, night and paper.",
  interaction: "Scroll the page and the rail follows; click a page to jump to it; type to filter (press / to focus the filter); fold the sidebar into an icon rail.",
  animation: "Rails and rings fill as you scroll; chapters open by animating their height (240ms); folding takes 260ms. Reduced motion removes the transitions and smooth scrolling.",
  a11y: "A labelled nav with real links and aria-current on the page being read; chapter toggles use aria-expanded; the filter is labelled and the empty state is a status. Collapsed chapters have names that include their progress.",
  responsive: "Folds into a 64px icon rail; the demo starts folded on narrow screens.",
  touchFallback: "Everything works by tap; progress follows touch scrolling too.",
  variants: [
    { id: "night", label: "Night", prompt: "Palette for this theme (Night): --cr-accent #8fb5ff; --cr-bg #0f1013; --cr-faint #5d616d; --cr-here rgba(143, 181, 255, 0.12); --cr-hover rgba(255, 255, 255, 0.05); --cr-ink #eceef2; --cr-line rgba(255, 255, 255, 0.07); --cr-mark rgba(255, 214, 102, 0.28); --cr-muted #8f93a0; --cr-track rgba(255, 255, 255, 0.09). Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"night\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
    { id: "paper", label: "Paper", prompt: "Palette for this theme (Paper): --cr-accent #2459c4; --cr-bg #fbfaf7; --cr-faint #8a8d96; --cr-here rgba(36, 89, 196, 0.08); --cr-hover rgba(20, 22, 28, 0.04); --cr-ink #18191d; --cr-line rgba(20, 22, 28, 0.08); --cr-mark rgba(255, 196, 0, 0.35); --cr-muted #5c5f68; --cr-track rgba(20, 22, 28, 0.1). Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"paper\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
  ],
  preview: { bg: "#0f1013", mode: "fill", height: 560 },
};
