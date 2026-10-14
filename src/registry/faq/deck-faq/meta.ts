import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "deck-faq",
  name: "Deck FAQ",
  category: "faq",
  description: "Questions as a deck of cards. Turn the top card over to read its answer, then send it right if it helped or left if it didn't — by dragging, with the arrow keys or the buttons — or skip it to the back. A stamp shows which way you're throwing it, and the last card gathers anything that wasn't answered and points to support.",
  tags: ["faq", "cards", "swipe", "flip", "deck", "support", "help", "gesture", "keyboard", "playful"],
  traits: ["click", "keyboard", "touch"],
  source: "original",
  isNew: true,
  files: ["DeckFaq.tsx", "deck-faq.css", "deck.ts"],
  dependencies: [],
  prompt:
    "Build an FAQ played as a deck of cards. Props: title, cards [{id, topic, q, a}], support {label, href}, onNavigate, theme and className.\n\nDeck (pure functions): a queue of card ids plus lists of helpful and unclear ones; judging the top card helpful or unclear moves it to that list, and skipping moves it to the back (unless it's the last); a drag counts once it passes 110px either way — right is helpful, left is unclear.\n\nLayout: a 520px panel — the title and \"3 of 6 answered\" with a thin progress bar in the helpful colour. The table shows the top three cards stacked, each one further back 15px lower and 5% smaller, the third faded. A card has two faces in 3D (preserve-3d, backface hidden): the front on the card colour with a topic chip, the question in a large serif and \"Tap to turn over\"; the back in a dark ink colour with the answer. Clicking or tapping the card, Space or Enter turns it over (rotateY 180°, 520ms).\n\nThe top card is focusable (a group named \"Question 2 of 6: … Press Space to see the answer\", including the answer once turned). Dragging it (pointer capture) moves it with the pointer, rotated by x/18, and fades in a tilted \"Helpful\" stamp on the right or \"Not quite\" on the left as it leans; letting go past the threshold throws it off that side (translate 140%, rotated 18°, 360ms), otherwise it springs back. → and ← do the same, ↓ skips (the card drops away and goes to the back). Buttons under the deck: Not quite, Answer/Question (aria-pressed), Skip (disabled with one card left) and Helpful. A polite live region says what happened. When the deck is empty, a closing card says that's everything, lists any questions that didn't help with a link to support, and offers Start over. Reduced motion skips the throws and the turn. Two themes, paper and night.",
  interaction: "Turn the top card over, then drag it right if it helped or left if it didn't; or use Space, the arrow keys or the buttons. Skip sends it to the back.",
  animation: "Cards turn in 520ms and are thrown off in 360ms; the stack shuffles up in 340ms. Reduced motion changes instantly.",
  a11y: "The top card is a focusable, labelled group with keyboard controls, every action also has a real button, results are announced politely, and the cards behind are hidden from assistive tech.",
  responsive: "Up to 520px wide; on phones the buttons wrap into two rows and the cards get a little taller.",
  touchFallback: "Swipe the card left or right, tap to turn it, or use the buttons.",
  variants: [
    { id: "paper", label: "Paper", prompt: "Palette for this theme (Paper): --df-accent #1f2a44; --df-back #1f2a44; --df-back-ink #f3f5fb; --df-bg #f4f1ea; --df-card #fffdf8; --df-ink #1d1b17; --df-line rgba(29, 27, 23, 0.12); --df-muted #625d54; --df-no #b5452a; --df-yes #1a7a4c. Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"paper\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
    { id: "night", label: "Night", prompt: "Palette for this theme (Night): --df-accent #e9ecf5; --df-back #e9ecf5; --df-back-ink #121318; --df-bg #121318; --df-card #1d1f27; --df-ink #eceef4; --df-line rgba(236, 238, 244, 0.1); --df-muted #a5a8b6; --df-no #ff9a83; --df-yes #5fd39a. Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"night\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
  ],
  preview: { bg: "#e8e4da", mode: "center", height: 600 },
};
