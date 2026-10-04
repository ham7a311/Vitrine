import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "relay-button",
  name: "Relay",
  category: "buttons",
  description: "An async button whose states ride a vertical reel — Deploy, Deploying 64%, Live — while its width eases to fit each label and progress runs along its bottom edge.",
  tags: ["button", "async", "loading", "progress", "states", "saas"],
  traits: ["click", "keyboard", "touch"],
  source: "original",
  files: ["RelayButton.tsx", "relay-button.css"],
  dependencies: [],
  prompt: `Build a primary button for a long-running action (shipping a build, generating a file, publishing). Its four states — idle, working, done, error — are rows of one vertical reel inside a 52px window; the reel translates by −index × height over 620ms on cubic-bezier(0.16,1,0.3,1), so the label never cross-fades: forward progress always moves up, a reset moves back down. Inactive rows stay faintly visible as they pass.

Each row has its own content: the idle label; a spinner, the working label and a tabular mono percentage; a check that draws itself and the done label; or a small rose badge and the error label. Labels are a prop. Measure every row's natural width with invisible copies (after fonts load) and animate the button's width to the current row's, so the pill always fits its words. Progress is a 2px rail along the bottom edge scaled on X — never over the text. On success the face tints faintly green and the rail fades; on error the face tints rose, the rail stays where it stopped and the label shakes once. Done returns to idle after 2.6s. The action is a prop that reports progress and resolves true or false.`,
  interaction: "Click to run; while working it ignores further clicks; errors can be retried by clicking again.",
  animation: "Reel 620ms expo-out; width 560ms; rail follows progress (180ms linear); tick draw 420ms; single shake on error.",
  a11y: "A real button with aria-busy while working; state changes are announced through a live region; hidden reel rows are aria-hidden. Reduced motion switches states instantly.",
  responsive: "Width follows its content; labels never wrap.",
  touchFallback: "Nothing depends on hover.",
  variants: [
    { id: "deploy", label: "Deploy", prompt: "Deploy (default labels): idle \"Deploy to production\", working \"Deploying\" with a percentage, done \"Live in 32 regions\", error \"Build failed — retry\"; the demo's first run fails on purpose so the error state is visible. On #0b080d." },
    { id: "export", label: "Export (frost)", prompt: "tone=\"frost\" with labels idle \"Export report\", working \"Exporting\", done \"Saved to Downloads\", error \"Couldn't export — retry\", on #0b0e13." },
  ],
  preview: { bg: "#0b080d", mode: "fill" },
};
