import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "board-view",
  name: "Board View",
  category: "data",
  description: "A status board in a calm document style: coloured status pills, cards with owner, date and tags, drag-and-drop between columns with a blue landing line, and full keyboard moves.",
  tags: ["kanban", "board", "drag and drop", "tasks", "status", "database"],
  traits: ["keyboard", "click", "touch"],
  source: "original",
  files: ["BoardView.tsx", "board-view.css"],
  dependencies: [],
  prompt:
    "Build a kanban board in a calm document style: Inter 14px, warm near-black ink #37352f on white. Columns sit side by side (min 15.5rem each, 14px gaps) and scroll horizontally with snap on narrow containers (each column 82% wide under 40rem). A column header holds a rounded status pill (a 7px coloured dot plus the label on a pastel tint) and a faint card count; the whole column tints with 6% ink while a card is dragged over it.\n\nCards are white with 6px corners and a hairline-ring shadow (0 0 0 1px rgb(15 15 15 / 0.08), 0 2px 4px rgb(15 15 15 / 0.06)). Each shows a 500-weight title, a muted meta line with an 18px initials avatar tinted by name and a short date ('16 Oct'), and small 3px-radius tag pills. Use a nine-colour select-pill palette (gray, brown, orange, yellow, green, blue, purple, pink, red), each a pale background with a deeper ink. A '+ New' ghost row at the foot of each column turns into an inline input ('Type a name, Enter to add').\n\nDragging: press a card and move 5px; the original fades to 35% and a fixed ghost copy follows the pointer, tilted 1.5° with a deeper shadow. A 3px rounded blue line (#2383e2) appears where it will land in the column under the pointer. On drop, cards slide to their new places (FLIP, 240ms). When a card has focus it also shows a small native 'Move to' select listing the columns.",
  interaction:
    "Pointer drag between and within columns. Keyboard: cards are focusable; arrows move focus between cards and columns, Shift+←/→ moves the card to the neighbouring status, and Shift+↑/↓ reorders it; focus follows the card. Tapping a card on touch focuses it and reveals the Move to select. + New adds a card to that column. onChange receives the cards array with updated statuses and order.",
  animation:
    "Cards glide to new positions with FLIP over 240ms (cubic-bezier(.2,.8,.2,1)); the drag ghost tilts slightly; columns tint on hover. Reduced motion removes the glide and the tilt.",
  a11y:
    "Each column is a section labelled by its header; cards are list items with tabIndex 0, described by hidden keyboard instructions. A polite live region announces each move ('moved to In review, position 2 of 3') and additions. The Move to select and New buttons have full accessible names.",
  responsive:
    "Columns keep a readable minimum width and the board scrolls horizontally with scroll-snap; titles and tags wrap within each card.",
  touchFallback: "Touch keeps native scrolling: tap a card to focus it, then use its Move to select. Drag still works with a mouse or pen.",
  variants: [
    { id: "light", label: "Light", prompt: "Light theme: page and cards #ffffff, card hover #fbfbfa, ink #37352f, muted #787774, faint #a5a29a, hover tint rgb(55 53 47 / 0.06), landing line and focus #2383e2. Pills: gray #f1f1ef/#787774, brown #f4eeee/#9f6b53, orange #fbecdd/#b85c0b, yellow #fbf3db/#a3741a, green #edf3ec/#448361, blue #e7f3f8/#337ea9, purple #f6f3f9/#9065b0, pink #faf1f5/#c14c8a, red #fdebec/#c4403b." },
    { id: "dark", label: "Dark", prompt: "Dark theme: page #191919, cards #252525 (hover #2c2c2c), ink #e3e2e0, muted #9b9a97, faint #6f6e69, landing line and focus #529cca, card ring rgb(255 255 255 / 0.07). Pills on deep tints with light ink: gray rgb(255 255 255 / 0.09)/#b4b4b0, orange #5c3b23/#eeb07c, green #243d30/#8ccfa3, blue #143a4e/#7fc0e4, purple #3c2d49/#c7a2e2, red #522e2a/#f2a39c (brown, yellow and pink follow the same pattern)." },
  ],
  preview: { bg: "#ffffff", mode: "fill", frame: [1200, 700] },
  isNew: true,
};
