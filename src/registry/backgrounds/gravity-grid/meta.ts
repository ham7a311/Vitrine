import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  "slug": "gravity-grid",
  "name": "Gravity Grid",
  "category": "backgrounds",
  "description": "A hairline grid that bends around the content placed on it \u2014 headlines and cards act as masses and dent the field, so the background frames what matters.",
  "tags": [
    "background",
    "grid",
    "canvas",
    "layout-aware",
    "gravity",
    "hero"
  ],
  "traits": [
    "canvas",
    "cursor",
    "ambient"
  ],
  "source": "original",
  "files": [
    "GravityGrid.tsx"
  ],
  "dependencies": [],
  "prompt": "Build a background whose field responds to the layout placed on it, not to decoration. Render a hairline grid (30px) on a 2D canvas behind the content. Every descendant with a data-mass attribute is measured (ResizeObserver on the wrapper and each mass, re-measured after fonts load) and treated as a rectangular mass.\n\nFor each grid sample (every 6px along each line) find the nearest point on each mass rectangle (expanded 10px). Pull the sample toward it by min(0.82\u00b7d, m\u00b7strength\u00b7(14 + 0.09\u00b7\u221aarea)\u00b7e^(\u2212d/\u03c3)), with \u03c3 = 40 + 0.22\u00b7\u221aarea \u2014 so lines bow in toward content, strongest near it, never crossing into it. Lines brighten from 7.5% to ~28% alpha as they bend ('heat'), fade out entirely within 18px of a mass and inside it, so text always sits on clean ground. Grid intersections near a mass get tiny 1.5px dots.\n\nThe pointer adds a small point mass (0.35) eased with a lerp; the canvas only animates while that mass is moving and otherwise is completely still. Cap DPR at 2. Under reduced motion the pointer is ignored \u2014 the layout-driven bend remains.",
  "interaction": "The field is shaped by the content itself; moving the pointer adds a light, slow dimple that follows it.",
  "animation": "None at rest. Redraws on layout change; pointer mass eases with a 0.08 lerp and the loop stops when settled.",
  "a11y": "Decorative canvas (aria-hidden) under real content; lines are removed beneath text for contrast. Reduced motion disables the pointer mass.",
  "responsive": "Re-measures on any size change of the wrapper or of any mass, so it adapts to every breakpoint automatically.",
  "variants": [
    {
      "id": "frost",
      "label": "Frost",
      "prompt": "Grid colour #b9cce4 (frost blue) on #0a0c10; content ink #eef2f7, muted #8b95a3; eyebrow in the grid colour."
    },
    {
      "id": "amber",
      "label": "Amber",
      "prompt": "Grid colour #e8a24a (amber) on warm black #0d0b09; content ink #efe8dc, muted #a8a59c."
    },
    {
      "id": "lilac",
      "label": "Lilac",
      "prompt": "Grid colour #c9b8ef (lilac) on violet-black #0b080d; content ink #efe8dc, muted #a7a1ab."
    }
  ],
  "preview": {
    "bg": "#0a0c10",
    "mode": "fill"
  },
  "touchFallback": "Without a hover pointer the grid simply frames the content; a drag moves the dimple."
};
