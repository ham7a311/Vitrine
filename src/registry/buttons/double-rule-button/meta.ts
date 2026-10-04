import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "double-rule-button",
  name: "Double Rule Button",
  category: "buttons",
  description: "A button bordered like a certificate, with two hairline rules and fine engraving between them; on hover the inner rule moves out to close into one firm frame.",
  tags: ["button", "border", "formal", "certificate", "sign", "legal", "engraving"],
  traits: ["hover", "keyboard"],
  source: "original",
  files: ["DoubleRuleButton.tsx", "double-rule-button.css"],
  dependencies: [],
  prompt:
    "Build a formal button for consequential actions ('Sign the agreement'), styled like a banknote or certificate: a theme-coloured face, a 1px outer rule, a 1px inner rule 5px inside it, and in the band between them a fine engraving of two crossed repeating-linear-gradients (\u00b160\u00b0, 0.6px lines). Show the engraving only in the band, using a content-box mask composited with exclude. The label is set in Cinzel caps with wide tracking.\n\nOn hover or focus, the inner rule's inset animates to 0 and thickens to 1.5px (520ms expo-out), meeting the outer rule so the frame closes into one firm line; the engraving fades, the tracking tightens slightly and a soft shadow in the rule colour appears \u2014 the document is sealed. Pressing nudges it down 1px.",
  interaction: "Hover or focus to close the double rule into one frame; press to act.",
  animation: "Inner rule and tracking move over 520ms expo-out; the engraving fades over 360ms.",
  a11y: "A real button with a text label and a strong outline on focus; the rules and engraving are decorative. Reduced motion makes the change instant.",
  responsive: "Intrinsic width from its label.",
  variants: [
    { id: "paper", label: "Ivory", prompt: "theme=\"paper\" (ivory): ivory face #fbf8ef with banknote-green rules, engraving and label (#1f4d3a)." },
    { id: "night", label: "Bottle green", prompt: "theme=\"night\" (bottle green): dark green face #12241c with gold rules, engraving and label (#d8bf86)." },
  ],
  preview: { bg: "#efeadc", mode: "fill" },
};
