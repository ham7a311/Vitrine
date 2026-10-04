import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "voice-capsule",
  name: "Voice Capsule",
  category: "ai",
  description:
    "Hold to talk: the mic swells into a capsule with a live waveform and timer. Slide left and the capsule reddens — let go there to throw it away; let go anywhere else and it becomes a voice note.",
  tags: ["ai", "voice", "microphone", "hold", "gesture", "waveform"],
  traits: ["click", "touch", "keyboard"],
  source: "original",
  files: ["VoiceCapsule.tsx", "voice-capsule.css"],
  dependencies: [],
  prompt: `Build a press-and-hold voice input. At rest it's a 56px round ink mic button. On press (pointer capture, touch-action none, context menu suppressed, 10ms haptic) the button swells to 1.12× with a soft accent halo, and a capsule grows out to its left (width transition 480ms expo-out) holding a blinking rose record dot, a tabular timer, a 'Slide to cancel' hint with a nudging chevron, and a live waveform of 28 bars fed by a level function (synthetic speech-like bursts here; an AnalyserNode in production), each bar's height a CSS variable updated every frame.

Dragging left moves the hint with the finger; past 90px the gesture is 'armed': the capsule and bars warm toward rose in proportion, the mic turns rose and its glyph morphs into a bin. Releasing while armed (or recording under 0.4s) discards it — the capsule shakes and fades. Releasing anywhere else sends: the capsule collapses back into the mic and a small 'Voice note · 0:04' pill rises into the list above. Space/Enter held works the same; Escape cancels. Paper and night themes.`,
  interaction: "Hold to record; slide left past the threshold to arm cancel; release to send or discard. Space/Enter hold also records; Escape cancels.",
  animation:
    "480ms capsule growth; per-frame waveform bars (90ms height smoothing); proportional rose warming while dragging; glyph → bin morph; shake on discard; note pill rise 520ms.",
  a11y: "A real button whose label changes with state; keyboard hold supported; outcomes announced assertively ('Voice note added' / 'Recording discarded'). Reduced motion keeps the states without the motion.",
  responsive: "The capsule fills the available width up to 24rem.",
  touchFallback: "Designed for thumbs: pointer capture keeps tracking outside the button; long-press menus and text selection are suppressed.",
  variants: [
    { id: "paper", label: "Paper" },
    { id: "night", label: "Night" },
  ],
  preview: { bg: "#f5f1e8", mode: "fill" },
};
