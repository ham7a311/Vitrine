"use client";

import { useState } from "react";
import { ThreadStepper } from "./ThreadStepper";

const STEPS = [
  { id: "account", title: "Account", hint: "Email and password" },
  { id: "profile", title: "Profile", hint: "Tell us about you" },
  { id: "team", title: "Team", hint: "Invite colleagues" },
  { id: "launch", title: "Launch", hint: "Review and go" },
];

export default function Demo() {
  const [i, setI] = useState(1);
  return (
    <div className="flex min-h-full w-full flex-col items-center justify-center gap-10 bg-[#0b080d] p-8">
      <div className="w-full max-w-xl">
        <ThreadStepper steps={STEPS} current={i} onChange={setI} />
      </div>
      <div className="flex gap-3">
        <button type="button" onClick={() => setI((n) => Math.max(0, n - 1))} className="h-10 rounded-md border border-white/15 px-4 text-sm text-[#efe8dc] hover:border-white/30 disabled:opacity-40" disabled={i === 0}>Back</button>
        <button type="button" onClick={() => setI((n) => Math.min(STEPS.length, n + 1))} className="h-10 rounded-md bg-[#efe8dc] px-4 text-sm font-medium text-[#0b080d] disabled:opacity-40" disabled={i >= STEPS.length - 1}>Continue</button>
      </div>
    </div>
  );
}
