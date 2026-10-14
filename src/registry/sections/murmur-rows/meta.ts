import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "murmur-rows",
  name: "Murmur Rows",
  category: "sections",
  description: "Testimonials as two quiet rows of quotes drifting in opposite directions, with edges that blur out like a shallow depth of field. Point at a row and it stops, with that quote brought forward; a pause button stops everything.",
  tags: ["testimonials", "quotes", "reviews", "social proof", "marquee", "wall of love", "customers", "infinite scroll"],
  traits: ["ambient", "hover", "keyboard", "touch"],
  source: "original",
  isNew: true,
  files: ["MurmurRows.tsx", "murmur-rows.css", "murmur.ts"],
  dependencies: [],
  // "aria-pressed" in the brief is the toggle attribute, not the option.
  promptAllow: ["pressed"],
  prompt:
    "Build a testimonial section where quotes drift sideways in rows. Props: quotes [{id, text, name, role, avatar, tint}], rows (1–3, default 2), speed (px/s; default 24, 18 in narrow containers; 0 holds still), look and label.\n\nDeal the quotes into rows round-robin. Each row is a measured loop: render one sequence of quotes with a trailing gap, measure its width, repeat it enough times to cover the row plus a spare, and move the track by translate3d at a constant pixel speed, wrapping by the exact measured period, so the seam never shows. Rows alternate direction — the first moves left, the next right — and start out of step. Re-measure on resize and font load, keeping each row's progress proportional. Clamp long frames so a backgrounded tab doesn't jump, and stop the animation frame entirely when the section is offscreen or the page is hidden.\n\nA quote is a fixed 440px column: the text at 1.32rem, weight 500, line height 1.42, clamped to six lines; then, 44px below, a 54px round portrait beside the name and role (1.12rem, the role muted). Quotes sit 120px apart and rows 76px apart on a black ground, with text at about 92% white.\n\nBoth edges carry a progressive blur 15% of the width wide: three stacked layers with backdrop blur at 1, 3 and 6px, each masked by a gradient that starts further from the edge than the last, so letters soften gradually as they leave, then a final gradient into the ground colour.\n\nPointing at a row stops that row only and dims its other quotes to 45%, leaving the one under the pointer at full strength. A small pill button in the bottom-right corner ('Pause testimonials' / 'Play testimonials', with an icon and aria-pressed) stops and restarts all rows.\n\nAssistive tech reads one plain list of the quotes as figure, blockquote and figcaption; the moving rows are hidden from it. With reduced motion, or fewer than three quotes, there are no rows: the quotes wrap in a static grid with no blur.\n\nBelow 640px quotes narrow to 300px, text drops to 1.08rem and portraits to 44px.",
  interaction: "Point at a row to stop it and bring one quote forward; move away and it carries on. The pause button stops and restarts every row.",
  animation: "Rows move at 24px/s (18px/s on small screens) in opposite directions, with no easing or jumps; dimming takes 240ms. Animation stops offscreen and in hidden tabs. Reduced motion shows a static grid.",
  a11y: "A labelled region with a single list of quotes for assistive tech, while the moving copies are hidden. The pause button is a real toggle with a label that says what it will do, so the motion can always be stopped (WCAG 2.2.2). Reduced motion removes the movement entirely.",
  responsive: "Rows always fill the width and repeat to cover it. Below 640px quotes and type step down; the blur edges scale with the width.",
  touchFallback: "Touch doesn't hover, so rows keep moving; the pause button stops them.",
  variants: [
    { id: "illustrated", label: "Illustrated", prompt: "Give every quote a portrait: a small monoline bust (a white figure with ink hair and features on a near-black disc with a fine ring), each person with their own hair and collar. Black ground, white text." },
    { id: "text-only", label: "Text only", prompt: "Leave the portraits out. The attribution sits 28px under the quote on one line: an em dash and the name in weight 500, then the role in the muted colour. Black ground, white text." },
    { id: "tinted", label: "Tinted", prompt: "Put each quote on a soft pastel card (peach, sage, lilac, butter, sky and rose in turn), 360px wide, 24px radius, padding 26px 28px, on a warm off-white ground #f6f5f1. Ink text at 1.14rem, a 40px initials disc in a deeper shade of the card colour, the name in weight 650. Cards sit 28px apart in both directions." },
    { id: "pressed", label: "Pressed", prompt: "Make every quote a tactile card in the style of a two-layer press button: a solid ink backing (#1c1b18) with a pastel face 2px-outlined in ink and offset 5px left and 6px up. Pointing lifts the face to 7px and 9px with a slight overshoot; pressing sinks it flush in 80ms. Initials discs carry the same ink outline. Warm paper ground #f3efe6, cards 360px wide and 34px apart." },
  ],
  preview: { bg: "#000000", mode: "fill", frame: [1440, 760] },
};
