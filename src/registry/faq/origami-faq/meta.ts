import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "origami-faq",
  name: "Origami FAQ",
  category: "faq",
  description: "Every answer is a sheet folded in three. Open a question and the sheet unfolds panel by panel along its creases, each fold catching the light as it turns, and folds itself back up when you close it.",
  tags: ["faq", "accordion", "3d", "fold", "paper", "editorial", "questions"],
  traits: ["click", "keyboard"],
  source: "original",
  files: ["OrigamiFaq.tsx", "origami-faq.css"],
  dependencies: [],
  prompt: `Build an accordion FAQ whose answers unfold like a sheet of paper folded in three.

Data: { q, a: [three short paragraphs] }. Each question is an h3 > button (aria-expanded, aria-controls) with a mono number, a serif question and a small folded-corner mark that rotates and flattens when open. Several can be open; the first starts open.

Answer: a region whose wrapper height animates from 0 to the sheet's natural height (scrollHeight, kept current by a ResizeObserver) over 700ms, with perspective 1100px and overflow hidden. Inside, three nested panels, each hinged at its top edge (transform-origin 50% 0, transform-style preserve-3d): panel 2 sits inside panel 1 after its paragraph, and panel 3 inside panel 2. The paper colour is on each panel's own paragraph, not its container, so a parent never paints over its children. Folded: panel 1 is rotateX(−88°), edge-on to the question, and panels 2 and 3 are rotateX(176°), each folded back up under its parent. Opening plays top-down — panel 1 then 2 then 3, 220ms apart, each 360–380ms with a slight overshoot. Closing plays bottom-up with an ease-in, and the wrapper waits 120ms before shrinking. Each fold has a 10px crease shadow along its top and a darkening wash whose opacity follows the fold, so angled panels look shaded. Closed answers are inert and become hidden once the fold has finished (760ms). Paper (cream sheets, terracotta accent) and Night; reduced motion opens and closes instantly.`,
  interaction: "Click a question to unfold its answer; click again to fold it back. Several can be open at once.",
  animation: "Unfold top-down, 220ms apart (360–380ms each, slight overshoot); fold bottom-up; height 700ms; crease shading follows each panel.",
  a11y: "Standard disclosure buttons in headings with aria-expanded and aria-controls; each answer is a labelled region, inert while closed and hidden once folded; the 3D is purely visual. Reduced motion removes all folding.",
  responsive: "One column up to 40rem; the serif scales with the viewport.",
  touchFallback: "Identical on touch.",
  variants: [
    { id: "paper", label: "Paper", prompt: "Palette for this theme (Paper): --og-accent #b5541f; --og-crease rgb(80 60 30 / 0.18); --og-focus #1f4e8c; --og-ink #1f1c17; --og-line rgb(31 28 23 / 0.14); --og-muted #77705f; --og-paper #fbf6ea; --og-paper-2 #f6efdf. Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"paper\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
    { id: "night", label: "Night", prompt: "Palette for this theme (Night): --og-accent #f0a36a; --og-crease rgb(0 0 0 / 0.4); --og-focus #8fb8ff; --og-ink #efe8dc; --og-line rgb(239 232 220 / 0.14); --og-muted #9c968c; --og-paper #26241f; --og-paper-2 #2c2a24. Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"night\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
  ],
  preview: { bg: "#efe8d8", mode: "fill" },
};
