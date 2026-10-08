import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "sieve",
  name: "Sieve",
  category: "data",
  description: "Faceted filtering that shows its work. Every option says how the results would change before you tick it, and whatever the filters remove drops into a perforated tray, grouped by the filter that set it aside, with 'Keep anyway' and 'Clear this filter' to bring things back.",
  tags: ["filter", "facets", "search", "catalogue", "commerce", "results", "empty state"],
  traits: ["click", "keyboard"],
  source: "original",
  files: ["Sieve.tsx", "sieve.css", "facets.ts"],
  dependencies: [],
  prompt:
    "Build a faceted product filter that answers 'why can't I find it?'. The idea is a sieve: what the filters remove isn't gone, it falls into a tray under the results where you can see which filter took it.\n\nSurface: a 14px-radius panel in kraft-paper tones (warm beige background, off-white cards, dark brown ink, a deep green accent), Hanken Grotesk. From 48rem a 13.5rem facet column sits left of the results; below that the facets collapse behind a full-width 'Filters (3)' disclosure button.\n\nFacets: small uppercase letter-spaced legends ('TYPE', 'MATERIAL', 'PRICE', 'AVAILABILITY') over rows of checkboxes. Options within a facet are alternatives (OR) and facets narrow each other (AND). On the right of every option is a signed preview of what ticking or unticking it would do to the result count right now: '+12' in green, '−9' in rust, '±0' muted; options that would leave nothing are greyed but still selectable. Ticked rows sit on a card-coloured background in semibold. A 'Clear all filters' link appears when anything is active.\n\nResults: '18 of 48 products' with the number large, then a grid of small catalogue cards (auto-fill, 150px minimum). Below the grid sits the tray: a darker kraft drawer with a small block of punched holes, 'Set aside 30' with the count in a dark pill, and 'See what the filters removed'. Opened, its body has a punched-hole pattern and one white group per active facet, 'Not Pen or Notebook · Type', each with a 'Clear type filter' link and a row per removed item: its name, a muted note when another filter also removed it ('also price'), and a 'Keep anyway' button. A kept item returns to the results with a dashed accent border, a 'Kept by you' label and a Release button.",
  interaction:
    "Ticking applies immediately. Counts preview the exact result of toggling that one option given every other filter. Keep anyway pins an item into the results regardless of filters; Release returns it to the filters. Clearing a facet from the tray restores every item it removed. onChange(filters, visible) reports each change.",
  animation:
    "Items removed by a change shrink and drop 40px toward the tray while fading, over 360ms, and the tray's count pill pops; items that come back scale in from 96% over 260ms. Option rows tint over 140ms. Reduced motion or motion={false} removes all of it.",
  a11y:
    "Facets are fieldsets with legends and native checkboxes; each option's preview is spoken ('adds 12', 'removes 9'). Results and the new count are announced in a polite live region ('Showing 18 of 48. 30 set aside.'). The tray and the mobile filter panel are disclosure buttons with aria-expanded; every Keep and Release button names its item.",
  responsive: "Facets sit beside results from 48rem and behind a disclosure button below it. The result grid reflows by width; under 30rem the tray drops its secondary notes.",
  touchFallback: "Every control is a tap target; nothing depends on hover.",
  variants: [
    { id: "light", label: "Light", prompt: "Palette for this theme (Light): --sieve-accent #2f5d50; --sieve-accent-ink #ffffff; --sieve-bg #efe7d8; --sieve-card #fbf7ef; --sieve-down #8a4b2a; --sieve-hole rgb(60 45 25 / 0.28); --sieve-ink #2a241c; --sieve-line rgb(42 36 28 / 0.14); --sieve-muted #6c6252; --sieve-tray #e0d3b9; --sieve-up #2f6b3c. Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"light\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
    { id: "dark", label: "Dark", prompt: "Palette for this theme (Dark): --sieve-accent #8fd1bd; --sieve-accent-ink #10221c; --sieve-bg #1a1815; --sieve-card #24211c; --sieve-down #e6a07a; --sieve-hole rgb(0 0 0 / 0.55); --sieve-ink #ede6d8; --sieve-line rgb(255 255 255 / 0.1); --sieve-muted #a99f8d; --sieve-tray #2e2a23; --sieve-up #8fd19a. Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"dark\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
  ],
  preview: { bg: "#e3d9c6", mode: "fill", frame: [1200, 800] },
};
