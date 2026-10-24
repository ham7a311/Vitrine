"use client";
import { Chat } from "./chat";
import { PulseChip } from "./PulseChip";

// The chip only comes inline, so the chat shows it in each reply and nothing above the thread.
export default function Example() {
  return (
    <div style={{ height: "100%", minHeight: 640, background: "radial-gradient(80% 60% at 50% 18%, #16161b, #0b0b0d)" }}>
      <Chat Mark={PulseChip} hero={false} />
    </div>
  );
}
