"use client";

import { useState } from "react";
import { SentenceSettings, type FieldDef } from "./SentenceSettings";

type V = { cadence: string; day: string; hour: string; urgent: string; via: string; quiet: string };

const FIELDS: Record<keyof V, FieldDef> = {
  cadence: { label: "Summary frequency", options: [{ value: "weekly", label: "weekly" }, { value: "daily", label: "daily" }, { value: "never", label: "no" }] },
  day: { label: "Summary day", options: ["Monday", "Wednesday", "Friday", "Sunday"].map((d) => ({ value: d, label: d })) },
  hour: { label: "Summary time", options: ["7:00", "9:00", "12:30", "18:00"].map((d) => ({ value: d, label: d })) },
  urgent: { label: "Straight away", options: [{ value: "both", label: "mentions and replies" }, { value: "mentions", label: "mentions only" }, { value: "none", label: "nothing" }] },
  via: { label: "How", options: [{ value: "push", label: "push" }, { value: "email", label: "email" }, { value: "both", label: "push and email" }] },
  quiet: { label: "Quiet hours", options: [{ value: "night", label: "overnight, 22:00 to 07:00" }, { value: "weekends", label: "on weekends" }, { value: "never", label: "never" }] },
};

export default function Demo({ variant = "paper" }: { variant?: string }) {
  const night = variant === "night";
  const [v, setV] = useState<V>({ cadence: "weekly", day: "Sunday", hour: "9:00", urgent: "both", via: "push", quiet: "night" });

  return (
    <div className={`flex min-h-full w-full items-center justify-center px-6 py-16 ${night ? "bg-[#0f1012]" : "bg-[#f3f1ec]"}`}>
      <SentenceSettings
        theme={night ? "night" : "paper"}
        fields={FIELDS}
        value={v}
        onChange={setV}
        sentence={(s, slot) => (
          <>
            Send me {s.cadence === "never" ? <>{slot("cadence")} summary</> : <>a {slot("cadence")} summary{s.cadence === "weekly" && <> on {slot("day")}</>} at {slot("hour")}</>}.{" "}
            {s.urgent === "none" ? (
              <>Tell me about {slot("urgent")} straight away.</>
            ) : (
              <>
                Tell me about {slot("urgent")} straight away, by {slot("via")}
                {s.quiet === "never" ? <>, {slot("quiet")} muted</> : <>, but stay quiet {slot("quiet")}</>}.
              </>
            )}
          </>
        )}
      />
    </div>
  );
}
