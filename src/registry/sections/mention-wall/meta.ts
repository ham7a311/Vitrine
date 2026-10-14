import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "mention-wall",
  name: "Mention Wall",
  category: "sections",
  description: "A masonry wall of public posts about your product, each one checkable: it links to the original, carries its date and network, and only shows a verified tick when the data says so. Columns balance by measured height, and Show more adds the next page and moves focus to it.",
  tags: ["testimonials", "wall of love", "social proof", "tweets", "posts", "masonry", "reviews", "mentions"],
  traits: ["click", "keyboard", "touch"],
  source: "original",
  isNew: true,
  files: ["MentionWall.tsx", "mention-wall.css", "masonry.ts"],
  dependencies: [],
  prompt:
    "Build a masonry wall of social posts. Props: posts [{id, author {name, handle, avatar, verified}, body, date, href, source, archived}], pageSize (default 12), look, label and onNavigate.\n\nColumns: four from 1180px of container width, three from 860px, two from 560px, otherwise one; 22px gaps (14px in one column). Don't use CSS columns: place posts in list order into whichever column is currently shortest, using each card's measured height (a ResizeObserver per card) and a text-length estimate until it's measured, so columns end within about one card of each other and reading down a column follows the list.\n\nA card is 22px radius, 24px 28px 20px padding. Header: a 50px round avatar (the image, or initials on a soft two-hue gradient picked from the name), then the name (1.06rem, weight 700) with a blue scalloped verified seal only when verified is true, the @handle muted under it, and a small speech-bubble button at the top right that links to the original ('View Artem Volkov's post on Chirp'). Body: plain text at 1.06rem and line height 1.62, blank lines as paragraphs, emoji kept as text, clamped to nine lines. Footer: the date ('Mar 4, 2026', a time element) and the network name; when the body is clamped the network name becomes 'Read on Chirp'; an archived post drops every link and says 'Original removed'.\n\nOnly the first page shows. While more remain, the wall fades out over its last 280px with a mask and a dark pill button sits over the fade ('Show more' with '4 more' beside it); pressing it adds the next page and moves focus to the first new post. With no posts the section renders nothing.\n\nBelow 560px cards tighten to 20px padding and 18px radius, avatars to 44px and body text to 1rem.",
  interaction: "Read the wall; the bubble icon and 'Read on…' open the original post. Show more adds the next page and puts focus on its first post.",
  animation: "Nothing moves on its own. Buttons lift 1px on hover. Reduced motion removes the hover movement.",
  a11y: "A labelled section of articles, each named by its author. Reading order follows the list within each column. The verified seal has a text label; links name the author and the network. Show more moves focus to the first new post so keyboard and screen-reader users land on new content.",
  responsive: "One to four columns from the container's width; cards and type step down below 560px. Columns re-balance whenever a card's height changes.",
  touchFallback: "Everything is a tap: the bubble and the 'Read on' link are real links with 32px targets, and nothing depends on hover.",
  variants: [
    { id: "paper", label: "Paper", prompt: "Light page #f6f6f5, white cards with a 6% ink hairline and a soft shadow (0 1px 2px at 4%, 0 10px 30px -12px at 10%), ink #171716, body #262624, muted #686864, verified seal #2f7cf6; the Show more pill is ink with white text." },
    { id: "night", label: "Night", prompt: "Dark page #0b0b0c, cards #161618 with a 7% white hairline and a deep soft shadow, text #f2f2f0, body #dcdcd8, muted #9b9b96, verified seal #4d90fa; the Show more pill is light with dark text." },
    { id: "pressed", label: "Pressed", prompt: "Tactile cards in the style of a two-layer press button: each post sits on a solid ink backing (#1c1b18) with its cream face (#fffdf8) outlined 2px in ink and offset 5px left and 6px up. Pointing lifts the face to 7px and 9px with a slight overshoot and pressing sinks it flush in 80ms. Avatars carry a 2px ink ring. Warm linen ground #f3efe6; the Show more pill is ink with a hard offset shadow." },
  ],
  preview: { bg: "#f6f6f5", mode: "fill", frame: [1440, 900] },
};
