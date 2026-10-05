"use client";
import { Less, More, Stretchtext } from "./Stretchtext";

export default function Demo({ variant = "light" }: { variant?: string }) {
  const dark = variant === "dark";
  return (
    <div className={`min-h-full w-full px-4 py-10 ${dark ? "bg-[#0d0c09]" : "bg-[#ebe5d8]"}`}>
      <div className="mx-auto w-full max-w-[44rem]">
        <Stretchtext title="How Masar keeps your files" theme={dark ? "dark" : "light"}>
          <p>
            Every file you put in Masar is stored twice<More level={1}>, in two buildings in Muscat and Salalah about a thousand kilometres apart</More>
            <More level={2}>, and the second copy is written before we tell your app the upload finished</More>.
            {" "}<Less below={1}>If one copy is lost, we use the other.</Less>
            <More level={1}>If a disk, a server or a whole building fails, the other copy keeps serving your files while we rebuild the first.</More>
          </p>
          <h3>Who can read them</h3>
          <p>
            Files are encrypted<More level={1}> on our servers and on the way to them</More>
            <More level={2}>, with keys that change every 90 days and are kept in separate hardware from the files themselves</More>.
            {" "}Only people you invite can open them<Less below={1}>.</Less>
            <More level={1}>, and our staff can't browse them: support can see a file's name and size, never its contents, unless you share it with them</More>
            <More level={2}> from the file's menu, for a time you choose</More>
            <More level={1}>.</More>
          </p>
          <h3>When you delete something</h3>
          <p>
            <Less below={1}>Deleted files can be recovered for 30 days.</Less>
            <More level={1}>Deleted files go to a recovery bin for 30 days, where anyone who could open them can bring them back. After that they're erased from both copies</More>
            <More level={2}> within 48 hours, and from our backups when those backups expire, at most 35 days later</More>
            <More level={1}>.</More>
          </p>
          <h3>If you leave</h3>
          <p>
            You can export everything as a zip at any time.
            <More level={1}> Folders, names and dates are kept, and comments come out as a separate file next to each document.</More>
            <More level={2}> Closing your account starts the same 30-day bin for everything at once, so a mistaken closure can still be undone by writing to us.</More>
          </p>
        </Stretchtext>
      </div>
    </div>
  );
}
