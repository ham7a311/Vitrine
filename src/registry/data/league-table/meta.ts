import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "league-table",
  name: "League Table",
  category: "data",
  description: "A weekly leaderboard with its stakes drawn in: a green line under the places that move up, a red line over the ones that move down, your row raised, and rows that slide into a new order as points change.",
  tags: ["leaderboard", "ranking", "gamification", "league", "table", "competition"],
  traits: ["click"],
  source: "original",
  files: ["LeagueTable.tsx", "league-table.css"],
  dependencies: [],
  prompt:
    "Build a weekly league leaderboard in a bright, chunky, friendly style: Nunito, ink #4b4b4b, grey #e5e5e5 for rules. A header row with a 46×50 shield badge (coral #ff7a59 with a 3px darker outline and a white star), the league name at 22px 800 and 'Top 3 advance to the next league' in grey, and a coral clock with '3 days' on the right, all over a 2px grey rule.\n\nBelow, an ordered list of 64px rows (grid: rank, 44px initials avatar in a colour derived from the name, name, XP right-aligned with tabular numbers). Ranks 1–3 sit in 30px medal circles (gold #ffc800, silver #b9c7d0, bronze #e0915a, each with a 2px darker lip and white numbers); other ranks are plain numbers, green #58cc02 inside the promotion zone and red #ff4b4b inside the demotion zone. After the last promoted place, a divider of two faint green rules around an up arrow and 'PROMOTION ZONE' (13px 800 uppercase, wide tracking); before the demoted places, the same in red with a down arrow and 'DEMOTION ZONE'. Your row has 14px corners, a pale blue #ddf4ff fill, a 2px #84d8ff border and a 3px solid lip, with '(you)' after the name. When your rank changes, a small green ▲2 or red ▼1 chip pops beside your name for 2.6 seconds.",
  interaction:
    "Pass new rows and the table re-sorts by XP (ties by name). Rows animate to their new positions; a polite live region says 'You moved up to 2nd place.' and onRankChange reports the new and previous rank. The demo's '+40 XP' button feeds it.",
  animation:
    "Reordering uses FLIP on offsetTop (unaffected by running transforms): each row slides from its last position over 520ms with cubic-bezier(.2,.8,.2,1). The rank chip pops with a slight overshoot. Reduced motion re-sorts without sliding or popping.",
  a11y:
    "A section labelled with the league name and an ordered list in rank order; your row has aria-current. Each row carries hidden text with its ordinal place and zone, so the coloured dividers (aria-hidden) are not the only signal. Rank changes are announced politely.",
  responsive: "Under 26rem the avatars and gaps shrink, the days counter moves under the title, and long names truncate with an ellipsis.",
  touchFallback: "Read-only; nothing depends on hover.",
  variants: [
    { id: "light", label: "Light", prompt: "Light theme: page #ffffff, ink #4b4b4b, muted #777777, rules #e5e5e5, row hover #f7f7f7, your row #ddf4ff with border and lip #84d8ff, promotion green #58cc02, demotion red #ff4b4b, badge coral #ff7a59 outlined #d95f3f." },
    { id: "dark", label: "Dark", prompt: "Dark theme: page #131f24, ink #dce6ec, muted #8ea3ad, rules #37464f, row hover #1a2a31, your row #193949 with border and lip #1f6e93; zone colours, medals and badge keep their bright values." },
  ],
  preview: { bg: "#ffffff", mode: "fill", frame: [640, 820] },
};
