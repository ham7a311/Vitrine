"use client";
import { InstallSnippet, type SnippetTab } from "./InstallSnippet";

const TABS: SnippetTab[] = [
  { id: "python", label: "Python", steps: [
    { title: "Install the client", lang: "shell", code: "$ pip install wally-client" },
    { title: "Connect with your token", lang: "python", code: `import wally\n\n# Reads WALLY_TOKEN from the environment\ncon = wally.connect("wally:muscat_bikes")` },
    { title: "Run a query", lang: "python", code: `con.sql("SELECT station, count(*) FROM rides GROUP BY 1").show()` },
  ] },
  { id: "node", label: "Node", steps: [
    { title: "Install the client", lang: "shell", code: "$ npm install @wally/client" },
    { title: "Connect and query", lang: "js", code: `import { connect } from "@wally/client";\n\nconst db = await connect("wally:muscat_bikes");\nconst rows = await db.all("SELECT * FROM rides LIMIT 10"); // array of objects` },
  ] },
  { id: "cli", label: "CLI", steps: [
    { title: "Install with Homebrew", lang: "shell", code: "$ brew install wally" },
    { title: "Sign in and open a shell", lang: "shell", code: "$ wally login\n$ wally sql muscat_bikes" },
  ] },
];

export default function Demo({ variant = "light" }: { variant?: string }) {
  const dark = variant === "dark";
  return (
    <div className={`flex min-h-full w-full justify-center px-4 py-12 sm:px-8 ${dark ? "bg-[#1f1f1f] text-[#f4efea]" : "bg-[#f4efea] text-[#383838]"}`}>
      <div className="w-full max-w-[42rem]">
        <p className="mb-2 font-[family-name:DM_Mono,ui-monospace,monospace] text-[12px] uppercase tracking-[0.04em] opacity-70">Quickstart</p>
        <h2 className="mb-6 font-[family-name:DM_Mono,ui-monospace,monospace] text-[28px] font-medium uppercase leading-tight tracking-[-0.01em]">Query Wally from anywhere</h2>
        <InstallSnippet tabs={TABS} storageKey="vitrine-install-snippet" theme={dark ? "dark" : "light"} />
      </div>
    </div>
  );
}
