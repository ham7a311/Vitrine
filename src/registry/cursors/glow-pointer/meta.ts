import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "glow-pointer",
  name: "Glow Pointer",
  category: "cursors",
  description: "A crisp arrow with softly rounded corners and a slight glow around it — light, not a shape. A soft core with a long faint tail that fades to exactly nothing, so there is no ring, no edge and no disc; it moves with the arrow and brightens a touch when you press.",
  tags: ["cursor", "pointer", "glow", "custom cursor", "soft", "light", "minimal"],
  traits: ["cursor", "click"],
  source: "original",
  files: ["GlowPointer.tsx", "glow-pointer.css"],
  dependencies: [],
  prompt: `Build a scoped custom cursor: a dark arrow with a slight, edgeless coloured glow behind it.

Scope: the host is position:relative; an aria-hidden, pointer-events:none layer sits above the children. Only under (hover: hover) and (pointer: fine) does the host get data-live, which sets cursor:none on it and every descendant (!important); text fields get cursor:auto back and the drawn cursor fades out over them. Coordinates are host-local, corrected by rect.width / offsetWidth for scaled hosts.

Arrow: a 32px SVG (viewBox 0 0 32 32) of a fat arrowhead with every corner rounded — vertices tip (2,2), (37.04,13.56), notch (19.1,19.1), (13.56,37.04) rounded with arcs of 2 at the tip and 3 at the outer corners and in the notch: M5.77 3.24 L28.12 10.61 A3 3 0 0 1 28.07 16.33 L20.61 18.63 A3 3 0 0 0 18.63 20.61 L16.33 28.07 A3 3 0 0 1 10.61 28.12 L3.24 5.77 A2 2 0 0 1 5.77 3.24 Z. Near-black fill with a white keyline (stroke-width 3.8 drawn beneath the fill with paint-order: stroke, so about 1.9px shows), round joins, a 0.6px grey outline shadow and a soft drop shadow; the rounded tip apex (3.73, 3.73) is the hotspot. Its translate is written in the pointermove handler. Pressing scales it to 0.9 from the tip.

Glow: a single 200px circle centred 12px down and right of the tip — on the arrow's body — filled with a radial-gradient(closest-side) whose stops (every 4% of the radius) are generated from a(d) = 0.46·e^(−d²/2·15²) + 0.06·e^(−d²/2·32²), multiplied by (1 − r⁴) so it reaches exactly zero at the edge: a soft core and a long faint tail, which is what makes it read as light rather than a disc. No second disc, no rim, no blur filter. Overall opacity 0.87, 1 while pressed. It is moved in the same pointermove write as the arrow, so it never trails or detaches and there is no animation loop. On dark surfaces the glow uses mix-blend-mode: plus-lighter so it adds light. Props: color, arrow ("dark" | "light"), size, motion.`,
  interaction: "Move over the page; press to brighten the glow. The system caret returns in fields.",
  animation: "Arrow and glow 1:1 (no loop); press 140–200ms.",
  a11y: "The drawn cursor is aria-hidden and pointer-events:none, and never touches focus or focus styles. Reduced motion drops the press transitions.",
  responsive: "Host-scoped; coordinates are corrected for scaled hosts, so it lines up inside thumbnails too.",
  touchFallback: "Coarse pointers draw nothing and keep the system cursor.",
  variants: [
    { id: "azure", label: "Azure", prompt: "color=\"#3b82f6\" (azure), arrow=\"dark\", on a white page (ink #111113, muted #6b6b73); focus rings in the glow colour." },
    { id: "ember", label: "Ember", prompt: "color=\"#fb923c\" (ember orange), arrow=\"light\" (white fill, dark keyline), on a near-black page (#0c0b0a, ink #f2ede6); the glow uses plus-lighter." },
    { id: "violet", label: "Violet", prompt: "color=\"#8b5cf6\" (violet), arrow=\"dark\", on warm paper (#f5f3ee, ink #1c1b17, muted #76716a)." },
  ],
  preview: { bg: "#ffffff", mode: "fill" },
};
