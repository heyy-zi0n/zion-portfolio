import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Link } from "react-router";
import { Breadcrumb } from "./Breadcrumb";
import type { Project } from "../types/database";
import { SystemFlow } from "./SystemFlow";

interface ProjectDetailViewProps {
  project: Project;
  nextProject?: Project | null;
  isAdminPreview?: boolean;
}

export function ProjectDetailView({ project, nextProject, isAdminPreview = false }: ProjectDetailViewProps) {
  const decisions = project.decisions || [];
  const systemFlow = project.systemFlow || [];
  
  const breadcrumbItems = isAdminPreview
    ? [
        { label: "admin", href: "/admin" },
        { label: "projects", href: "/admin/projects" },
        { label: project.title }
      ]
    : [
        { label: "projects", href: "/projects" }, 
        { label: project.title }
      ];

  return (
    <div className="animate-in fade-in duration-500 slide-in-from-bottom-2">
      <Breadcrumb items={breadcrumbItems} />
      
      {isAdminPreview && (
        <div className="mt-4 bg-orange-500/10 text-orange-500 text-sm px-4 py-2 rounded-md border border-orange-500/20">
          <strong>Draft Preview:</strong> This project is currently in '{project.status}' status.
        </div>
      )}

      <div className="flex flex-col gap-12 mt-8">
        <div className="flex flex-col gap-6">
          <h1 
            className="text-2xl md:text-3xl text-[var(--foreground)] font-normal"
            style={{ viewTransitionName: `project-title-${project.slug}` }}
          >
            {project.fullTitle || project.title}
          </h1>
          
          {project.technologies && project.technologies.length > 0 && (
            <div className="flex flex-wrap gap-2 text-sm text-[var(--muted-foreground)]">
              {project.technologies.join(" · ")}
            </div>
          )}
          
          {project.imagePath && (
            <div className="mt-4 rounded-md overflow-hidden border border-[var(--border)]">
              <img 
                src={project.imagePath} 
                alt={project.title} 
                className="w-full h-auto"
                style={{ viewTransitionName: `project-shot-${project.slug}` }}
                loading="eager"
              />
            </div>
          )}
        </div>

        {project.problem && (
          <div className="flex flex-col gap-4">
            <h2 className="text-xs font-medium text-[var(--muted-foreground)] uppercase tracking-wider">
              the problem
            </h2>
            <p className="text-[var(--muted-foreground)] text-sm md:text-base font-light leading-relaxed whitespace-pre-wrap">
              {project.problem}
            </p>
          </div>
        )}

        {decisions.length > 0 && (
          <div className="flex flex-col gap-6">
            <h2 className="text-xs font-medium text-[var(--muted-foreground)] uppercase tracking-wider mb-2">
              what I decided
            </h2>
            
            <div className="flex flex-col gap-8">
              {decisions.map((decision, i) => (
                <div key={decision.id || i} className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                  <div className="text-[var(--muted-foreground)] font-medium text-sm w-8 shrink-0">
                    0{i + 1}
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <h3 className="text-[var(--foreground)] font-medium text-base">
                      {decision.title}
                    </h3>
                    <p className="text-[var(--muted-foreground)] text-sm font-light leading-relaxed whitespace-pre-wrap">
                      {decision.detail}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {systemFlow.length >= 2 && (
          <div className="flex flex-col gap-6">
            <h2 className="text-xs font-medium text-[var(--muted-foreground)] uppercase tracking-wider">
              system flow
            </h2>
            <SystemFlow steps={systemFlow} />
          </div>
        )}

        {project.outcome && (
          <div className="flex flex-col gap-4">
            <h2 className="text-xs font-medium text-[var(--muted-foreground)] uppercase tracking-wider">
              the outcome
            </h2>
            <p className="text-[var(--muted-foreground)] text-sm md:text-base font-light leading-relaxed whitespace-pre-wrap">
              {project.outcome}
            </p>
          </div>
        )}

        {(project.liveUrl || project.repositoryUrl) && (
          <div className="flex flex-wrap items-center gap-6 pt-4 border-t border-[var(--border)]">
            {project.liveUrl && (
              <a 
                href={project.liveUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="link-highlight text-[var(--foreground)] font-medium inline-flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--foreground)] rounded-sm"
              >
                visit site
                <ArrowUpRight size={14} className="text-[var(--muted-foreground)]" />
              </a>
            )}
            
            {project.repositoryUrl && (
              <a 
                href={project.repositoryUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="link-highlight text-[var(--foreground)] font-medium inline-flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--foreground)] rounded-sm"
              >
                view code
                <ArrowUpRight size={14} className="text-[var(--muted-foreground)]" />
              </a>
            )}
          </div>
        )}

        {!isAdminPreview && nextProject && (
          <div className="pt-12 pb-8 flex justify-end border-t border-[var(--border)]">
            <Link 
              to={`/projects/${nextProject.slug}`}
              className="group flex flex-col items-end gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--foreground)] rounded-sm p-2 -mr-2"
              viewTransition
            >
              <span className="text-xs font-medium text-[var(--muted-foreground)] uppercase tracking-wider">
                next
              </span>
              <div className="flex items-center gap-2 text-[var(--foreground)] font-medium">
                <span className="link-sweep">{nextProject.title}</span>
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
