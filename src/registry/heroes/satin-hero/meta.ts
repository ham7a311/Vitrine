import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "satin-hero",
  name: "Satin Hero",
  category: "heroes",
  description: "A personal hero on pale draped satin that drifts and catches the light in thin bright streaks. The serif headline looks pressed into the cloth, numbered links sit along the top, the actions are solid and frosted pills, and a faint four-column grid runs through it all.",
  tags: ["hero", "portfolio", "personal", "satin", "silk", "webgl", "shader", "serif", "blue"],
  traits: ["webgl", "cursor", "ambient"],
  source: "original",
  files: ["SatinHero.tsx", "satin-hero.css"],
  dependencies: [],
  prompt:
    "Build a personal portfolio hero (a fictional designer, Salma Haddad) over a full-bleed WebGL satin.\n\nCloth: a fragment shader over a height field: two sets of slow vertical drapes (sines bent by lower-frequency sines) plus a sweep of creases (ridged sines, (1 − |sin|)³) radiating from beyond the top-right corner. Take the gradient for a normal, light it from the upper left: a ramp from cornflower (#79aeea) in the folds through ice blue (#a8d2fb) to pale (#d8ecff) where it faces the light, plus a very tight specular (power 220) that draws knife-edge white streaks where folds turn, and a soft wider sheen. The cloth thins to paper white toward the left and bottom edges. It drifts slowly; the pointer adds a faint ring in the fold under it. Render at 0.7× resolution and pause off-screen.\n\nLayout: padding about 5.4% of the width; five faint white vertical guide lines at the content edges and the quarter points, full height, fading at the ends. Top: the name left in ink at 500 weight, and on the right a numbered list of links ('01 Work', '02 Notes' …): plain words at about 22px in the soft blue with the figure in small mono at 70%, a 1px rule drawing in from the left under the hovered one. Middle: a two-line serif headline (Newsreader 500, up to 170px, tight tracking) pressed into the cloth: a vertical navy gradient clipped to the text, a 1.5px white lip below each stroke and a faint dark edge above, using drop-shadow filters. Under it an intro paragraph (about 26px, 34rem wide), then two pills about 52px tall: 'Write to me' solid in the ink colour with pale text and an arrow in a pale circle at its right end, and 'See the work' frosted (translucent white, 8px backdrop blur, a white hairline). Bottom: © year left, two icon links right.",
  interaction: "A rule draws in under a hovered link; the primary pill lifts 1px and its arrow nudges right; the frosted pill brightens. Moving the pointer stirs the cloth beneath it.",
  animation: "The cloth drifts continuously and slowly, stopping off-screen and in hidden tabs. Reduced motion or motion={false} renders a single still frame.",
  a11y: "Real nav, h1, paragraph and footer. The link numbers are aria-hidden and the links are an ordered list; icon links have labels. The canvas is aria-hidden; without WebGL a static gradient stands in.",
  responsive: "Type scales with the container; below 40rem the nav wraps and only three guide lines remain.",
  touchFallback: "Without a pointer the cloth just drifts.",
  variants: [
    { id: "light", label: "Light", prompt: "Palette for this theme (Light): --satn-bottom #15304f; --satn-chip rgb(255 255 255 / 0.38); --satn-chip-hover rgb(255 255 255 / 0.62); --satn-fallback radial-gradient(120% 90% at 85% 10%, #ffffff 0%, #b7dbfd 30%, #8fc2f3 55%, #d8ebff 85%); --satn-focus #1c3a5e; --satn-hi rgb(255 255 255 / 0.7); --satn-ink #1c3a5e; --satn-ink-soft #2a5a8c; --satn-line rgb(255 255 255 / 0.55); --satn-lo rgb(10 35 70 / 0.28); --satn-on-ink #f4f8fd; --satn-top #3a6593. Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"light\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
    { id: "dark", label: "Dark", prompt: "Palette for this theme (Dark): --satn-bottom #b4c8e2; --satn-chip rgb(255 255 255 / 0.08); --satn-chip-hover rgb(255 255 255 / 0.16); --satn-fallback radial-gradient(120% 90% at 85% 10%, #3c5f8f 0%, #1d3557 35%, #0c1830 70%, #070d18 100%); --satn-focus #e3edf9; --satn-hi rgb(0 0 0 / 0.55); --satn-ink #e3edf9; --satn-ink-soft #b9cde6; --satn-line rgb(255 255 255 / 0.08); --satn-lo rgb(255 255 255 / 0.25); --satn-on-ink #0c1830; --satn-top #ffffff. Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"dark\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
  ],
  preview: { bg: "#d8ecff", mode: "fill", frame: [1440, 780] },
  isNew: true,
};
