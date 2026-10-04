"use client";

import { SlideTabs } from "./SlideTabs";

const P = ({ title, children }: { title: string; children: string }) => (
  <div className="max-w-md">
    <h3 className="font-display text-2xl text-[#efe8dc]" style={{ fontFamily: "'Newsreader', Georgia, serif" }}>{title}</h3>
    <p className="mt-2 text-[0.9375rem] leading-relaxed text-[#a7a1ab]">{children}</p>
  </div>
);

export default function Demo() {
  return (
    <div className="flex min-h-full w-full items-center justify-center bg-[#0b080d] p-8">
      <SlideTabs
        tabs={[
          { id: "overview", label: "Overview", panel: <P title="Overview">A calm summary of what this project is, who it is for, and where it stands right now.</P> },
          { id: "activity", label: "Activity", panel: <P title="Activity">Every change, comment and review in one timeline, newest first, grouped by day.</P> },
          { id: "members", label: "Members", panel: <P title="Members">Eleven people across four time zones. Invite more from the settings page.</P> },
          { id: "settings", label: "Settings", panel: <P title="Settings">Notifications, integrations and access — the things you only change once in a while.</P> },
        ]}
      />
    </div>
  );
}
