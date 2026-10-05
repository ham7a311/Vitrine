"use client";

import { useState } from "react";
import { NearestPage } from "./NearestPage";

const ROUTES = [
  { path: "/", title: "Home" },
  { path: "/work", title: "Selected work" },
  { path: "/work/masar", title: "Masar" },
  { path: "/work/wally", title: "Wally" },
  { path: "/work/ocs", title: "OCS" },
  { path: "/work/transocean", title: "TransOcean" },
  { path: "/writing", title: "Writing" },
  { path: "/writing/a-wallet-that-says-no", title: "A wallet that says no" },
  { path: "/writing/right-to-left-is-not-a-mirror", title: "Right-to-left is not a mirror" },
  { path: "/about", title: "About" },
  { path: "/contact", title: "Contact" },
  { path: "/colophon", title: "Colophon" },
];

const TRIES = ["/work/walley", "/writing/right-to-left-is-not-mirror", "/contacts", "/archive/2019/qalam-beta"];

export default function Demo({ variant = "paper" }: { variant?: string }) {
  const night = variant === "night";
  const [path, setPath] = useState(TRIES[0]);
  const [went, setWent] = useState<string | null>(null);
  const muted = night ? "text-[#8d8f95]" : "text-[#6b6861]";
  return (
    <div className={`h-full w-full overflow-y-auto ${night ? "bg-[#0f1012] text-[#ececea]" : "bg-[#f6f5f1] text-[#1b1a17]"}`} style={{ height: "100%" }}>
      <div className="mx-auto max-w-[44rem] px-6 pb-16 pt-14">
        <div className={`mb-10 flex flex-wrap items-center gap-x-4 gap-y-1 font-[family-name:Geist_Mono] text-[0.6875rem] uppercase tracking-[0.12em] ${muted}`}>
          <span>Try a mistyped path</span>
          {TRIES.map((t) => (
            <button key={t} type="button" onClick={() => { setPath(t); setWent(null); }} className={`min-h-9 underline-offset-4 ${path === t ? "underline" : "opacity-70 hover:opacity-100"}`}>{t}</button>
          ))}
        </div>
        <NearestPage theme={night ? "night" : "paper"} path={path} routes={ROUTES} startHere={[ROUTES[1], ROUTES[6], ROUTES[10]]} onNavigate={setWent} />
        <p className={`mt-8 min-h-5 font-[family-name:Geist_Mono] text-[0.75rem] ${muted}`} role="status">{went ? `Would go to ${went}` : ""}</p>
      </div>
    </div>
  );
}
