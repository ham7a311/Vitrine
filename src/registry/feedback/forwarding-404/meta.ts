import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "forwarding-404",
  name: "Forwarding 404",
  category: "feedback",
  description: "A not-found page for addresses that used to work: it follows your redirect table and draws the trail from the old link to where the page lives now.",
  tags: ["404", "not found", "redirect", "moved", "recovery", "error page"],
  traits: ["keyboard"],
  source: "original",
  files: ["Forwarding404.tsx", "forwarding.ts", "forwarding-404.css"],
  dependencies: [],
  prompt:
    "Build a not-found page for retired addresses. Take the requested path and a redirect table of { from, to, date, reason } records. Normalise addresses (lowercase, no query or hash, no trailing slash) and follow the table from the requested address until it settles, recording each move; stop and flag a loop if an address repeats or after 20 steps.\n\nCompose a single left-aligned 40rem column on a cool grey page. A mono 11px uppercase eyebrow '404 · Forwarding record', then a 30–48px Geist headline: 'This page moved on.' A muted lede says when the requested address was retired and how many times it has moved. Below, an ordered trail on a single 1.5px vertical rail with a 12px node beside every address. Each stop after the first carries a small uppercase mono line '↓ Renamed · 3 Jun 2025' (reason and date), then the address in mono. Retired addresses are struck through in a faint tone, with tags 'You asked for this' under the first. The final, live address is larger, in the accent colour as a link, with a filled accent node and a soft 4px ring, tagged 'Lives here now'. Then a filled accent button 'Continue to /plans/studio', an outline 'Copy new link' button, a polite status line, and a small uppercase home link.\n\nWhen the trail loops, the headline says 'This address goes round in circles.', the repeated stop is struck in red with a dashed node, and the actions become home plus a search field. When nothing forwards, the headline is 'No forwarding address.' with a search form (label, field, Search button) and a home button.",
  interaction:
    "Continue follows the live address through an hrefFor mapping (the demo maps addresses to local fragments). Copy new link writes origin + address to the clipboard and only says 'Copied' on success; if copying fails, the status line spells out the address instead. The search form calls onSearch with the trimmed query.",
  animation:
    "The rail draws downward over 900ms (scaleY, expo-out) while each stop rises 6px and fades in 220ms after the one before, so the reader follows the move in order. Reduced motion shows the finished trail.",
  a11y:
    "A section labelled by its heading; the trail is an ordered list labelled 'Forwarding trail' with real <s> and <time> elements; copy results go to a role=status line; the search is a labelled role=search form. Unique ids per instance and visible focus rings.",
  responsive:
    "One fluid column from 320px up; long addresses wrap anywhere instead of overflowing, and the action buttons wrap onto their own lines.",
  touchFallback: "All actions are buttons or links with 44px targets; nothing relies on hover.",
  variants: [
    { id: "paper", label: "Paper", prompt: "Paper theme with a two-move trail (/team-plan renamed to /pricing/teams, then merged into /plans/studio). Palette: page #eef1f4, ink #15202b, muted #586574, faint #8a96a3, hairlines rgb(21 32 43 / 0.14), rail rgb(21 32 43 / 0.22), accent #2643c4 with white text, loop red #b4232c, fields #ffffff." },
    { id: "night", label: "Night", prompt: "Night theme with the same two-move trail. Palette: page #0f1318, ink #e6ebf0, muted #98a4b1, faint #5f6b78, hairlines rgb(230 235 240 / 0.12), rail rgb(230 235 240 / 0.2), accent #8ea2ff with #0f1318 text, loop red #ff7b84, fields #161b22." },
    { id: "unknown", label: "No record", prompt: "Show the state with nothing to forward, on the light palette (page #eef1f4, ink #15202b, accent #2643c4): the requested address /press-kit-2019 has no redirect, so there is no trail. The headline reads 'No forwarding address.', the lede explains it may never have existed, then a filled home button and a search form whose submit calls onSearch." },
  ],
  preview: { bg: "#eef1f4", mode: "page", frame: [1280, 800] },
  isNew: true,
};
