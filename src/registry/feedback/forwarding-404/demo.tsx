"use client";
import { useState } from "react";
import { Forwarding404 } from "./Forwarding404";

const REDIRECTS = [
  { from: "/team-plan", to: "/pricing/teams", date: "2025-06-03", reason: "Renamed" },
  { from: "/pricing/teams", to: "/plans/studio", date: "2026-02-14", reason: "Merged into" },
];

export default function Demo({ variant = "paper" }: { variant?: string }) {
  const [searched, setSearched] = useState("");
  const night = variant === "night";
  return (
    <div className="flex min-h-full w-full flex-col">
      <Forwarding404
        path={variant === "unknown" ? "/press-kit-2019" : "/team-plan"}
        redirects={REDIRECTS}
        origin="https://masar.app"
        home={{ label: "masar.app home", href: "#home" }}
        hrefFor={(path) => `#${path}`}
        onSearch={setSearched}
        locale="en-GB"
        theme={night ? "night" : "paper"}
      />
      {searched && <p className="px-4 pb-6 text-center font-[family-name:Geist_Mono] text-[11px] uppercase tracking-[0.12em] text-[#586574]" role="status">demo · would search for “{searched}”</p>}
    </div>
  );
}
