import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "entry-ring-button",
  name: "Entry Ring Button",
  category: "buttons",
  description: "A pill whose gradient border draws itself from exactly where your cursor crossed the edge, growing both ways round to meet on the far side, and shrinks away toward where you leave.",
  tags: ["button", "border", "gradient", "direction-aware", "svg", "stroke-dasharray"],
  traits: ["hover", "cursor", "keyboard"],
  source: "original",
  files: ["EntryRingButton.tsx", "entry-ring-button.css"],
  dependencies: [],
  prompt:
    "Build a dark pill button (52px, hairline ring) with an SVG outline measured by a ResizeObserver: a pill path with pathLength=1, stroked 2px with a diagonal frost → lilac → amber gradient and a soft drop-shadow glow. At rest the dash is '0 1', so nothing shows.\n\nOn pointerenter, project the pointer onto the outline and express it as a fraction s of the way round. Show a single dash centred on s: dasharray 'len 1−len' with dashoffset −(s − len/2). Jump to len 0 at s, then transition len to 1 (620ms ease-in-out, dasharray and dashoffset together, so the centre stays put): the line grows both ways from your entry point and meets on the far side. On pointerleave, project the exit point, re-centre the full ring on it with no transition (invisible at full length), then transition len back to 0, so the line shrinks away toward where you left. Keyboard focus grows it from the middle of the bottom edge. Pressing fades in the same gradient as the face (scale 0.85 → 1) and turns the label to ink.",
  interaction: "Enter from any side and the border draws from that point; leave and it retracts toward the exit. Press to flood the face.",
  animation: "Draw and retract 620ms ease-in-out; press flood 120–200ms.",
  a11y: "A real button with its text as the label; the outline is aria-hidden. Focus draws the ring and adds an outline. Reduced motion makes the ring appear instantly.",
  responsive: "The outline is rebuilt from the measured size, so it fits any label.",
  touchFallback: "No ring on touch; pressing floods the face as feedback.",
  variants: [
    { id: "night", label: "Night" },
    { id: "paper", label: "Paper" },
  ],
  preview: { bg: "#0b0a0d", mode: "fill" },
};
