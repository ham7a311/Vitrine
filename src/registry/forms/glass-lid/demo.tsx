"use client";

import { GlassLid } from "./GlassLid";

const BILLING = [
  { id: "org", label: "Legal name", value: "GUtech Studio LLC", autoComplete: "organization", required: true },
  { id: "vat", label: "VAT number", value: "OM1100284716", hint: "Printed on every invoice." },
  { id: "email", label: "Billing email", value: "finance@gutech.studio", type: "email" as const, autoComplete: "email", required: true },
  { id: "addr", label: "Address", value: "Way 36, Halban, Muscat 130", autoComplete: "street-address" },
];

const SSO = [
  { id: "idp", label: "Identity provider", value: "Microsoft Entra ID" },
  { id: "domain", label: "Verified domain", value: "gutech.edu.om" },
  { id: "policy", label: "Enforcement", value: "Required for all members" },
];

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

export default function Demo({ variant = "paper" }: { variant?: string }) {
  const night = variant === "night";
  const theme = night ? "night" : "paper";
  return (
    <div className={`flex min-h-full w-full flex-col items-center justify-center gap-6 px-4 py-14 ${night ? "bg-[#0f1012]" : "bg-[#f3f1ec]"}`} style={{ fontFamily: "Geist, ui-sans-serif, system-ui" }}>
      <GlassLid
        theme={theme}
        title="Billing details"
        description="Used on invoices for the Vitrine workspace."
        fields={BILLING}
        onSave={async (v) => {
          await wait(700);
          if (!/^\S+@\S+\.\S+$/.test(v.email)) throw new Error("That billing email doesn't look right.");
        }}
      />
      <GlassLid theme={theme} title="Single sign-on" description="How members of GUtech Studio sign in." fields={SSO} lockedBy="GUtech IT" />
    </div>
  );
}
