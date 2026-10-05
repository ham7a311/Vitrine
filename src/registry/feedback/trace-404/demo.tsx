"use client";
import { Trace404 } from "./Trace404";

const ROUTES = [
  { href: "/", label: "Home" },
  { href: "/pricing", label: "Pricing" },
  { href: "/pricing/teams", label: "Teams" },
  { href: "/pricing/education", label: "Education" },
  { href: "/pricing/enterprise", label: "Enterprise" },
  { href: "/pricing/compare", label: "Compare plans" },
  { href: "/docs", label: "Docs" },
  { href: "/docs/api", label: "API reference" },
  { href: "/changelog", label: "Changelog" },
];

export default function Demo({ variant = "paper" }: { variant?: string }) {
  return (
    <Trace404
      path="/pricing/team/annual"
      routes={ROUTES}
      host="masar.app"
      home={{ label: "masar.app home", href: "#home" }}
      hrefFor={(path) => `#${path}`}
      theme={variant === "night" ? "night" : "paper"}
    />
  );
}
