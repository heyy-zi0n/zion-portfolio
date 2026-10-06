import { Breadcrumb } from "../components/Breadcrumb";
import { ProjectIndex } from "../components/ProjectIndex";
import { PROJECTS } from "../data/portfolio";
import { generateMeta } from "../lib/meta";

export function meta() {
  return generateMeta(
    "Projects — Zion-faith Pelumi Omosanya",
    "Selected software development and web engineering projects by Zion-faith Pelumi Omosanya."
  );
}

export default function Projects() {
  return (
    <div className="animate-in fade-in duration-500 slide-in-from-bottom-2">
      <Breadcrumb items={[{ label: "home", href: "/" }, { label: "projects" }]} />
      
      <div className="mt-8">
        <ProjectIndex projects={PROJECTS} />
      </div>
    </div>
  );
}
