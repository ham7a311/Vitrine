"use client";

import { EntryPointCta } from "./EntryPointCta";

export default function Demo({ variant = "night" }: { variant?: string }) {
  return (
    <div className="flex min-h-full w-full">
      <EntryPointCta
        theme={variant === "paper" ? "paper" : "night"}
        href="mailto:hello@qantab.studio"
        eyebrow="Studio Qantab · booking projects for spring 2027"
        headline="Have a project? Let's talk."
        details={["hello@qantab.studio", "Replies within a working day", "Muscat · GMT+4"]}
      />
    </div>
  );
}
