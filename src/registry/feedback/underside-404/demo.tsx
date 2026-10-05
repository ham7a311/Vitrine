"use client";
import { Underside404 } from "./Underside404";

const ENTRIES = [
  { label: "Recent work", href: "#work", folio: "02" },
  { label: "Studio journal", href: "#journal", folio: "11" },
  { label: "Type specimens", href: "#specimens", folio: "24" },
  { label: "Commissions", href: "#commissions", folio: "31" },
  { label: "Contact, Muscat", href: "#contact", folio: "40" },
];

export default function Demo({ variant = "paper" }: { variant?: string }) {
  return <Underside404 entries={ENTRIES} home={{ label: "Qalam Studio", href: "#home" }} theme={variant === "night" ? "night" : "paper"} />;
}
