import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "stretchtext",
  name: "Stretchtext",
  category: "reading",
  description: "One article at three depths. Switch between Gist, Normal and Full and the extra detail grows inside the sentences themselves, washed briefly with a highlighter so you can see what's new, while the paragraph you were reading stays put on screen.",
  tags: ["article", "reading", "docs", "progressive disclosure", "summary", "editorial", "typography"],
  traits: ["click", "keyboard"],
  source: "original",
  files: ["Stretchtext.tsx", "stretchtext.css"],
  dependencies: [],
  prompt:
    "Build a long-form reader that lets the reader choose how deep to go, based on Ted Nelson's stretchtext: the same article written at three depths, where more depth adds clauses and sentences inside the text instead of linking elsewhere.\n\nAuthoring API: <Stretchtext levels={['Gist', 'Normal', 'Full']} defaultLevel={1} title='How Masar keeps your files'> wrapping ordinary paragraphs and small headings; inside them <More level={1}>…</More> is text that appears from that depth up, and <Less below={1}>…</Less> is shorter wording used only below that depth (so the gist can say 'Deleted files can be recovered for 30 days.' while Normal says it in two sentences). Word counts per depth are computed by walking the same tree that renders.\n\nSurface: warm paper with a 14px radius and hairline border, Newsreader at 17–19px with 1.62 line height for the text, small letter-spaced uppercase Hanken Grotesk headings, a 28–38px Newsreader title. A sticky top bar holds a three-part segmented control (each segment shows its name in bold and '96 words' under it; the active segment is a raised paper chip) and '2 min read' on the right.\n\nChanging depth: new text appears in place with a pale yellow highlighter wash that fades over 1.2s, and the added length is revealed downward over 320ms with a clip (layout settles at once, so scrolling stays correct). The first paragraph still on screen is held at the same position by adjusting scroll, so expanding text above doesn't push the reader's place away. Paragraphs that still have more to say at a greater depth carry a dotted rust rule in the left margin.",
  interaction:
    "The segmented control is a native radio group (arrow keys move between depths). While focus is anywhere in the article, ] goes one level deeper and [ one level shallower. onLevelChange(level) reports changes.",
  animation:
    "New text: a highlighter wash held for the first quarter of 1.2s then faded. Length: when the article grows, a clip-path reveal over 320ms cubic-bezier(.2,.8,.2,1) uncovers the new length; shrinking is immediate. With prefers-reduced-motion or motion={false} the change is immediate and new text keeps a static highlight until the next change, so it can still be found.",
  a11y:
    "Hidden text is removed from the DOM rather than visually hidden, so assistive tech reads exactly what is shown. The depth control is a fieldset with a legend and native radios that declare their [ ] shortcuts. A polite live region announces the new depth with its word count and reading time.",
  responsive: "Side padding and type size scale with the viewport; the bar wraps under 30rem and stays sticky at the top of the article while reading.",
  touchFallback: "Tap a depth; scroll position is held the same way as with a mouse.",
  variants: [
    { id: "light", label: "Light" },
    { id: "dark", label: "Dark" },
  ],
  preview: { bg: "#ebe5d8", mode: "page", frame: [1000, 760] },
  isNew: true,
};
