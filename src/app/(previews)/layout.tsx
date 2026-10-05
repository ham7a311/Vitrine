import { ComponentFonts } from "@/site/ComponentFonts";
export default function PreviewLayout({ children }: { children: React.ReactNode }) {
  return <><ComponentFonts /><main id="main">{children}</main></>;
}
