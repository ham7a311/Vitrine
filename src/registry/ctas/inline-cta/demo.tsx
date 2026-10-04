"use client";

import { InlineCta } from "./InlineCta";

export default function Demo({ variant = "bone" }: { variant?: string }) {
  if (variant === "frost")
    return (
      <div className="flex min-h-full w-full items-center bg-[#0b0e13] px-[8%] py-12">
        <InlineCta accent="#b9cce4" before="The library is open. Take what you need, or" action="browse all components" after="first." caption="Free · MIT licensed · no sign-up" />
      </div>
    );
  if (variant === "amber")
    return (
      <div className="flex min-h-full w-full items-center bg-[#0e0b08] px-[8%] py-12">
        <InlineCta accent="#e8a24a" before="Seats are limited this year —" action="reserve yours" after="before the 14th." caption="Northstar Build Summit · Harbour Hall" />
      </div>
    );
  return (
    <div className="flex min-h-full w-full items-center bg-[#0c0b0a] px-[8%] py-12">
      <InlineCta before="Have an idea that needs a careful hand? Let’s" action="build it together" after="— properly." caption="Hamza Al-Bulushi · replies within a day" />
    </div>
  );
}
