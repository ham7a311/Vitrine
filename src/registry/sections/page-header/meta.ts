import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "page-header",
  name: "Page Header",
  category: "sections",
  description: "The top of a document page: a cover you can change and reposition, an emoji icon overlapping it, an editable title, and status, owner, date and tag properties edited in place.",
  tags: ["document", "properties", "cover", "editor", "select", "tags"],
  traits: ["keyboard", "click", "touch"],
  source: "original",
  files: ["PageHeader.tsx", "page-header.css"],
  dependencies: [],
  prompt:
    "Build a document page header in a calm, warm-minimal style (Inter, ink #37352f, 4px radii, pastel select pills). A full-width cover 140–250px tall (24% of the container width) shows a flat colour or an image with background-size cover. On hover or focus a joined pair of small white tool buttons appears at its bottom right: 'Change cover' (opens a listbox of covers with a 28×18 swatch each) and, for images, 'Reposition'. Repositioning shows a centred dark hint 'Drag image to reposition · ↑ ↓ · Enter to save', turns the cover into a focused slider, and maps a vertical drag to background-position-y; Save position and Cancel replace the tools.\n\nBelow, in a 46rem column, an 84px emoji icon button overlaps the cover by 42px (a 4×4 emoji grid picker), then a borderless auto-growing 30–40px bold title with tight tracking and an 'Untitled' placeholder. Then a property list (dl) with a hairline under it: each row is a muted label with a 16px line icon (Status, Owner, Due, Tags) and a value cell that highlights warm grey on hover. Status is a rounded pill with a coloured dot that opens a listbox; Owner shows a 20px initials avatar and name with a people listbox; Due is a native date input; Tags are 3px-radius pastel pills with × remove buttons and a + that opens a search-or-create popover ('Create “Fieldwork”' assigns the next colour). Popovers are white, 6px radius, with a three-layer soft shadow.",
  interaction:
    "Each picker is a listbox that takes focus: ↑/↓/Home/End move, Enter or Space picks, Escape or Tab closes and returns focus to its trigger; outside presses close it. The cover slider moves 5% per arrow key, Enter saves and Escape restores the previous position. Enter in the title jumps to the Status value. onChange receives the full page state after every edit.",
  animation: "Popovers fade in and drop 3px over 120ms; cover tools fade in on hover. Reduced motion removes both.",
  a11y:
    "A header element with a description list; value buttons are named by their row label and current value via aria-labelledby, carry aria-expanded, and open listboxes with aria-activedescendant and aria-selected. Tag remove buttons are named 'Remove tag …'. The reposition mode is a real slider with aria-valuenow and a spoken value. Visible 2px focus rings throughout.",
  responsive: "The label column narrows to 6.5rem under 30rem; title and cover scale with container units; popovers fit the column on phones.",
  touchFallback: "Cover tools are always visible on touch screens; repositioning works with a finger drag (touch-action none while active); every picker is tap-friendly.",
  variants: [
    { id: "light", label: "Light", prompt: "Light theme: page #ffffff, ink #37352f, muted #787774, faint #a5a29a, hover rgb(55 53 47 / 0.06), active option rgb(55 53 47 / 0.08), hairline rgb(55 53 47 / 0.09), focus #2383e2, cover tools rgb(255 255 255 / 0.92) with #5f5e5b text. Pills: gray #f1f1ef/#787774, blue #e7f3f8/#337ea9, green #edf3ec/#448361, red #fdebec/#c4403b, purple #f6f3f9/#9065b0, orange #fbecdd/#b85c0b." },
    { id: "dark", label: "Dark", prompt: "Dark theme: page #191919, ink #e3e2e0, muted #9b9a97, faint #6f6e69, hover rgb(255 255 255 / 0.055), hairline rgb(255 255 255 / 0.08), focus #529cca, cover tools rgb(37 37 37 / 0.92) with #c9c8c5 text, date input in dark color-scheme. Pills on deep tints: gray rgb(255 255 255 / 0.09)/#b4b4b0, blue #143a4e/#7fc0e4, green #243d30/#8ccfa3, red #522e2a/#f2a39c, purple #3c2d49/#c7a2e2, orange #5c3b23/#eeb07c." },
  ],
  preview: { bg: "#ffffff", mode: "fill", frame: [1100, 720] },
  isNew: true,
};
