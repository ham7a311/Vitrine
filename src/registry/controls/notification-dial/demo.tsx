"use client";
import { NotificationDial, type DialSample } from "./NotificationDial";

const LEVELS = [
  { id: "off", label: "Off", description: "No notifications at all." },
  { id: "mentions", label: "Mentions", description: "Only when someone mentions you or replies to you." },
  { id: "important", label: "Important", description: "Mentions, plus reviews you're asked for and deadlines." },
  { id: "all", label: "Everything", description: "Every comment, edit and share in documents you follow." },
];
const RAW: [string, string, number][] = [
  ["Layla mentioned you in Field notes, issue 12", "Mentions", 1], ["Omar replied to your comment", "Mentions", 1], ["Salma mentioned you in Budget Q1", "Mentions", 1],
  ["Review requested: Offline sync announcement", "Reviews", 2], ["Deadline tomorrow: Board pack", "Deadlines", 2], ["Hamza asked you to approve the invoice", "Reviews", 2],
  ["Layla edited Field notes, issue 12", "Activity", 3], ["New comment on Roadmap", "Activity", 3], ["Omar shared Budget Q1 with Finance", "Activity", 3], ["3 edits to Style guide", "Activity", 3],
];
const SAMPLES: DialSample[] = Array.from({ length: 34 }, (_, i) => {
  const [title, source, minLevel] = RAW[(i * 7) % RAW.length];
  return { id: `n${i}`, title, source, minLevel, day: (i * 3) % 7 };
}).sort((a, b) => a.minLevel - b.minLevel || a.day - b.day);

export default function Demo({ variant = "light" }: { variant?: string }) {
  const dark = variant === "dark";
  return (
    <div className={`flex min-h-full w-full items-center justify-center px-4 py-10 ${dark ? "bg-[#0e0f10]" : "bg-[#e4e1da]"}`}>
      <div className="w-full max-w-[50rem]">
        <NotificationDial levels={LEVELS} samples={SAMPLES} defaultValue={2} emptyText="Nothing will reach you. You can still check Masar yourself." theme={dark ? "dark" : "light"} />
      </div>
    </div>
  );
}
