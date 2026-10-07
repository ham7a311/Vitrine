import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "shadow-board",
  name: "Shadow Board",
  category: "controls",
  description: "Toolbar customisation as a workshop pegboard. Every tool has a painted outline where it hangs; take one up to the toolbar and the outline stays behind, so what's in use, what's missing and where each tool goes back are visible at a glance.",
  tags: ["toolbar", "customise", "settings", "editor", "physical", "reorder"],
  traits: ["click", "keyboard"],
  source: "original",
  files: ["ShadowBoard.tsx", "shadow-board.css"],
  dependencies: [],
  prompt:
    "Build toolbar customisation modelled on a workshop shadow board, the pegboard where every tool has its outline painted so a missing tool is obvious.\n\nAt rest it is just a working toolbar: a white 12px-radius bar with a soft shadow, 38px icon buttons with 8px radii and a light hover tint, and a 'Customize' outline button at the right end.\n\nCustomize opens a pegboard under the bar (the button fills dark and reads 'Done'): warm brown hardboard with a regular grid of punched holes every 22px, a small white note '7 of 9 on the toolbar · Delete puts a tool back, Alt + ← / → reorders' and a 'Restore default' button. Every tool has a fixed spot in a grid (84px minimum columns): a grey peg hook at the top, a 54px rounded outline painted in signal orange with the tool's icon painted inside it, and a condensed uppercase stencil name under it. Tools not on the toolbar hang on their hook over their own outline as light grey tiles with a drop shadow, tilted a degree or two, straightening and lifting on hover. A tool on the toolbar leaves only its painted outline. In customize mode each toolbar button shows a small dark × badge and the empty capacity shows as dashed slots.\n\nClicking a hanging tool flies it up to the end of the toolbar; clicking a toolbar tool flies it back onto its outline; 'Restore default' sends everything home at once. The flight is the same element moving between its two places.",
  interaction:
    "Outside customize mode toolbar buttons call onAction(id). In customize mode: click a board tool to add it (refused with a message when the toolbar holds max tools), click a toolbar tool or press Delete/Backspace on it to put it back, Alt+←/→ moves the focused toolbar tool. onChange(ids) receives the new order after every change.",
  animation:
    "Tools fly between the board and the toolbar with a FLIP transform over 420ms cubic-bezier(.2,.8,.2,1); neighbours slide to close or open the gap. The board drops in 6px over 260ms; hanging tiles straighten over 200ms on hover. Reduced motion or motion={false} moves tools instantly.",
  a11y:
    "The toolbar is role='toolbar' with roving tabindex and arrow/Home/End movement; button names change to 'Bold, put back on the board' while customising. The Customize button has aria-expanded. Board tools are buttons named 'Add Italic to the toolbar'; outlines left by tools in use are announced as 'Bold is on the toolbar'. Every change is announced in a polite live region.",
  responsive: "The toolbar wraps onto a second row when narrow; the board's grid fits as many 84px spots per row as there is room for.",
  touchFallback: "Tap tools to move them; nothing depends on hover or dragging.",
  variants: [
    { id: "light", label: "Light", prompt: "Palette for this theme (Light): --shb-bar #ffffff; --shb-board #c4a273; --shb-focus #1f4ea8; --shb-hole rgb(60 38 15 / 0.45); --shb-hook #8a8f96; --shb-ink #1f1d1a; --shb-line rgb(31 29 26 / 0.14); --shb-muted #625b51; --shb-paint #d9480f; --shb-tile #f3f2ee; --shb-tile-edge #b9b5ac. Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"light\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
    { id: "dark", label: "Dark", prompt: "Palette for this theme (Dark): --shb-bar #1c1d20; --shb-board #2b2621; --shb-focus #93b4ff; --shb-hole rgb(0 0 0 / 0.7); --shb-hook #8e949b; --shb-ink #ecebe7; --shb-line rgb(255 255 255 / 0.12); --shb-muted #a5a29a; --shb-paint #ff7a3d; --shb-tile #3a3d42; --shb-tile-edge #55595f. Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"dark\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
  ],
  preview: { bg: "#e7e3db", mode: "center", frame: [900, 600] },
};
