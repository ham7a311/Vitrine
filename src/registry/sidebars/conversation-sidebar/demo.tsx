"use client";

import { ConversationSidebar, type Chat } from "./ConversationSidebar";

const CHATS: Chat[] = [
  { id: "1", title: "Board deck vs churn data", when: "today", pinned: true },
  { id: "2", title: "Wadi Shab weekend plan", when: "today" },
  { id: "3", title: "Accessible tabs in React", when: "today" },
  { id: "4", title: "Yearly discount per plan", when: "yesterday" },
  { id: "5", title: "Arabic type pairing ideas", when: "yesterday" },
  { id: "6", title: "Postgres index for search", when: "week" },
  { id: "7", title: "Rewrite the README intro", when: "week" },
  { id: "8", title: "Thesis outline — HCI", when: "week" },
  { id: "9", title: "Masar onboarding copy", when: "older" },
  { id: "10", title: "Shader for dithered sky", when: "older" },
];

export default function Demo({ variant = "paper" }: { variant?: string }) {
  const night = variant === "night";
  return (
    <div className={`flex h-full min-h-[32rem] w-full ${night ? "bg-[#0f0e10]" : "bg-[#f5f1e8]"}`}>
      <ConversationSidebar chats={CHATS} theme={night ? "night" : "paper"} />
      <div className="flex min-w-0 flex-1 items-center justify-center overflow-hidden">
        <div className="p-6 sm:p-8">
        <p className={`max-w-[22ch] text-center font-[family-name:Instrument_Serif] text-[1.35rem] leading-tight sm:text-[1.8rem] ${night ? "text-[#6f6a74]" : "text-[#a39b8f]"}`}>
          Collapse the sidebar with the panel button — titles become initials.
        </p>
        </div>
      </div>
    </div>
  );
}
