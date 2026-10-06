import { Link } from "react-router";
import { ArrowLeft } from "lucide-react";
import { cn } from "../lib/utils";

export function Breadcrumb({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <div className="mb-8">
      <nav aria-label="Breadcrumb" className="flex items-center text-sm mb-4 overflow-x-auto whitespace-nowrap">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          
          return (
            <div key={index} className="flex items-center">
              {index === 0 && item.href && (
                <Link to={item.href} className="group mr-1 inline-flex items-center text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--foreground)] rounded-sm">
                  <ArrowLeft size={14} className="mr-1.5 group-hover:-translate-x-0.5 transition-transform" />
                  <span className="font-light">{item.label}</span>
                </Link>
              )}
              {index === 0 && !item.href && (
                <span className="mr-1 inline-flex items-center text-[var(--muted-foreground)]">
                  <ArrowLeft size={14} className="mr-1.5" />
                  <span className="font-light">{item.label}</span>
                </span>
              )}
              
              {index > 0 && (
                <>
                  <span className="mx-2 text-[var(--muted-foreground)] font-light">/</span>
                  {isLast ? (
                    <span className="font-semibold text-[var(--foreground)]">{item.label}</span>
                  ) : item.href ? (
                    <Link to={item.href} className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] font-light transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--foreground)] rounded-sm">
                      {item.label}
                    </Link>
                  ) : (
                    <span className="text-[var(--muted-foreground)] font-light">{item.label}</span>
                  )}
                </>
              )}
            </div>
          );
        })}
      </nav>
      <div className="h-[1px] w-full bg-[var(--border)]" />
    </div>
  );
}
