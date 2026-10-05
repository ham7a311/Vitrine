"use client";
import { Sieve, type Facet } from "./Sieve";

type Product = { id: string; name: string; type: string; material: string; price: number; stock: string; colour: string };
const NAMES: Record<string, string[]> = {
  Pen: ["Ruwi fountain pen", "Dune rollerball", "Harbour fineliner", "Souq ballpoint", "Wadi brush pen", "Falaj gel pen", "Corniche fountain pen", "Jabal technical pen", "Qurum calligraphy pen", "Seeb felt tip"],
  Pencil: ["Mutrah graphite set", "Sur colour pencils", "Nizwa carpenter pencil", "Bahla mechanical pencil", "Ibra charcoal sticks", "Sohar 2B pencils", "Khasab drafting lead", "Rustaq watercolour pencils"],
  Notebook: ["Salalah dot grid", "Masirah sketchbook", "Duqm field notes", "Sinaw ruled notebook", "Ibri pocket journal", "Barka grid pad", "Adam travel journal", "Bidbid lab book", "Qalhat ledger", "Fins planner"],
  Ink: ["Frankincense ink", "Date-palm ink", "Indigo bottle", "Sepia bottle", "Lime ink", "Myrrh ink", "Sea-green ink", "Charcoal ink cartridges", "Rose ink"],
  Paper: ["Cotton letter paper", "Kraft wrap", "Tracing pad", "Watercolour block", "Laid envelopes", "Washi tape set", "Index cards", "Vellum sheets", "Newsprint pad", "Postcard blanks", "Card stock"],
};
const MATERIALS: Record<string, string[]> = { Pen: ["Brass", "Resin", "Aluminium", "Wood"], Pencil: ["Wood", "Aluminium"], Notebook: ["Recycled paper", "Cotton paper", "Leather"], Ink: ["Glass bottle"], Paper: ["Recycled paper", "Cotton paper"] };
const COLOURS = ["#2f5d50", "#8a4b2a", "#3d4f7a", "#a7822a", "#6b3f5e", "#4b6b2e", "#7a2e2e", "#2e5e6b"];
const PRODUCTS: Product[] = Object.entries(NAMES).flatMap(([type, names], t) => names.map((name, i) => {
  const h = (t * 31 + i * 17) % 97;
  const mats = MATERIALS[type];
  return { id: `${type}-${i}`, name, type, material: mats[h % mats.length], price: [6, 9, 14, 19, 24, 32, 45, 58, 72][(h * 7) % 9], stock: h % 4 === 0 ? "Ships in a week" : "In stock", colour: COLOURS[h % COLOURS.length] };
}));
const band = (p: number) => (p < 10 ? "Under $10" : p < 25 ? "$10–25" : p < 50 ? "$25–50" : "$50 and up");
const FACETS: Facet<Product>[] = [
  { key: "type", label: "Type", get: (p) => p.type },
  { key: "material", label: "Material", get: (p) => p.material },
  { key: "price", label: "Price", get: (p) => band(p.price) },
  { key: "stock", label: "Availability", get: (p) => p.stock },
];

export default function Demo({ variant = "light" }: { variant?: string }) {
  const dark = variant === "dark";
  return (
    <div className={`min-h-full w-full px-4 py-8 ${dark ? "bg-[#100f0d]" : "bg-[#e3d9c6]"}`}>
      <div className="mx-auto w-full max-w-[64rem]">
        <Sieve
          items={PRODUCTS}
          facets={FACETS}
          getId={(p) => p.id}
          getName={(p) => p.name}
          noun={["product", "products"]}
          initial={{ type: ["Pen", "Notebook"], price: ["$10–25", "$25–50"] }}
          theme={dark ? "dark" : "light"}
          renderItem={(p) => (
            <>
              <span className="block h-14 rounded-md" style={{ background: p.colour }} aria-hidden="true" />
              <span className="text-[13px] font-semibold leading-tight">{p.name}</span>
              <span className={`text-[12px] ${dark ? "text-[#a99f8d]" : "text-[#6c6252]"}`}>{p.material} · ${p.price}{p.stock !== "In stock" ? " · ships in a week" : ""}</span>
            </>
          )}
        />
      </div>
    </div>
  );
}
