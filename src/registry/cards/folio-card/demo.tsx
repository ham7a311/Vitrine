"use client";

import { FolioCard } from "./FolioCard";

export default function Demo({ variant = "paper" }: { variant?: string }) {
  const night = variant === "night";
  const theme = night ? "night" : "paper";
  return (
    <div className={`flex min-h-full w-full items-center justify-center px-6 py-12 sm:px-10 ${night ? "bg-[#0d0c10]" : "bg-[#ece8df]"}`}>
      <div className="grid w-full max-w-4xl items-start gap-8 sm:grid-cols-3 sm:gap-6">
        <FolioCard theme={theme} href="#note" kicker="Note" title="Why we deploy on Sundays" dek="The Muscat working week starts Sunday, so that's when the team is all at their desks." author="Hamza Al-Bulushi" date="12 Sep 2026" words={920} />
        <FolioCard theme={theme} href="#guide" kicker="Guide" title="Preview databases without the bill" dek="Branching Postgres for every pull request, and deleting it when the branch goes." author="Aisha Al-Harthy" date="28 Aug 2026" words={2600} progress={0.45} />
        <FolioCard theme={theme} href="#essay" kicker="Essay" title="Eleven years of on-call, and what finally fixed it" dek="Rotas, handovers and the alerts we deleted. A long one; get a coffee." author="Salim Al-Rawahi" date="3 Aug 2026" words={7400} />
      </div>
    </div>
  );
}
