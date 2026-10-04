"use client";

import { WorkspaceSidebar } from "./WorkspaceSidebar";

const i = (d: string) => <svg viewBox="0 0 16 16" aria-hidden="true"><path d={d} /></svg>;

export default function Demo() {
  return (
    <div className="flex h-full min-h-[34rem] w-full bg-[#09090b]">
      <WorkspaceSidebar
        workspace="Vitrine"
        items={[
          { id: "inbox", label: "Inbox", count: 4, icon: i("M2.5 9.5h3l1 2h3l1-2h3M2.5 9.5 4 3.5h8l1.5 6v3h-11z") },
          { id: "issues", label: "My issues", icon: i("M8 2.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM8 6v2.5") },
          { id: "reviews", label: "Reviews", count: 2, icon: i("M3 3.5h10v7H7l-3 2v-2H3z") },
          {
            id: "projects",
            label: "Projects",
            icon: i("M2.5 4.5h4l1 1.5h6v6.5h-11z"),
            children: [
              { id: "p-web", label: "Website redesign" },
              { id: "p-ai", label: "AI & Chat set" },
              { id: "p-docs", label: "Docs v2" },
            ],
          },
          { id: "cycles", label: "Cycles", icon: i("M13 8A5 5 0 1 1 8 3M13 3v2.5h-2.5") },
        ]}
        pinned={[
          { id: "f-launch", label: "Launch checklist", color: "#e8a24a" },
          { id: "f-bugs", label: "Bugs this week", color: "#f0a2a2" },
        ]}
      />
      <div className="hidden flex-1 items-center justify-center p-8 text-center sm:flex font-[family-name:Geist] text-[0.875rem] text-[#5b5b63]">Click between top-level and nested items.</div>
    </div>
  );
}
