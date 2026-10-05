import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "blank-page-starter",
  name: "Blank Page Starter",
  category: "feedback",
  description: "The empty state of a new page: faint options under an untitled heading offer a blank page or a template, step aside the moment you type, and set a chosen template in line by line.",
  tags: ["empty state", "templates", "onboarding", "document", "editor", "new page"],
  traits: ["keyboard", "click"],
  source: "original",
  files: ["BlankPageStarter.tsx", "blank-page-starter.css"],
  dependencies: [],
  prompt:
    "Build the empty state of a new document page in a warm-minimal style (Inter, ink #37352f). A borderless 30–40px bold title input with tight tracking and a pale 'Untitled' placeholder, then a borderless auto-growing body textarea whose 'Start writing…' placeholder only shows when focused. Under it, a small faint label 'Begin with' and a stack of ghost options, each a 32px row in faint grey #a5a29a with a 20px glyph: '▢ Empty page' (with a tiny bordered ↵ key hint), '✎ Meeting notes', '☷ Weekly plan', '❏ Reading list'. Hovering or focusing an option gives it a 6% ink background and full ink colour; options rise in 40ms apart.\n\nTyping in the body makes the options disappear (clearing it brings them back). Choosing a template sets the title to the template name if it is empty and replaces the body with the template's lines, set in one by one (4px rise, 260ms, 40ms stagger): 20px semibold headings, • bullets, real to-do checkboxes that strike through when ticked, and plain text. A quiet 'Start over with a blank page' button follows the last line.",
  interaction:
    "From the title, ↓ moves into the options and Enter starts an empty page (focus goes to the body). ↑/↓ walk the options; ↑ from the first returns to the title. Choosing a template moves focus to Start over; Start over clears everything and focuses the title. onPick reports the template id or 'empty'.",
  animation: "Options and template lines rise 4px and fade in with a 40ms stagger. Reduced motion shows them immediately.",
  a11y: "The page is an article named by its title. Options are a labelled group of real buttons; checkboxes are wrapped in labels. Focus is moved deliberately after each choice and is always visible.",
  responsive: "One fluid column; the title scales with container width and long template lines wrap.",
  touchFallback: "Every option is a tap target; nothing depends on hover.",
  variants: [
    { id: "light", label: "Light", prompt: "Light theme: page #ffffff, ink #37352f, muted #787774, faint #a5a29a, title placeholder #b9b6ae, hover rgb(55 53 47 / 0.06), key hint border rgb(55 53 47 / 0.12), focus and checkbox accent #2383e2." },
    { id: "dark", label: "Dark", prompt: "Dark theme: page #191919, ink #e3e2e0, muted #9b9a97, faint #6f6e69, title placeholder #5f5e5a, hover rgb(255 255 255 / 0.055), key hint border rgb(255 255 255 / 0.09), focus and checkbox accent #529cca." },
  ],
  preview: { bg: "#ffffff", mode: "fill", frame: [800, 560] },
  isNew: true,
};
