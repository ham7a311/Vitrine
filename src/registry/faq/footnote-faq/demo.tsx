"use client";

import { FootnoteFaq, type Paragraph } from "./FootnoteFaq";

const TEXT: Paragraph[] = [
  [
    "Vitrine builds every branch you push and gives it ",
    { text: "its own preview address", q: "Do previews cost extra?", a: "No. Previews are included on every plan, including Hobby. They count toward your build minutes but not toward seats, and they're deleted 30 days after the branch is merged." },
    ". Production stays behind ",
    { text: "an approval you choose", q: "Who can approve a production deploy?", a: "Anyone with the Deployer role. On Team and Business you can require one or two approvals, and require that the approver isn't the person who wrote the change." },
    ", and every deploy can be ",
    { text: "rolled back in one step", q: "How fast is a rollback?", a: "Usually under ten seconds. Vitrine keeps your last 20 production builds warm, so rolling back switches traffic instead of rebuilding." },
    ".",
  ],
  [
    "You pay ",
    { text: "per seat, monthly or yearly", q: "What counts as a seat?", a: "A person who can deploy or approve. People who only view previews or leave comments are free, so designers and clients don't cost anything." },
    ", in US dollars or Omani rials, and ",
    { text: "you can leave whenever you like", q: "What happens to my data if I cancel?", a: "Your projects stay readable for 60 days, and you can export the build history and audit log as JSON at any time. After 60 days we delete them and email you to confirm." },
    ". If you're a student at GUtech or any other university, ",
    { text: "Team is free while you study", q: "How do students get Team for free?", a: "Sign in with your university email and we'll verify it. The plan renews each September as long as the address still works." },
    ".",
  ],
];

export default function Demo({ variant = "paper" }: { variant?: string }) {
  const night = variant === "night";
  return (
    <div className={`flex min-h-full w-full justify-center px-6 py-12 sm:px-10 sm:py-16 ${night ? "bg-[#0d0c10]" : "bg-[#fbfaf6]"}`}>
      <div className="w-full max-w-[40rem]">
        <p className={`font-mono text-[0.6875rem] uppercase tracking-[0.14em] ${night ? "text-[#8f8994]" : "text-[#77716a]"}`}>Questions, answered</p>
        <h2 className={`mb-6 mt-2 font-[family-name:Instrument_Serif] text-[clamp(2rem,5vw,2.75rem)] leading-none ${night ? "text-[#efe8dc]" : "text-[#1d1b17]"}`}>Vitrine, in two paragraphs</h2>
        <FootnoteFaq paragraphs={TEXT} theme={night ? "night" : "paper"} />
      </div>
    </div>
  );
}
