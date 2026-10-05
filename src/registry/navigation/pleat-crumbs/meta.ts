import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "pleat-crumbs",
  name: "Pleat Crumbs",
  category: "navigation",
  description: "A breadcrumb where every level is a fold. Open one and its siblings unfold in the line itself, while the rest of the path folds down to initials, so you can see the alternatives at any depth without a dropdown floating over the page.",
  tags: ["breadcrumb", "path", "hierarchy", "siblings", "navigation", "folder", "docs"],
  traits: ["click", "keyboard", "touch"],
  source: "original",
  files: ["PleatCrumbs.tsx", "pleat-crumbs.css"],
  dependencies: [],
  prompt: `Build a breadcrumb where depth and siblings are the same axis.

<PleatCrumbs path={[{ id, label, href?, siblings? }]} onNavigate(level, id) theme motion />. It is a nav > ol on one non-wrapping line. Each crumb is a label, then a chevron button. The chevron is the separator and also the way in: it has aria-expanded and aria-controls, and ArrowDown opens it. The last crumb's chevron points down.

Opening level i replaces that crumb's label, in the same place in the line, with a ul of its siblings (one button each; the current one has aria-current and an inset ring). The row unfolds with max-width 0 → 60em over 380ms, and each sibling fans out from behind the crumb with a 28ms stagger (opacity plus translateX(-10px) scaleX(0.7)).

At the same time every other crumb folds down to its initial: its label is a span with overflow hidden and max-width 20em that transitions to 0.75em over 360ms, so 'Components' becomes 'C' inside a small chip (and gets a title and aria-label with the full name). Nothing wraps, and nothing floats over the page.

Choosing a sibling calls onNavigate(level, id) and closes; the consumer returns a new path, and deeper crumbs unfold in with a max-width/opacity entrance. Escape closes and returns focus to the chevron; ←/→/Home/End move between siblings; a pointerdown outside closes.

Under 521px, when the path is longer than three levels only the last two show, preceded by an ellipsis button that reveals all. Paper and Night themes; reduced motion removes all the tweens.`,
  interaction: "Press a chevron: its siblings unfold in the line and the rest of the path folds to initials. Pick a sibling to replace the path from there.",
  animation: "Row unfold 380ms with a 28ms fan-out stagger; other crumbs fold to their initials over 360ms; chevron turns 320ms.",
  a11y: "A nav landmark with an ordered list; the last crumb has aria-current=page. Each chevron is a button with aria-expanded, aria-controls and a label naming its level. Focus moves to the current sibling on open and back to the chevron on Escape or choice; arrow keys roam siblings. Folded crumbs keep their full names as accessible labels. Reduced motion removes the folds.",
  responsive: "Never wraps. Under 521px only the last two levels show behind an ellipsis button.",
  variants: [
    { id: "paper", label: "Paper", prompt: "Palette for this theme (Paper): --pc-chip rgb(27 26 23 / 0.06); --pc-ink #1b1a17; --pc-line rgb(27 26 23 / 0.12); --pc-muted #77736b. Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"paper\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
    { id: "night", label: "Night", prompt: "Palette for this theme (Night): --pc-chip rgb(255 255 255 / 0.08); --pc-ink #ececea; --pc-line rgb(255 255 255 / 0.14); --pc-muted #8b8d93. Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"night\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
  ],
  preview: { bg: "#f3f1ec", mode: "fill" },
};
