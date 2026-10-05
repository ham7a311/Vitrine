"use client";
import { useState } from "react";
import { QuickstartChecklist } from "./QuickstartChecklist";

export default function Demo({ variant = "light" }: { variant?: string }) {
  const dark = variant === "dark";
  const [note, setNote] = useState("");
  const say = (text: string) => () => setNote(`Demo · ${text}`);
  return (
    <div className={`flex min-h-full w-full justify-center px-4 py-12 sm:px-8 ${dark ? "bg-[#1f1f1f]" : "bg-[#f4efea]"}`}>
      <div className="w-full max-w-[40rem]">
        <QuickstartChecklist
          title="Get Wally running"
          theme={dark ? "dark" : "light"}
          onComplete={say("all steps finished")}
          steps={[
            { id: "token", title: "Create an access token", body: <p>Tokens let your notebooks and scripts reach the Muscat workspace. Keep it out of version control.</p>, action: { label: "Create token", onClick: say("would open the token dialog") } },
            { id: "load", title: "Load your first file", body: <p>Drop a CSV or Parquet file, or attach a public bucket. Types are inferred; you can change them before the table is made.</p>, action: { label: "Upload data", onClick: say("would open the importer") } },
            { id: "query", title: "Run a query", body: <p>Open a notebook and try <code>SELECT count(*) FROM rides</code>. Results stay in your workspace.</p>, action: { label: "Open notebook", onClick: say("would open a notebook") } },
            { id: "invite", title: "Invite a teammate", body: <p>Share the workspace with read or edit access. Invites expire after seven days.</p> },
          ]}
        />
        <p role="status" className={`mt-5 min-h-[1.5em] font-[family-name:DM_Mono,ui-monospace,monospace] text-[12px] uppercase tracking-[0.04em] ${dark ? "text-[#b9b2a9]" : "text-[#6f6a64]"}`}>{note}</p>
      </div>
    </div>
  );
}
