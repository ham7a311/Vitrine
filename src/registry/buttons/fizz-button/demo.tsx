"use client";
import { FizzButton } from "./FizzButton";

const DRINKS = {
  cola: { ground: "#f6ece1", drink: { top: "#6a321c", bottom: "#24100a", bubble: "rgba(255, 228, 196, 0.8)", label: "#fff3e3" }, text: "Crack one open" },
  lime: { ground: "#eef6e2", drink: { top: "#c9ef6b", bottom: "#86b937", bubble: "rgba(255, 255, 255, 0.9)", label: "#1c3306" }, text: "Get the zest" },
  berry: { ground: "#fbe9f0", drink: { top: "#c93a70", bottom: "#861543", bubble: "rgba(255, 220, 236, 0.9)", label: "#ffffff" }, text: "Pour me one" },
};

export default function Demo({ variant = "cola" }: { variant?: string }) {
  const d = DRINKS[variant as keyof typeof DRINKS] ?? DRINKS.cola;
  return (
    <div style={{ minHeight: "100%", display: "grid", placeItems: "center", padding: 48, background: d.ground }}>
      <FizzButton drink={d.drink}>{d.text}</FizzButton>
    </div>
  );
}
