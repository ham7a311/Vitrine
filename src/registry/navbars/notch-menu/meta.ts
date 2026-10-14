import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "notch-menu",
  name: "Notch Menu",
  category: "navbars",
  description: "A dark notch hangs from the top of the page, camera lens and all, under a soft glow. Point at it and it grows — same black, same curved shoulders — into a panel of a few destinations and a Get started button, then shrinks back when you leave.",
  tags: ["navbar", "notch", "menu", "dynamic island", "mac", "dropdown", "navigation", "minimal"],
  traits: ["hover", "click", "keyboard", "touch"],
  source: "original",
  isNew: true,
  files: ["NotchMenu.tsx", "notch-menu.css", "notch.ts"],
  dependencies: [],
  prompt:
    "Build a menu that lives in a laptop-style notch. Props: links [{title, sub, href}], cta {label, href}, label, glow (colour), hint and onNavigate.\n\nThe page top is a black panel with 30px top corners and a faint hairline, lit by a soft radial glow of the glow colour pouring down from the top centre. The notch hangs from the very top edge: near-black, 44px tall and 300px wide (40% of narrow screens), flush at the top with 24px bottom corners and concave 14px shoulders where it meets the edge (radial-gradient ears), with a tiny camera lens in the middle — a dark sphere with a teal glint.\n\nPointing at the notch (after 90ms), tapping it, or pressing Enter on it grows it into a panel: the width springs to 600px (or the available width minus 24px) with a slight overshoot over 550ms, the corners widen to 30px, and the height opens with a grid-template-rows 0fr→1fr transition over 500ms. Inside, each destination is a row with the title (1.1rem, 600), a muted line and an arrow that nudges right on hover, then a full-width light pill button for the call to action, separated by a hairline. Rows and the button fade and slide in with a 45ms stagger after a 120ms delay. The glow dims a little and the hint under the notch fades out while it's open.\n\nLeaving the notch closes it after 220ms; Escape closes it and returns focus to the lens button; a press outside or focus leaving closes it. The lens is a button with aria-expanded and aria-controls; ↓ from it, then ↑/↓/Home/End move through the links and the button, which are out of the tab order while closed. Reduced motion switches open and closed instantly.",
  interaction: "Point at, tap or press Enter on the notch to open it; ↓ moves into the menu, ↑/↓ move between items; leave, tap outside or press Escape to close it.",
  animation: "Width springs over 550ms with a slight overshoot, height opens over 500ms, items fade and slide in with a 45ms stagger. Reduced motion: instant.",
  a11y: "A labelled nav with a real toggle button (aria-expanded, aria-controls); the links and the button are removed from the tab order while closed; Escape returns focus to the toggle.",
  responsive: "The notch shrinks to 40% of narrow containers at rest and opens to the available width minus 24px, never wider than 600px.",
  touchFallback: "Tap the notch to open or close it.",
  variants: [
    { id: "cobalt", label: "Cobalt", prompt: "Glow #2f5fd6: a deep blue light behind the notch." },
    { id: "violet", label: "Violet", prompt: "Glow #6b3fe0: a violet light behind the notch." },
    { id: "ember", label: "Ember", prompt: "Glow #d4561f: a warm orange light behind the notch." },
  ],
  preview: { bg: "#000000", mode: "fill", frame: [1440, 640] },
};
