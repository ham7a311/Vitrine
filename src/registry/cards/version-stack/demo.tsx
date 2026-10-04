"use client";

import { VersionStack, type Version } from "./VersionStack";

const V: Version[] = [
  { version: "v4.2", date: "Sep 2026", title: "Faster cold starts", notes: [
    { kind: "Added", text: "Regional warm pools for every plan." },
    { kind: "Changed", text: "Build cache is now shared across branches." },
    { kind: "Fixed", text: "Preview URLs no longer expire mid-review." } ] },
  { version: "v4.1", date: "Aug 2026", title: "Audit log, finally", notes: [
    { kind: "Added", text: "Every setting change is recorded with who and when." },
    { kind: "Fixed", text: "Timezone drift in scheduled jobs." } ] },
  { version: "v4.0", date: "Jun 2026", title: "A new dashboard", notes: [
    { kind: "Changed", text: "Projects, deploys and logs now share one view." },
    { kind: "Added", text: "Keyboard navigation everywhere." } ] },
  { version: "v3.9", date: "Apr 2026", title: "Edge functions GA", notes: [
    { kind: "Added", text: "Streaming responses from 32 regions." },
    { kind: "Fixed", text: "Cold-start spikes on large bundles." } ] },
  { version: "v3.8", date: "Feb 2026", title: "Team roles", notes: [
    { kind: "Added", text: "Viewer, developer and owner roles." } ] },
  { version: "v3.7", date: "Jan 2026", title: "Quiet notifications", notes: [
    { kind: "Changed", text: "Digest emails replace per-deploy alerts." } ] },
];

export default function Demo({ variant = "frost" }: { variant?: string }) {
  return (
    <div className="flex min-h-full w-full items-center justify-center bg-[#0b080d] p-10">
      <VersionStack versions={V} accent={variant === "amber" ? "#e8a24a" : "#b9cce4"} />
    </div>
  );
}
