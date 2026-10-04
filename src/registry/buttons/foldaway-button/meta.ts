import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "foldaway-button",
  name: "Foldaway",
  category: "buttons",
  description: "Two sheets of card meeting at a crease: on hover the top sheet folds down over the front and its back reveals the next state.",
  tags: ["button", "3d", "fold", "hover", "paper", "text-swap"],
  traits: ["hover", "keyboard", "touch"],
  source: "original",
  files: ["FoldawayButton.tsx", "foldaway-button.css"],
  dependencies: [],
  prompt: `Design a button that behaves like a folded piece of card. It is a 192×56px sheet of warm paper with a crease at its horizontal midline and a soft grounded shadow. At rest the label ("Send message") reads across both halves.

On hover or focus the top half — a flap hinged on the crease — folds forward and down through 180° over 650ms (cubic-bezier(0.5,0,0.15,1)) in real 3D perspective. Because the flap has two faces, the fold reveals new text: the flap's front is the top half of the resting label; its back (visible once folded) is the bottom half of the revealed label, and underneath, the top half of the revealed label appears in the space the flap vacated. The result is that the whole label changes from "Send message" to "Sent ✓" through a physical fold, in a cool frost tint so the state change is unmistakable. As the flap turns away it darkens with a gradient shading, and a hairline crease shadow stays at the hinge. Keyboard focus folds it too; on touch it folds while pressed. The accessible name is the resting label (visually hidden copy) — the decorative halves are aria-hidden.`,
  interaction: "Hover/focus folds the flap and swaps the label; leaving unfolds it. On touch it folds while pressed.",
  animation: "Fold 650ms cubic-bezier(0.5,0,0.15,1) in 3D; shading fades over the same time.",
  a11y: "A real <button> with a visually-hidden resting label; the revealed text is decorative, so if it conveys real state, also announce it via aria-live in your app. Focus-visible triggers the same fold plus an outline.",
  responsive: "Fixed 12rem width by default; override with a class for longer labels.",
  touchFallback: "Folds while pressed.",
  preview: { bg: "#0b080d", mode: "fill" },
};
