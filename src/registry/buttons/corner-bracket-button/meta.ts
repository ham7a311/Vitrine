import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "corner-bracket-button",
  name: "Corner Bracket Button",
  category: "buttons",
  description: "A square button with no outline, only four L-shaped brackets sitting just outside its corners. On hover they close in on the corners and turn to the accent, the button washes with colour, and the label opens its letter-spacing.",
  tags: ["button", "brackets", "corners", "hud", "viewfinder", "sci-fi", "focus", "mono"],
  traits: ["click", "keyboard", "hover"],
  source: "original",
  files: ["CornerBracketButton.tsx", "corner-bracket-button.css"],
  dependencies: [],
  prompt:
    "Build a square instrument-panel button drawn only with corner brackets, in a faint-wash tone and a bare tone and three sizes (36px, 46px, 54px tall; 16, 24, 30px side padding). Type: a monospace stack at 600, uppercase, 0.08em tracking, 12 to 14.5px. An optional arrow icon after the label slides 3px on hover.\n\nBrackets: four L-shaped corners (1.5px lines, 10px arms, ink at 55%) sitting 5px outside the button's corners; the wash tone also gets a faint 7% ink fill. On hover or keyboard focus the brackets close onto the corners (0px outside) and grow to 14px arms in the accent, the button washes with the accent at 10%, and the label's tracking opens from 0.08em to 0.12em, all over 0.3s. Press moves it down 1px. Focus also shows a 2px accent outline 8px out.\n\nPalette (light / dark): ink #0d0d0e / #f1f1ef, page #efefec / #0b0b0c, accent signal orange #ff5a1f with near-black text / acid lime #c6ff3d with near-black text, accent wash at 10%. Focus: a 2px accent outline.\n\nShow a large 'Launch' with an arrow, a bare 'View specs' and a small 'Arm', centred on the page colour.",
  interaction: "A normal button: click, Enter or Space. Hover and keyboard focus show the same closing brackets.",
  animation: "A 0.3s close-in of the brackets with the tracking opening, a 3px icon slide, a 1px press. Reduced motion makes them instant.",
  a11y: "Native button; the brackets are decorative; the label keeps 4.5:1 on the page and on the hover wash.",
  responsive: "Buttons keep their size and wrap in rows; the brackets sit outside the box, so leave 5px around the button.",
  touchFallback: "Nothing depends on hover; the press gives touch feedback.",
  variants: [
    { id: "light", label: "Light", prompt: "Palette for this theme (Light): --ccbk-accent #ff5a1f; --ccbk-focus #ff5a1f; --ccbk-ink #0d0d0e; --ccbk-wash rgb(255 90 31 / 0.1). Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"light\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
    { id: "dark", label: "Dark", prompt: "Palette for this theme (Dark): --ccbk-accent #c6ff3d; --ccbk-focus #c6ff3d; --ccbk-ink #f1f1ef; --ccbk-wash rgb(198 255 61 / 0.1). Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"dark\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
  ],
  preview: { bg: "#efefec", mode: "fill", frame: [900, 420] },
  isNew: true,
};
