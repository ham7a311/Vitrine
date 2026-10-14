"use client";
import { FieldCta } from "./FieldCta";
import type { CtaField } from "./fields";

const COPY: Record<CtaField, { eyebrow: string; title: string; lede: string; primary: string; secondary: string; layout: "center" | "split" }> = {
  horizon: { eyebrow: "Early access", title: "Ship before the sun comes up.", lede: "Night builds, morning reviews. Halyard queues the work so your team wakes up to it done.", primary: "Start free", secondary: "Talk to us", layout: "center" },
  strands: { eyebrow: "Live in 40 cities", title: "Every stream, on one line.", lede: "Bring your feeds together and watch them cross in real time.", primary: "Connect a feed", secondary: "See the demo", layout: "split" },
  plumes: { eyebrow: "Season four", title: "Bring the heat back.", lede: "Tickets for the winter run open on Friday. The first two hundred get the front rows.", primary: "Get tickets", secondary: "Line-up", layout: "center" },
  shore: { eyebrow: "Paint & paper", title: "Colour that settles on its own.", lede: "Pigments that dry the way they want to — mixed small, by hand, in Porto.", primary: "Shop the set", secondary: "How it's made", layout: "split" },
};

export default function Demo({ variant = "horizon" }: { variant?: string }) {
  const f = (variant in COPY ? variant : "horizon") as CtaField;
  const c = COPY[f];
  return (
    <div style={{ minHeight: "100%", display: "grid", alignContent: "center", padding: "clamp(12px, 3vw, 40px)", background: "#08080b" }}>
      <FieldCta field={f} layout={c.layout} eyebrow={c.eyebrow} title={c.title} lede={c.lede}
        primary={{ label: c.primary, href: "#start" }} secondary={{ label: c.secondary, href: "#more" }} onNavigate={(_, e) => e.preventDefault()} />
    </div>
  );
}
