import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "chat-thread-faq",
  name: "Chat Thread FAQ",
  category: "faq",
  description: "An FAQ you ask rather than scan. Questions sit at the bottom of a support thread as suggestions; pick one and it's sent as your message, the reply types for a moment and then arrives word by word, followed by the questions people usually ask next.",
  tags: ["faq", "chat", "support", "conversation", "help", "questions", "messaging"],
  traits: ["click", "keyboard"],
  source: "original",
  files: ["ChatThreadFaq.tsx", "chat-thread-faq.css"],
  dependencies: [],
  prompt: `Build an FAQ shaped as a support conversation.

Props: items ({ id, q, a, next?: ids }), agent (name and role), greeting, an optional human hand-off ({ label, reply }), and the starting suggestions.

Layout: a 30rem × 36rem card with a header (agent avatar, name, a green "live" dot with the role, and Start over), a scrolling thread, and a suggestions tray. The thread is role=log, aria-live polite, aria-busy while a reply is arriving, and keeps the newest message in view.

Flow: the agent greets. Suggestions are pill buttons that fade up 60ms apart. Choosing one hides the tray, appends your bubble (right-aligned, accent, tail bottom-right), then shows a typing indicator (three bouncing dots, labelled "Vitrine Help is typing") for 650ms plus a little per character, then the answer bubble arrives word by word every 28–58ms. The words not yet shown are already in the bubble but visibility:hidden, so the bubble is its final size from the start and the text doesn't reflow as it fills. Afterwards up to three follow-ups are offered: the item's next ids first, then anything not yet asked. "Talk to a person" is always available once the conversation has started and ends with the hand-off reply. When everything has been asked, it says so. Start over clears the thread and any pending timers. Paper and Night; reduced motion shows replies whole after a beat, with no bounce or stagger.`,
  interaction: "Tap a suggested question; read the reply; pick a follow-up, or Talk to a person. Start over resets the thread.",
  animation: "Messages spring up 300ms; typing dots 1s loop; words stream every 28–58ms; chips fade up 60ms apart.",
  a11y: "The thread is a polite live log that is aria-busy while a reply streams, so screen readers get finished sentences; suggestions are real buttons in a labelled group; the typing indicator has a text label. Reduced motion shows replies at once.",
  responsive: "A fixed-height card up to 30rem wide; bubbles widen on phones.",
  touchFallback: "Identical on touch; chips are full-size tap targets.",
  variants: [
    { id: "paper", label: "Paper", prompt: "Palette for this theme (Paper): --ct-card #fffdf8; --ct-focus #1f4e8c; --ct-ink #1b1a17; --ct-line rgb(27 26 23 / 0.1); --ct-muted #6f6a62; --ct-them #f1ede5; --ct-you #1f4e8c; --ct-you-ink #ffffff. Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"paper\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
    { id: "night", label: "Night", prompt: "Palette for this theme (Night): --ct-card #18191c; --ct-focus #8fb8ff; --ct-ink #efe8dc; --ct-line rgb(239 232 220 / 0.1); --ct-muted #9a98a0; --ct-them #25262b; --ct-you #8fb8ff; --ct-you-ink #0d1a33. Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"night\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
  ],
  preview: { bg: "#ece8e0", mode: "fill" },
};
