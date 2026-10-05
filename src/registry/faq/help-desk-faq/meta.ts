import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "help-desk-faq",
  name: "Help Desk FAQ",
  category: "faq",
  description: "A help centre in three panes — topics, the questions in that topic, and the answer — like a mail client for help. Arrow keys move within a pane and between panes, every answer asks whether it helped, and on a phone the panes become a drill-down with a way back at each level.",
  tags: ["faq", "help center", "knowledge base", "support", "three pane", "keyboard", "articles"],
  traits: ["click", "keyboard"],
  source: "original",
  files: ["HelpDeskFaq.tsx", "help-desk-faq.css"],
  dependencies: [],
  prompt: `Build a three-pane help centre FAQ.

Data: topics ({ name, icon, articles: { q, body: paragraphs, updated }[] }).

Layout: a breadcrumb (Help / Topic / Article, the first two clickable), then a grid of a topics column (13rem, tinted, with icon, name and article count), a questions column (17.5rem) and the article. The selected topic and question are marked aria-current and highlighted. The article shows the topic as a kicker, the question as a heading, the paragraphs (max 62ch), "Updated …", and a "Was this helpful?" group with Yes/No buttons that turn into "Glad it helped" or "Thanks — we'll make this clearer" (a status) with a Change link; votes are remembered per article.

Keyboard: each list is a roving-tabindex set — ArrowUp/ArrowDown/Home/End move within it (moving through topics shows each topic's questions), ArrowRight moves on to the next pane (topics → questions → article heading) and ArrowLeft goes back. Choosing a topic focuses its first question; choosing a question focuses the article heading.

Responsive: between 769 and 1000px the topics collapse to an icon rail with hidden text labels. At 768px and below only one pane shows at a time — topics, then questions, then the article — sliding in from the right, each lower level with a Back button and focus placed on the new level. Questions fade in 35ms apart; the article fades up on change. Paper and Night; reduced motion removes the motion.`,
  interaction: "Pick a topic and a question; use the arrow keys to move within and between panes; vote on whether the answer helped. On a phone, drill in and use Back.",
  animation: "Questions fade in 35ms apart; the article fades up 300ms; phone panes slide in 280ms.",
  a11y: "A labelled breadcrumb nav; lists of real buttons with roving tabindex and aria-current; focus moves to the new pane's heading or list; the helpful vote is a labelled group with a status reply. Reduced motion removes the animation.",
  responsive: "Three panes on wide screens, an icon rail at tablet widths, and a one-pane drill-down on phones.",
  touchFallback: "The phone drill-down is designed for taps, with large rows and a Back button at each level.",
  variants: [
    { id: "paper", label: "Paper", prompt: "Palette for this theme (Paper): --hdk-accent #1f4e8c; --hdk-card #fffdf8; --hdk-focus #1f4e8c; --hdk-ink #1b1a17; --hdk-line rgb(27 26 23 / 0.1); --hdk-muted #6f6a62; --hdk-sel rgb(31 78 140 / 0.1); --hdk-side #f6f2ea. Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"paper\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
    { id: "night", label: "Night", prompt: "Palette for this theme (Night): --hdk-accent #8fb8ff; --hdk-card #18191c; --hdk-focus #8fb8ff; --hdk-ink #efe8dc; --hdk-line rgb(239 232 220 / 0.1); --hdk-muted #9a98a0; --hdk-sel rgb(143 184 255 / 0.14); --hdk-side #1d1e22. Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"night\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
  ],
  preview: { bg: "#ece8e0", mode: "fill" },
};
