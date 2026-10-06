import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "satin-hero",
  name: "Satin Hero",
  category: "heroes",
  description: "A personal hero on pale draped satin that drifts and catches the light in thin bright streaks. The serif headline looks pressed into the cloth, links sit in bracketed glass chips, and a faint four-column grid runs through it all.",
  tags: ["hero", "portfolio", "personal", "satin", "silk", "webgl", "shader", "serif", "blue"],
  traits: ["webgl", "cursor", "ambient"],
  source: "original",
  files: ["SatinHero.tsx", "satin-hero.css"],
  dependencies: [],
  prompt:
    "Build a personal portfolio hero (a fictional designer, Salma Haddad) over a full-bleed WebGL satin.\n\nCloth: a fragment shader over a height field: two sets of slow vertical drapes (sines bent by lower-frequency sines) plus a sweep of curved folds radiating from beyond the top-right corner. Take the gradient for a normal, light it from the upper left: a ramp from cornflower (#79aeea) in the folds through ice blue (#a8d2fb) to pale (#d8ecff) where it faces the light, plus a very tight specular (power 140) that draws knife-edge white streaks where folds turn, and a soft wider sheen. The cloth thins to paper white toward the left and bottom edges. It drifts slowly; the pointer adds a faint ring in the fold under it. Render at 0.7× resolution and pause off-screen.\n\nLayout: padding about 5.4% of the width; five faint white vertical guide lines at the content edges and the quarter points, full height, fading at the ends. Top: the name left in a soft blue, and links right as '[ Work ]' chips: translucent white with a backdrop blur, about 25px text. Middle: a two-line serif headline (Newsreader 500, up to 170px, tight tracking) pressed into the cloth: a vertical navy gradient clipped to the text, a 1.5px white lip below each stroke and a faint dark edge above, using drop-shadow filters. Under it an intro paragraph (about 26px, 34rem wide), then '↳ Write to me' and a '[ See the work ]' chip. Bottom: © year left, two icon links right.",
  interaction: "Links and chips brighten on hover; the arrow before the primary link nudges. Moving the pointer stirs the cloth beneath it.",
  animation: "The cloth drifts continuously and slowly, stopping off-screen and in hidden tabs. Reduced motion or motion={false} renders a single still frame.",
  a11y: "Real nav, h1, paragraph and footer. The brackets are aria-hidden so links read as plain words; icon links have labels. The canvas is aria-hidden; without WebGL a static gradient stands in.",
  responsive: "Type scales with the container; below 40rem the nav wraps and only three guide lines remain.",
  touchFallback: "Without a pointer the cloth just drifts.",
  variants: [
    { id: "light", label: "Light" },
    { id: "dark", label: "Dark" },
  ],
  preview: { bg: "#d8ecff", mode: "fill", frame: [1440, 780] },
  isNew: true,
};
