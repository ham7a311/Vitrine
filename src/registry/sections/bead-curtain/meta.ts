import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "bead-curtain",
  name: "Bead Curtain",
  category: "sections",
  description: "A section you step into through a curtain of beads: strings hang across its top, longer at the sides and parted in the middle like a doorway. Move the pointer through them and they swing aside and fall back, each string a chain of beads with its own weight. The copy waits beneath, centred, with a single invitation. Amber, jade or glass beads.",
  tags: ["section", "breaker", "beads", "curtain", "physics", "interactive", "canvas", "hospitality", "playful", "verlet"],
  traits: ["cursor", "canvas", "ambient"],
  source: "original",
  isNew: true,
  promptAllow: ["glass"],
  files: ["BeadCurtain.tsx", "bead-curtain.css", "beads.ts"],
  dependencies: [],
  prompt:
    "Build a section that opens under a bead curtain the pointer can push through. Props: eyebrow, title, lead, action {label, href}, palette {ground, beads [colours], cord, ink, muted, accent, onAccent, glass}, onNavigate and className.\n\nPhysics (pure functions): a strand of n beads 13px apart hanging from a pinned top; how many beads hang at x — 6 in the middle rising to 15 at the sides on a 1.3 power, so the curtain is parted like a doorway; and a Verlet step: each free bead keeps its velocity (damped to 98.2%) and falls under 900px/s² gravity, then five passes hold every link to its length (the top bead pinned) and push beads out of the pointer's 30px circle, the push last so it wins, returning how much the strand is still moving.\n\nThe curtain is a 230px canvas as wide as the section (a ResizeObserver rebuilds it; DPR ≤ 2), with a strand every 15px. Draw a rail across the top, each cord as a thin line through its beads, and each bead as a 4.6px circle with a radial highlight — opaque for coloured beads, mostly clear with a bright glint for glass. The strands start with a slight sway. A pointermove on the section feeds the pointer to the simulation while it's over the curtain; the loop runs only while the pointer is in it or the strands are still moving, and only while the section is on screen. Reduced motion draws the curtain hanging still.\n\nBody: centred and pulled up 70px into the parting — an eyebrow in wide-spaced capitals, a large italic serif title, a muted lead and one pill link in the accent with an arrow that nudges on hover.",
  interaction: "Move the pointer through the curtain to part the strings; the link works as normal.",
  animation: "Strands swing on a Verlet simulation and settle after a few seconds. Reduced motion keeps them hanging still.",
  a11y: "A labelled section with one real link; the curtain is decorative and hidden. Text keeps 4.5:1 contrast in every palette.",
  responsive: "The curtain is rebuilt for any width with a strand every 15px; the copy rises less far into it on phones.",
  touchFallback: "Touch scrolls the page normally; the curtain still sways in on load.",
  variants: [
    { id: "amber", label: "Amber", prompt: "Amber, honey and brown beads on a dark brown #1d140c section, cream ink #f7ead6 and a honey #f3c46b button with dark text." },
    { id: "jade", label: "Jade", prompt: "Jade greens (#2f8a65, #5fb38d, #1d5c43, #9fd2b5) on cream #f1efe6, dark green ink and a deep green button with cream text." },
    { id: "glass", label: "Glass", prompt: "Clear pale-blue glass beads with bright glints on a midnight blue #0f2340 section, white ink and a white button with blue text." },
  ],
  preview: { bg: "#1d140c", mode: "fill", frame: [1440, 900] },
};
