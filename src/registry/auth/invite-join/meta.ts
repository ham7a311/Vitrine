import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "invite-join",
  name: "Invite Join",
  category: "auth",
  description: "An invitation that shows you the room before you walk in: the team sits as a cluster of faces around the person who invited you. Accept, choose a name and password, and your face flies up into the cluster beside theirs while everyone else shuffles out on springs to make room.",
  tags: ["auth", "invite", "team", "join", "sign up", "avatars", "onboarding"],
  traits: ["click", "keyboard"],
  source: "original",
  files: ["InviteJoin.tsx", "invite-join.css"],
  dependencies: [],
  prompt: `Build a team-invitation card whose avatar cluster makes room for you when you join.

Cluster (13.5rem tall, a soft accent glow behind): avatars are gradient circles with initials, placed by phyllotaxis — slot 0 at the centre (the inviter, larger), slot i at radius 31·√(i + 2.2) (offset so the first ring clears the centre) and angle i × 137.508°, stretched 1.42× wide and 0.84× tall to fit the card, plus a "+12" bubble in the next slot. Each face is absolutely centred and moved with transform: translate(var(--x), var(--y)); they pop in staggered on mount (scale 0.4 → 1, overshoot). The cluster is one role=img listing every name.

Steps: invite ("Maryam Al-Harthy invited you to join Vitrine Design", member count and the invited email, Accept invitation / Decline) → form (your name prefilled from the email, a password of 10+ characters, text errors linked to the inputs, Join / Back; the name field is focused) → joined ("You're in, Hamza.", Open Vitrine Design →, focus on the heading, a polite status) or declined ("We won't tell Maryam", Undo; the faces go grey).

Joining inserts you at slot 1, right beside the inviter, so every other face's slot moves outward: their transforms transition to the new places over 760ms with a springy overshoot, staggered 28ms per face. Your face flies in with keyframes — from 13rem below (where the form was) at 1.6× scale, arcing up through a point 2.2rem above and short of your slot, settling at scale 1 — with an accent ring. Members are keyed by name, so they keep their identity across the shuffle. Paper and Night; reduced motion places everyone at once.`,
  interaction: "Accept the invitation, choose a password (10+ characters) and join to see your face fly in and the team make room. Try Decline and Undo.",
  animation: "Faces pop in 520ms, 45ms apart; on joining, every face springs to its new slot (760ms, overshoot, 28ms stagger) and yours flies in along an arc (900ms).",
  a11y: "Real form fields with labels and text errors; focus moves to the name field and then to the result heading; the cluster is one labelled image; joining is announced politely. Reduced motion moves no one.",
  responsive: "A single card up to 26rem; the cluster fits phone widths.",
  touchFallback: "Identical on touch.",
  variants: [
    { id: "paper", label: "Paper" },
    { id: "night", label: "Night" },
  ],
  preview: { bg: "#ece8e0", mode: "fill" },
};
