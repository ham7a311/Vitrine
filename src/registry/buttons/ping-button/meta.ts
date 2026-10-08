import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "ping-button",
  name: "Ping Button",
  category: "buttons",
  description: "An 'Inbox' button with a count badge on its corner. When a new item arrives the badge bumps and a copy of it pings outward three times, then rests; pressing clears the count.",
  tags: ["button", "ping", "badge", "notification", "unread", "count", "inbox", "alert"],
  traits: ["click", "keyboard", "ambient"],
  source: "original",
  files: ["PingButton.tsx", "ping-button.css", "ping.ts"],
  dependencies: [],
  prompt:
    "Build an 'Inbox' pill button (46px tall, fully rounded, 1px hairline, Inter 500 at 15px) with a tray icon and a count badge.\n\nBadge: a 22px-high red capsule (white, 12px, 700, tabular figures, 99+ cap) on the button's top-right corner (-7px), ringed in the face colour with a 2.5px shadow so it cuts cleanly out of the corner. It only shows when the count is above zero. When the number goes up the badge bumps (scale from 0.5 with an overshoot, 0.35s) and a copy of it behind the badge pings outward to 1.9× and fades, three times at 1.2s, then rests. The accessible name includes the unread count; pressing the button clears it. In the demo a new message arrives every five seconds up to nine.\n\nPalette: ink #111111 / #ededed, face #ffffff / #161616, hairline #e2e2e2 / #2c2c2c, badge #e11d2e / #ff3b4b, focus ring #2563eb / #6ea8fe (2px, 3px out). Hover tints the face 4%; press scales to 0.97. Show it centred on a #f6f6f5 / #0a0a0a page.",
  interaction: "A normal button: Enter or Space opens the inbox and clears the badge.",
  animation: "A 0.35s bump and a 1.2s ping repeated three times whenever the count rises. Reduced motion shows the badge with no bump and no ping.",
  a11y: "Native button; the unread count is part of its accessible name and the badge says 'unread' to screen readers; the ping is decorative.",
  responsive: "One fixed-height pill.",
  touchFallback: "Nothing depends on hover.",
  variants: [
    { id: "light", label: "Light", prompt: "Palette for this theme (Light): --pngb-badge #e11d2e; --pngb-edge #e2e2e2; --pngb-face #ffffff; --pngb-focus #2563eb; --pngb-ink #111111. Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"light\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
    { id: "dark", label: "Dark", prompt: "Palette for this theme (Dark): --pngb-badge #ff3b4b; --pngb-edge #2c2c2c; --pngb-face #161616; --pngb-focus #6ea8fe; --pngb-ink #ededed. Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"dark\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
  ],
  preview: { bg: "#f6f6f5", mode: "fill", frame: [900, 400] },
};
