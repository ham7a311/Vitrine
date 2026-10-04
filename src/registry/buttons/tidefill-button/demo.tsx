"use client";

import { TidefillButton } from "./TidefillButton";

export default function Demo() {
  return (
    <div className="flex min-h-full w-full flex-wrap items-center justify-center gap-6 bg-[#0b080d] p-10">
      <TidefillButton>Dive in</TidefillButton>
      <TidefillButton tone="lilac">Read the story</TidefillButton>
      <TidefillButton tone="cream">Subscribe</TidefillButton>
    </div>
  );
}
