"use client";

import { ProgressiveForm, useToday, type Step } from "./ProgressiveForm";

const fmtDate = (v: string) => {
  const d = new Date(`${v}T00:00:00`);
  return Number.isNaN(d.getTime()) ? v : d.toLocaleDateString("en-GB", { day: "numeric", month: "long" });
};

export default function Demo({ variant = "paper" }: { variant?: string }) {
  const night = variant === "night";
  const today = useToday();

  const steps: Step[] = [
    { id: "name", name: "Your name", label: "First, what should we call you?", type: "text", placeholder: "Hamza Al-Bulushi", validate: (v) => (v.trim().length < 2 ? "A name needs at least two letters." : null) },
    { id: "org", name: "Organisation", label: "Where do you work or study?", type: "text", placeholder: "GUtech", hint: "This becomes your workspace name. You can change it later." },
    { id: "size", name: "Team size", label: "How many people will use it?", type: "number", placeholder: "12", min: 1, max: 500, summary: (v) => (v === "1" ? "one" : v) },
    {
      id: "plan",
      name: "Plan",
      label: "Which plan would you like to start on?",
      type: "choice",
      summary: (v) => ({ free: "the Free plan", pro: "the Pro plan", team: "the Team plan" })[v] ?? v,
      options: [
        { value: "free", label: "Free", description: "Up to 3 projects" },
        { value: "pro", label: "Pro", description: "OMR 6 / seat · unlimited projects" },
        { value: "team", label: "Team", description: "OMR 11 / seat · SSO and audit log" },
        { value: "ent", label: "Enterprise", description: "Talk to sales — not available for self-serve", disabled: true },
      ],
    },
    {
      id: "start",
      name: "Start date",
      label: "When should billing start?",
      type: "date",
      hint: "Your 14-day trial runs until then.",
      summary: fmtDate,
      validate: (v) => (today && v < today ? "Pick today or a date after it." : null),
    },
  ];

  return (
    <div className={`flex h-full min-h-[600px] w-full items-center justify-center px-5 py-10 ${night ? "bg-[#121315]" : "bg-[#fbfaf6]"}`}>
      <ProgressiveForm
        theme={night ? "night" : "paper"}
        title="Set up your workspace"
        steps={steps}
        submitLabel="Create workspace"
        successMessage="Workspace created — see you inside."
        onSubmit={() => new Promise((r) => setTimeout(r, 1200))}
        template={(t) => (
          <>
            I&rsquo;m {t("name")} from {t("org")}, a team of {t("size")}, and we&rsquo;d like to start on {t("plan")} from {t("start")}.
          </>
        )}
      />
    </div>
  );
}
