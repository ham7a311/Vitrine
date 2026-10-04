import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "media-inspector",
  name: "Media Inspector",
  category: "data",
  description: "A media grid with no modal. Selecting an asset opens the grid around it: the thumbnail grows into a full-width inspector on the next row, the rest of the grid reflows to make room, and next/previous walk the inspector through the grid in place.",
  tags: ["media", "gallery", "image", "assets", "inspector", "lightbox", "metadata"],
  traits: ["click", "keyboard", "touch"],
  source: "original",
  files: ["MediaInspector.tsx", "media-inspector.css"],
  dependencies: [],
  prompt: `Build a media browser that replaces grid → modal with grid → selected object → inspection in place.

The grid is CSS grid (auto-fill, minmax(8.5rem, 1fr), grid-auto-flow: row dense) of square thumbnails with filenames. Selecting one turns that grid item into the inspector: it spans the full row (grid-column: 1 / -1), and dense packing backfills the row it came from, so the inspector opens directly beneath its neighbours. The rest of the grid reflows around it with a FLIP translate (380ms). The chosen image grows out of its own thumbnail — a FLIP scale from the thumbnail's rect to the stage (420ms) — so the object you picked becomes the object you're inspecting.

The inspector row holds a stage at the asset's real aspect ratio (object-fit contain, capped height) and an info column that fades in after the stage lands. The info column has:
- an 'n / total' counter with previous, next and close
- the filename and a metadata grid: dimensions with a reduced ratio (4032 × 3024 · 4:3), size and type, taken, place, camera, owner
- a palette strip
- actions (the primary filled, Delete in red)

Next and previous move the inspector through the grid in place — the FLIP makes it hop to the next position — rather than swapping content in a fixed box.

Keyboard: thumbnails use roving focus with arrow keys that respect the live column count, plus Home/End. Enter opens. Inside the inspector ← → browse and Escape closes, returning focus to the thumbnail. Under 34rem of container width the grid is three tight columns, and the inspector becomes a full-bleed block of the column (image on top, up to 60vh) with swipe left/right on the image. The demo uses procedural landscape artwork (Wahiba Sands, Muttrah, Wadi Shab…) so it needs no network. Paper and Night themes.`,
  interaction: "Click a photo; use ← → or the arrows to walk through the grid; Esc closes. On a phone, swipe the image.",
  animation: "Grid reflow 380ms FLIP; the chosen image scales out of its thumbnail in 420ms; the info column fades in after.",
  a11y: "Thumbnails are labelled buttons with roving tabindex. The inspector is a labelled region ('name, 3 of 10') that takes focus; the image has alt text; nav buttons are labelled, and Escape returns focus to the thumbnail. Reduced motion removes the reflow and growth, so the inspector simply appears in place.",
  responsive: "Container queries switch to a three-column grid and a stacked, full-bleed inspector under 34rem, with swipe for next and previous.",
  touchFallback: "Swipe left or right on the image.",
  variants: [
    { id: "paper", label: "Paper" },
    { id: "night", label: "Night" },
  ],
  preview: { bg: "#f3f1ec", mode: "fill" },
};
