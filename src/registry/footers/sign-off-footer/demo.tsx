"use client";

import { SignOffFooter } from "./SignOffFooter";

export default function Demo() {
  return (
    <div className="flex min-h-full w-full items-end bg-[#0c0b0a]">
      <SignOffFooter
        line="Let's make something careful."
        email="hello@hamza.dev"
        city="Muscat"
        timeZone="Asia/Muscat"
        owner="Hamza Al-Bulushi"
        links={[{ label: "GitHub", href: "#" }, { label: "LinkedIn", href: "#" }, { label: "Read.cv", href: "#" }]}
      />
    </div>
  );
}
