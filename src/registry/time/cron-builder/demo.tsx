"use client";
import { CronBuilder } from "./CronBuilder";

export default function Demo({ variant = "light" }: { variant?: string }) {
  const dark = variant === "dark";
  return (
    <div className={`flex min-h-full w-full items-center justify-center px-4 py-10 ${dark ? "bg-[#0c0d0f]" : "bg-[#e8ebe9]"}`}>
      <div className="w-full max-w-[40rem]">
        <CronBuilder label="Masar · nightly backup" defaultValue="30 2 * * 1-5" timeZone="Asia/Muscat" locale="en-GB" theme={dark ? "dark" : "light"} />
      </div>
    </div>
  );
}
