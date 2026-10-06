import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "pulse-button",
  name: "Pulse Button",
  category: "buttons",
  description: "Buttons that move only because something is happening: an on-air button whose dot beats and whose viewer count ticks, a button whose badge pings when new items arrive, and a call to action that breathes a slow glow.",
  tags: ["button", "live", "pulse", "ping", "badge", "notification", "glow", "cta", "streaming"],
  traits: ["click", "keyboard", "ambient"],
  source: "original",
  files: ["PulseButton.tsx", "pulse-button.css", "pulse.ts"],
  dependencies: [],
  prompt:
    "Build a pill button (46px tall, fully rounded, 1px hairline, Inter 500 at 15px) that carries one kind of pulse, the one selected below.\n\nPalette (light / dark): ink #111111 / #ededed, muted #6b6b6b / #a0a0a0, face #ffffff / #161616, hairline #e2e2e2 / #2c2c2c, red #e11d2e / #ff3b4b, gradient #4f46e5 → #9333ea / #6366f1 → #a855f7. Focus ring 2px #2563eb / #6ea8fe, 3px out. Press scales to 0.97.\n\nShow it on a #f6f6f5 panel and a #0a0a0a panel side by side.",
  interaction: "A normal button. Its pulse never blocks it, and every number it shows is also in its accessible name.",
  animation: "Each pulse is CSS: rings 2s, badge ping 1.2s × 3, glow 3.2s. Reduced motion stops all of them and leaves a still, readable button.",
  a11y: "Native buttons; counts are spelled out for screen readers ('2.4k watching', '3 unread'); a toggle uses aria-pressed; motion is decorative and stops under reduced motion.",
  responsive: "Buttons keep their size; the panels stack on narrow screens.",
  touchFallback: "Nothing relies on hover; hover only strengthens what's already there.",
  variants: [
    { id: "live", label: "Live", prompt: "Live: the pill starts with a red 34px 'LIVE' tag (white, 12px, 700, 0.08em tracking) holding a white 8px dot with two rings that expand to 3.2× and fade over 2s, a second ring 1s behind. Then a play icon and 'Watch live', then the viewer count after a hairline divider in muted tabular figures, compacted (2.4k, 12k, 1.4M) and ticking. Pressing toggles aria-pressed: the label reads 'Watching' and the play icon becomes three small red equaliser bars bouncing at different speeds. Hover tints the edge red with a soft red shadow." },
    { id: "ping", label: "Ping", prompt: "Ping: an 'Inbox' pill with a tray icon and a red count badge (22px, 99+ cap) on its top-right corner, ringed in the page colour. When the number goes up the badge bumps (scale from 0.5 with overshoot) and a copy behind it pings out to 1.9× and fades, three times, then rests. Pressing clears the count. The accessible name includes the unread count." },
    { id: "breathe", label: "Breathe", prompt: "Breathe: a 52px gradient pill (#4f46e5 → #9333ea, white 16px semibold, a light top edge) reading 'Start building' with an arrow that slides 3px on hover. A blurred copy of the gradient behind it breathes: scale 0.96 ↔ 1.06 and opacity 0.35 ↔ 0.7 over 3.2s; on hover it brightens and breathes twice as fast." },
  ],
  preview: { bg: "#f6f6f5", mode: "fill", frame: [1000, 420] },
  isNew: true,
};
