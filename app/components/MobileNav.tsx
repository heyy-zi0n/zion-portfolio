import { useEffect, useState, useRef } from "react";
import { Link, useLocation } from "react-router";
import { cn } from "../lib/utils";

const NAV_ITEMS = [
  { label: "about", href: "/about" },
  { label: "career", href: "/experience" },
  { label: "projects", href: "/projects" },
  { label: "connect", href: "/contact" },
];

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    
    const handleResize = () => {
      if (window.innerWidth >= 768) setIsOpen(false);
    };

    if (isOpen) {
      window.addEventListener("keydown", handleEscape);
      window.addEventListener("resize", handleResize);
    }
    
    return () => {
      window.removeEventListener("keydown", handleEscape);
      window.removeEventListener("resize", handleResize);
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <div className="md:hidden flex items-center">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="z-50 relative text-[13px] lowercase text-[var(--foreground)] opacity-70 hover:opacity-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--foreground)] rounded-sm p-1"
        aria-expanded={isOpen}
        aria-controls="mobile-menu"
        aria-label="Toggle menu"
      >
        <span className="relative inline-block w-[36px] h-[20px] overflow-hidden">
          <span className={cn("absolute inset-0 flex items-center justify-center transition-transform duration-300", isOpen ? "-translate-y-full" : "translate-y-0")}>menu</span>
          <span className={cn("absolute inset-0 flex items-center justify-center transition-transform duration-300", isOpen ? "translate-y-0" : "translate-y-full")}>close</span>
        </span>
      </button>

      <div
        id="mobile-menu"
        className={cn(
          "fixed inset-0 z-40 bg-[var(--background)]/50 backdrop-blur-md backdrop-saturate-150 flex flex-col justify-center px-8 clip-circle",
          isOpen ? "open" : "pointer-events-none"
        )}
      >
        <nav aria-label="Mobile Navigation" className="flex flex-col w-full max-w-sm mx-auto mt-12">
          {NAV_ITEMS.map((item, i) => {
            const isActive = location.pathname === item.href || (item.href === '/projects' && location.pathname.startsWith('/projects'));
            
            return (
              <div 
                key={item.href}
                className="border-b border-[var(--border)] overflow-hidden"
                style={{
                  transitionDelay: isOpen ? `${100 + i * 60}ms` : "0ms",
                  opacity: isOpen ? 1 : 0,
                  transform: isOpen ? "translateY(0)" : "translateY(20px)",
                  transition: "opacity 400ms ease-out, transform 400ms ease-out"
                }}
              >
                <Link
                  to={item.href}
                  className="flex items-center justify-between py-6 text-4xl font-light hover:text-[var(--muted-foreground)] transition-colors focus-visible:outline-none focus-visible:bg-[var(--muted)]/50 rounded-sm"
                  onClick={() => setIsOpen(false)}
                >
                  <span className="text-[var(--muted-foreground)] text-sm self-start mt-2 mr-6 font-medium">
                    0{i + 1}
                  </span>
                  <span className={cn("flex-1", isActive ? "font-normal text-[var(--foreground)]" : "text-[var(--foreground)]")}>
                    {item.label}
                  </span>
                  {isActive && <span className="w-2 h-2 rounded-full bg-[var(--foreground)]" />}
                </Link>
              </div>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
