"use client";
import { MegaNav, type MegaSection } from "./MegaNav";

// A fictional field-data company. Names, pages and numbers are invented.
const l = (id: string, title: string, blurb: string, kind: MegaSection["groups"][number]["links"][number]["preview"]["kind"], note: string, finds: string[], tag?: string) => ({
  id, title, blurb, href: `/${id}`, tag, preview: { kind, note, finds },
});

const SECTIONS: MegaSection[] = [
  {
    id: "product",
    label: "Product",
    groups: [
      {
        id: "capture", label: "Capture", all: { label: "Everything in Capture", href: "/capture" },
        links: [
          l("forms", "Forms", "Build the survey once; it adapts to every device.", "form", "A drag-and-drop form builder with logic, repeats and required photos.", ["Field types and validation", "Skip logic and repeat groups", "Versioning without breaking old data"]),
          l("offline", "Offline sync", "Work a whole week with no signal.", "list", "Records queue on the device and sync when a connection returns — no conflicts to resolve by hand.", ["How merging works", "Storage limits per device", "What happens on a shared tablet"]),
          l("photo-gps", "Photo & GPS", "Every record pinned to where it was taken.", "map", "Geotagged photos, tracks and areas, captured with the accuracy shown on screen.", ["Accuracy and averaging", "Drawing areas on site", "Photo compression settings"]),
          l("scan", "Barcode scanning", "Tag assets once, find them forever.", "list", "Scan a tag to open the asset's history, or start a new record from it.", ["Supported codes", "Printing your own tags", "Bulk import"], "New"),
        ],
      },
      {
        id: "analyse", label: "Analyse", all: { label: "Everything in Analyse", href: "/analyse" },
        links: [
          l("dashboards", "Dashboards", "Numbers that update while crews are still out.", "chart", "Live charts built from your forms — filter by team, place or week.", ["Chart types", "Sharing with a link", "Scheduled snapshots"]),
          l("layers", "Map layers", "See every record on one map.", "map", "Stack records over satellite, terrain or your own shapefiles.", ["Importing shapefiles", "Heatmaps and clusters", "Offline base maps"]),
          l("exports", "Exports", "CSV, GeoJSON and PDF, on a schedule.", "doc", "One-off or recurring exports in the formats your other tools expect.", ["Export formats", "Scheduled delivery", "Column mapping"]),
          l("alerts", "Alerts", "Hear about the reading that's out of range.", "list", "Rules that watch incoming records and notify the right person.", ["Thresholds and conditions", "Routing by region", "Quiet hours"]),
        ],
      },
      {
        id: "automate", label: "Automate", all: { label: "Everything in Automate", href: "/automate" },
        links: [
          l("workflows", "Workflows", "Hand a record from crew to reviewer to office.", "flow", "Approval steps, assignments and deadlines drawn as a simple flow.", ["Approval chains", "Reassigning work", "Escalation timers"]),
          l("integrations", "Integrations", "Send records where they're needed next.", "flow", "Ready-made connections to spreadsheets, GIS and maintenance systems.", ["Spreadsheets and storage", "GIS platforms", "Maintenance systems"]),
          l("api", "REST API", "Read and write everything programmatically.", "code", "A versioned API with examples in four languages.", ["Authentication", "Rate limits", "Pagination"]),
          l("webhooks", "Webhooks", "Get a call the moment a record lands.", "code", "Signed event payloads with retries and a delivery log.", ["Event types", "Verifying signatures", "Replaying deliveries"]),
        ],
      },
      {
        id: "govern", label: "Govern", all: { label: "Everything in Govern", href: "/govern" },
        links: [
          l("roles", "Roles & permissions", "Crews see their sites; managers see all.", "people", "Fine-grained roles down to the field level.", ["Built-in roles", "Custom roles", "Per-project access"]),
          l("audit", "Audit log", "Who changed what, and when.", "list", "An append-only history of every edit, export and sign-in.", ["What's recorded", "Retention", "Exporting the log"]),
          l("residency", "Data residency", "Keep data in the region it belongs to.", "map", "Choose where records are stored and processed.", ["Available regions", "Moving regions", "Backups"]),
        ],
      },
    ],
  },
  {
    id: "solutions",
    label: "Solutions",
    groups: [
      {
        id: "industry", label: "By industry",
        links: [
          l("utilities", "Utilities", "Pole, pipe and meter inspections.", "map", "Templates and maps for crews inspecting networked assets.", ["Inspection templates", "Asset registers", "Outage reporting"]),
          l("agriculture", "Agriculture", "Scouting, yields and spray records.", "chart", "Season-long records for growers and agronomists.", ["Field scouting", "Spray diaries", "Yield maps"]),
          l("conservation", "Conservation", "Species counts in the rain.", "form", "Survey forms designed for gloves, wet screens and no signal.", ["Transect surveys", "Camera-trap logs", "Sharing with partners"]),
          l("construction", "Construction", "Snags, handovers and site diaries.", "list", "Punch lists and diaries that hold up at handover.", ["Snag lists", "Daily diaries", "Handover packs"]),
        ],
      },
      {
        id: "team", label: "By team",
        links: [
          l("crews", "Field crews", "Less typing, bigger buttons.", "form", "What a crew member sees: today's jobs and one tap to start.", ["The job list", "Working offline", "Handing over a shift"]),
          l("ops", "Operations", "Know where every job stands.", "chart", "Live progress by team and region, and what's overdue.", ["Progress boards", "Reassigning work", "Weekly reports"]),
          l("compliance", "Compliance", "Evidence ready before it's asked for.", "doc", "Signed, timestamped records that make audits short.", ["Signatures", "Tamper evidence", "Audit packs"]),
        ],
      },
      {
        id: "stories", label: "Customer stories",
        links: [
          l("story-ridgeway", "Ridgeway Water", "Cut inspection write-ups from days to minutes.", "doc", "How a regional utility retired paper inspection forms in a season.", ["The rollout plan", "What crews said", "Results after a year"]),
          l("story-moorland", "Moorland Trust", "Ten years of bird counts, finally in one place.", "map", "A conservation charity's move from spreadsheets to a shared map.", ["Migrating old data", "Volunteer training", "Sharing with partners"]),
        ],
      },
    ],
  },
  {
    id: "resources",
    label: "Resources",
    groups: [
      {
        id: "learn", label: "Learn",
        links: [
          l("guides", "Guides", "Step-by-step, from first form to first export.", "doc", "Short guides written for people who'd rather be outside.", ["Getting started", "Designing good forms", "Rolling out to a team"]),
          l("templates", "Template gallery", "120 forms you can copy and change.", "form", "Inspection, survey and audit templates from real teams.", ["Browse by industry", "Importing a template", "Sharing your own"]),
          l("webinars", "Webinars", "Monthly, recorded, 30 minutes.", "people", "Live sessions with the team, then recordings with chapters.", ["Upcoming sessions", "Recordings", "Office hours"]),
        ],
      },
      {
        id: "developers", label: "Developers",
        links: [
          l("reference", "API reference", "Every endpoint, with examples.", "code", "The full reference, generated from the API itself.", ["Endpoints", "Errors", "SDKs"]),
          l("changelog", "Changelog", "What shipped, every week.", "list", "Dated notes on every change, with migration hints.", ["This month", "Breaking changes", "Subscribe"]),
          l("status", "Status", "Uptime and incidents.", "chart", "Live service status and a history of incidents.", ["Current status", "Incident history", "Notifications"]),
        ],
      },
      {
        id: "support", label: "Support",
        links: [
          l("help", "Help centre", "Answers to the common questions.", "doc", "Searchable articles, kept short and current.", ["Popular articles", "Troubleshooting sync", "Billing questions"]),
          l("community", "Community", "Ask other field teams.", "people", "A forum of customers sharing forms, tips and workarounds.", ["Show and tell", "Feature requests", "Local groups"]),
          l("contact-support", "Contact support", "A person replies within a working day.", "form", "Write to the support team; attach the record you're stuck on.", ["Response times", "Priority support", "Sending diagnostics"]),
        ],
      },
    ],
  },
  {
    id: "company",
    label: "Company",
    groups: [
      {
        id: "company", label: "Company",
        links: [
          l("about", "About", "Why we build for people who work outside.", "doc", "", []),
          l("careers", "Careers", "Remote-first, with field days twice a year.", "people", "", [], "6 open"),
          l("press", "Press", "Logos, photos and the short version.", "doc", "", []),
          l("contact", "Contact", "Sales, partnerships and everything else.", "form", "", []),
        ],
      },
    ],
    aside: { eyebrow: "Field Report No. 7", title: "What 400 inspection crews told us about paper.", body: "Our yearly survey of field teams: what they still print, why, and what finally made them stop.", href: "/field-report", cta: "Read the report" },
  },
];

export default function Demo({ variant = "light" }: { variant?: string }) {
  const dark = variant === "dark";
  const ink = dark ? "text-[#eeede9]" : "text-[#17181b]";
  const muted = dark ? "text-[#96969a]" : "text-[#6b6d73]";
  const rule = dark ? "border-[#2a2b2e]" : "border-[#dddbd4]";
  return (
    <div className={`min-h-full w-full ${dark ? "bg-[#101112]" : "bg-[#fbfaf7]"}`}>
      <MegaNav
        brand="Halden"
        theme={dark ? "dark" : "light"}
        sections={SECTIONS}
        links={[{ label: "Pricing", href: "/pricing" }]}
        signIn={{ label: "Sign in", href: "/sign-in" }}
        primary={{ label: "Start free", href: "/start" }}
      />
      {/* A page underneath, so the panel reads as an overlay on real content. */}
      <main className="mx-auto max-w-[74rem] px-6 pb-24 pt-16 sm:pt-24">
        <p className={`mb-4 text-[13px] font-semibold uppercase tracking-[0.08em] ${dark ? "text-[#6fd1a6]" : "text-[#1d6a4e]"}`}>Field data platform</p>
        <h1 className={`max-w-[18ch] text-[40px] font-semibold leading-[1.05] tracking-[-0.03em] sm:text-[60px] ${ink}`}>Records from the field, ready before the crew gets back.</h1>
        <p className={`mt-6 max-w-[52ch] text-[17px] leading-relaxed ${muted}`}>Halden turns inspections, surveys and counts into data the office can use the same afternoon — with or without signal.</p>
        <div className="mt-16 grid gap-8 sm:grid-cols-3">
          {[
            ["Capture", "Forms that work with gloves on and no signal."],
            ["Analyse", "Maps and numbers that update while crews are out."],
            ["Automate", "Hand each record to whoever needs it next."],
          ].map(([t, d]) => (
            <div key={t} className={`border-t pt-5 ${rule}`}>
              <p className={`text-[17px] font-semibold ${ink}`}>{t}</p>
              <p className={`mt-2 text-[15px] leading-relaxed ${muted}`}>{d}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
