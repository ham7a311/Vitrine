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
    { id: "light", label: "Light", prompt: "Palette for this theme (Light): --vo-a #7fb2ff; --vo-b #d9ecff; --vo-bg #ffffff; --vo-c #3b6cff; --vo-ink #0d0d0d; --vo-muted #8f8f8f. Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"light\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
    { id: "dark", label: "Dark", prompt: "Palette for this theme (Dark): --vo-a #6f8dff; --vo-b #bfe3ff; --vo-bg #0d0d0d; --vo-c #3050ff; --vo-ink #ececec; --vo-muted #7a7a7a. Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"dark\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
  ],
  preview: { bg: "#ffffff", mode: "fill" },
};
