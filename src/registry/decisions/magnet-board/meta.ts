import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "magnet-board",
  name: "Magnet Board",
  category: "decisions",
  description: "Explore things that differ in several ways at once. Each enamel magnet stands for one quality; put it on the board and every item drifts toward it in proportion to how much of that quality it has, so clusters show the trade-offs. Flip a magnet to pull the lowest values instead, or switch to the list for the same model as a table.",
  tags: ["exploration", "comparison", "data", "multi-attribute", "visualisation", "drag", "shopping"],
  traits: ["click", "keyboard", "touch"],
  source: "original",
  files: ["MagnetBoard.tsx", "magnet-board.css", "layout.ts"],
  dependencies: [],
  prompt:
    "Build an exploration board for comparing items on several qualities at once (24 laptops: price, battery, weight, rating), based on the dust-and-magnet technique: qualities are magnets, items are dust.\n\nPanel: white with a 14px radius and a hairline border. A header bar holds '24 laptops', a row of pill chips (one per quality: an active chip has a coloured dot, the name, a 'High'/'Low' toggle and a ×; an inactive one is a dashed '+ Price'), and a Board/List segmented switch on the right.\n\nBoard: 340–500px tall, drawn as graph paper (a faint blue 24px grid with a stronger 120px grid on warm off-white). Items are 14px ink dots with a 2px paper-coloured ring; each magnet's strongest item keeps a small label beside their dot, and hovering any dot enlarges it, shows its label and opens a white card with every value. Magnets are 56px enamel pucks in red, blue, ochre and green with a darker 4px rim, a short code in white heavy type ('Bt', 'Kg', '$', '★'), a drop shadow and an uppercase name tag under them. A flipped magnet turns white with coloured text and its tag reads 'Weight · low'.\n\nLayout rule (deterministic, no physics loop): each item's resting point is the weighted mean of the magnet positions, each weighted by the square of the item's normalised value for that quality (or 1 minus it when flipped), plus a weak pull to the centre; 40 relaxation passes then push overlapping dots apart and keep them inside the board. Moving, adding, flipping or removing a magnet recomputes it, and the dots drift to their new places.\n\nList view: a table with one column per magnet (a small pull bar beside each value) and the remaining qualities muted, rows sorted by total pull, header sticky.",
  interaction:
    "Drag pucks with the pointer; dots follow as you drag. Each puck is a button: arrow keys move it 16px (Shift 64px), I flips it, Delete removes it. Chips add a magnet at the next free spot, flip it or remove it. Hover or tap a dot for its values; onSelect(item) fires on click.",
  animation:
    "Dots drift with transform over 640ms cubic-bezier(.2,.8,.2,1), shortened to 320ms while a magnet is being dragged so they keep up. Pucks lift slightly while held. Reduced motion or motion={false} moves dots straight to their places.",
  a11y:
    "The plotted dots are decorative; the List view is the accessible twin of the board. Pucks are labelled buttons that describe their quality, direction and keys. After each move or flip a polite live region names the three items that magnet now pulls hardest. Chips and view buttons expose aria-pressed.",
  responsive: "The board's height scales with the viewport between 340px and 500px and its layout follows its measured size; the header wraps chips onto a second line on narrow screens.",
  touchFallback: "Drag pucks with a finger (the board disables scrolling under it); tap a dot to see its card; the List view works without dragging at all.",
  variants: [
    { id: "light", label: "Light" },
    { id: "dark", label: "Dark" },
  ],
  preview: { bg: "#e8e3d6", mode: "fill", frame: [1200, 760] },
  isNew: true,
};
