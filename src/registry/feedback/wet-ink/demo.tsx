"use client";

import { useRef, useState } from "react";
import { WetInk } from "./WetInk";

type Net = "online" | "slow" | "offline";

const NOTE = `Sprint 18 retro — Vitrine

What went well
The search rewrite shipped two days early. Review turnaround was under a day for every pull request this sprint.

What didn't
Two deploys were rolled back because staging had drifted from production. We lost about half a day each time.

Next
Pin the staging config to production's, and write the rollback checklist down before Thursday.`;

export default function Demo({ variant = "paper" }: { variant?: string }) {
  const night = variant === "night";
  const [net, setNet] = useState<Net>("online");
  const [failNext, setFailNext] = useState(false);
  const netRef = useRef(net);
  const failRef = useRef(failNext);
  netRef.current = net;
  failRef.current = failNext;

  const save = async () => {
    await new Promise((r) => setTimeout(r, netRef.current === "slow" ? 2600 : 550));
    if (netRef.current === "offline") throw new Error("offline");
    if (failRef.current) {
      setFailNext(false);
      throw new Error("server");
    }
  };

  const seg = (id: Net, label: string) => (
    <button key={id} type="button" aria-pressed={net === id} onClick={() => setNet(id)} className={`h-8 rounded-lg px-3 ring-1 ${net === id ? (night ? "bg-white/10 ring-white/20" : "bg-black/[0.06] ring-black/20") : night ? "ring-white/10 text-[#8b8d93]" : "ring-black/10 text-[#77736b]"}`}>
      {label}
    </button>
  );

  return (
    <div className={`flex min-h-full w-full flex-col items-center justify-center gap-5 px-4 py-12 ${night ? "bg-[#0f1012] text-[#ececea]" : "bg-[#f3f1ec] text-[#1b1a17]"}`} style={{ fontFamily: "Geist, ui-sans-serif, system-ui" }}>
      <WetInk label="Note" value={NOTE} save={save} theme={night ? "night" : "paper"} rows={12} />
      <div className="flex flex-wrap items-center justify-center gap-1.5 text-[12.5px]">
        {seg("online", "Online")}
        {seg("slow", "Slow")}
        {seg("offline", "Offline")}
        <button type="button" aria-pressed={failNext} onClick={() => setFailNext((f) => !f)} className={`h-8 rounded-lg px-3 ring-1 ${failNext ? (night ? "bg-white/10 ring-white/20" : "bg-black/[0.06] ring-black/20") : night ? "ring-white/10 text-[#8b8d93]" : "ring-black/10 text-[#77736b]"}`}>
          Fail next save
        </button>
      </div>
    </div>
  );
}
