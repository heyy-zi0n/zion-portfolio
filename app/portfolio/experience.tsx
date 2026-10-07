import { Breadcrumb } from "../components/Breadcrumb";
import { EXPERIENCES, HAS_CV } from "../data/portfolio";
import { generateMeta } from "../lib/meta";
import { ArrowDownRight } from "lucide-react";
import { cn } from "../lib/utils";

export function meta() {
  return generateMeta(
    "Career — Zion-faith Pelumi Omosanya",
    "Professional experience and career history of Zion-faith Pelumi Omosanya."
  );
}

export default function Experience() {
  return (
    <div className="animate-in fade-in duration-500 slide-in-from-bottom-2">
      <Breadcrumb items={[{ label: "about me", href: "/about" }, { label: "career" }]} />
      
      <div className="flex flex-col gap-12 mt-8">
        {EXPERIENCES.map((exp, index) => (
          <div key={exp.id} className="relative">
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-8">
              <div className="text-[var(--muted-foreground)] text-sm pt-1 w-8 shrink-0">
                0{index + 1}
              </div>
              
              <div className="flex flex-col gap-8 flex-1">
                {exp.roles.map((role, roleIndex) => (
                  <div key={role.id} className="flex flex-col relative">
                    {exp.roles.length > 1 && roleIndex !== exp.roles.length - 1 && (
                      <div className="absolute left-[-1.5rem] top-6 bottom-[-2rem] w-px bg-[var(--border)] hidden sm:block" />
                    )}
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-1 mb-4">
                      <div>
                        <h3 className="text-[var(--foreground)] font-medium text-base">{exp.company}</h3>
                        <div className="text-[var(--foreground)] text-sm font-light mt-0.5">{role.title}</div>
                      </div>
                      <span className="text-[var(--muted-foreground)] text-xs font-light tracking-wide uppercase">
                        {role.period}
                      </span>
                    </div>
                    
                    <ul className="flex flex-col gap-3">
                      {role.highlights.map((highlight, i) => (
                        <li key={i} className="text-[var(--muted-foreground)] text-sm font-light leading-relaxed flex items-start">
                          <span className="mr-3 mt-2 w-1 h-1 rounded-full bg-[var(--muted-foreground)] opacity-40 shrink-0" />
                          <span>{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {HAS_CV && (
        <div className="mt-12 flex justify-end">
          <a
            href="/zion-faith-omosanya-cv.pdf"
            download="Zion-faith-Pelumi-Omosanya-CV.pdf"
            className="link-sweep text-sm font-light text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors inline-flex items-center gap-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--foreground)] rounded-sm pb-0.5"
          >
            download my cv <ArrowDownRight size={14} strokeWidth={1.5} />
          </a>
        </div>
      )}
    </div>
  );
}
