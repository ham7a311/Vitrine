import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "machined-bevel-button",
  name: "Machined Bevel Button",
  category: "buttons",
  description: "A button turned from metal whose bevelled rim catches the light from your pointer: the bright edge turns to face it, and pressing flips the bevel as the face sinks.",
  tags: ["button", "border", "bevel", "metal", "hardware", "toggle", "conic"],
  traits: ["cursor", "click", "keyboard"],
  source: "original",
  files: ["MachinedBevelButton.tsx", "machined-bevel-button.css"],
  dependencies: [],
  prompt:
    "Build a hardware-style button: a brushed-metal face (a vertical gradient plus a 1px repeating line texture) inside a 3px bevel drawn as a border-box conic gradient \u2014 white, mid grey, dark, mid grey, white \u2014 starting from a registered --angle. At rest the light comes from the top-left (\u221245\u00b0).\n\nOn pointer move anywhere within 360px, compute the angle from the button's centre to the pointer (atan2, +90\u00b0 to match conic-gradient's zero), so the bright edge of the bevel turns to face the cursor, transitioning 260ms. On press, the angle jumps to 135\u00b0 (light on the far side, as if the bevel were pressed in), the face drops 1px and gains an inset shadow. The label is engraved with a 1px highlight text-shadow. A small status LED sits before the label; the button is a toggle (aria-pressed): pressing reads 'Connected \u00b7 38 ms' and lights the LED green.",
  interaction: "Move the pointer around the button to see the bevel catch the light; press to connect (toggle).",
  animation: "Bevel angle follows the pointer over 260ms; press is 140ms; LED fades 200ms.",
  a11y: "A real toggle button with aria-pressed and a label that changes with state; the LED is decorative. Keyboard press works like a click. Reduced motion removes the transitions.",
  responsive: "Intrinsic width from its label.",
  variants: [
    { id: "paper", label: "Aluminium", prompt: "theme=\"paper\" (aluminium): a light brushed face #e9ebee → #c9cdd3 with dark engraved label #2b2f36; label \"Connect device\"." },
    { id: "night", label: "Gunmetal", prompt: "theme=\"night\" (gunmetal): a dark brushed face #3a3f47 → #24282e with a light engraved label #e6e8eb; label \"Connect device\"." },
  ],
  preview: { bg: "#dfe2e6", mode: "fill" },
};
