import type { ComponentMeta } from "../../types";

const LIGHT_DARK = "Show it on a white panel and a #0a0a0a panel side by side.";

export const meta: ComponentMeta = {
  slug: "core-button",
  name: "Core Button",
  category: "buttons",
  description: "The everyday button set that product teams ship, done carefully: filled, soft, bordered, bare, destructive, positive, cautionary and text styles, each in three sizes with icons, an icon-only square, a loading state that keeps its width, and a disabled state, on light and dark.",
  tags: ["button", "buttons", "ui kit", "design system", "primary", "outline", "ghost", "danger", "loading", "icon button"],
  traits: ["click", "keyboard", "hover"],
  source: "original",
  files: ["CoreButton.tsx", "core-button.css"],
  dependencies: [],
  prompt:
    "Build one reusable button in the style of a modern product design system (crisp, neutral, Inter at 500), in the single style selected below.\n\nAnatomy: a native <button type=\"button\"> laid out as an inline flex row with an 8px gap. Sizes: small 32px tall, 12px side padding, 6px radius, 13.5px text, 14px icons; medium 40px, 16px, 8px radius, 15px text, 16px icons; large 48px, 22px, 10px radius, 16px text, 18px icons. Letter-spacing -0.01em, no wrapping. Optional icon before the label and optional icon after it (the trailing one slides 2px right on hover). With only an icon and an aria-label it becomes a square.\n\nStates: hover changes the fill over 0.15s; press scales to 0.97; keyboard focus shows a 2px #2563eb ring 2px outside (#6ea8fe on dark). Loading: the content fades to opacity 0 but keeps its space (so neither the width nor the accessible name changes), a 16px spinner (2px border with one side clear, 0.7s per turn) sits in the middle, and the button gets aria-busy and aria-disabled and ignores clicks. Disabled: native disabled, 45% opacity, a not-allowed cursor, no hover.\n\nShow it at each size, with a leading icon, with a trailing arrow, as an icon-only square, in a 'Save changes' button that loads for 1.6s when pressed, and disabled. " + LIGHT_DARK,
  interaction: "A real button: Enter and Space press it; loading buttons ignore presses; disabled buttons are skipped by Tab.",
  animation: "0.15s fill and ring changes, a 0.97 press, a 2px slide of the trailing icon and a 0.7s spinner. Reduced motion removes the press and slide and slows the spinner.",
  a11y: "Native button semantics. Loading keeps the label in the accessibility tree and sets aria-busy and aria-disabled; icon-only buttons need an aria-label; every fill keeps its text at 4.5:1 or better.",
  responsive: "Buttons keep their size; rows wrap, and the two panels stack on narrow screens.",
  touchFallback: "Nothing depends on hover; the press scale gives touch feedback.",
  variants: [
    { id: "primary", label: "Primary", prompt: "Primary: solid ink. Light: #0a0a0a fill, white text, hover #2e2e2e, a faint top highlight (inset 0 1px 0 white at 12%) and a 1px soft shadow. Dark: #ededed fill, #0a0a0a text, hover #cfcfcf. Copy: 'Continue', 'Deploy' with a plus icon." },
    { id: "secondary", label: "Secondary", prompt: "Secondary: a soft neutral fill with no shadow. Light: #f2f2f2 with #0a0a0a text, hover #e6e6e6. Dark: #1f1f1f with #ededed text, hover #2b2b2b. Copy: 'Preview', 'Duplicate'." },
    { id: "outline", label: "Outline", prompt: "Outline: transparent with a 1px inset ring and a barely-there shadow. Light: ring #d9d9d9 (#a8a8a8 on hover) with a 5% black wash on hover, #0a0a0a text. Dark: ring #343434 (#5c5c5c on hover) with a 7% white wash, #ededed text. Copy: 'Export', 'Invite'." },
    { id: "ghost", label: "Ghost", prompt: "Ghost: no fill and no ring until hover, which brings a 5% black wash (7% white on dark). Text #0a0a0a (#ededed on dark). Copy: 'Skip', 'Settings' with a gear icon." },
    { id: "danger", label: "Danger", prompt: "Danger: destructive red with white text. Light #dc2626, hover #b91c1c; dark #e5484d, hover #f2555a. A faint top highlight and 1px shadow. Copy: 'Delete', 'Remove' with a bin icon." },
    { id: "success", label: "Success", prompt: "Success: a confirming green with white text, dark enough for 4.5:1. Light #15803d, hover #166534; dark #238636, hover #2a9a40. Copy: 'Approve', 'Mark done' with a tick." },
    { id: "warning", label: "Warning", prompt: "Warning: amber #f5a524 with dark brown #241700 text (white would fail contrast), hover #e3920b (#ffb53d on dark), a stronger top highlight at 30%. Copy: 'Override', 'Force sync' with a triangle icon." },
    { id: "link", label: "Link", prompt: "Link: text only, #2563eb (#6ea8fe on dark), auto height and 2px vertical padding; the underline (1.5px, offset 4px) fades in on hover; press dims to 75% instead of scaling. No icon-only form. Copy: 'Learn more', 'View docs'." },
  ],
  preview: { bg: "#ffffff", mode: "fill", frame: [1100, 560] },
  isNew: true,
};
