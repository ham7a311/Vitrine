import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "aperture-rings",
  name: "Aperture Rings",
  category: "backgrounds",
  description: "Concentric rings of ticks and dashes turning at their own slow speeds, like a lens barrel or watch bezel — pure CSS.",
  tags: ["background", "css-only", "rings", "geometric", "ambient", "dark"],
  traits: ["ambient"],
  source: "original",
  files: ["ApertureRings.tsx", "aperture-rings.css"],
  dependencies: [],
  prompt: `Create a purely geometric, CSS-only background inspired by a lens barrel or watch bezel. Centre a stack of seven concentric rings, each a circular element with a mask that keeps only its outer 1.5px (or 9px for the tick ring) and a repeating-conic-gradient fill that draws its pattern: fine ticks (0.5° every 3°), coarse ticks (1.2° every 15°), long dashes (9° every 13°), and a broken arc (110°, gap, 50°, gap). Cycle the four patterns across the rings.

Each ring rotates on its own linear loop (70s for the innermost up to ~270s for the outermost), alternating direction, with a negative animation delay so nothing starts aligned. Opacity fades from 0.5 at the centre to 0.2 outward. Behind the rings sit a soft blurred radial glow that breathes on a 12s loop and, at the centre, a small bright core dot with a halo. Size everything in container-query units (cqmin) so it scales to any container without JavaScript. Colours are two props: ring colour and background. Reduced motion holds everything still.`,
  interaction: "None — ambient.",
  animation: "Ring rotation loops of 70–270s (alternating), glow breathing 12s.",
  a11y: "Purely decorative and aria-hidden; reduced motion stops all rotation.",
  responsive: "Sized with container-query units, so it fits any box; rings beyond the container are clipped.",
  variants: [
    { id: "frost", label: "Frost", prompt: "Ring colour #b9cce4 (frost blue) on #08070c; corner labels in the ring colour at 55%." },
    { id: "amber", label: "Amber", prompt: "Ring colour #f0b45f (amber) on #0b0806, like a lit watch bezel." },
    { id: "lilac", label: "Lilac", prompt: "Ring colour #c8b9ea (lilac) on #09070e." },
  ],
  preview: { bg: "#08070c", mode: "fill" },
};
