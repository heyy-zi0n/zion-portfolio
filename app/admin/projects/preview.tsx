import { Link } from "react-router";
import { requireAdmin } from "../../services/auth.server";
import { ProjectDetailView } from "../../components/ProjectDetailView";
import type { Route } from "./+types/preview";
import { generateMeta } from "../../lib/meta";
import type { Project } from "../../types/database";

export function meta() {
  return generateMeta("Draft Preview", "CMS Preview");
}

export async function loader({ request, params }: Route.LoaderArgs) {
  const { supabase } = await requireAdmin(request);
  
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("id", params.id)
    .single();

  if (error || !data) {
    throw new Response("Project not found", { status: 404 });
  }

  // Map snake_case back to camelCase as expected by the Project type
  const project: Project = {
    id: data.id,
    slug: data.slug,
    title: data.title,
    fullTitle: data.full_title,
    description: data.description,
    problem: data.problem,
    outcome: data.outcome,
    technologies: data.technologies,
    decisions: data.decisions,
    systemFlow: data.system_flow,
    imagePath: data.image_path,
    repositoryUrl: data.repository_url,
    liveUrl: data.live_url,
    status: data.status,
    sortOrder: data.sort_order,
    publishedAt: data.published_at,
    createdAt: data.created_at,
    updatedAt: data.updated_at
  };

  return { project };
}

export default function ProjectPreview({ loaderData }: Route.ComponentProps) {
  const { project } = loaderData;

  return (
    <div className="max-w-2xl mx-auto py-8">
      <ProjectDetailView project={project} isAdminPreview={true} />
    </div>
  );
}
