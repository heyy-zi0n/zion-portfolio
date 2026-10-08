import { Breadcrumb } from "../components/Breadcrumb";
import { ProjectIndex } from "../components/ProjectIndex";
import { getPublishedProjects } from "../services/portfolio.server";
import { generateMeta } from "../lib/meta";
import type { Route } from "./+types/projects";

export function meta() {
  return generateMeta(
    "Projects — Zion-faith Pelumi Omosanya",
    "Selected software development and web engineering projects by Zion-faith Pelumi Omosanya."
  );
}

export async function loader({ request }: Route.LoaderArgs) {
  const projects = await getPublishedProjects(request);
  return { projects };
}

export default function Projects({ loaderData }: Route.ComponentProps) {
  const { projects } = loaderData;

  return (
    <div className="animate-in fade-in duration-500 slide-in-from-bottom-2">
      <Breadcrumb items={[{ label: "home", href: "/" }, { label: "projects" }]} />
      
      <div className="mt-8">
        <ProjectIndex projects={projects} />
      </div>
    </div>
  );
}
