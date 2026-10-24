import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "bloom-edge",
  name: "Bloom Edge",
  category: "buttons",
  description: "Point at the button and a stem grows round it both ways from where you came in, with things unfurling along it nearest-first — cherry blossom that lets the odd petal drift away, curling fern fronds, or frost crystals that glint. Leave and it all wilts back.",
  tags: ["button", "hover", "flowers", "plants", "garden", "frost", "growth", "edge", "playful", "svg"],
  traits: ["hover", "keyboard"],
  source: "original",
  files: ["BloomEdge.tsx", "bloom-edge.css", "bloom.ts", "growth.ts", "perimeter.ts"],
  dependencies: [],
  prompt:
    "Build a pill button that grows things round its edge. Props: children, flora (one of three growths), colors {stem, a, b, c}, tone {face, label}, onClick and type.\n\nGeometry (pure functions): the outline of a w × h rounded rectangle with radius h/2, walked clockwise — its length, the point at distance s with tangent and outward normal, and the distance nearest to any point.\n\nOn pointerenter, find the outline distance nearest to where the pointer came in. In an SVG overlay that reaches 30px past the button (pointer-events none, overflow visible), draw two stems from that point, each half the outline long, one each way, running 5px outside the edge with a gentle sine meander of ±1.6px; draw them in with stroke-dashoffset at 520px per second. Along both halves, every 15–17px, place a piece rotated to the outward normal plus a seeded jitter of ±28°, and grow it in (scale 0 → 1.18 → 1 with a springy ease, or an unfurl from −70° for curled pieces) with a delay equal to its distance along the stem at the same 520px/s, so growth follows the stems outward. Use a seeded jitter so every hover looks hand-placed but stays stable.\n\nOn leave, wilt: every piece shrinks to 20% and turns 40°, the furthest first, and the stems withdraw by animating the dash offset past the end, then the group is removed. A new hover clears any growth still wilting. Keyboard focus grows from the top centre; touch grows on press and wilts after 2.4s. Reduced motion: the finished arrangement fades in and out.\n\nThe button is a 52px pill in the face colour with the label colour, a 1px lift on hover and a small press, and a focus ring in the stem colour.",
  interaction: "Point at the button and the edge blooms from where you came in; leave and it wilts. Keyboard focus blooms it from the top.",
  animation: "Stems draw at 520px/s; pieces spring in, staggered by distance; petals drift down on a 2.2s loop; frost glints. Wilting takes about 0.8s. Reduced motion fades a still arrangement in and out.",
  a11y: "A real button with its text label; the growth is decorative SVG in an aria-hidden overlay with pointer-events none.",
  responsive: "The button keeps its size; leave about 30px of room around it.",
  touchFallback: "A press grows the edge for 2.4s.",
  variants: [
    { id: "blossom", label: "Blossom", prompt: "Cherry blossom: every third piece a five-petal flower (#f29bba petals, #f2c94c centre, on a short stem), the rest leaf shapes (#8db27a); a brown stem #6f5a4a; some flowers release a petal that drifts down and spins on a loop. Ground #fbf3f1, button #3a2430 with #fff3f7 text." },
    { id: "fern", label: "Fern", prompt: "Ferns: each piece a curved frond (#3d6b43 rib, #6fa36a leaflets in four pairs that shrink towards the tip, a curl at the end) that unfurls from −70°. Ground #eef2e8, button #1f3a26 with #eff7ea text." },
    { id: "frost", label: "Frost", prompt: "Frost on a dark ground: a dotted pale-blue line instead of a stem (#8fc6ec), six-armed ice crystals with side branches (#cdeaff), and every fourth piece a small white glint that twinkles. Ground #0f1823, button #e7f4ff with #0f2234 text." },
  ],
  preview: { bg: "#fbf3f1", mode: "center", height: 360 },
};
