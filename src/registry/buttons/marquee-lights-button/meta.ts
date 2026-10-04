import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "marquee-lights-button",
  name: "Marquee Lights Button",
  category: "buttons",
  description: "A theatre marquee for a border: warm bulbs run round the button chasing in threes, and pointing at it brings every bulb up and quickens the chase.",
  tags: ["button", "border", "lights", "theatre", "tickets", "events", "chase"],
  traits: ["hover", "keyboard", "ambient"],
  source: "original",
  files: ["MarqueeLightsButton.tsx", "marquee-lights-button.css"],
  dependencies: [],
  prompt:
    "Build a ticket button styled as a theatre marquee: a deep theme-coloured face with a gold inset rim, an engraved serif uppercase label ('Get tickets'), and a row of 5px bulbs running round just inside the edge. Measure the button and place the bulbs evenly along a rounded rectangle 7px in from the edge (straight edges and quarter-circle corners, about 12px apart), rounding the count to a multiple of three.\n\nEvery bulb runs the same stepped keyframe \u2014 lit (cream core, warm glow) for the first third of the cycle, off for the rest \u2014 and bulb k is delayed by (k mod 3) thirds, so light chases round the frame in threes. On hover or focus the cycle drops from 1.2s to 0.5s, the 'off' bulbs warm up so the whole frame is brighter, and the label picks up a faint glow. Reduced motion shows every bulb lit and still.",
  interaction: "Hover or focus to bring the lights up and speed the chase.",
  animation: "Chase cycle 1.2s (0.5s on hover), stepped; label glow 300ms.",
  a11y: "A real button with a text label; bulbs are decorative and hidden. Reduced motion stops the chase.",
  responsive: "Bulbs are re-placed from the measured size, so any label length closes the loop.",
  variants: [
    { id: "night", label: "Velvet red", prompt: "theme=\"night\" (velvet red): face #6e1c22, rim #c9a35a, cream label #fbefd6, on #0c0909." },
    { id: "paper", label: "Midnight blue", prompt: "theme=\"paper\" (midnight blue): face #1f2b4d → #121a33, rim #e8c77a, dim bulbs #4b4636, on a light #efe9dc page." },
  ],
  preview: { bg: "#0c0909", mode: "fill" },
};
