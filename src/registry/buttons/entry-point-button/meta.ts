import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "entry-point-button",
  name: "Entry Point",
  category: "buttons",
  description: "A pill whose colour blooms from the exact point your cursor crossed its edge, and drains away toward the point where it leaves — the label inverts precisely along the circle.",
  tags: ["button", "hover", "direction-aware", "clip-path", "text-reveal"],
  traits: ["hover", "cursor", "keyboard", "touch"],
  source: "original",
  files: ["EntryPointButton.tsx", "entry-point-button.css"],
  dependencies: [],
  prompt: `Design a pill button (56px, near-black plum face, cream label, hairline ring) in the same family as a liquid fill, but where the fill knows where you came from. On mouseenter, record the pointer's position as percentages of the button and write them to --ex/--ey; a full-size fill layer in the tone colour is clipped with clip-path: circle(0% at var(--ex) var(--ey)) and opens to circle(140%) over 640ms on cubic-bezier(0.16,1,0.3,1). On mouseleave, update the point to where the pointer exits and close the circle there on an ease-in curve (520ms), so the colour drains toward the side you left through.

The label is rendered twice: on the face in cream, and inside the fill in ink, in an identical box — so the letters invert exactly along the edge of the circle as it passes over them. Keyboard focus blooms from the centre. On touch, the fill blooms from the centre while pressed. The ring takes the fill colour on hover.`,
  interaction: "Enter from any side and the colour blooms from that point; leave and it drains toward the exit point. Focus blooms from the centre.",
  animation: "clip-path circle 640ms expo-out in, 520ms ease-in out; ring colour 300ms.",
  a11y: "A real <button>; the duplicated label inside the fill is aria-hidden. Focus-visible shows the filled state plus an outline. Reduced motion makes it instant.",
  responsive: "Intrinsic width with an 11rem minimum.",
  touchFallback: "Fills from the centre while pressed.",
  variants: [
    { id: "lilac", label: "Lilac", prompt: "tone=\"lilac\": the fill is lilac (#c8b9ea) with plum-ink letters inside it, on #0b080d." },
    { id: "frost", label: "Frost", prompt: "tone=\"frost\": the fill is frost blue (#b9cce4), on #0b080d." },
    { id: "ember", label: "Ember", prompt: "tone=\"ember\": the fill is amber (#e8a24a) over a warm-black face (#140e0a) with dark brown letters inside the fill, on a #0e0a07 page." },
  ],
  preview: { bg: "#0b080d", mode: "fill" },
};
