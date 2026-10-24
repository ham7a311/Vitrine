"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { ConversationSidebar, type Chat } from "@/registry/sidebars/conversation-sidebar/ConversationSidebar";
import { AskBar, type AskMessage, type AskModel } from "@/registry/ai/ask-bar/AskBar";

/* One dark palette: Ask Bar's own night values are the reference, the sidebar is set to match. */
const TOKENS = `
.aiw .conversation-sidebar--night { --cs-bg: #0a0b0f; --cs-ink: #e8eaed; --cs-muted: #9aa0a6; --cs-faint: #6b7076; --cs-line: rgb(255 255 255 / 0.07); --cs-hover: rgb(255 255 255 / 0.04); --cs-active: rgb(138 180 248 / 0.12); --cs-accent: #8ab4f8; }
.aiw .askb { min-height: 100%; height: 100%; }
`;

const MODELS: AskModel[] = [
  { id: "vitrine", name: "Vitrine 4", detail: "Careful answers, the default" },
  { id: "fast", name: "Vitrine 4 Fast", detail: "Quick replies and small edits" },
];

type Thread = { chat: Chat; messages: AskMessage[] };
const turn = (q: string, a: string): AskMessage[] => [
  { role: "user", text: q },
  { role: "assistant", text: a, model: "Vitrine 4" },
];

const SEED: Thread[] = [
  {
    chat: { id: "wadi", title: "Wadi Shab trip, November", when: "today", pinned: true },
    messages: [
      ...turn(
        "When is the best time to hike Wadi Shab, and how long does it take?",
        "November to March is the comfortable window, with daytime highs in the high twenties. The walk to the pools takes about 45 minutes each way and starts with a short boat crossing at the trailhead.\n\nGo early: the car park fills by mid-morning at weekends, and the last stretch to the cave means swimming.",
      ),
      ...turn("What should we pack?", "Shoes that can get wet, a dry bag for phones and keys, and at least two litres of water each. Leave Muscat by 6:30 to reach the boats before they get busy."),
    ],
  },
  {
    chat: { id: "churn", title: "Board deck vs churn data", when: "today" },
    messages: turn(
      "The deck says churn fell to 2.1% but the dashboard shows 2.6%. Which is right?",
      "Both, measured differently. The deck counts accounts that cancelled in the month; the dashboard counts seats lost, including downgrades. For the board, keep 2.1% as logo churn and add 2.6% as seat churn on the same slide, with one line saying which is which.",
    ),
  },
  {
    chat: { id: "tabs", title: "Accessible tabs in React", when: "yesterday" },
    messages: turn(
      "How do I make tabs keyboard accessible?",
      "Give the list role=\"tablist\", each tab role=\"tab\" with aria-selected and aria-controls, and each panel role=\"tabpanel\". Only the selected tab gets tabIndex 0; the arrow keys move between tabs, and Home and End jump to the first and last.",
    ),
  },
  {
    chat: { id: "type", title: "Arabic type pairing ideas", when: "yesterday" },
    messages: turn(
      "What Arabic typeface pairs well with a geometric sans?",
      "IBM Plex Sans Arabic is the safe pair: drawn alongside a Latin grotesque, with matched weights and x-height. For more character, try Readex Pro, whose round, open forms sit well beside geometric Latin.",
    ),
  },
  {
    chat: { id: "pg", title: "Postgres index for search", when: "week" },
    messages: turn(
      "Search on product names is slow. What index should I add?",
      "For contains-style search, add a trigram index: CREATE EXTENSION pg_trgm; then CREATE INDEX ON products USING gin (name gin_trgm_ops). ILIKE '%term%' will use it; check with EXPLAIN ANALYZE before and after.",
    ),
  },
  {
    chat: { id: "readme", title: "Rewrite the README intro", when: "week" },
    messages: turn(
      "Make this intro shorter: 'Vitrine is a comprehensive and powerful collection of beautiful components…'",
      "Vitrine is a collection of React components you copy into your project and own. Every one comes with its source, a prompt to rebuild it, and the states people usually forget.",
    ),
  },
  {
    chat: { id: "thesis", title: "Thesis outline: HCI", when: "older" },
    messages: turn(
      "Help me outline a thesis on calm notifications.",
      "1. The problem: interruption cost, with two field studies.\n2. A design space: timing, channel, and how much each notification says.\n3. A study: batched against immediate delivery for one week.\n4. Results and what they mean for product teams.",
    ),
  },
];

/** A reply that fits what was asked. Simulated: connect your model here. */
function reply(prompt: string): string {
  const p = prompt.toLowerCase();
  if (/(trip|hike|travel|flight|visit|weekend|wadi|beach|pack)/.test(p))
    return "Here's a plan that leaves room to breathe: start early, keep the long drive for the first morning, and book the one thing that sells out (a boat, a table, a guide) before anything else. Tell me the dates and who's coming and I'll turn it into a day-by-day list.";
  if (/(code|react|bug|error|function|css|typescript|api|sql|test)/.test(p))
    return "Start by making the failure small: one input that always reproduces it. Then read the stack from the first frame that's your code, not the framework's. If you paste the snippet and the exact error, I'll point at the line and suggest the change.";
  if (/(write|email|rewrite|summar|draft|intro|tone|shorter|letter)/.test(p))
    return "Here's a tighter version: one sentence on what it is, one on why it matters to the reader, and a clear next step. Paste your draft and I'll keep your voice and cut what repeats.";
  return `Good question. The short answer depends on one thing you haven't said yet: what “${prompt.trim().split(/\s+/).slice(0, 6).join(" ")}” is for. Tell me the goal and the constraint you care about most, and I'll give you a specific answer rather than a list of options.`;
}

const FILLER = new Set(["a", "an", "and", "at", "for", "from", "in", "of", "on", "or", "the", "to", "with"]);

/** A sidebar title from the first prompt: its first few words, never ending on a filler word or punctuation. */
function titleFrom(prompt: string) {
  const words = prompt.trim().replace(/[?.!,:;]+/g, "").split(/\s+/).slice(0, 6);
  while (words.length > 2 && FILLER.has(words[words.length - 1].toLowerCase())) words.pop();
  const joined = words.join(" ");
  const t = joined.length > 42 ? `${joined.slice(0, 40).trimEnd()}…` : joined;
  return t.charAt(0).toUpperCase() + t.slice(1);
}

export default function AiWorkspace() {
  const [threads, setThreads] = useState<Thread[]>(SEED);
  const [active, setActive] = useState(SEED[0].chat.id);
  const drafts = useRef(0);
  const chats = useMemo(() => threads.map((t) => t.chat), [threads]);
  const current = threads.find((t) => t.chat.id === active);

  const newChat = useCallback(() => setActive(`new-${++drafts.current}`), []);

  // Record each exchange so the chat reopens with its history; a draft becomes a chat on its first message.
  const respond = useCallback(
    (prompt: string, model: AskModel) => {
      const text = reply(prompt);
      const id = active;
      setThreads((ts) => {
        const pair: AskMessage[] = [{ role: "user", text: prompt }, { role: "assistant", text, model: model.name }];
        if (ts.some((t) => t.chat.id === id)) return ts.map((t) => (t.chat.id === id ? { ...t, messages: [...t.messages, ...pair] } : t));
        return [{ chat: { id, title: titleFrom(prompt), when: "today" }, messages: pair }, ...ts];
      });
      return new Promise<string>((r) => setTimeout(() => r(text), 650));
    },
    [active],
  );

  return (
    <div className="aiw flex h-full w-full bg-[#0e0f14] text-[#e8eaed]" style={{ fontFamily: "Geist, ui-sans-serif, system-ui" }}>
      <style>{TOKENS}</style>
      <div className="hidden md:flex">
        <ConversationSidebar chats={chats} active={active} onSelect={setActive} onNew={newChat} theme="night" />
      </div>
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-[3.25rem] flex-none items-center justify-between gap-3 border-b border-white/[0.06] px-4 sm:px-6">
          <p className="truncate text-[0.875rem] font-medium text-[#e8eaed]">{current?.chat.title ?? "New chat"}</p>
          {/* On phones the sidebar is hidden, so New chat lives here. */}
          <button
            type="button"
            onClick={newChat}
            className="inline-flex h-9 items-center gap-1.5 rounded-full px-3 text-[0.8125rem] text-[#c4c7c5] ring-1 ring-white/10 transition-colors hover:bg-white/[0.06] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#8ab4f8] md:hidden"
          >
            <svg viewBox="0 0 20 20" className="size-4 fill-none stroke-current" strokeWidth={1.7} strokeLinecap="round" aria-hidden="true">
              <path d="M10 5v10M5 10h10" />
            </svg>
            New chat
          </button>
        </header>
        <main className="min-h-0 flex-1">
          <AskBar
            key={active}
            theme="dark"
            greeting="Hello, Hamza. Where should we start?"
            placeholder="Ask anything"
            models={MODELS}
            initialMessages={current?.messages}
            respond={respond}
          />
        </main>
      </div>
    </div>
  );
}
