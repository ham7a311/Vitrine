import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "patina",
  name: "Patina",
  category: "cards",
  description: "Documentation cards that age with their last review. The paper warms, the corner curls and a red stamp says how long it has been, in stages set by real thresholds, so stale pages get noticed; marking a page as checked brings it back to fresh.",
  tags: ["documentation", "freshness", "knowledge base", "cards", "review", "content"],
  traits: ["click", "keyboard"],
  source: "original",
  files: ["Patina.tsx", "patina.css", "age.ts"],
  dependencies: [],
  prompt:
    "Build a grid of documentation cards whose appearance encodes how long ago each page was last checked, so freshness is visible without reading dates. Stages come from thresholds (default 90, 180 and 365 days): Fresh, Ageing, Stale, Old.\n\nCards: Newsreader titles and summaries on paper with a hairline border and a soft shadow. Fresh paper is white; Ageing is a faint cream; Stale is a warmer yellowed paper with slightly browner ink and a small folded corner (a diagonal triangle in the bottom-right revealing the background); Old is deeper parchment with a larger fold, a few small foxing spots, and a red rubber stamp rotated about 7° in the top-right reading 'CHECKED 14 MONTHS AGO' in condensed heavy capitals. Under each summary, in small Hanken Grotesk: the owner and 'checked 3 weeks ago'. A dashed rule separates a footer with the stage name in tiny caps and a 'Mark as checked' button.\n\nHeader: 'Pages that need a look', a summary ('2 pages haven't been checked in over a year; 3 in all are stale.') and a sort select (oldest check first, or title). Marking a page as checked calls onCheck, shows 'Saving…', then the card's paper eases back to white with a brief accent ring and 'Checked today'; a failure leaves it unchanged with the error under it.",
  interaction: "Mark as checked calls onCheck(id), which may reject. The sort select reorders the grid. Ages are computed from now (or the viewer's clock after mount).",
  animation: "Paper and ink colours ease over 700ms when a page changes stage; a freshly checked card shows a fading accent ring over 900ms. Reduced motion or motion={false} applies changes at once.",
  a11y: "Each card is an article labelled by its title; its stage and age are stated in text ('Omar, stale, checked 8 months ago'), not only by colour or the stamp, which is decorative. The result of every check is announced; errors use role=alert.",
  responsive: "The grid fills as many 230px columns as fit; the header wraps.",
  touchFallback: "Every action is a button.",
  variants: [
    { id: "light", label: "Light" },
    { id: "dark", label: "Dark" },
  ],
  preview: { bg: "#e3e0d8", mode: "fill", frame: [1100, 620] },
  isNew: true,
};
