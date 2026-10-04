"use client";

import { OdometerStats } from "./OdometerStats";

export default function Demo() {
  return (
    <div className="flex min-h-full w-full flex-col items-center justify-center bg-[#0b080d] p-8 [container-type:inline-size]">
      <div className="w-full max-w-4xl">
        <OdometerStats
          stats={[
            { value: "48K+", label: "Downloads" },
            { value: "1.2M", label: "Requests per day" },
            { value: "98.4%", label: "Uptime, 12 months" },
          ]}
        />
      </div>
    </div>
  );
}
