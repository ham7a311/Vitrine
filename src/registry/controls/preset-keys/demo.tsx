"use client";

import { PresetKeys } from "./PresetKeys";

const STATIONS = [
  { name: "Classic FM", short: "Classic", mhz: 90.4 },
  { name: "Al Wisal", short: "Wisal", mhz: 96.5 },
  { name: "Coast FM", short: "Coast", mhz: 99.1 },
  { name: "Hala FM", short: "Hala", mhz: 102.7 },
  { name: "Merge", short: "Merge", mhz: 104.8 },
];

export default function Demo({ variant = "walnut" }: { variant?: string }) {
  const hifi = variant === "hifi";
  return (
    <div className="flex min-h-full w-full items-center justify-center px-4 py-12" style={{ background: hifi ? "#0d0e10" : "#e6dccb" }}>
      <PresetKeys stations={STATIONS} defaultIndex={3} theme={hifi ? "hifi" : "walnut"} />
    </div>
  );
}
