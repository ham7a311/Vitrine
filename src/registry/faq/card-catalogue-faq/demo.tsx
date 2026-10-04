"use client";

import { CardCatalogueFaq, type Drawer } from "./CardCatalogueFaq";

const DRAWERS: Drawer[] = [
  {
    id: "billing",
    label: "Billing",
    cards: [
      { q: "Can I pay in Omani rials?", a: "Yes. Choose OMR at checkout and we invoice in rials with VAT shown separately; card and bank transfer both work." },
      { q: "What happens if I go over my build minutes?", a: "Builds keep running. Extra minutes are billed at $1 per 100 at the end of the month, and we email you at 80% so it's never a surprise." },
      { q: "Do you refund unused months on a yearly plan?", a: "Within the first 30 days, in full. After that we refund the remaining whole months if you're leaving because something didn't work." },
      { q: "Can I get one invoice for several teams?", a: "On Business, yes: add the teams to one organisation and they share a single monthly invoice with a line per team." },
    ],
  },
  {
    id: "security",
    label: "Security",
    cards: [
      { q: "Where is my code built?", a: "In isolated containers in Frankfurt or Bahrain, your choice per project. Containers are destroyed after each build." },
      { q: "Do you support single sign-on?", a: "On Business: SAML with Okta, Azure AD and Google Workspace, plus SCIM so leavers lose access the day they leave." },
      { q: "How do I report a vulnerability?", a: "Email security@tryvitrine.dev. We reply within one working day and don't take legal action against good-faith research." },
    ],
  },
  {
    id: "deploys",
    label: "Deploys",
    cards: [
      { q: "How long does a deploy take?", a: "A typical Next.js site builds in 40 to 90 seconds. Cached dependencies make the second deploy of a branch noticeably faster." },
      { q: "Can I freeze deploys over a holiday?", a: "Yes. Set a deploy window per project; outside it, deploys wait for an approver instead of going out." },
      { q: "Can I roll back from my phone?", a: "Yes, from the Vitrine app or by replying ROLLBACK to the deploy notification email." },
      { q: "Do previews get their own database?", a: "Only if you ask: connect a Postgres branch and each preview gets a copy of staging data, deleted with the preview." },
    ],
  },
  {
    id: "account",
    label: "Account",
    cards: [
      { q: "Can I move a project to another team?", a: "Yes, from the project settings. Its domains, history and environment variables move with it." },
      { q: "How do I delete my account?", a: "Settings → Account → Delete. We keep nothing after 30 days, and we email you when it's done." },
      { q: "Do students get anything free?", a: "Team is free while you study. Sign up with your university email; it renews each September." },
    ],
  },
];

export default function Demo({ variant = "paper" }: { variant?: string }) {
  const night = variant === "night";
  return (
    <div className={`flex min-h-full w-full justify-center px-4 py-10 sm:px-10 ${night ? "bg-[#0e0c0b]" : "bg-[#f3efe7]"}`}>
      <div className="w-full max-w-[44rem]">
        <p className={`mb-4 font-mono text-[0.6875rem] uppercase tracking-[0.14em] ${night ? "text-[#9a8f84]" : "text-[#7a6f62]"}`}>Help · Filed by topic</p>
        <CardCatalogueFaq drawers={DRAWERS} theme={night ? "night" : "paper"} />
      </div>
    </div>
  );
}
