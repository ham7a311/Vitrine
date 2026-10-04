import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "card-catalogue-faq",
  name: "Card Catalogue FAQ",
  category: "faq",
  description: "Questions filed like a library card catalogue: pull a topic's drawer and its index cards rise out of it; lift a card to read the answer on its ruled face.",
  tags: ["faq", "help", "tabs", "accordion", "library", "topics"],
  traits: ["click", "keyboard", "touch"],
  source: "original",
  files: ["CardCatalogueFaq.tsx", "card-catalogue-faq.css"],
  dependencies: [],
  prompt:
    "Build an FAQ for many questions sorted by topic, styled as a library card catalogue. The topics are drawer fronts in a wooden cabinet (a darker frame with 6px gaps; each front has a vertical grain made from repeating gradients, a brass label plate with the topic in serif small caps and its count in mono, and a brass half-ring handle). The fronts are a tablist; the chosen drawer is 'pulled': it moves 5px toward you, scales 2.5% and casts a shadow onto the cabinet.\n\nUnder the cabinet, the drawer's inside: a dark tray with shadowed side walls. Its index cards stand in it as a stack of cream cards showing only their heading row \u2014 a red mono call number ('BIL 02') and the question in serif. Changing drawer re-mounts the cards so they rise out of the tray, staggered 55ms.\n\nOpening a card (button with aria-expanded) lifts it 3px with a deeper shadow, draws the red header rule under the question and reveals its face with a grid-rows transition: the answer is set on blue ruled lines whose spacing equals the line height, so the text sits on the rules like a typed card. One card is open at a time. Arrow keys move between drawers; #billing and #billing-2 deep-link to a drawer and a card.",
  interaction: "Choose a drawer (click or ←/→) to see its cards; open a card to read its answer. Deep links open a drawer and card.",
  animation: "Drawer pull 420ms; cards rise 560ms staggered 55ms; card lift and face reveal 420–480ms.",
  a11y: "Drawers are tabs with roving tabindex controlling one tabpanel; cards are headings containing buttons with aria-expanded/aria-controls; closed faces are inert. The call numbers are decorative. Reduced motion removes the rise and lift.",
  responsive: "Drawers wrap to as many columns as fit (two under 480px); card headings stack the call number above the question.",
  variants: [
    { id: "paper", label: "Oak", prompt: "theme=\"paper\" (oak): light oak drawer fronts and cabinet on a warm paper page (#f3efe7)." },
    { id: "night", label: "Walnut", prompt: "theme=\"night\" (walnut): dark walnut drawer fronts and cabinet on a near-black page (#0e0c0b)." },
  ],
  preview: { bg: "#f3efe7", mode: "fill", height: 640 },
};
