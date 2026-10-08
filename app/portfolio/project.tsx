import { useParams } from "react-router";
import { getProjectBySlug, getPublishedProjects } from "../services/portfolio.server";
import { generateMeta } from "../lib/meta";
import NotFound from "./not-found";
import { ProjectDetailView } from "../components/ProjectDetailView";
import type { Route } from "./+types/project";
import type { Project } from "../types/database";

export async function loader({ request, params }: Route.LoaderArgs) {
  const project = await getProjectBySlug(request, params.slug);
  
  if (!project) {
    throw new Response("Not Found", { status: 404 });
  }

  // To get the next project, we need the published projects array
  const allProjects = await getPublishedProjects(request);
  const currentIndex = allProjects.findIndex(p => p.id === project.id);
  const nextProject = allProjects[(currentIndex + 1) % allProjects.length];

  return { project, nextProject };
}

export function meta({ data }: Route.MetaArgs) {
  if (!data?.project) return generateMeta("Project Not Found", "Project not found.");
  
  return generateMeta(
    `${data.project.title} — Zion-faith Pelumi Omosanya`,
    data.project.description
  );
}

export default function ProjectDetail({ loaderData }: Route.ComponentProps) {
  const { project, nextProject } = loaderData;
  return <ProjectDetailView project={project as Project} nextProject={nextProject as Project} />;
}
