export type Category =
  | "buttons" | "controls" | "cards" | "backgrounds" | "cursors" | "heroes" | "navbars" | "navigation" | "footers" | "pricing"
  | "faq" | "ctas" | "auth" | "stats" | "analytics" | "media" | "maps" | "micro" | "forms" | "feedback" | "sections" | "type" | "text" | "ai" | "sidebars" | "overlays" | "data"
  | "decisions" | "reading" | "commerce" | "time";

export type Source = "original";

export type Trait = "hover" | "cursor" | "click" | "scroll" | "webgl" | "canvas" | "keyboard" | "ambient" | "touch";

export type PreviewMode = "center" | "fill" | "page" | "scroll";

export interface Variant {
  id: string;
  label: string;
  /** What this option alone looks and behaves like, and the props that produce it. Appended to the base prompt when selected. */
  prompt?: string;
}

const THEME_LABELS = new Set(["paper", "night", "light", "dark", "light surface", "dark surface"]);

/** Theme-only pairs share a visual brief; composition always includes the selected theme. */
export const isThemeOnly = (variants?: Variant[]) => !variants || variants.every((v) => THEME_LABELS.has(v.label.toLowerCase()));

/** Base prompt plus the selected variant's own description — never the options that weren't chosen. */
export function composePrompt(prompt: string, variants: Variant[] | undefined, id: string | undefined) {
  const v = variants?.find((x) => x.id === id) ?? variants?.[0];
  if (!v) return prompt;
  const direction = v.prompt?.trim() || `Apply the ${v.label.toLowerCase()} theme. Where the brief above gives no colour values for it, choose a restrained ${v.label.toLowerCase()} palette with text at 4.5:1 contrast or better. Keep the geometry, states and motion described above unchanged.`;
  return `${prompt}\n\nSelected variant — ${v.label} (${v.id}):\n${direction}\nThis selection takes precedence over references to other themes or options in the general brief. Implement this selected appearance; do not add a variant picker or alternative appearances unless requested.`;
}

export interface ComponentMeta {
  slug: string;
  name: string;
  category: Category;
  description: string;
  tags: string[];
  traits: Trait[];
  /** Internal tracking only — not rendered publicly. */
  source: Source;
  /** Files shown in the code tab, relative to the component folder. First is primary. */
  files: string[];
  dependencies: string[];
  prompt: string;
  interaction: string;
  animation: string;
  a11y: string;
  responsive: string;
  touchFallback?: string;
  variants?: Variant[];
  /** Option names the base prompt may use as ordinary words (checked by scripts/check-prompts.mts). */
  promptAllow?: string[];
  /** frame: design size [w, h] a gallery thumbnail renders at before scaling to fit. */
  preview: { bg: string; height?: number; mode: PreviewMode; frame?: [number, number] };
  featured?: boolean;
  isNew?: boolean;
}

export const CATEGORIES: { id: Category; label: string; blurb: string }[] = [
  { id: "buttons", label: "Buttons", blurb: "Actions that answer back — shatter, trace, lean, hold." },
  { id: "controls", label: "Controls", blurb: "Checkboxes, switches, segments and loaders, given the same care as the big pieces." },
  { id: "cards", label: "Cards", blurb: "Containers treated as objects, with a point of view about what they hold." },
  { id: "backgrounds", label: "Backgrounds", blurb: "Atmosphere you can set type on — shaders, fields, contours, light." },
  { id: "micro", label: "Micro-animations", blurb: "Small moments of feedback — likes, saves, copies, sends — each with one precise motion." },
  { id: "cursors", label: "Cursors", blurb: "Pointers with a point of view: they light, frame, measure, write and keep company." },
  { id: "text", label: "Text Animations", blurb: "Type that moves with intent — flaps, ink, chrome, gravity and second thoughts." },
  { id: "ai", label: "AI & Chat", blurb: "Composers, attachments, model pickers and the small states around a conversation." },
  { id: "sidebars", label: "Sidebars", blurb: "App and conversation sidebars that stay out of the way until you need them." },
  { id: "heroes", label: "Heroes", blurb: "The first screen: a name, a promise and one action, each with a reason to be there." },
  { id: "navbars", label: "Navbars", blurb: "The first thing anyone sees. Calm to use, memorable to look at." },
  { id: "navigation", label: "Navigation", blurb: "Tabs, indexes and steppers that show where you are and where you're going." },
  { id: "overlays", label: "Overlays", blurb: "Dialogs, sheets and popovers that keep you oriented while they're open." },
  { id: "data", label: "Data", blurb: "Search, tables and dense information, kept readable." },
  { id: "decisions", label: "Decisions", blurb: "Ranking, weighing and allocating, with the choice made visible as you make it." },
  { id: "time", label: "Time", blurb: "History, versions and schedules you can move through." },
  { id: "footers", label: "Footers", blurb: "Endings that close the page properly instead of dumping a sitemap." },
  { id: "commerce", label: "Commerce", blurb: "Configuring and buying, with the reasons on the page." },
  { id: "pricing", label: "Pricing", blurb: "Plans you can compare at a glance, without three identical cards." },
  { id: "reading", label: "Reading", blurb: "Text that adapts to the reader: how deep, which numbers, how much detail." },
  { id: "faq", label: "FAQ", blurb: "Questions and answers where typography and spacing do most of the work." },
  { id: "ctas", label: "CTAs", blurb: "Calls to action built on composition and focus rather than gradients." },
  { id: "auth", label: "Authentication", blurb: "Sign-in flows that stay practical under the polish." },
  { id: "stats", label: "Stats", blurb: "Numbers presented so the change, not just the value, is visible." },
  { id: "analytics", label: "Analytics", blurb: "Charts that read at a glance and reward a closer look." },
  { id: "media", label: "Media", blurb: "Galleries, comparisons and image moments that reward a closer look." },
  { id: "maps", label: "Maps & Globes", blurb: "The world, drawn in dots and arcs — routes, activity and places." },
  { id: "forms", label: "Forms", blurb: "Inputs and fields with careful focus, validation and states." },
  { id: "feedback", label: "Feedback", blurb: "Toasts and notices that tell people what just happened, calmly." },
  { id: "sections", label: "Sections", blurb: "Whole page moments: testimonials, stories, showcases." },
  { id: "type", label: "Type & Names", blurb: "Names, wordmarks and titles set with intent." },
];

export const TRAIT_LABEL: Record<Trait, string> = {
  hover: "Hover",
  cursor: "Cursor",
  click: "Click",
  scroll: "Scroll",
  webgl: "WebGL",
  canvas: "Canvas",
  keyboard: "Keyboard",
  ambient: "Ambient",
  touch: "Touch",
};

/** A portable brief includes the behavior contract, even when the visual prompt omits it. */
export function componentBrief(meta: ComponentMeta, id?: string) {
  return [
    composePrompt(meta.prompt, meta.variants, id),
    "",
    "Implementation requirements:",
    "Use React and TypeScript. Keep the component self-contained, with uniquely scoped CSS and no animation libraries. Include required imports, styles and font setup in the result.",
    `Interaction: ${meta.interaction}`,
    `Motion: ${meta.animation}`,
    `Accessibility: ${meta.a11y}`,
    `Responsive behavior: ${meta.responsive}`,
    ...(meta.touchFallback ? [`Touch: ${meta.touchFallback}`] : []),
    "Preserve keyboard access, visible focus and reduced-motion behavior. Keep fictional demo data and simulated service calls in a separate usage example; expose callbacks for real actions and recover from rejected requests.",
    "Keep usage-example links inside the demo: use local buttons or prevent navigation. Demonstration links must not navigate to Vitrine routes or open other pages; preserve real URL support in the reusable component itself.",
    "Verify the result at narrow and wide viewport sizes, with keyboard input and reduced motion enabled.",
  ].join("\n");
}
