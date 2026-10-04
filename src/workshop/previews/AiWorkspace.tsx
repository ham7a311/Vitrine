"use client";

import { ConversationSidebar, type Chat } from "@/registry/sidebars/conversation-sidebar/ConversationSidebar";
import { ModelPicker, type Model } from "@/registry/ai/model-picker/ModelPicker";
import { ThinkingTrace } from "@/registry/ai/thinking-trace/ThinkingTrace";
import { CitedAnswer } from "@/registry/ai/cited-answer/CitedAnswer";
import { MessageActions } from "@/registry/ai/message-actions/MessageActions";
import { PromptComposer } from "@/registry/ai/prompt-composer/PromptComposer";

const CHATS: Chat[] = [
  { id: "1", title: "Wadi Shab trip, November", when: "today", pinned: true },
  { id: "2", title: "Board deck vs churn data", when: "today" },
  { id: "3", title: "Accessible tabs in React", when: "yesterday" },
  { id: "4", title: "Arabic type pairing ideas", when: "yesterday" },
  { id: "5", title: "Postgres index for search", when: "week" },
  { id: "6", title: "Rewrite the README intro", when: "week" },
  { id: "7", title: "Thesis outline — HCI", when: "older" },
];

const MODELS: Model[] = [
  { id: "swift", name: "Swift", note: "Quick answers and everyday edits", speed: 5, depth: 2 },
  { id: "vitrine", name: "Vitrine", note: "The balanced default", speed: 4, depth: 4, badge: "Default" },
  { id: "meridian", name: "Meridian", note: "Long documents, careful reasoning", speed: 2, depth: 5 },
];

const SOURCES = [
  { domain: "omantourism.gov.om", title: "Wadi Shab — walking routes and safety notes" },
  { domain: "lonelyplanet.com", title: "The best time to visit Oman: a month-by-month guide" },
  { domain: "met.gov.om", title: "Muscat climate normals, 1991–2020" },
  { domain: "reddit.com", title: "Hiked Wadi Shab in November — tips?" },
];

const ANSWER = [
  { text: "November to March is the most comfortable window for Wadi Shab, with daytime highs in the high twenties.", cites: [1, 2] },
  { text: "The walk to the pools takes about 45 minutes each way and starts with a short boat crossing at the trailhead.", cites: [0] },
  { text: "Go early: the car park fills by mid-morning on weekends, and the last stretch to the cave needs swimming.", cites: [0, 3] },
];

const FOLLOW_UP = [
  <>
    <p>Pack for water and shade: shoes that can get wet, a dry bag for your phone, and at least two litres of water each.</p>
    <p>Leave Muscat by 6:30 to reach the trailhead before the boats get busy.</p>
  </>,
  <>
    <p>Wet shoes, a dry bag, two litres of water each. Leave Muscat by 6:30.</p>
  </>,
];

export default function AiWorkspace() {
  return (
    <div className="flex h-full w-full bg-[#f5f1e8] text-[#2a2520]" style={{ fontFamily: "Geist, ui-sans-serif, system-ui" }}>
      <div className="hidden md:flex">
        <ConversationSidebar chats={CHATS} theme="paper" />
      </div>
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between gap-3 border-b border-black/[0.06] px-4 py-2.5 sm:px-6">
          <p className="truncate text-[0.875rem] font-medium">Wadi Shab trip, November</p>
          <ModelPicker models={MODELS} value="vitrine" theme="paper" />
        </header>
        <main className="min-h-0 flex-1 overflow-y-auto px-4 pb-6 pt-6 sm:px-6">
          <div className="mx-auto flex w-full max-w-[42rem] flex-col gap-6">
            <p className="ml-auto max-w-[85%] rounded-2xl rounded-br-md bg-[#e9e2d4] px-4 py-3 text-[15px] leading-relaxed">
              When is the best time to hike Wadi Shab, and how long does it take?
            </p>
            <ThinkingTrace
              theme="paper"
              loop={false}
              steps={[
                { label: "Searching Omani tourism and weather sources", ms: 1200 },
                { label: "Reading walking routes and safety notes", ms: 1400 },
                { label: "Checking climate normals for Muscat", ms: 900 },
              ]}
            />
            <CitedAnswer question="When is the best time to hike Wadi Shab?" sources={SOURCES} answer={ANSWER} theme="paper" />
            <p className="ml-auto max-w-[85%] rounded-2xl rounded-br-md bg-[#e9e2d4] px-4 py-3 text-[15px] leading-relaxed">What should we pack?</p>
            <MessageActions versions={FOLLOW_UP} theme="paper" />
          </div>
        </main>
        <div className="border-t border-black/[0.05] px-4 pb-4 pt-3 sm:px-6">
          <div className="mx-auto w-full max-w-[42rem]">
            <PromptComposer theme="paper" placeholder="Ask a follow-up…" models={["Swift", "Vitrine", "Meridian"]} />
          </div>
        </div>
      </div>
    </div>
  );
}
