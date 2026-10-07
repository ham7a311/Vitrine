import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "daily-quests",
  name: "Daily Quests",
  category: "stats",
  description: "Three small goals for the day as chunky progress bars; a full bar turns gold and offers a Claim button, and the chest opens only once the reward is really granted.",
  tags: ["gamification", "progress", "goals", "rewards", "quests", "streak"],
  traits: ["click"],
  source: "original",
  files: ["DailyQuests.tsx", "daily-quests.css"],
  dependencies: [],
  prompt:
    "Build a daily quests card in a bright, chunky, friendly style: Nunito, ink #4b4b4b. A header with 'Daily quests' at 22px 800 and an orange #ff9600 clock with '14 hours left', counted from a resetsAt timestamp and refreshed every 30 seconds (rendered after mount to avoid clock mismatches). Below, one 16px-radius container with a 2px #e5e5e5 border and 2px rules between rows.\n\nEach row is a grid: a 52px rounded-square icon tile tinted 16% with its colour (bolt yellow #ffc800, target red #ff4b4b, clock blue #1cb0f6, book purple #ce82ff), then the quest title at 17px 800 over a 20px pill progress bar (#e5e5e5 track, #ffc800 fill with a 4px white gloss line inset near its top, and '18 / 30' centred in 13px 800 tabular numbers), then a reward column. Unfinished quests show a small greyed treasure chest; a full bar shows an orange 'CLAIM' button with a solid 4px #cc7a00 lip that pops in. While claiming it reads 'Claiming…' and is disabled; on success the chest lid swings open (rotate −24° with a soft overshoot) and the title greys; on failure an inline red 'That didn't go through. Try again.' appears and the button reads 'Retry'.",
  interaction:
    "Progress comes from props; bars animate when it changes. Claim awaits the onClaim promise: it can't be pressed twice while pending, a rejection leaves the quest claimable with a retry, and only a resolved claim opens the chest.",
  animation:
    "Bar fills ease over 320ms; the Claim button pops in from 70% with a slight overshoot; the chest lid swings open. Reduced motion jumps to each final state.",
  a11y:
    "Each bar is a progressbar named by its quest title with aria-valuenow and a spoken '18 of 30 XP'. Claim buttons are described by the quest title; errors use role=alert; the chest is an image labelled 'Reward claimed' or 'Reward locked until the bar is full'.",
  responsive: "Under 24rem the icon tiles shrink to 40px and padding tightens; titles wrap above their bars.",
  touchFallback: "Claim is a 44px tap target; nothing depends on hover.",
  variants: [
    { id: "light", label: "Light", prompt: "Light theme: page #ffffff, ink #4b4b4b, muted #777777, faint #afafaf, borders and track #e5e5e5, fill #ffc800, claim #ff9600 with lip #cc7a00, chest #d18a3b with lid #a86a26 and a #ffc800 lock, error #ea2b2b, focus #1cb0f6." },
    { id: "dark", label: "Dark", prompt: "Dark theme: page #131f24, ink #dce6ec, muted #8ea3ad, faint #52656d, borders and track #37464f, error #ff7878, focus #49c0f8; fill, claim, chest and icon colours keep their bright values." },
  ],
  preview: { bg: "#ffffff", mode: "fill", frame: [640, 620] },
};
