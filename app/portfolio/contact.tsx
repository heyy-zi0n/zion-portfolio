import { ArrowUpRight } from "lucide-react";
import { Breadcrumb } from "../components/Breadcrumb";
import { SOCIAL_LINKS } from "../data/static-fallback";
import { generateMeta } from "../lib/meta";

export function meta() {
  return generateMeta(
    "Connect — Zion-faith Pelumi Omosanya",
    "Contact Zion-faith Pelumi Omosanya."
  );
}

export default function Contact() {
  return (
    <div className="animate-in fade-in duration-500 slide-in-from-bottom-2">
      <Breadcrumb items={[{ label: "about me", href: "/about" }, { label: "connect" }]} />
      
      <div className="flex flex-col mt-8 group/list">
        {SOCIAL_LINKS.map((link, index) => {
          return (
            <a 
              key={link.id} 
              href={link.url}
              target={link.target}
              rel={link.target === "_blank" ? "noopener noreferrer" : undefined}
              className="group flex flex-col sm:flex-row sm:items-center py-6 border-b border-[var(--border)] transition-opacity duration-300 group-hover/list:opacity-35 hover:!opacity-100 focus-visible:!opacity-100 focus-visible:outline-none focus-visible:bg-[var(--muted)]/50 rounded-sm px-2 -mx-2"
            >
              <div className="text-[var(--muted-foreground)] font-medium text-sm w-8 shrink-0 mb-2 sm:mb-0">
                0{index + 1}
              </div>
              
              <div className="flex-1 flex justify-between items-center group-hover:translate-x-2 transition-transform duration-300">
                <div className="flex flex-col gap-1">
                  <h3 className="text-[var(--foreground)] font-medium text-xl md:text-2xl lowercase">
                    {link.name}
                  </h3>
                  {link.detail && (
                    <span className="text-[var(--muted-foreground)] text-sm font-light">
                      {link.detail}
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
