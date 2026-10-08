import { Breadcrumb } from "../components/Breadcrumb";
import { getPublishedExperiences, getSiteSettings } from "../services/portfolio.server";
import { generateMeta } from "../lib/meta";
import type { Route } from "./+types/experience";
import { format, parseISO } from "date-fns";
import type { Experience } from "../types/database";
import { ArrowDownRight } from "lucide-react";

export function meta() {
  return generateMeta(
    "Career — Zion-faith Pelumi Omosanya",
    "Professional experience and career history of Zion-faith Pelumi Omosanya."
  );
}

export async function loader({ request }: Route.LoaderArgs) {
  const [experiences, settings] = await Promise.all([
    getPublishedExperiences(request),
    getSiteSettings(request)
  ]);
  return { experiences, cvPath: settings?.cvPath };
}

function formatDateRange(startDate: string | null, endDate: string | null, isCurrent: boolean): string {
  if (!startDate) return "";
  
  const start = parseISO(startDate);
  let endStr = isCurrent ? "PRESENT" : "";
  
  if (!isCurrent && endDate) {
    const end = parseISO(endDate);
    // If same year, return "OCT 2025 - DEC 2025" or similar based on how we want it
    endStr = format(end, "MMM yyyy").toUpperCase();
  }
  
  const startStr = format(start, "MMM yyyy").toUpperCase();
  
  // If it's a multi-year like 2026 - PRESENT, wait, the example had "2026 — PRESENT".
  // The user said: "2026 — PRESENT" and "OCT 2025 — DEC 2025".
  // Let's just use "MMM yyyy" if there's a month, or if it's just year we can use "yyyy".
  // Since we have full dates in the DB, let's format as "MMM yyyy — PRESENT" or "yyyy — PRESENT" depending on what looks best.
  // We'll just use "MMM yyyy — [END]" or "yyyy — [END]" if we just want years. Let's stick to "MMM yyyy" to be safe.
  
  return `${startStr} — ${endStr}`;
}

// Helper to group by organization to match the old UI structure
function groupExperiences(experiences: Experience[]) {
  const grouped: { id: string; company: string; roles: any[] }[] = [];
  
  experiences.forEach((exp) => {
    let group = grouped.find(g => g.company === exp.organization);
    if (!group) {
      group = { id: exp.id, company: exp.organization, roles: [] };
      grouped.push(group);
    }
    
    group.roles.push({
      id: exp.id,
      title: exp.role,
      period: formatDateRange(exp.startDate, exp.endDate, exp.isCurrent),
      highlights: exp.highlights
    });
  });
  
  return grouped;
}

export default function ExperiencePage({ loaderData }: Route.ComponentProps) {
  const { experiences, cvPath } = loaderData;
  const groupedExperiences = groupExperiences(experiences);

  return (
    <div className="animate-in fade-in duration-500 slide-in-from-bottom-2">
      <Breadcrumb items={[{ label: "about me", href: "/about" }, { label: "career" }]} />
      
      <div className="flex flex-col gap-12 mt-8">
        {groupedExperiences.map((exp, index) => (
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
                      {role.highlights.map((highlight: string, i: number) => (
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
      
      {cvPath && (
        <div className="mt-16 flex justify-end">
          <a
            href={cvPath}
            download
            className="group flex items-center gap-2 text-sm font-medium text-[var(--foreground)] hover:text-[var(--muted-foreground)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--foreground)] rounded-sm p-1"
          >
            <span className="link-sweep">download my cv</span>
            <ArrowDownRight size={14} strokeWidth={1.5} className="group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
          </a>
        </div>
      )}
    </div>
  );
}
