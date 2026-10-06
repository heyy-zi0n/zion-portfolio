import { useState, useEffect, useRef } from "react";
import { Link } from "react-router";
import { Plus, ArrowRight } from "lucide-react";
import { Project } from "../data/portfolio";
import { cn } from "../lib/utils";

export function ProjectIndex({ projects }: { projects: Project[] }) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isPointerFine, setIsPointerFine] = useState(false);

  useEffect(() => {
    setIsPointerFine(window.matchMedia("(pointer: fine)").matches);
  }, []);

  useEffect(() => {
    if (!isPointerFine || hoveredIndex === null) return;
    
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [hoveredIndex, isPointerFine]);

  const handleToggle = (e: React.MouseEvent<HTMLDetailsElement>) => {
    const details = e.currentTarget;
    
    document.querySelectorAll("details[data-project]").forEach((d) => {
      if (d !== details) (d as HTMLDetailsElement).open = false;
    });
  };

  return (
    <div className="flex flex-col gap-0 w-full relative" onMouseLeave={() => setHoveredIndex(null)}>
      {projects.map((project, index) => {
        const isHovered = hoveredIndex === index;
        const isOtherHovered = hoveredIndex !== null && hoveredIndex !== index;
        
        return (
          <details 
            key={project.id} 
            data-project 
            className={cn(
              "group border-b border-[var(--border)] transition-opacity duration-300",
              isOtherHovered ? "opacity-35" : "opacity-100"
            )}
            onMouseEnter={() => setHoveredIndex(index)}
            onClick={handleToggle}
          >
            <summary className="flex items-center cursor-pointer list-none py-6 outline-none focus-visible:bg-[var(--muted)]/50 rounded-sm">
              <div className="flex-1 flex flex-col md:flex-row md:items-center gap-1 md:gap-4 overflow-hidden">
                <span className="text-[var(--muted-foreground)] text-sm font-medium w-8 shrink-0">
                  0{index + 1}
                </span>
                
                <h3 className={cn(
                  "text-xl md:text-2xl font-normal text-[var(--foreground)] truncate transition-transform duration-300 origin-left",
                  isHovered && "translate-x-1"
                )} style={{ viewTransitionName: `project-title-${project.slug}` }}>
                  {project.title}
                </h3>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="hidden md:flex flex-wrap justify-end gap-2 text-xs text-[var(--muted-foreground)] max-w-[200px]">
                  {project.techUsed.join(" · ")}
                </div>
                
                <div className="text-[var(--muted-foreground)] group-open:rotate-45 transition-transform duration-300 shrink-0 ml-2">
                  <Plus size={20} strokeWidth={1.5} />
                </div>
              </div>
            </summary>
            
            <div className="text-sm text-[var(--muted-foreground)] pb-6 pt-2 font-light leading-relaxed">
              <p className="mb-6 max-w-lg">{project.description}</p>
              
              {!isPointerFine && (
                <div className="mb-6 rounded-md overflow-hidden border border-[var(--border)]">
                  <img src={project.img} alt={project.title} className="w-full h-auto" loading="lazy" style={{ viewTransitionName: `project-shot-${project.slug}` }} />
                </div>
              )}
              
              <div className="flex items-center gap-6">
                <Link 
                  to={`/projects/${project.slug}`} 
                  className="link-sweep text-[var(--foreground)] font-medium inline-flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--foreground)] rounded-sm"
                  viewTransition
                >
                  read the case study
                  <ArrowRight size={14} />
                </Link>
                
                {project.url && (
                  <a href={project.url} target="_blank" rel="noopener noreferrer" className="link-highlight focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--foreground)] rounded-sm">
                    visit site
                  </a>
                )}
                
                {project.repo && (
                  <a href={project.repo} target="_blank" rel="noopener noreferrer" className="link-highlight focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--foreground)] rounded-sm">
                    view code
                  </a>
                )}
              </div>
            </div>
          </details>
        );
      })}

      {isPointerFine && hoveredIndex !== null && projects[hoveredIndex] && (
        <div 
          className="fixed z-50 pointer-events-none w-[20rem] rounded-lg overflow-hidden border border-[var(--border)] shadow-xl bg-[var(--background)] transition-opacity duration-300 ease-out"
          style={{
            left: mousePos.x + 24 + 320 > window.innerWidth ? mousePos.x - 24 - 320 : mousePos.x + 24,
            top: Math.max(16, Math.min(mousePos.y - 100, window.innerHeight - 200 - 16)),
            opacity: 1
          }}
        >
          <img 
            src={projects[hoveredIndex].img} 
            alt={projects[hoveredIndex].title} 
            className="w-full h-auto object-cover aspect-video"
            loading="eager"
          />
        </div>
      )}
    </div>
  );
}
