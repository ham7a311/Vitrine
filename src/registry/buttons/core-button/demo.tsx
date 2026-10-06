"use client";
import { useState } from "react";
import { CoreButton, type CoreVariant } from "./CoreButton";

const Plus = () => <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"><path d="M8 3v10M3 8h10" /></svg>;
const Arrow = () => <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M3 8h10M9 4l4 4-4 4" /></svg>;
const Gear = () => <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="8" cy="8" r="2.2" /><path d="M8 1.8v1.6M8 12.6v1.6M1.8 8h1.6M12.6 8h1.6M3.6 3.6l1.1 1.1M11.3 11.3l1.1 1.1M3.6 12.4l1.1-1.1M11.3 4.7l1.1-1.1" strokeLinecap="round" /></svg>;
const Trash = () => <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2.5 4.5h11M6 4.5V3h4v1.5M4 4.5l.7 8.5h6.6l.7-8.5" /></svg>;
const Check = () => <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="m3 8.5 3 3 7-7" /></svg>;
const Alert = () => <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M8 2 14.5 13.5h-13Z" /><path d="M8 6.5v3M8 11.6v.1" /></svg>;

// What each kind of button would say in a real product.
const STYLES: { id: CoreVariant; name: string; label: string; act: string; icon: typeof Plus }[] = [
  { id: "primary", name: "Primary", label: "Continue", act: "Deploy", icon: Plus },
  { id: "secondary", name: "Secondary", label: "Preview", act: "Duplicate", icon: Plus },
  { id: "outline", name: "Outline", label: "Export", act: "Invite", icon: Plus },
  { id: "ghost", name: "Ghost", label: "Skip", act: "Settings", icon: Gear },
  { id: "danger", name: "Danger", label: "Delete", act: "Remove", icon: Trash },
  { id: "success", name: "Success", label: "Approve", act: "Mark done", icon: Check },
  { id: "warning", name: "Warning", label: "Override", act: "Force sync", icon: Alert },
  { id: "link", name: "Link", label: "Learn more", act: "View docs", icon: Arrow },
];

function Row({ s, theme }: { s: (typeof STYLES)[number]; theme: "light" | "dark" }) {
  const [busy, setBusy] = useState(false);
  const Icon = s.icon;
  const run = () => { setBusy(true); setTimeout(() => setBusy(false), 1600); };
  return (
    <div className="cbtn-demo__row">
      <h3>{s.name}</h3>
      <div className="cbtn-demo__set">
        {(["sm", "md", "lg"] as const).map((z) => <CoreButton key={z} variant={s.id} size={z} theme={theme}>{s.label}</CoreButton>)}
        <CoreButton variant={s.id} theme={theme} icon={<Icon />}>{s.act}</CoreButton>
        <CoreButton variant={s.id} theme={theme} trailing={<Arrow />}>{s.label}</CoreButton>
        {s.id !== "link" && <CoreButton variant={s.id} theme={theme} aria-label={s.act}><Icon /></CoreButton>}
        <CoreButton variant={s.id} theme={theme} loading={busy} onClick={run}>Save</CoreButton>
        <CoreButton variant={s.id} theme={theme} disabled>Unavailable</CoreButton>
      </div>
    </div>
  );
}

export default function Demo({ variant = "light" }: { variant?: string }) {
  const theme = variant === "dark" ? "dark" : "light";
  return (
    <div className={`cbtn-demo cbtn-demo--${theme}`}>
      {STYLES.map((s) => <Row key={s.id} s={s} theme={theme} />)}
    </div>
  );
}
