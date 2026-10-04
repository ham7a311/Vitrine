import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "voice-orb",
  name: "Voice Orb",
  category: "ai",
  description: "A voice conversation reduced to one object: a soft sphere whose clouds breathe with your voice, gather while it thinks and pulse as it speaks — with one line of caption underneath.",
  tags: ["ai", "voice", "orb", "conversation", "assistant", "minimal"],
  traits: ["click", "ambient", "keyboard"],
  source: "original",
  files: ["VoiceOrb.tsx", "voice-orb.css"],
  dependencies: [],
  prompt: `Design a minimal, monochrome voice-mode screen: a white (or near-black) field, one sphere, one caption line, two round controls. The sphere (clamp 10–13rem) has a pale blue radial base, three large blurred 'clouds' (blur 18px, multiply blend on light) drifting on 7s / 9s / 11s loops, and a soft top-left sheen.

The conversation state changes behaviour, not icons. A single level signal (0–1) scales the sphere up to 7%: while listening it follows the user's voice (synthetic here, an AnalyserNode in production); while thinking the sphere contracts to 0.94 and the clouds turn much faster, as if gathering; while speaking the level follows the reply's syllables and the clouds speed up a little; idle is a slow 5s breath. Muting desaturates the sphere. The caption says 'Listening…', then shows the transcribed question, then streams the reply word by word. Controls: a mic mute toggle (inverts when muted) and a red end button.`,
  interaction: "Tap the sphere to start; mute or end with the controls below.",
  animation: "Per-frame level (lerped) drives scale; cloud drift loops change speed by phase; caption lines rise in over 420ms.",
  a11y: "The sphere is a button with a state-aware label; captions are a polite live region; mute is a toggle with aria-pressed. Reduced motion stills the clouds and level.",
  responsive: "The sphere scales with the viewport; controls stay 52px.",
  touchFallback: "Designed for taps; nothing depends on hover.",
  variants: [
    { id: "light", label: "Light" },
    { id: "dark", label: "Dark" },
  ],
  preview: { bg: "#ffffff", mode: "fill" },
};
