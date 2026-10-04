import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "toast-stack",
  name: "Toast Stack",
  category: "feedback",
  description: "Notifications that stack like a hand of cards and fan out into a readable list on hover, pausing every timer.",
  tags: ["toast", "notification", "feedback", "stack", "hover", "aria-live"],
  traits: ["hover", "keyboard", "click"],
  source: "original",
  files: ["ToastStack.tsx", "toast-stack.css"],
  dependencies: [],
  prompt: `Design a toast system where the pile is the interface. Toasts are 14px-rounded dark plum cards with a hairline border, blur, and a deep shadow, each with a round status icon (info, success, error), a title, optional body, a dismiss button, and a 2px countdown hairline along the bottom edge that shrinks as its time runs out.

Stacking: all toasts are absolutely positioned at the bottom-right. The newest is at index 0 in front; each older one is offset up 0.7rem, scaled down 5.5% and faded 18%, anchored at the bottom centre, so the pile reads like cards in a hand. New toasts rise in (420ms, ease-out-expo). Hovering or focusing anywhere in the region fans the stack into a list — each toast moves up by its own height plus a gap and returns to full scale and opacity — and pauses every countdown; leaving resumes them. Dismissed toasts slide right and fade. At most four are visible; extras wait invisibly behind. Provide a provider + useToast() hook. The container is an aria-live="polite" region; each toast uses role="status", or role="alert" for errors.`,
  interaction: "Hover/focus the pile to fan it out and pause timers; click ✕ or wait to dismiss.",
  animation: "Enter 420ms ease-out-expo; stack ↔ fan 420ms; dismiss 320ms; countdown per frame.",
  a11y: "aria-live polite region; role=status/alert per toast; dismiss buttons are labelled with the toast title; focus inside the region also fans and pauses. Reduced motion removes the animations.",
  responsive: "Width min(22rem, 100% − 2rem), anchored to the bottom-right of its positioned container.",
  preview: { bg: "#0b080d", mode: "fill" },
};
