"use client";

import { InviteJoin } from "./InviteJoin";

export default function Demo({ variant = "paper" }: { variant?: string }) {
  const night = variant === "night";
  return (
    <div className={`flex min-h-full w-full items-center justify-center px-4 py-12 ${night ? "bg-[#0d0e10]" : "bg-[#ece8e0]"}`}>
      <InviteJoin
        theme={night ? "night" : "paper"}
        team="Vitrine Design"
        email="hamza@tryvitrine.dev"
        inviter={{ name: "Maryam Al-Harthy", hue: 14 }}
        members={[
          { name: "Yousef Al-Rawahi", hue: 222 },
          { name: "Aisha Al-Balushi", hue: 150 },
          { name: "Salim Al-Kindi", hue: 40 },
          { name: "Noor Al-Zadjali", hue: 290 },
          { name: "Khalid Al-Maskari", hue: 190 },
          { name: "Huda Al-Lawati", hue: 330 },
          { name: "Rashid Al-Habsi", hue: 100 },
        ]}
        more={12}
      />
    </div>
  );
}
