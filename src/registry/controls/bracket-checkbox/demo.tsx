"use client";

import { useState } from "react";
import { BracketCheckbox } from "./BracketCheckbox";

export default function Demo({ variant = "light" }: { variant?: string }) {
  const dark = variant === "dark";
  const [agreed, setAgreed] = useState(false);
  const [tried, setTried] = useState(false);

  return (
    <div className="flex min-h-full w-full items-center justify-center p-8" style={{ background: dark ? "#10161c" : "#f6f4ef" }}>
      <form
        className="flex w-full max-w-md flex-col gap-5"
        onSubmit={(e) => {
          e.preventDefault();
          setTried(true);
        }}
        noValidate
      >
        <BracketCheckbox surface={dark ? "dark" : "light"} defaultChecked>
          Send me the monthly field notes
        </BracketCheckbox>
        <BracketCheckbox surface={dark ? "dark" : "light"}>Remember this device for 30 days</BracketCheckbox>
        <BracketCheckbox
          surface={dark ? "dark" : "light"}
          checked={agreed}
          onChange={(e) => setAgreed(e.target.checked)}
          hint="Required"
          error={tried && !agreed ? "Please accept the terms to continue." : undefined}
        >
          I agree to the <a href="#terms">terms of service</a>.
        </BracketCheckbox>
        <button
          type="submit"
          className="mt-2 h-11 self-start border px-5 text-sm font-semibold"
          style={{ borderColor: dark ? "#f6f4ef" : "#10161c", color: dark ? "#f6f4ef" : "#10161c" }}
        >
          Continue
        </button>
      </form>
    </div>
  );
}
