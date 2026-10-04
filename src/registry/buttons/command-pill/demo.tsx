"use client";

import { CommandPill } from "./CommandPill";

export default function Demo() {
  return (
    <div className="flex min-h-full w-full flex-col items-center justify-center gap-4 bg-[#0b080d] p-8">
      <CommandPill command="npx vitrine add mercury-segments" />
      <CommandPill command="pnpm dlx vitrine init" prompt="›" />
    </div>
  );
}
