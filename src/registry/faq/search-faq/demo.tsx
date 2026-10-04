"use client";

import { SearchFaq } from "./SearchFaq";

const ITEMS = [
  { tag: "Billing", q: "Can I get a refund if it isn't right for us?", a: "Yes — within 30 days of any payment, no questions asked. Refunds go back to the original card within five working days." },
  { tag: "Teams", q: "How do I add people to my team?", a: "Invite them from Settings → Members. Everyone gets their own login, and you choose whether they can deploy, review or only view." },
  { tag: "Data", q: "Where is my data stored?", a: "In the region you pick when you create a project — Frankfurt, Bahrain, Virginia or Singapore. It never leaves that region without your say." },
  { tag: "Billing", q: "Do you charge per seat or per usage?", a: "Per seat for the team plan, with generous usage included. You'll only see usage charges past the included amount, and we warn you before." },
  { tag: "Security", q: "Do you support SSO and SCIM?", a: "Yes, on the Studio plan: SAML SSO with Okta, Azure AD and Google, plus SCIM provisioning so your team list stays in sync." },
  { tag: "Data", q: "Can I export everything and leave?", a: "Any time, in one click — projects, logs and settings as a single archive. We'd be sad, but we'll never make leaving hard." },
];

export default function Demo() {
  return (
    <div className="flex min-h-full w-full items-start justify-center bg-[#0b080d] px-8 py-14">
      <SearchFaq items={ITEMS} />
    </div>
  );
}
