import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "thread-map",
  name: "Thread Map",
  category: "ai",
  description: "A long conversation with a map of itself down the side: one tick per turn, sized from the real message and coloured by who spoke, with marks where there's code or a tool was used. The window on the map shows where you are — drag it or click anywhere on the map to jump — search lights up the matching turns, and J and K step from turn to turn.",
  tags: ["ai", "chat", "conversation", "minimap", "navigation", "search", "scroll", "long thread", "keyboard", "transcript"],
  traits: ["scroll", "click", "keyboard"],
  source: "original",
  isNew: true,
  files: ["ThreadMap.tsx", "thread-map.css", "map.ts"],
  dependencies: [],
  prompt:
    "Build a chat transcript with a minimap rail. Props: title, turns [{id, role: user | assistant, text, code, tool}], names {user, assistant}, theme and className.\n\nMap maths (pure functions): ticks on a rail of a given height, scaled from each turn's measured top and height in the scrolling thread (at least 3px tall, with a 2px gap); the visible window as a box on the rail (at least 18px); the scroll position that centres the window on a point of the rail; the indices of turns whose text, code or tool line mention a query; and the turn being read — the last one whose top is within the top third of the view.\n\nLayout: a header with the title and a search field (with a count \"2 of 5\" in a status region, previous/next buttons when there's more than one, Enter and Shift+Enter to step, Escape to clear). Below, a 480px frame: the thread on the left — a focusable log of turns, user messages as right-aligned bubbles, assistant replies as text with optional code blocks and tool-call chips, the current turn marked with a thin rule on its left, matches wrapped in <mark> — and a 46px rail on the right. Measure the turns with a ResizeObserver and getBoundingClientRect and redraw the rail from the measurements.\n\nOn the rail each turn is a tick: assistant turns in the accent, wider and to the left; user turns muted and to the right; a small bracket where there's code and a dot where a tool ran. Matching turns get a yellow ring and the current one an accent ring. A translucent window with an accent edge shows the visible part. Pressing on the rail jumps there and dragging scrubs (pointer capture). J and K move to the next and previous turn with smooth scrolling (instant under reduced motion); searching scrolls to the current match. A hint line shows the keys.\n\nTwo themes, paper and night.",
  interaction: "Scroll, drag or click the map to move; search to light up matching turns and step through them; J and K step through the conversation.",
  animation: "Smooth scrolling to turns and matches; ticks and the current-turn rule change in 160–200ms. Reduced motion jumps instantly.",
  a11y: "The thread is a focusable, labelled log with each turn named by speaker and number; search is labelled with a live count; J/K and the search controls give full keyboard access, so the pointer-only rail is hidden from assistive tech.",
  responsive: "The rail narrows to 30px on phones and the search field shrinks.",
  touchFallback: "Dragging a finger on the map scrubs the thread; the thread scrolls normally.",
  variants: [
    { id: "paper", label: "Paper", prompt: "Palette for this theme (Paper): --tm-assist #2f6fd1; --tm-bg #fbfaf7; --tm-code #f3f1ec; --tm-hit #f2c33d; --tm-ink #1c1b18; --tm-line rgba(28, 27, 24, 0.1); --tm-mark rgba(242, 195, 61, 0.45); --tm-muted #66625a; --tm-rail #f1eee8; --tm-user #ece7dd. Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"paper\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
    { id: "night", label: "Night", prompt: "Palette for this theme (Night): --tm-assist #8fb4ff; --tm-bg #141417; --tm-code #0d0d10; --tm-hit #f2c33d; --tm-ink #ecebef; --tm-line rgba(236, 235, 239, 0.1); --tm-mark rgba(242, 195, 61, 0.35); --tm-muted #a3a2ab; --tm-rail #1b1b1f; --tm-user #26252c. Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"night\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
  ],
  preview: { bg: "#ece9e2", mode: "center", height: 640 },
};
