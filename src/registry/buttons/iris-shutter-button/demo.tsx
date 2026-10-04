"use client";

import { IrisShutterButton } from "./IrisShutterButton";

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

export default function Demo() {
  return (
    <div className="flex min-h-full w-full flex-wrap items-center justify-center gap-6 bg-[#0b080d] p-10">
      <IrisShutterButton onAction={() => wait(1600)} />
      <IrisShutterButton
        labels={{ idle: "Publish", loading: "Publishing…", success: "Published", error: "Couldn’t publish" }}
        onAction={async () => {
          await wait(1400);
          throw new Error("demo failure");
        }}
      />
    </div>
  );
}
