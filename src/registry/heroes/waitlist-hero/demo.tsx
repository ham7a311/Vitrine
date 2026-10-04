"use client";

import { WaitlistHero } from "./WaitlistHero";

export default function Demo({ variant = "night" }: { variant?: string }) {
  return (
    <div className="h-full min-h-[40rem] w-full">
      <WaitlistHero
        theme={variant === "paper" ? "paper" : "night"}
        eyebrow="Vitrine for iPhone · Private beta"
        headline={<>Approve the deploy from <em>wherever you are</em>.</>}
        sub="Review previews, approve production deploys and roll back in two taps. We let people in every Monday, in the order they joined."
        ahead={1283}
        perWeek={200}
      />
    </div>
  );
}
