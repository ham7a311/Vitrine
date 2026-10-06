import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "platform-badges",
  name: "Platform Badges",
  category: "buttons",
  description: "Download and store buttons with the platform marks (macOS, Windows, Linux, App Store, Mac App Store, Google Play, Microsoft Store, Android) in your choice of a solid, outline or light style, grouped into desktop, stores and a large pair.",
  tags: ["download", "app store", "google play", "macos", "windows", "linux", "badge", "buttons", "platform", "store", "android"],
  traits: ["click", "keyboard", "hover"],
  source: "original",
  files: ["PlatformBadges.tsx", "platform-badges.css", "logos.tsx"],
  dependencies: [],
  prompt:
    "Build a set of download and store badges for a fictional app, in the single style selected below.\n\nBadge: an inline link 52px tall (64px large) with an 11px radius (14px large), the platform mark at 27px (34px) on the left, and two lines: a small 10.5px top line ('Download for', 'Download on the', 'Get it on', 'Get it from') over an 18px (22px) semibold name. Marks are single-colour SVGs in currentColor (Apple, the four-square Windows mark, a penguin, the Android robot head, a shopping bag with four squares) except the Play triangle, which keeps its four colours. Kinds: macOS, Windows, Linux, Android APK, App Store, Mac App Store, Google Play, Microsoft Store. Hover lifts 1px, nudges the mark and slides a soft diagonal sheen across once; press moves down 1px.\n\nLayout: a 20px-radius panel (30px by 32px padding, 22px between groups, 10px between badges, wrapping) with small uppercase muted headings 'Desktop' (macOS, Windows, Linux), 'Stores' (App Store, Google Play, Microsoft Store, Mac App Store, Android APK) and 'Large' (the App Store and Google Play badges at 64px), on a #e9e9e6 or #060607 page.",
  interaction: "Badges are links; keyboard focus shows a 2px ring.",
  animation: "Hover lift, mark nudge and a one-pass sheen. Reduced motion removes them.",
  a11y: "Real links; the marks are aria-hidden because the visible text names the platform.",
  responsive: "Badges wrap; the panel tightens its padding under 520px.",
  touchFallback: "Every badge is a tap target; nothing depends on hover.",
  variants: [
    { id: "solid", label: "Solid", prompt: "Solid: near-black #0b0b0c with white text and a 1px #a6a6a6 inner edge, like store badges; hover adds a top highlight and a soft 8px/22px shadow. Panel #f7f7f5 on a #e9e9e6 page, headings #6c6c69." },
    { id: "outline", label: "Outline", prompt: "Outline: transparent with a 1.5px rgb(255 255 255 / 0.1) hairline and #f2f2f0 text; hover fills it with #17171a and brightens the hairline. Panel #101011 on a #060607 page, headings #9b9b98." },
    { id: "light", label: "Light", prompt: "Light: a pale #f4f4f2 slab with #0b0b0c text, a hairline inner edge and a 1px soft shadow; hover deepens the shadow. Panel #101011 on a #060607 page, headings #9b9b98." },
  ],
  preview: { bg: "#e9e9e6", mode: "fill", frame: [1000, 700] },
  isNew: true,
};
