import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "transcript-player",
  name: "Transcript Player",
  category: "media",
  description: "Audio with its transcript as the main control. The spoken word is lit as it plays, any word is a seek point, search hits show as ticks on the scrubber, and copying a passage carries its timestamp. Chapters, speaker turns, playback speed and a full keyboard map.",
  tags: ["audio", "podcast", "transcript", "player", "search", "captions", "media"],
  traits: ["click", "keyboard", "scroll"],
  source: "original",
  files: ["TranscriptPlayer.tsx", "transcript-player.css", "transcript.ts"],
  dependencies: [],
  prompt:
    "Build an audio player whose transcript is the interface. Props: src (any audio URL), words [{ text, start, end, speaker }], chapters [{ title, start }], speakers map. Playback uses a real <audio> element (hidden).\n\nLayout: a warm 14px-radius panel. Header: a 46px round play/pause button, the title in Newsreader, 'Chapter · 0:12 / 1:03' and a speed button (1×, 1.25×, 1.5×, 2×). Under it a 4px scrubber rail with an accent fill, chapter notches and search-hit ticks (taller, blue, the current hit in accent), over an invisible native range for input. Chapter pills. A search field with a match count and ↑/↓. Then a 21rem scroll area in Newsreader 18px/1.7: turns (one per speaker change) with the speaker name and a dotted-underline timestamp button on the left (stacked above on narrow screens) and the words on the right.\n\nWords: the one being spoken has a warm highlight; earlier words fade to muted; search hits are tinted. Binary-search the word list for the current word; read audio.currentTime in rAF but only re-render each tenth of a second, and memoise each turn so only the active paragraph re-renders. Auto-scroll keeps the current word in view; a wheel or touch scroll pauses that and shows 'Back to 0:34 ↓'.",
  interaction:
    "Click a word to play from it. Space plays or pauses; ←/→ seek 5 s; J/K go to the previous or next sentence (J first restarts the current sentence); / focuses search, Enter and Shift+Enter step through matches (and seek), Escape clears. Selecting text and copying puts “quote” (title, 0:34) on the clipboard and says so.",
  animation: "Words fade to muted as they are spoken; the current-word highlight follows playback. The only other motion is smooth auto-scroll.",
  a11y: "A real audio element with native range input for seeking (with spoken time values). Words are in reading order text in a focusable region; timestamps are labelled buttons; match counts are announced politely; shortcuts do not fire while typing in the search field.",
  responsive: "Below 560px speaker and timestamp stack above the words and the shortcut line hides.",
  touchFallback: "Tap any word to jump; scrolling by touch pauses auto-follow until 'Back to' is tapped.",
  variants: [
    { id: "light", label: "Light" },
    { id: "dark", label: "Dark" },
  ],
  preview: { bg: "#e9e4d9", mode: "fill", frame: [1000, 780] },
  isNew: true,
};
