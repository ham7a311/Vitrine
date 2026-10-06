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
const COPY: Record<CoreVariant, { label: string; act: string; icon: typeof Plus }> = {
  primary: { label: "Continue", act: "Deploy", icon: Plus },
  secondary: { label: "Preview", act: "Duplicate", icon: Plus },
  outline: { label: "Export", act: "Invite", icon: Plus },
  ghost: { label: "Skip", act: "Settings", icon: Gear },
  danger: { label: "Delete", act: "Remove", icon: Trash },
  success: { label: "Approve", act: "Mark done", icon: Check },
  warning: { label: "Override", act: "Force sync", icon: Alert },
  link: { label: "Learn more", act: "View docs", icon: Plus },
};
const VARIANTS = Object.keys(COPY) as CoreVariant[];

function Panel({ variant, theme }: { variant: CoreVariant; theme: "light" | "dark" }) {
  const [busy, setBusy] = useState(false);
  const c = COPY[variant], Icon = c.icon;
  const run = () => { setBusy(true); setTimeout(() => setBusy(false), 1600); };
  return (
    <section className={`cbtn-demo__panel cbtn-demo__panel--${theme}`} aria-label={theme === "dark" ? "On dark" : "On light"}>
      <h3>Sizes</h3>
      <div className="cbtn-demo__row">
        {(["sm", "md", "lg"] as const).map((s) => <CoreButton key={s} variant={variant} size={s} theme={theme}>{c.label}</CoreButton>)}
      </div>
      <h3>Icons</h3>
      <div className="cbtn-demo__row">
        <CoreButton variant={variant} theme={theme} icon={<Icon />}>{c.act}</CoreButton>
        <CoreButton variant={variant} theme={theme} trailing={<Arrow />}>{c.label}</CoreButton>
        {variant !== "link" && <CoreButton variant={variant} theme={theme} aria-label={c.act}><Icon /></CoreButton>}
      </div>
      <h3>States</h3>
      <div className="cbtn-demo__row">
        <CoreButton variant={variant} theme={theme} loading={busy} onClick={run}>Save changes</CoreButton>
        <CoreButton variant={variant} theme={theme} disabled>Unavailable</CoreButton>
      </div>
    </section>
  );
}

export default function Demo({ variant = "primary" }: { variant?: string }) {
  const v = (VARIANTS.includes(variant as CoreVariant) ? variant : "primary") as CoreVariant;
  return (
    <div className="cbtn-demo">
      <Panel variant={v} theme="light" />
      <Panel variant={v} theme="dark" />
    </div>
  );
}
