"use client";

import { ArrivalCta } from "./ArrivalCta";

export default function Demo() {
  return (
    <div className="min-h-full w-full bg-black">
      <ArrivalCta
        eyebrow="Join Northstar"
        heading={
          <>
            The doors are open. <em>Come make something.</em>
          </>
        }
        lead="Our community lives in one shared space — it's where sessions get announced, teams form, and questions get answered by people a few steps ahead of you."
        primary={{ label: "Join the community", href: "#join" }}
        secondary={{ label: "Create an account", href: "#signup" }}
        tagsLabel="Focus areas"
        tags={["Interfaces", "Machine learning", "Open source", "Research", "Hardware"]}
      />
    </div>
  );
}
