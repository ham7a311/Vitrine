import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "ruler-edge",
  name: "Ruler Edge",
  category: "buttons",
  description: "Point at the button and it gets measured: ruler ticks draw in round its edge from where you came in, with numbers along the top, then dimension lines arrive with its real width and height in pixels and the radius of its corners, like a page from a spec sheet. On a blueprint or on drafting paper.",
  tags: ["button", "hover", "ruler", "measure", "blueprint", "spec", "design", "developer", "svg", "edge"],
  traits: ["hover", "keyboard"],
  source: "original",
  isNew: true,
  files: ["RulerEdge.tsx", "ruler-edge.css", "ruler.ts", "perimeter.ts"],
  dependencies: [],
  prompt:
    "Build a pill button that gets measured when you point at it. Props: children, sheet (one of two drawing styles), onClick and type.\n\nGeometry (pure functions): the pill outline walked by distance with its outward normal, the outline distance nearest a point, and the shortest way round between two distances. Ticks every 4px round the outline, starting 3px outside the edge and pointing outwards — 3.5px long, 6px every 5th, 9px and heavier every 10th. Each tick's delay is its distance round the outline from the entry point × 1.1ms, capped at 420ms, so they spread both ways from where you came in. Ruler numbers sit above the top edge's straight part every 40px of x.\n\nOn pointerenter, measure the button's real offsetWidth and offsetHeight and the entry point, and render an SVG overlay extending 62px round it with pointer-events none: dashed guide lines running off all four edges; the ticks, each drawn in with stroke-dashoffset (pathLength 1) on its own delay; the numbers fading in; then a width dimension 40px above (clear of the numbers) (extension lines, a run drawn out from the middle to both ends, arrowheads and a filled tag reading e.g. \"216 px\"), a height dimension 30px to the right (the same, its tag reading the height), and a radius callout — a pin at the corner centre, a line to the arc and a leader out to a note reading \"r 28\" — each arriving 140ms after the last. Everything uses transitions keyed off a data-shown attribute set on the next frame, so leaving takes it all away together in about 160ms.\n\nThe button is a 56px pill. Keyboard focus measures from the top centre; blur clears it. Touch measures on press for 2.6s. Reduced motion shows the drawing without the staggered drawing-in.",
  interaction: "Point at the button and it's measured from where you came in; move away and the drawing clears. Keyboard focus measures it too.",
  animation: "Ticks draw in within about 420ms, spreading both ways from the entry point; the dimensions follow 140ms apart; everything clears in 160ms. Reduced motion shows it at once.",
  a11y: "A real button with its text label; the drawing is decorative SVG, hidden and pointer-transparent. The numbers are real measurements but aren't announced.",
  responsive: "Leave about 62px of room above and to the right for the dimensions; the numbers follow the button's real size.",
  touchFallback: "A press measures it for a couple of seconds.",
  variants: [
    { id: "blueprint", label: "Blueprint", prompt: "A blueprint: blue ground #0f3a6e with a faint 20px grid, a white-outlined translucent button with a #f5f9ff label, pale blue ticks with white major ones, and yellow #ffd36a dimensions with dark blue tag text." },
    { id: "drafting", label: "Drafting", prompt: "Drafting paper: cream #f3eee2 with a faint grid, a graphite #1f232b button with a cream label, grey ticks with black major ones, and red #c8402b dimensions with cream tag text." },
  ],
  preview: { bg: "#0f3a6e", mode: "center", height: 320 },
};
