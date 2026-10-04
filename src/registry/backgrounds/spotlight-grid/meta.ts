import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "spotlight-grid",
  name: "Spotlight Grid",
  category: "backgrounds",
  description: "Faint graph-paper dots on black, with a brighter grid revealed by a soft torch that eases after your cursor.",
  tags: ["background", "grid", "cursor", "spotlight", "dots", "minimal"],
  traits: ["cursor", "hover"],
  source: "original",
  files: ["SpotlightGrid.tsx", "spotlight-grid.css"],
  dependencies: [],
  prompt: `Create a section background of faint dots on pure black: a 1px white dot at 5% opacity tiled every 28px. Stack a second, identical grid on top whose dots are the accent colour at 38%, and reveal it only through a 450px circular mask — solid at the centre, 50% at 38% of the radius, gone by 72% — positioned at CSS variables for x and y. The effect is a torch sweeping across graph paper.

Drive the variables with a tiny rAF loop that lerps the spotlight position toward the pointer (factor 0.15) and its opacity toward 1 on enter / 0 on leave (factor 0.12). The loop runs only while there's something to animate and stops itself once the light has faded out and settled (<0.5px and <0.008 opacity). On first entry, snap the position to the pointer so the light fades in where you are instead of sliding in from a corner.

On touch devices, show a resting pool of light at (50%, 40%). Under reduced motion, show a very soft (18%) fixed glow at (50%, 38%) and skip the loop.`,
  interaction: "The lit grid fades in under the cursor and trails it smoothly; it fades out when the pointer leaves.",
  animation: "Position lerp 0.15/frame, opacity lerp 0.12/frame; the rAF loop self-terminates once settled.",
  a11y: "Decorative layer is aria-hidden; children render above it at z-index 1. Reduced motion shows a static glow.",
  responsive: "Fills its container; grid gap and spotlight radius are props.",
  touchFallback: "A static pool of light at (50%, 40%) replaces cursor tracking.",
  variants: [
    { id: "phosphor", label: "Phosphor", prompt: "Accent #86efac (phosphor green): the revealed dots glow terminal-green; the eyebrow label uses the same green." },
    { id: "frost", label: "Frost", prompt: "Accent #b9cce4 (frost blue): the revealed dots are a cool pale blue; the eyebrow label uses the same blue." },
    { id: "lilac", label: "Lilac", prompt: "Accent #c8b9ea (lilac): the revealed dots are soft violet; the eyebrow label uses the same lilac." },
    { id: "ember", label: "Ember", prompt: "Accent #f3b45f (ember amber): the revealed dots are warm amber, like a torch on graph paper; the eyebrow label uses the same amber." },
  ],
  preview: { bg: "#000000", mode: "fill" },
};
