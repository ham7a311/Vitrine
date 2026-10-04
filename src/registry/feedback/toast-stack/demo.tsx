"use client";

import { ToastProvider, useToast } from "./ToastStack";

const SAMPLES = [
  { title: "Draft saved", body: "Your changes are safe.", kind: "success" as const },
  { title: "New comment from Alex Morgan", body: "“Love the direction — can we try a darker header?”", kind: "info" as const },
  { title: "Upload failed", body: "hero-final.png is over the 10 MB limit.", kind: "error" as const },
];

function Buttons() {
  const { push } = useToast();
  let n = 0;
  return (
    <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-3 text-center">
      <button
        type="button"
        onClick={() => push({ ...SAMPLES[n++ % SAMPLES.length], duration: 6000 })}
        className="h-11 rounded-md bg-[#efe8dc] px-5 text-sm font-medium text-[#0b080d]"
      >
        Show a toast
      </button>
      <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-white/40">Click a few · hover the stack to fan it out</p>
    </div>
  );
}

export default function Demo() {
  return (
    <div className="relative h-full min-h-full w-full overflow-hidden bg-[#0b080d]">
      <ToastProvider>
        <Buttons />
      </ToastProvider>
    </div>
  );
}
