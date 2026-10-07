import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { Search } from "lucide-react";
import { PROJECTS, SOCIAL_LINKS } from "../data/portfolio";
import { cn } from "../lib/utils";
import { useTheme } from "./ThemeProvider";

type CommandItem = {
  id: string;
  label: string;
  group: string;
  onSelect: () => void;
};

export function CommandMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { toggleTheme } = useTheme();

  const handleClose = () => {
    setIsOpen(false);
    setQuery("");
  };

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    
    if (isOpen) {
      dialog.showModal();
      document.body.style.overflow = "hidden";
    } else {
      dialog.close();
      document.body.style.overflow = "";
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
    };
    
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const items: CommandItem[] = [
    { id: "home", label: "home", group: "PAGES", onSelect: () => navigate("/") },
    { id: "about", label: "about", group: "PAGES", onSelect: () => navigate("/about") },
    { id: "career", label: "career", group: "PAGES", onSelect: () => navigate("/experience") },
    { id: "projects", label: "projects", group: "PAGES", onSelect: () => navigate("/projects") },
    { id: "connect", label: "connect", group: "PAGES", onSelect: () => navigate("/contact") },
    
    ...PROJECTS.map((p) => ({
      id: `project-${p.slug}`,
      label: p.title,
      group: "CASE STUDIES",
      onSelect: () => navigate(`/projects/${p.slug}`)
    })),
    
    ...SOCIAL_LINKS.map((s) => ({
      id: `social-${s.name}`,
      label: s.name,
      group: "ELSEWHERE",
      onSelect: () => {
        if (s.target === "_blank") window.open(s.url, "_blank");
        else window.location.href = s.url;
      }
    })),
    
    {
      id: "theme",
      label: "switch theme",
      group: "ACTIONS",
      onSelect: () => {
        toggleTheme();
      }
    }
  ];

  const filteredItems = query
    ? items.filter((item) => item.label.toLowerCase().includes(query.toLowerCase()))
    : items;

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => (prev + 1) % filteredItems.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => (prev - 1 + filteredItems.length) % filteredItems.length);
    } else if (e.key === "Enter" && filteredItems[activeIndex]) {
      e.preventDefault();
      filteredItems[activeIndex].onSelect();
      handleClose();
    }
  };

  const groups = Array.from(new Set(filteredItems.map(item => item.group)));

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="hidden md:flex items-center text-[11px] font-medium text-[var(--foreground)] opacity-70 hover:opacity-100 transition-colors px-1.5 py-0.5 rounded border border-[var(--border)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--foreground)] tracking-widest uppercase bg-[var(--background)]"
        aria-label="Open command menu"
      >
        <span>{navigator.userAgent.includes("Mac") ? "⌘K" : "CTRL K"}</span>
      </button>
      
      <button
        onClick={() => setIsOpen(true)}
        className="md:hidden w-8 h-8 grid place-items-center bg-transparent border-0 text-[var(--foreground)] transition-opacity focus-visible:outline-none"
        aria-label="Open command menu"
      >
        <Search size={16} strokeWidth={1.7} />
      </button>

      <dialog
        ref={dialogRef}
        className="w-full max-w-[28rem] rounded-xl border border-[var(--border)] bg-[var(--background)]/80 backdrop-blur-md backdrop-saturate-150 p-0 shadow-lg text-[var(--foreground)] backdrop:bg-black/20 backdrop:backdrop-blur-sm m-auto top-[10%] bottom-auto open:animate-in open:fade-in-90 open:zoom-in-95"
        onClick={(e) => {
          if (e.target === dialogRef.current) handleClose();
        }}
        onClose={handleClose}
      >
        <div className="flex flex-col w-full h-full max-h-[60vh] overflow-hidden rounded-xl">
          <div className="flex items-center px-4 py-3 border-b border-[var(--border)]">
            <Search size={16} className="text-[var(--muted-foreground)] mr-3 shrink-0" />
            <input
              ref={inputRef}
              autoFocus
              className="flex-1 bg-transparent border-none outline-none text-sm placeholder-[var(--muted-foreground)]"
              placeholder="search pages and actions…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>
          
          <div className="overflow-y-auto p-2">
            {filteredItems.length === 0 ? (
              <div className="py-6 text-center text-sm text-[var(--muted-foreground)]">
                No results found.
              </div>
            ) : (
              groups.map((group) => (
                <div key={group} className="mb-4 last:mb-0">
                  <div className="px-2 py-1.5 text-xs font-medium text-[var(--muted-foreground)] mb-1 tracking-wider">
                    {group}
                  </div>
                  {filteredItems
                    .map((item, originalIndex) => ({ item, originalIndex }))
                    .filter(({ item }) => item.group === group)
                    .map(({ item, originalIndex }) => (
                      <button
                        key={item.id}
                        onMouseEnter={() => setActiveIndex(originalIndex)}
                        onClick={() => {
                          item.onSelect();
                          handleClose();
                        }}
                        ref={(el) => {
                          if (activeIndex === originalIndex && el) {
                            el.scrollIntoView({ block: "nearest" });
                          }
                        }}
                        className={cn(
                          "w-full text-left px-2 py-2 text-sm rounded-md transition-colors flex items-center",
                          activeIndex === originalIndex
                            ? "bg-[var(--muted)] text-[var(--foreground)]"
                            : "text-[var(--muted-foreground)] hover:bg-[var(--muted)]/50 hover:text-[var(--foreground)]"
                        )}
                      >
                        {item.label}
                      </button>
                    ))}
                </div>
              ))
            )}
          </div>
        </div>
      </dialog>
    </>
  );
}
