import { MurmurRows, type Murmur, type MurmurRowsProps } from "./MurmurRows";
import { portrait } from "./portraits";

// Fictional people talking about a fictional component library.
const quotes: Murmur[] = [
  { id: "a", name: "Alex Rivera", role: "Frontend developer", avatar: portrait("crop", "tie"),
    text: "Lumen gets the small details right. I drop a component in, make it mine in an afternoon, and the rest of the project keeps moving." },
  { id: "b", name: "Jordan Lee", role: "Product designer", avatar: portrait("side", "collar", true),
    text: "The motion is what caught my eye. Reading the source is what kept me here — it's the shortest path I've found from a sketch to something real." },
  { id: "c", name: "Casey Morgan", role: "Independent maker", avatar: portrait("bob", "turtle"),
    text: "I wanted my launch page to feel like it had a point of view. Lumen let me get there without starting every interaction from nothing." },
  { id: "d", name: "Morgan Reed", role: "Full-stack developer", avatar: portrait("cap", "hoodie"),
    text: "Having the code right there changes everything. I tune the styling and behaviour to the interface I'm actually shipping, not a demo." },
  { id: "e", name: "Sam Ellis", role: "React developer", avatar: portrait("beard", "stripes"),
    text: "Preview it, read it, paste it in. That loop is quick enough that exploring the library feels like part of designing." },
  { id: "f", name: "Avery Stone", role: "Creative developer", avatar: portrait("curls", "dots"),
    text: "The cursor and scroll pieces are a great starting point for a more expressive site. I experiment more because nothing is a black box." },
  { id: "g", name: "Noor Haddad", role: "Design engineer", avatar: portrait("long", "collar"),
    text: "Every component handles reduced motion and keyboard focus properly. I stopped auditing them after the first week." },
  { id: "h", name: "Theo Brandt", role: "Engineering lead", avatar: portrait("bun", "turtle", true),
    text: "Our designers and developers finally point at the same thing. Fewer handoff notes, more shipped screens." },
];

export default function Demo({ variant = "illustrated" }: { variant?: string }) {
  const look = (["illustrated", "text-only", "tinted", "pressed"].includes(variant) ? variant : "illustrated") as MurmurRowsProps["look"];
  const items = look === "illustrated" ? quotes : quotes.map(({ avatar, ...q }) => q);
  return (
    <div style={{ minHeight: "100%", display: "grid", alignContent: "center", background: look === "pressed" ? "#f3efe6" : look === "tinted" ? "#f6f5f1" : "#000" }}>
      <MurmurRows quotes={items} look={look} rows={2} label="What developers say about Lumen UI" />
    </div>
  );
}
