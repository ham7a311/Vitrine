"use client";
import { RecoveryKit } from "./RecoveryKit";
import { makeCode, type RecoveryCode } from "./codes";

const rng = (seed: number) => () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
const first = rng(11);
const codes: RecoveryCode[] = Array.from({ length: 10 }, (_, i) => ({ code: makeCode(first), used: i === 2 || i === 7 }));
let round = 40;

export default function Demo({ variant = "night" }: { variant?: string }) {
  const paper = variant === "paper";
  return (
    <div style={{ minHeight: "100%", display: "grid", placeItems: "center", padding: 20, background: paper ? "#f1f0eb" : "#0a0b0e" }}>
      <RecoveryKit
        theme={paper ? "paper" : "night"}
        codes={codes}
        account="mara@foldline.app"
        issued="12 March 2026"
        onRegenerate={async () => { const r = rng(round++); return Array.from({ length: 10 }, () => ({ code: makeCode(r) })); }}
        onContinue={() => {}}
      />
    </div>
  );
}
