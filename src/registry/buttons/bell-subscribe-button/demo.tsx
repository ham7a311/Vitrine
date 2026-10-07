"use client";

import { BellSubscribeButton } from "./BellSubscribeButton";

const LOOKS: Record<string, { accent: string; page: string }> = {
  peach: { accent: "#f4c1a8", page: "#7b6ff0" },
  mint: { accent: "#bfe9cf", page: "#2f6b5e" },
  lemon: { accent: "#f6e27a", page: "#ff7a59" },
};

export default function Demo({ variant = "peach" }: { variant?: string }) {
  const look = LOOKS[variant] ?? LOOKS.peach;
  return (
    <div className="flex min-h-full w-full items-center justify-center px-4 py-12" style={{ background: look.page }}>
      <BellSubscribeButton accent={look.accent} />
    </div>
  );
}
