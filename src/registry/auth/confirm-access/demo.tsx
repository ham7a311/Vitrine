"use client";
import { useState } from "react";
import { ConfirmAccess } from "./ConfirmAccess";

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

export default function Demo({ variant = "night" }: { variant?: string }) {
  const paper = variant === "paper";
  const [gone, setGone] = useState(false);
  const ink = paper ? "#16181d" : "#f1f2f5", muted = paper ? "#5c606a" : "#9fa3ad", line = paper ? "rgba(18,20,24,.12)" : "rgba(255,255,255,.1)";
  return (
    <div style={{ minHeight: "100%", display: "grid", placeItems: "center", padding: 24, background: paper ? "#f2f1ec" : "#0b0c10", fontFamily: "Hanken Grotesk, system-ui, sans-serif" }}>
      <section style={{ width: "min(640px, 100%)", border: `1px solid ${line}`, borderRadius: 18, overflow: "hidden", background: paper ? "#fff" : "#121318" }}>
        <header style={{ padding: "16px 20px", borderBottom: `1px solid ${line}`, color: ink, fontWeight: 650 }}>Danger zone</header>
        <div style={{ display: "flex", gap: 16, alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", padding: 20 }}>
          <div>
            <p style={{ margin: 0, color: ink, fontWeight: 600 }}>{gone ? "northwind/site was deleted" : "Delete this repository"}</p>
            <p style={{ margin: "4px 0 0", color: muted, fontSize: 14 }}>{gone ? "Reload the page to try the flow again." : "Once deleted, it's gone for good. Try the code 246810 or the password ‘tidewater’."}</p>
          </div>
          {!gone && (
            <ConfirmAccess
              theme={paper ? "paper" : "night"}
              action={{ verb: "Delete repository", target: "northwind/site" }}
              triggerLabel="Delete repository"
              account={{ handle: "mara" }}
              onVerify={async (m, v) => { await wait(m === "passkey" ? 1600 : 700); if (m === "code" && v !== "246810") throw new Error("wrong"); if (m === "password" && v !== "tidewater") throw new Error("wrong"); }}
              onConfirmed={() => setGone(true)}
            />
          )}
        </div>
      </section>
    </div>
  );
}
