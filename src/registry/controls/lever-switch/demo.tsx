"use client";

import { LeverSwitch } from "./LeverSwitch";

export default function Demo() {
  return (
    <div className="flex min-h-full w-full items-center justify-center bg-[#0b080d] p-10">
      <div className="flex w-full max-w-sm flex-col gap-7">
        <LeverSwitch defaultChecked label="Notifications" description="A quiet digest, once a day." />
        <LeverSwitch label="Auto-save drafts" description="Keep a version every few minutes." />
        <LeverSwitch disabled label="Team analytics" description="Available on the Studio plan." />
      </div>
    </div>
  );
}
