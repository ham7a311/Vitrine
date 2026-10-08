import { notFound } from "next/navigation";
import { FilmScene } from "@/film/FilmScene";

/** Dev-only: product scenes captured for the launch film. Not built or served in production. */
export const metadata = { robots: { index: false } };
/* Only the pages built from the registry exist; any other slug is a plain 404 and is never cached. */
export const dynamicParams = false;

export function generateStaticParams() {
  return [];
}

export default async function FilmPage({ params }: { params: Promise<{ scene: string }> }) {
  if (process.env.NODE_ENV === "production") notFound();
  const { scene } = await params;
  return (
    <div className="fixed inset-0 z-[1000]">
      <FilmScene scene={scene} />
    </div>
  );
}
