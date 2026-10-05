"use client";
import { Splice } from "./Splice";

const DRAFTS = [
  { id: "a", label: "Short", text: "Masar now works offline. Write on the plane and your changes sync when you land. Nothing to install or switch on. It's in every workspace from 19 October." },
  { id: "b", label: "Warm", text: "Some of our best writing happens far from good Wi-Fi. From today, Masar keeps working when the connection doesn't. Your edits wait safely on your laptop and join everyone else's the moment you're back online. If two people change the same paragraph, you'll see both and choose. It reaches every workspace on 19 October." },
  { id: "c", label: "Detailed", text: "Offline mode stores every open document on your device, encrypted with your workspace key. Only the paragraphs you change are sent when you reconnect, usually in under a second. Conflicts are rare; when they happen, a side-by-side view lets you keep yours, take theirs or combine them. Offline mode is on for every workspace from 19 October, with no settings to change." },
];

export default function Demo({ variant = "light" }: { variant?: string }) {
  const dark = variant === "dark";
  return (
    <div className={`min-h-full w-full px-4 py-8 ${dark ? "bg-[#0b0c0d]" : "bg-[#e9e7e1]"}`}>
      <div className="mx-auto w-full max-w-[72rem]">
        <p className={`mb-3 px-1 text-[13px] ${dark ? "text-[#a19d95]" : "text-[#6b675f]"}`}>Three drafts of the offline-sync announcement. Pick the sentences worth keeping.</p>
        <Splice drafts={DRAFTS} theme={dark ? "dark" : "light"} />
      </div>
    </div>
  );
}
