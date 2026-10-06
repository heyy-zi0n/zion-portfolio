import { Link, useParams } from "react-router";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Breadcrumb } from "../components/Breadcrumb";
import { PROJECTS } from "../data/portfolio";
import { generateMeta } from "../lib/meta";
import NotFound from "./not-found";

export function meta({ params }: { params: { slug: string } }) {
  const project = PROJECTS.find((p) => p.slug === params.slug);
  if (!project) return generateMeta("Project Not Found", "Project not found.");
  
  return generateMeta(
    `${project.title} — Zion-faith Pelumi Omosanya`,
    project.description
  );
}

export default function ProjectDetail() {
  const { slug } = useParams();
  const projectIndex = PROJECTS.findIndex((p) => p.slug === slug);
  const project = PROJECTS[projectIndex];
  
  if (!project) {
    return <NotFound />;
  }

  const nextProject = PROJECTS[(projectIndex + 1) % PROJECTS.length];

  return (
    <div className="animate-in fade-in duration-500 slide-in-from-bottom-2">
      <Breadcrumb items={[{ label: "projects", href: "/projects" }, { label: project.title }]} />
      
      <div className="flex flex-col gap-12 mt-8">
        <div className="flex flex-col gap-6">
          <h1 
            className="text-2xl md:text-3xl text-[var(--foreground)] font-normal"
            style={{ viewTransitionName: `project-title-${project.slug}` }}
          >
            {project.fullTitle || project.title}
          </h1>
          
          <div className="flex flex-wrap gap-2 text-sm text-[var(--muted-foreground)]">
            {project.techUsed.join(" · ")}
          </div>
          
          <div className="mt-4 rounded-md overflow-hidden border border-[var(--border)]">
            <img 
              src={project.img} 
              alt={project.title} 
              className="w-full h-auto"
              style={{ viewTransitionName: `project-shot-${project.slug}` }}
              loading="eager"
            />
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <h2 className="text-xs font-medium text-[var(--muted-foreground)] uppercase tracking-wider">
            the problem
          </h2>
          <p className="text-[var(--muted-foreground)] text-sm md:text-base font-light leading-relaxed">
            {project.caseStudy.problem}
          </p>
        </div>

        <div className="flex flex-col gap-6">
          <h2 className="text-xs font-medium text-[var(--muted-foreground)] uppercase tracking-wider mb-2">
            what I decided
          </h2>
          
          <div className="flex flex-col gap-8">
            {project.caseStudy.decisions.map((decision, i) => (
              <div key={decision.id} className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                <div className="text-[var(--muted-foreground)] font-medium text-sm w-8 shrink-0">
                  0{i + 1}
                </div>
                <div className="flex flex-col gap-1.5">
                  <h3 className="text-[var(--foreground)] font-medium text-base">
                    {decision.title}
                  </h3>
                  <p className="text-[var(--muted-foreground)] text-sm font-light leading-relaxed">
                    {decision.detail}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <h2 className="text-xs font-medium text-[var(--muted-foreground)] uppercase tracking-wider">
            the outcome
          </h2>
          <p className="text-[var(--muted-foreground)] text-sm md:text-base font-light leading-relaxed">
            {project.caseStudy.outcome}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-6 pt-4 border-t border-[var(--border)]">
          {project.url && (
            <a 
              href={project.url} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="link-highlight text-[var(--foreground)] font-medium inline-flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--foreground)] rounded-sm"
            >
              visit site
              <ArrowUpRight size={14} className="text-[var(--muted-foreground)]" />
            </a>
          )}
          
          {project.repo && (
            <a 
              href={project.repo} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="link-highlight text-[var(--foreground)] font-medium inline-flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--foreground)] rounded-sm"
            >
              view code
              <ArrowUpRight size={14} className="text-[var(--muted-foreground)]" />
            </a>
          )}
        </div>

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
      </div>
    </div>
  );
}
