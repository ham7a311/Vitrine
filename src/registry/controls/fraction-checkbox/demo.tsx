"use client";

import { FractionCheckbox } from "./FractionCheckbox";

export default function Demo() {
  return (
    <div className="flex min-h-full w-full items-center justify-center bg-[#0b080d] p-8">
      <FractionCheckbox
        title="Notify me about"
        initial={["deploys", "mentions"]}
        options={[
          { id: "deploys", label: "Deploys", meta: "email" },
          { id: "mentions", label: "Mentions", meta: "push" },
          { id: "reviews", label: "Review requests", meta: "push" },
          { id: "billing", label: "Billing", meta: "email" },
          { id: "digest", label: "Weekly digest", meta: "email" },
        ]}
      />
    </div>
  );
}
