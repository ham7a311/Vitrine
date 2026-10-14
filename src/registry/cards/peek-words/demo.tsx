"use client";
import { Peek, PeekText } from "./PeekWords";
import { scenes } from "./scenes";

export default function Demo({ variant = "night" }: { variant?: string }) {
  const paper = variant === "paper";
  return (
    <div style={{ minHeight: "100%", display: "grid", placeItems: "center", padding: "clamp(140px, 22vh, 260px) clamp(20px, 5vw, 64px) 80px", background: paper ? "#f3f2ee" : "#050505" }}>
      <PeekText theme={paper ? "paper" : "night"}>
        <div style={{ maxWidth: "40rem", textAlign: "center" }}>
          <h2 style={{ margin: 0, fontSize: "clamp(2.4rem, 6vw, 3.8rem)", fontWeight: 500, letterSpacing: "-0.035em", lineHeight: 1.05, color: paper ? "#151513" : "#f4f4f1" }}>
            <Peek title="The Lantern Keepers" caption="A novel in four seasons" picture={scenes.lighthouse}>The Lantern Keepers</Peek>
          </h2>
          <p style={{ margin: "36px 0 0", fontSize: "clamp(1.15rem, 2.4vw, 1.5rem)", lineHeight: 1.65 }}>
            On a coast where the fog never quite lifts, a retired cartographer named{" "}
            <Peek title="Ines Varga" caption="Draws maps of places that moved" picture={scenes.dawn}>Ines</Peek>{" "}
            takes over the last working lighthouse. She finds a boy,{" "}
            <Peek title="Tomas" caption="Knows every boat by its engine" picture={scenes.canal}>Tomas</Peek>, sleeping in the lamp room, and a letter that leads them inland to the{" "}
            <Peek title="Mirror Lake" caption="Where the second lantern was lit" picture={scenes.lake}>mirror lake</Peek>
            {" "}— and to the reason the light has to stay on.
          </p>
        </div>
      </PeekText>
    </div>
  );
}
