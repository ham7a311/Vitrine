import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "pulse-loader",
  name: "Pulse Loader",
  category: "controls",
  description: "A loading indicator drawn as a heartbeat trace with a glowing dash that spikes as it crosses the beat.",
  tags: ["loader", "spinner", "feedback", "svg", "css-only", "status"],
  traits: ["ambient"],
  source: "original",
  files: ["PulseLoader.tsx", "pulse-loader.css"],
  dependencies: [],
  prompt: `Design a loading indicator as an ECG trace. Draw one SVG path (viewBox 100×40, preserveAspectRatio none): a flat line, a small rounded P wave, a sharp QRS spike (down, up to the top, down to the bottom, back), a T wave, then flat again. Render it twice: a faint ghost (1px, 20% opacity) so the whole shape is always readable, and a bright line (2px, in the colour prop, soft drop-shadow glow) using pathLength=1 with stroke-dasharray 0.24 1 so only a 24% dash is visible.

Animate stroke-dashoffset from 0.24 to −1 over 1.6s with an ease-in-out curve, looping — the dash starts wholly before the path and ends wholly past it, so the light seems to travel along the trace and spike as it crosses the beat, then re-enters. Provide three sizes and a colour prop, with a muted label beside it. Use role="status" with the label as its accessible text. Under reduced motion show the whole trace lit, static.`,
  interaction: "None — status indicator.",
  animation: "Dash travel 1.6s ease-in-out infinite.",
  a11y: "role=status with visible text label; decorative SVG is aria-hidden. Reduced motion shows a static lit trace.",
  responsive: "Three fixed sizes (sm, md, lg).",
  variants: [
    { id: "frost", label: "Frost", prompt: "color=\"#b9cce4\" (frost blue); three sizes stacked — lg \"Syncing your library\", md \"Loading\", sm \"Saving\" — on #0b080d." },
    { id: "lilac", label: "Lilac", prompt: "color=\"#c8b9ea\" (lilac); the same three sizes." },
    { id: "amber", label: "Amber", prompt: "color=\"#f3b45f\" (amber); the same three sizes." },
  ],
  preview: { bg: "#0b080d", mode: "fill" },
};
