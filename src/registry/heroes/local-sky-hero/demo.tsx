"use client";

import { LocalSkyHero } from "./LocalSkyHero";

const AT: Record<string, number | undefined> = { live: undefined, dawn: 6.5, noon: 12.5, dusk: 18.15, night: 22.4 };

export default function Demo({ variant = "live" }: { variant?: string }) {
  return (
    <div className="h-full min-h-[38rem] w-full">
      <LocalSkyHero
        at={AT[variant]}
        eyebrow="Rahbi Studio · Brand and product design"
        headline={<>A small studio on the <em>Gulf of Oman</em>, working with teams in every time zone.</>}
        sub="Hamza and two designers, no account managers. You talk to the people doing the work, usually the same day."
        place="Muscat"
        timeZone="Asia/Muscat"
        actions={
          <>
            <a className="lsh-btn" href="#book">Book a 20-minute call</a>
            <a className="lsh-btn lsh-btn--ghost" href="#work">See the work</a>
          </>
        }
      />
    </div>
  );
}
