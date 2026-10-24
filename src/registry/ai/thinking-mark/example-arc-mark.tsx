"use client";
import { Chat } from "./chat";
import { ArcMark } from "./ArcMark";

export default function Example() {
  return (
    <div style={{ height: "100%", minHeight: 640, background: "radial-gradient(80% 60% at 50% 18%, #16161b, #0b0b0d)" }}>
      <Chat Mark={ArcMark} />
    </div>
  );
}
