"use client";

import { EclipseEventCard } from "./EclipseEventCard";

export default function Demo() {
  return (
    <div className="flex min-h-full w-full items-center justify-center bg-[#0c0b0a] p-5 sm:p-10">
      <div className="w-full max-w-5xl">
        <EclipseEventCard
          event={{
            category: "Summit",
            status: "Registration open",
            day: "24",
            month: "Oct",
            year: "2026",
            weekday: "Saturday",
            title: "Northstar Build Summit: a day of small teams and big ideas",
            description: "Eight hours, twelve teams, one shared brief. Mentors rotate every ninety minutes and every team demos on the main stage at dusk.",
            partner: "Halden & Co. and the Lumen Foundation",
            cta: { label: "Register", href: "#register" },
            meta: [
              { label: "Where", value: "Harbour Hall, Level 2" },
              { label: "Time", value: "09:00 – 18:00" },
              { label: "Format", value: "In person" },
              { label: "Seats", value: "120" },
            ],
          }}
        />
      </div>
    </div>
  );
}
