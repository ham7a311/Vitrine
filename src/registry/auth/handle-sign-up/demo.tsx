"use client";
import { HandleSignUp } from "./HandleSignUp";

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));
// Handles that are already taken in this fictional network.
const TAKEN = ["mara_okafor", "mara", "maraokafor", "admin"];

export default function Demo({ variant = "night" }: { variant?: string }) {
  return (
    <HandleSignUp
      theme={variant === "paper" ? "paper" : "night"}
      brand="Murmur"
      onStart={async (how) => { await wait(1100); return "provider" in how ? { name: "Mara Okafor", via: how.provider } : { name: "" }; }}
      checkHandle={async (h) => { await wait(500); return !TAKEN.includes(h); }}
      onFinish={async () => { await wait(800); }}
    />
  );
}
