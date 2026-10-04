"use client";

import { Marginalia, type Note } from "./Marginalia";

const P = (...t: string[]) => (
  <>
    {t.map((x) => (
      <p key={x}>{x}</p>
    ))}
  </>
);

const NOTES: Note[] = [
  { id: "wayfinding", title: "Wayfinding on a campus with no street names", author: "Hamza Al-Bulushi", date: "12 Sep 2026", abstract: "Students describe routes by landmarks, not by building codes. We tested signage that follows the way people already talk.", body: P("Halban's campus has forty-one buildings and no street names. New students learn it by landmark: past the falcon, behind the library, the corridor that smells of coffee.", "We asked sixty first-years to guide a stranger to three destinations. Only six used a building code. Everyone else used a landmark, and eleven changed their route halfway to keep one in view.", "The signage trial replaced codes with landmark-first labels on four junctions. Wrong turns fell by a third in the first week.") },
  { id: "queues", title: "Why the registrar's queue feels longer than it is", author: "Dr. Salim Al-Harthy", date: "4 Sep 2026", abstract: "Perceived waiting time tracks uncertainty, not minutes. Showing position in line cut complaints without cutting the wait.", body: P("Median time in the registrar's queue is eleven minutes. Median perceived time, reported afterwards, is twenty-two.", "The gap closes almost entirely when people can see their position. Uncertainty, not duration, is what people are reporting.", "We recommend a numbered ticket and a wall display before any staffing change.") },
  { id: "tides", title: "Reading tide tables as a shared calendar", author: "Maryam Al-Kindi", date: "29 Aug 2026", abstract: "Fishing cooperatives already plan around tides. A calendar that speaks tide, not date, fits how they schedule.", body: P("Three cooperatives in Sohar plan their week from a printed tide table pinned in the harbour office.", "A generic calendar app failed them: it could not express 'the second low tide after the moon rises'. A calendar with tides as first-class events did.") },
  { id: "consent", title: "Consent screens people actually finish", author: "Hamza Al-Bulushi", date: "21 Aug 2026", abstract: "Shorter is not clearer. Ordering by consequence, not by category, doubled completion in our test.", body: P("Most consent screens list data categories. People do not think in categories; they think in consequences.", "Reordering the same permissions by what happens if you say yes doubled completion in a test with 140 students, with no change in opt-out rate.") },
  { id: "labs", title: "Lab booking without the spreadsheet", author: "Khalid Al-Rawahi", date: "14 Aug 2026", abstract: "Booking conflicts came from three sources, not one. Fixing the loudest cut only a quarter of them.", body: P("We logged every double booking for a term. Forty per cent came from two people editing the same spreadsheet cell. Another third came from bookings made on behalf of others.", "Only the first is fixed by a better tool.") },
  { id: "arabic-type", title: "Setting Arabic and Latin on one line", author: "Aisha Al-Balushi", date: "7 Aug 2026", abstract: "Mixed-script interfaces fail at the baseline. Matching x-height and optical weight matters more than matching typefaces.", body: P("When Arabic and Latin share a line, the eye reads baseline mismatch before it reads letterforms.", "We matched x-height, then optical weight, and only then looked at style. The pairing that looked best in isolation was the worst in running text.") },
  { id: "notifications", title: "The seven-minute rule for campus notifications", author: "Dr. Salim Al-Harthy", date: "1 Aug 2026", abstract: "Alerts that arrive within seven minutes of an event are acted on. After that, they are archived unread.", body: P("We tracked 9,000 notifications across a semester. Action rate fell off a cliff at seven minutes.", "Late alerts are worse than none: they train people to ignore the channel.") },
  { id: "printing", title: "What a library printer taught us about trust", author: "Maryam Al-Kindi", date: "24 Jul 2026", abstract: "Students avoided the cheapest printer because it once jammed. Trust in a system is a memory of its worst day.", body: P("The library's newest printer was the least used. Interviews traced it to a single jam in week two of term.", "Reliability is not an average. It is the worst day people remember.") },
  { id: "handover", title: "Handover notes that survive a graduation", author: "Hamza Al-Bulushi", date: "17 Jul 2026", abstract: "Student projects lose their history every June. A one-page handover template kept eight of ten projects alive.", body: P("Student-run projects have a natural half-life of one academic year.", "A one-page handover, written in the last two weeks of term and read aloud once, kept eight of ten projects alive the following year.") },
];

export default function Demo({ variant = "paper" }: { variant?: string }) {
  const night = variant === "night";
  return (
    <div className={`flex min-h-full w-full items-start justify-center px-4 py-10 sm:px-8 ${night ? "bg-[#0f1012]" : "bg-[#f3f1ec]"}`}>
      <Marginalia notes={NOTES} theme={night ? "night" : "paper"} />
    </div>
  );
}
