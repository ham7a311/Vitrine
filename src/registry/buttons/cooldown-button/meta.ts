import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "cooldown-button",
  name: "Cooldown Button",
  category: "buttons",
  description: "“Resend code” with the wait drawn on its border: the outline drains clockwise as a timer, then closes, glows once and the button is ready.",
  tags: ["button", "border", "timer", "otp", "verification", "countdown", "auth"],
  traits: ["click", "keyboard", "touch"],
  source: "original",
  files: ["CooldownButton.tsx", "cooldown-button.css"],
  dependencies: [],
  prompt:
    "Build a 'Resend code' button for a verification screen whose border is the cooldown timer. From the measured size, draw a pill outline in SVG starting at the top centre and running clockwise, twice: a faint track, and an accent arc with pathLength=1.\n\nEvery animation frame, with rem = time left ÷ total, set the arc's stroke-dasharray to 'rem 1' and its dashoffset to −(1 − rem), so it drains clockwise from the top. The label ticks once a second ('Resend code in 0:24', tabular figures) and the button is aria-disabled with an accessible label that gives the seconds left. At zero the arc becomes a closed ring in green, a copy of it glows and fades once (900ms), the label reads 'Resend code' and a polite live region says it's available. Pressing it then calls onResend, announces 'New code sent to +968 9••• 4412' and starts the wait again.",
  interaction: "Wait for the border to drain, then press to resend; it starts the wait again.",
  animation: "Arc drains continuously over the cooldown; a 900ms glow when it's ready.",
  a11y: "Uses aria-disabled instead of disabled, so the button stays focusable and its label says how long is left; readiness and resends are announced politely. Reduced motion keeps the timer but drops the glow.",
  responsive: "The outline is rebuilt from the measured size.",
  variants: [
    { id: "night", label: "Night" },
    { id: "paper", label: "Paper" },
  ],
  preview: { bg: "#0b0a0d", mode: "fill" },
};
