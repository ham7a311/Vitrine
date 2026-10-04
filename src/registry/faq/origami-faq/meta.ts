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
    { id: "paper", label: "Paper" },
    { id: "night", label: "Night" },
  ],
  preview: { bg: "#efe8d8", mode: "fill" },
};
