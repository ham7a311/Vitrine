"use client";

import { useState } from "react";
import { EtchedField } from "./EtchedField";

export default function Demo() {
  const [email, setEmail] = useState("");
  const bad = email.length > 0 && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
  return (
    <div className="flex min-h-full w-full items-center justify-center bg-[#0b080d] p-10">
      <div className="flex w-full max-w-sm flex-col gap-7">
        <EtchedField label="Full name" defaultValue="" autoComplete="name" hint="As it appears on your ID." />
        <EtchedField label="Email address" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} error={bad ? "That doesn’t look like an email." : undefined} />
        <EtchedField label="Company" defaultValue="Northstar" />
      </div>
    </div>
  );
}
