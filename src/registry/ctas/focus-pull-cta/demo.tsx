"use client";

import { FocusPullCta } from "./FocusPullCta";

export default function Demo({ variant = "studio" }: { variant?: string }) {
  if (variant === "product")
    return (
      <div className="flex min-h-full w-full items-center bg-[#0b0e13] px-[8%] py-12">
        <FocusPullCta
          accent="#b9cce4"
          eyebrow="Vitrine · v2"
          title={<>Components worth <em>copying</em> into real work.</>}
          primary={{ label: "Browse the library" }}
          secondary={{ label: "Read the docs" }}
          note="Free and open source · MIT licence"
        />
      </div>
    );
  return (
    <div className="flex min-h-full w-full items-center bg-[#0c0b0a] px-[8%] py-12">
      <FocusPullCta
        eyebrow="Available from March"
        title={<>Have something worth building <em>carefully?</em></>}
        primary={{ label: "Start a project" }}
        secondary={{ label: "See selected work" }}
        note="Hamza Al-Bulushi · Software engineer, Muscat"
      />
    </div>
  );
}
