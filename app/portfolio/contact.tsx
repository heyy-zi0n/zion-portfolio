import { ArrowUpRight } from "lucide-react";
import { Breadcrumb } from "../components/Breadcrumb";
import { getVisibleSocialLinks } from "../services/portfolio.server";
import { generateMeta } from "../lib/meta";
import { getLinkDetail, isExternalUrl } from "../lib/social-links";
import type { Route } from "./+types/contact";

export function meta() {
  return generateMeta(
    "Connect — Zion-faith Pelumi Omosanya",
    "Contact Zion-faith Pelumi Omosanya."
  );
}

export async function loader({ request }: Route.LoaderArgs) {
  return { links: await getVisibleSocialLinks(request) };
}

export default function Contact({ loaderData }: Route.ComponentProps) {
  const { links } = loaderData;
  return (
    <div className="animate-in fade-in duration-500 slide-in-from-bottom-2">
      <Breadcrumb items={[{ label: "about me", href: "/about" }, { label: "connect" }]} />
      
      <div className="flex flex-col mt-8 group/list">
        {links.map((link, index) => {
          const external = isExternalUrl(link.url);
          const detail = getLinkDetail(link.url);
          return (
            <a 
              key={link.id} 
              href={link.url}
              target={external ? "_blank" : undefined}
              rel={external ? "noopener noreferrer" : undefined}
              className="group flex flex-col sm:flex-row sm:items-center py-6 border-b border-[var(--border)] transition-opacity duration-300 group-hover/list:opacity-35 hover:!opacity-100 focus-visible:!opacity-100 focus-visible:outline-none focus-visible:bg-[var(--muted)]/50 rounded-sm px-2 -mx-2"
            >
              <div className="text-[var(--muted-foreground)] font-medium text-sm w-8 shrink-0 mb-2 sm:mb-0">
                {String(index + 1).padStart(2, "0")}
              </div>
              
              <div className="flex-1 flex justify-between items-center group-hover:translate-x-2 transition-transform duration-300">
                <div className="flex flex-col gap-1">
                  <h3 className="text-[var(--foreground)] font-medium text-xl md:text-2xl lowercase">
                    {link.label}
                  </h3>
                  {detail && (
                    <span className="text-[var(--muted-foreground)] text-sm font-light">
                      {detail}
                    </span>
                  )}
                </div>
                
                <ArrowUpRight size={24} className="text-[var(--muted-foreground)] group-hover:text-[var(--foreground)] group-hover:-translate-y-1 group-hover:translate-x-1 transition-all duration-300" strokeWidth={1} />
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
}
