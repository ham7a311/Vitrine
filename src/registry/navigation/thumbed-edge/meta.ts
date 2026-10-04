import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "thumbed-edge",
  name: "Thumbed Edge",
  category: "navigation",
  description: "A long document's contents drawn as the fore-edge of a well-used book. Section thickness is the section's real length, the ones you read most wear darker, and a ribbon hangs out where you left off last time.",
  tags: ["table of contents", "toc", "scroll", "memory", "history", "reading", "docs", "handbook"],
  traits: ["scroll", "click", "hover", "keyboard", "touch"],
  source: "original",
  files: ["ThumbedEdge.tsx", "thumbed-edge.css"],
  dependencies: [],
  prompt: `Build a table of contents for a long scrolling document that remembers how you have used it.

<ThumbedEdge scroller sections storageKey seedWear orientation theme motion />. scroller is a ref to the element that scrolls; sections are { id, title } and are found inside it by id.

Draw the contents as the fore-edge of a book: a narrow vertical stack (34px) of page bands in a flex column, each band's flex-grow equal to its section's measured offsetHeight (a ResizeObserver keeps it current), so section thickness is real length. Bands have a fine horizontal ruling (a repeating 2px/1px gradient) and a 1px separator.

Wear: a 1s interval adds a second to the section under a reading line at 30% of the scroller height, only while document.visibilityState is visible. Wear level is 0 below 3 seconds, otherwise ceil(4 × seconds / most-read) from 1 to 4, and darkens the band with a warm grey wash plus a soiled outer margin at levels 3–4. Persist { wear, ribbon } to localStorage inside try/catch.

Ribbon: it marks where the *last visit* ended. On pagehide, on the tab becoming hidden and on unmount, save { sectionId, fraction }; on the next visit draw a red ribbon with a notched tail hanging out of the right edge at exactly that point on the stack. It never moves while you read. The ribbon is itself the control: a real button with a generous hit area (the silk is drawn inside it), labelled 'Back to where you left off, in <section>'; pressing it scrolls there (smooth, unless reduced motion). It is at full strength when you are more than 4% of the stack away from it.

'You are here' is a 2px line with a dot across the stack, positioned by section index plus fraction through the section. Hovering or focusing a band slides it out 3px, like a page you are about to turn, and shows its title on a small ink tab beside the edge.

Each band is a real button in an ol inside a nav. ↑/↓ (←/→ when horizontal), Home and End move between them; aria-current=location marks the section you are in. Horizontal orientation is the same object turned on its side as a 26px strip across the top of the document (the demo switches when its container is under 600px): the ribbon hangs down into the text and section tabs open above the strip. Touch has no hover, so after a jump the section's tab shows for 1.4s. Paper and Night themes.`,
  interaction: "Scroll the handbook: the hairline follows you and the ribbon lands where you stop. Click a band to jump, or press the ribbon to go back to where you left off.",
  animation: "Bands slide 3px on hover (220ms); the ribbon glides if it is ever re-placed (320ms); the hairline tracks scroll. Wear changes are quiet and slow: a second at a time.",
  a11y: "A nav landmark with an ordered list of buttons; aria-current marks the current section; arrow keys, Home and End roam the edge. The ribbon is a labelled button, and a status region announces jumps. Wear is decorative and additionally announced as 'well read' on heavily used sections. Reduced motion removes the slide and glide, and scrolls instantly.",
  responsive: "In a narrow container the edge becomes a horizontal strip across the top of the document, with the ribbon hanging into the text.",
  touchFallback: "Tap a band to jump; the tab label appears on focus.",
  variants: [
    { id: "paper", label: "Paper" },
    { id: "night", label: "Night" },
  ],
  preview: { bg: "#f3f1ec", mode: "fill" },
};
