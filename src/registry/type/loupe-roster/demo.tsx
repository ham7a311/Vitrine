"use client";
import { LoupeRoster } from "./LoupeRoster";
const SKILLS = ["TypeScript","React","Next.js","Node.js","WebGL","GLSL","Three.js","Tailwind CSS","CSS Houdini","SVG","Canvas 2D","Python","PostgreSQL","Prisma","REST","GraphQL","Docker","Git","Figma","Design systems","Accessibility","Motion design","Vite","Vercel","React Native","Swift","Java","C++","Linux","CI/CD","Testing Library","Playwright","Web performance","i18n","RTL layouts","Arabic typography","Data viz","UX writing","Prototyping","Shaders"];
export default function Demo({ variant = "amber" }: { variant?: string }) {
  const a = variant === "mint" ? "#7fe3b6" : variant === "sky" ? "#8fc4ff" : "#e8a24a";
  return <div className="flex min-h-full w-full items-center justify-center bg-[#0c0b0a] p-6"><LoupeRoster names={[...SKILLS, ...SKILLS]} accent={a} className="w-full max-w-xl" /></div>;
}
