"use client";
import { useRef } from "react";
import { Patina, type PatinaPage } from "./Patina";

const PAGES: PatinaPage[] = [
  { id: "onboard", title: "Onboarding a new studio", summary: "Accounts, seats and the welcome call, step by step.", owner: "Layla", checked: "2026-09-21" },
  { id: "billing", title: "How annual billing works", summary: "Proration, renewals and what happens when a card fails.", owner: "Omar", checked: "2026-05-30" },
  { id: "export", title: "Exporting to Word", summary: "Which styles survive and which become plain text.", owner: "Salma", checked: "2026-02-11" },
  { id: "sync", title: "Offline sync limits", summary: "File sizes, conflict rules and what is kept on the device.", owner: "Hamza", checked: "2025-08-02" },
  { id: "sso", title: "Single sign-on setup", summary: "Connecting an identity provider and testing the first login.", owner: "Omar", checked: "2024-12-14" },
  { id: "style", title: "Writing style guide", summary: "Voice, dates, numbers and Arabic transliteration.", owner: "Layla", checked: "2026-07-01" },
];

export default function Demo({ variant = "light" }: { variant?: string }) {
  const dark = variant === "dark";
  const n = useRef(0);
  return (
    <div className={`min-h-full w-full px-4 py-8 ${dark ? "bg-[#0b0a09]" : "bg-[#e3e0d8]"}`}>
      <div className="mx-auto w-full max-w-[64rem]">
        <Patina
          pages={PAGES}
          now="2026-10-05"
          theme={dark ? "dark" : "light"}
          // Simulated service: the second check fails so the rollback is visible.
          onCheck={() => new Promise((resolve, reject) => setTimeout(() => (++n.current === 2 ? reject(new Error("Couldn't reach the docs server. The page wasn't changed.")) : resolve()), 500))}
        />
      </div>
    </div>
  );
}
