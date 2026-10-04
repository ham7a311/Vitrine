import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "hover-reel",
  name: "Hover Reel",
  category: "media",
  description: "A project list where a picture blooms under the cursor, follows it, and rolls to the next image as you move between rows.",
  tags: ["hover", "image", "portfolio", "list", "projects", "cursor", "preview", "work"],
  traits: ["hover", "cursor", "keyboard", "touch"],
  source: "original",
  files: ["HoverReel.tsx", "hover-reel.css", "../art-gallery/studies.ts"],
  dependencies: [],
  prompt: `Build a portfolio project list with a floating image preview. Each project is a full-width row link — a large title (clamp 1.75–2.75rem, 500, −0.025em) on the left and a muted label on the right — separated by hairline rules.

The preview is one absolutely positioned 400×250 frame (8:5, 12px radius, deep soft shadow) containing a vertical strip of every project's image. Entering a row scales the frame in (scale 0 → 1, 400ms ease-out) and slides the strip to that row's image (translateY −100%·index, 450ms), so moving between rows rolls the pictures past inside the frame instead of swapping them. The frame follows the pointer through a rAF lerp (0.16 per frame, stopping when it arrives), clamped so it always stays 16px inside the component; leaving the list scales it away.

While one row is hovered the others dim to 40%, and the hovered title slides 15px left while its label slides 15px right (500ms). Keyboard focus does the same and parks the frame at the right end of the focused row. Images are optional per project; by default each gets a generated canvas study.`,
  interaction: "Hover a row to bloom the preview under the cursor; move between rows to roll the images. Tab through the rows for the same effect from the keyboard.",
  animation: "Frame scale 400ms and strip roll 450ms on cubic-bezier(0.22,1,0.36,1); pointer follow is a 0.16 lerp; row nudges 500ms.",
  a11y: "Rows are real links with visible focus; the floating preview is aria-hidden decoration because each title already names the project. Reduced motion removes the transitions and makes the frame track the pointer directly.",
  responsive: "Below 768px (or without hover) the floating frame is replaced by a small inline thumbnail at the start of each row, and the label moves under the title.",
  touchFallback: "Touch devices get inline thumbnails in every row instead of a floating preview.",
  variants: [
    { id: "paper", label: "Paper" },
    { id: "night", label: "Night" },
  ],
  preview: { bg: "#f2f0ec", mode: "fill", height: 620 },
};
