import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "ribbon-otp",
  name: "Ribbon OTP",
  category: "forms",
  description: "A one-time-code input as a single ribbon of cells: digits drop in, a light sweeps the ribbon on success, and it shakes on failure.",
  tags: ["otp", "input", "form", "authentication", "verification", "code"],
  traits: ["keyboard", "click"],
  source: "original",
  files: ["RibbonOtp.tsx", "ribbon-otp.css"],
  dependencies: [],
  prompt: `Design a verification-code input that reads as one object rather than six boxes. A single 14px-rounded ribbon (near-black plum, hairline border, faint top highlight) is divided into equal cells by hairline dividers. Each cell is a real numeric <input> in a mono face at 1.5rem.

Focus shows a frost underline and a faint frost wash on the active cell. Typing a digit fills the cell with a small drop-and-settle (240ms, overshoot) and advances focus; Backspace clears then moves back; arrow keys move; pasting a code fills all cells. When every cell is filled the code is submitted: on success a band of frost light sweeps across the whole ribbon (800ms) and the border turns frost; on failure the ribbon shakes, digits turn rose, and after 700ms it clears and refocuses the first cell. Use autocomplete="one-time-code" on the first cell, an accessible label per cell, and a polite live region for the result.`,
  interaction: "Type or paste digits; Backspace/←/→ navigate; completion verifies automatically.",
  animation: "Digit drop 240ms; success sweep 800ms; failure shake 380ms.",
  a11y: "A labelled group; each cell has 'Digit n of N' as its name; autocomplete one-time-code; result announced via aria-live. Reduced motion removes the drop, shake and sweep.",
  responsive: "Cells shrink below 26rem so six digits always fit.",
  preview: { bg: "#0b080d", mode: "fill" },
};
