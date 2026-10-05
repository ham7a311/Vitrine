import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "line-map",
  name: "Line Map",
  category: "navigation",
  description: "A course or a set of docs drawn as a transit map. Tracks are lines, lessons are stations, lessons shared by two tracks are interchanges, and the stretch of each line you've travelled is drawn in full colour, with a 'You are here' marker. On phones it becomes a strip map per line.",
  tags: ["navigation", "course", "docs", "progress", "map", "onboarding", "learning"],
  traits: ["click", "keyboard", "hover"],
  source: "original",
  files: ["LineMap.tsx", "line-map.css"],
  dependencies: [],
  prompt:
    "Build course navigation drawn as a schematic transit map ('Masar Academy'): three tracks (Foundations blue, Writing red, Research green) with lessons as stations. Research crosses the other two at the lessons they share (Citations and Interviews), which are interchanges.\n\nData: stations { id, title }, lines { name, color, stops[] } and a hand-laid grid { id: [column, row, labelSide] }, since good transit maps are arranged by hand. Positions are 112 units per column and 72 per row.\n\nDrawing (SVG on warm paper, Hanken Grotesk): each line is an 8px round-capped stroke between consecutive stops, bent the schematic way: horizontal first, then a 45° diagonal (or vertical then diagonal when the rise is larger). The part of a line between two visited stations is full colour; the rest is a pale tint of it. Stations are white discs with a 3.5px ring in the line's colour (tinted when unvisited); interchanges are larger with a dark ring; the current station is filled with its line's colour, labelled 'YOU ARE HERE' in small heavy caps above, and sends out two soft rings on load. Labels sit on the side given in the grid with a paper-coloured halo; unvisited labels are muted. A header shows the legend as colour bars with progress per line ('Writing 2/6').\n\nPointing at or focusing a station opens a small card above it: title, the lines through it in their colours, and 'Visited' / 'Not visited yet' / 'You are here'. Below 36rem the map is replaced by one vertical strip per line (a thick rail, a disc per station, 'change for Research' at interchanges).",
  interaction:
    "Stations are focusable buttons over the map with one tab stop: ←/→ move along the current line, ↑/↓ switch line, but only at an interchange, and Enter or a click calls onNavigate(id). The strip view's buttons do the same on small screens.",
  animation: "The current station pulses twice (1.4s, after 300ms) and the station card fades up over 140ms. Reduced motion or motion={false} removes both.",
  a11y:
    "The SVG is decorative; each station's button is named with its title, the lines through it and its state ('Citations, interchange for Foundations and Research, visited'), and the current one has aria-current='location'. The keyboard model follows the lines themselves. The strip view is an ordinary set of labelled ordered lists.",
  responsive: "The map scales from its viewBox; under 36rem it switches to vertical strip maps.",
  touchFallback: "Tap a station to open it; the strip maps give phones large, plain targets.",
  variants: [
    { id: "light", label: "Light" },
    { id: "dark", label: "Dark" },
  ],
  preview: { bg: "#e9e7e0", mode: "center", frame: [1000, 620] },
  isNew: true,
};
