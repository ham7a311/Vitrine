import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "underside-404",
  name: "Underside 404",
  category: "feedback",
  description: "A blank sheet with one corner turned up. Turn the page — drag the corner or press the button — and the back is printed with an index of the places that exist.",
  tags: ["404", "not found", "error page", "page turn", "recovery", "editorial"],
  traits: ["click", "touch", "keyboard"],
  source: "original",
  files: ["Underside404.tsx", "underside-404.css"],
  dependencies: [],
  prompt:
    "Build a not-found page as a single sheet of paper lying on a flat desk colour. The sheet is 30rem wide at most, about 4:3 tall, with a soft layered shadow. Front (recto): a hairline-ruled mono header 'No. 404' left and 'Recto' right; vertically centred, a 36–52px Instrument Serif headline 'This page is blank.' and a muted 15px line 'Nothing was ever printed on it. The way back is on the other side.'; at the bottom, a pill outline button 'Turn the page over ↶'. The bottom-right corner is cut away with clip-path along a 40px diagonal and a flap in the back's tone is folded over it, with a darker copy of the flap offset 3px as its shadow; the fold grows to 54px when the corner or the button is hovered or focused.\n\nBack (verso): the same ruled header reading 'Index' and 'Verso', then a nav with an ordered list of entries: an Instrument Serif label, a dotted leader that fills the gap, and a mono folio number, each a 44px link whose label and leader turn the accent colour on hover. A footer rule holds a pill 'Turn back ↷' button and a small uppercase home link.\n\nBoth faces share one grid cell inside a sheet with preserve-3d; the back is pre-rotated 180°, both hide their backface, and the sheet rotates by --turn × −180° around the vertical axis.",
  interaction:
    "The button turns the page and moves focus to the first index entry; Turn back returns and focuses the turn button. Dragging the turned corner leftwards turns the page live in proportion to the drag (pointer capture); releasing past 35% completes the turn, otherwise it settles back. A plain tap on the corner also turns it. The hidden side is inert and ignores pointers.",
  animation:
    "The page turn is a 720ms rotateY with a soft ease-out, tracked 1:1 during a drag with transitions off. The corner fold grows on hover. With reduced motion the sheet never rotates: the two sides cross-fade in place.",
  a11y:
    "The section is labelled by the front headline. The turn button has aria-expanded and aria-controls pointing at the back; the drag corner is decorative and hidden, so the button is the accessible path. The back is a labelled nav with an ordered list, and the side facing away is inert. Focus moves deliberately on each turn.",
  responsive:
    "The sheet is fluid to 320px, sized with container units so the headline and padding scale; the index keeps a minimum leader width and labels wrap rather than overflow.",
  touchFallback: "Drag the corner with a finger (touch-action is disabled on it), tap it, or use the button.",
  variants: [
    { id: "paper", label: "Paper", prompt: "Paper theme: desk #e3dfd6, sheet #fbfaf6, back of sheet #f3f0e8, ink #1f1d19, muted #6e695f, faint leaders #aaa498, hairlines rgb(31 29 25 / 0.12), accent brick #a2361f." },
    { id: "night", label: "Night", prompt: "Night theme: desk #141416, sheet #222226, back of sheet #1c1c20, ink #ece9e2, muted #a19d94, faint leaders #67645e, hairlines rgb(236 233 226 / 0.12), accent coral #f08a6c, deeper black shadows." },
  ],
  preview: { bg: "#e3dfd6", mode: "page", frame: [1280, 800] },
  isNew: true,
};
