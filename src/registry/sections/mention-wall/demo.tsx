import { MentionWall, type Mention } from "./MentionWall";

// Fictional people, handles and network. No real accounts.
const P = (id: string, name: string, handle: string, body: string, date: string, verified = false, extra: Partial<Mention> = {}): Mention =>
  ({ id, author: { name, handle, verified }, body, date, href: `#post-${id}`, source: "Chirp", ...extra });

const posts: Mention[] = [
  P("1", "Artem Volkov", "artemvolk", "That looks amazing 🔥\n\nVery cool. We might plug our own service into it one day — it fits nicely next to what I'm building. Keeping an eye on it.", "2026-03-04", true),
  P("2", "Eri Nakamura", "erisky", "The biggest problem for people building with AI already has a fix.\n\nYour sites look generic because you don't have good references. Lumen UI gives you hundreds of them, each with a prompt ready to paste. 👏", "2026-03-03", true),
  P("3", "Alex McKenna", "alexmck", "Love this 🖤", "2026-03-03", true),
  P("4", "Csilla Kovacs", "csilla_k", "lumen.dev — a library of components with prompts for coders\n\nNice collection 🚀", "2026-03-02", true),
  P("5", "Gaëlle Denis", "gaelle_dn", "Will try it. I always struggle to describe the UI I want while vibe coding. Thanks!", "2026-03-02", true),
  P("6", "Faro Martínez", "faro_builds", "Spot-on. The generic look was holding back a lot of quick builds, and this is a real answer: 400+ components that lift the quality without slowing you down.", "2026-03-01", false),
  P("7", "Sick Fox", "sickfoxdev", "This looks super cool 💎", "2026-03-01", true),
  P("8", "Kiyo Tanaka", "kiyohq", "Honestly you solved it properly. One suggestion: an install command per component would make it perfect.", "2026-02-28", true),
  P("9", "Bao Lam", "baolam_", "That's impressive", "2026-02-28", true),
  P("10", "Mathieu Roux", "stillnotenough3", "thank you for this, it's really useful!\n\nI just visited the site. I'm not actively building a landing page right now but I bookmarked twelve components already.", "2026-02-27", false),
  P("11", "Matteo Ricci", "techwithmatteo", "Filmed a walkthrough of the sign-in components. The keyboard handling is better than most paid kits I've used. Video next week. 🎬", "2026-02-27", true),
  P("12", "Priya Raman", "priyaraman", "The reduced-motion versions are designed, not just switched off. That's rare and I noticed. 🙏", "2026-02-26", false),
  P("13", "Jonas Berg", "jonasberg", "Swapped our pricing table for one of these in an afternoon. Conversion is up, but more importantly the team stopped arguing about it. 😅", "2026-02-25", false),
  P("14", "Lena Fischer", "lenafischer", "A long one, because I think it deserves it.\n\nI've tried most of the component galleries out there. Most give you a pretty screenshot and a block of code that falls apart the moment you put real data in it. These hold up: long names, empty states, errors, small screens. Somebody clearly sat with each one and asked what happens when it goes wrong.\n\nThe prompts are the other half. I paste one into my editor and get something that actually matches what I saw, not a cousin of it.\n\nAnyway. Thank you.", "2026-02-24", true),
  P("15", "Omar Haddad", "omarhaddad", "Deleted my old post about this because I was wrong — it's much better than I said.", "2026-02-23", false, { archived: true }),
  P("16", "Ines Duarte", "inesduarte", "every component handles focus properly?? who does that", "2026-02-22", false),
];

export default function Demo({ variant = "paper" }: { variant?: string }) {
  const look = variant === "night" ? "night" : variant === "pressed" ? "pressed" : "paper";
  return (
    <div style={{ minHeight: "100%", background: look === "night" ? "#0b0b0c" : look === "pressed" ? "#f3efe6" : "#f6f6f5" }}>
      <MentionWall posts={posts} pageSize={12} look={look} label="Posts about Lumen UI" onNavigate={(_, e) => e.preventDefault()} />
    </div>
  );
}
