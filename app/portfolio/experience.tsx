import { ArrowUpRight, Download } from "lucide-react";
import { getPublishedExperiences, getSiteSettings } from "../services/portfolio.server";
import { generateMeta } from "../lib/meta";
import type { Route } from "./+types/experience";

export function meta() {
  return generateMeta(
    "Experience — Zion-faith Pelumi Omosanya",
    "Where I've worked and what I've done."
  );
}

export async function loader({ request }: Route.LoaderArgs) {
  const [experiences, settings] = await Promise.all([
    getPublishedExperiences(request),
    getSiteSettings(request)
  ]);
  return { experiences, cvPath: settings?.cvPath };
}

export default function Experience({ loaderData }: Route.ComponentProps) {
  const { experiences, cvPath } = loaderData;

  return (
    <div className="animate-in fade-in duration-500 slide-in-from-bottom-2 flex flex-col min-h-[calc(100vh-200px)]">
      <h1 className="text-xl md:text-2xl text-[var(--foreground)] font-normal mb-12">
        Where I've worked and what I've done.
      </h1>

      <div className="flex flex-col gap-16 flex-1">
        {experiences.map((exp) => (
          <div key={exp.id} className="flex flex-col md:grid md:grid-cols-4 gap-4 md:gap-8">
            <div className="md:col-span-1">
              {exp.organizationUrl ? (
                <a 
                  href={exp.organizationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-1.5 text-[var(--foreground)] font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--foreground)] rounded-sm"
                >
                  <span className="link-highlight">{exp.organization}</span>
                  <ArrowUpRight size={14} className="text-[var(--muted-foreground)] opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                </a>
              ) : (
                <h2 className="text-[var(--foreground)] font-medium">
                  {exp.organization}
                </h2>
              )}
            </div>
            
            <div className="md:col-span-3 flex flex-col gap-6">
              <div className="flex flex-col">
                <h3 className="text-lg text-[var(--foreground)] font-medium">
                  {exp.role}
                </h3>
              </div>
              
              <ul className="flex flex-col gap-3">
                {exp.highlights.map((highlight, i) => (
                  <li key={i} className="flex gap-4">
                    <span className="text-[var(--muted-foreground)] select-none mt-1.5 text-[10px]">
                      ◆
                    </span>
                    <span className="text-[var(--muted-foreground)] leading-relaxed font-light">
                      {highlight}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      {cvPath && (
        <div className="mt-16 pt-8 border-t border-[var(--border)] flex justify-end">
          <a
            href={cvPath}
            download
            className="group flex items-center gap-2 text-sm font-medium text-[var(--foreground)] hover:text-[var(--muted-foreground)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--foreground)] rounded-sm p-1"
          >
            <span className="link-sweep">download my cv</span>
            <Download size={14} className="group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
          </a>
        </div>
      )}
    </div>
  );
}
