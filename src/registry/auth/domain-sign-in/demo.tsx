"use client";
import { DomainSignIn } from "./DomainSignIn";
import type { Org } from "./route";

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));
// Fictional companies and their identity providers.
const orgs: Org[] = [
  { domain: "northwind.co", name: "Northwind", color: "#2f8f6b", idp: "Okta" },
  { domain: "halcyon.io", name: "Halcyon", color: "#7b5cd6", idp: "Microsoft Entra" },
];
const Mark = <svg width="22" height="22" viewBox="0 0 22 22" aria-hidden="true"><circle cx="11" cy="11" r="8" fill="none" stroke="currentColor" strokeWidth="2.4" /><circle cx="11" cy="11" r="3" fill="currentColor" /></svg>;

export default function Demo({ variant = "paper" }: { variant?: string }) {
  return (
    <DomainSignIn
      theme={variant === "night" ? "night" : "paper"}
      app={{ name: "Orbitly", mark: Mark }}
      orgs={orgs}
      onHandoff={async () => { await wait(1300); }}
      onPassword={async (_, p) => { await wait(1000); if (p !== "orbit") throw new Error("wrong"); }}
    />
  );
}
