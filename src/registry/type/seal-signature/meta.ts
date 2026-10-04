import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "seal-signature",
  name: "Seal Signature",
  category: "type",
  description: "A name as a heraldic seal — italic serif at the centre, the full name and a number circling a slowly rotating ring.",
  tags: ["name", "seal", "svg", "textpath", "team", "ambient"],
  traits: ["ambient"],
  source: "original",
  files: ["SealSignature.tsx", "seal-signature.css"],
  dependencies: [],
  prompt: `Build an SVG seal on a 280×280 viewBox for a person's name. At the centre, set the given name in Instrument Serif italic (44px, -0.03em) filled with a per-person accent colour; if the name has more than one word, stack it on two tspans. Around it, run a legend — the full name, a middle dot, a two-digit number, another dot, repeated three times — in Geist Mono 10px, 0.18em tracking, uppercase, at 70% opacity. Lay the legend on a circular textPath of radius 108 and set textLength to the circumference (2πr) with lengthAdjust="spacing", so the text always closes the ring exactly whatever the name length.

Clip the legend to a band between radius 99 and 117 with an even-odd clipPath. Wrap it in a group that rotates 360° every 40s linear, transform-box: view-box, and give each seal a different negative animation delay so a row of seals never turns in step. Decorate with two hairline rings (r128 at 40%, r94 at 22%), eight short ticks between r90 and r97 at 22.5° + 45°·i, and sixteen palmettes (each a leaflet plus five leaves, with ridge strokes) at 22.5° steps, alternating full-size at 45% fill and scaled to 82% at 27%; scale the whole seal 1.2. Finish with a drop-shadow glow in the accent colour.`,
  interaction: "None — ambient. The ring turns continuously.",
  animation: "One linear 40s rotation on the legend group, staggered per seal by a negative delay.",
  a11y: "The svg is role=img with a label naming the person and number. Reduced motion freezes the ring.",
  responsive: "Scales fluidly with its container (max 320px). Colour, speed and offset are props.",
  variants: [
    { id: "indigo", label: "Indigo", prompt: "One seal: \"Hamza Al-Bulushi\", number 01, accent #5C7CFA (indigo), 260px wide on #0c0b0a." },
    { id: "rose", label: "Rose", prompt: "One seal: \"Hamza Al-Bulushi\", number 02, accent #EF6FA7 (rose)." },
    { id: "jade", label: "Jade", prompt: "One seal: \"Hamza Al-Bulushi\", number 03, accent #2FBF71 (jade)." },
    { id: "trio", label: "Three seals", prompt: "Three seals: \"Hamza Al-Bulushi\" 01 in #5C7CFA, 02 in #EF6FA7 and 03 in #2FBF71, 220px each, wrapping on narrow screens, each with a different negative rotation delay so they never turn in step." },
  ],
  preview: { bg: "#0c0b0a", mode: "fill" },
};
