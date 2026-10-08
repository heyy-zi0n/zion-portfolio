import { Link } from "react-router";
import { ArrowUpRight } from "lucide-react";
import { getPublishedProjects } from "../services/portfolio.server";
import { generateMeta } from "../lib/meta";
import type { Route } from "./+types/projects";

export function meta() {
  return generateMeta(
    "Projects — Zion-faith Pelumi Omosanya",
    "A collection of my work."
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
      <h1 className="text-xl md:text-2xl text-[var(--foreground)] font-normal mb-8 md:mb-12">
        A collection of my work.
      </h1>

      <div className="flex flex-col">
        {projects.map((project) => (
          <div 
            key={project.slug}
            className="group flex flex-col md:flex-row md:items-start justify-between py-6 md:py-8 border-t border-[var(--border)] first:border-t-0 gap-4 transition-colors hover:bg-[var(--muted)]/20 -mx-4 px-4 md:-mx-6 md:px-6 rounded-md"
          >
            <div className="flex flex-col gap-2 md:max-w-[70%]">
              <Link 
                to={`/projects/${project.slug}`}
                className="text-lg text-[var(--foreground)] font-medium inline-flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--foreground)] rounded-sm w-fit"
                viewTransition
              >
                <span 
                  className="link-sweep"
                  style={{ viewTransitionName: `project-title-${project.slug}` }}
                >
                  {project.title}
                </span>
                <ArrowUpRight size={16} className="text-[var(--muted-foreground)] opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
              </Link>
              <p className="text-[var(--muted-foreground)] font-light leading-relaxed">
                {project.description}
              </p>
            </div>
            
            {project.technologies && project.technologies.length > 0 && (
              <div className="flex flex-wrap md:flex-col gap-x-3 gap-y-1 md:text-right mt-1 md:mt-0">
                {project.technologies.map(tech => (
                  <span key={tech} className="text-sm text-[var(--muted-foreground)]">{tech}</span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
