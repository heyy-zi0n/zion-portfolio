import { Link, NavLink, Outlet } from "react-router";
import { ThemeToggle } from "../components/ThemeToggle";
import { CommandMenu } from "../components/CommandMenu";
import { MobileNav } from "../components/MobileNav";
import { cn } from "../lib/utils";

export default function PortfolioLayout() {
  return (
    <div className="min-h-screen flex flex-col items-center">
      <header className="sticky top-0 z-30 w-full flex justify-center bg-[var(--background)]/80 backdrop-blur-sm before:content-[''] before:absolute before:inset-0 before:-z-10 before:bg-gradient-to-b before:from-[var(--background)] before:to-transparent">
        <div className="w-full px-4 md:px-6 py-4 flex items-center justify-between max-w-[1200px]">
          <Link to="/" className="text-sm font-medium tracking-tight hover:opacity-80 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--foreground)] rounded-sm">
            heyy.zi0n
          </Link>

          <div className="flex items-center gap-4 md:gap-6">
            <nav className="hidden md:flex items-center gap-6">
              {['about', 'career', 'projects', 'connect'].map((item) => {
                const path = `/${item === 'career' ? 'experience' : item === 'connect' ? 'contact' : item}`;
                return (
                  <NavLink
                    key={item}
                    to={path}
                    className={({ isActive }) => cn(
                      "text-sm font-light transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--foreground)] rounded-sm",
                      isActive ? "text-[var(--foreground)] font-medium" : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                    )}
                  >
                    {item}
                  </NavLink>
                );
              })}
            </nav>

            <div className="flex items-center gap-2">
              <CommandMenu />
              <ThemeToggle />
              <MobileNav />
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full max-w-full px-4 md:px-6 py-12 md:py-24 flex justify-center">
        <div className="w-full max-w-[20rem] sm:max-w-[24rem] md:max-w-[31.25rem]">
          <Outlet />
        </div>
      </main>

      <footer className="w-full flex justify-center py-8 relative">
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-[var(--background)] to-transparent pointer-events-none" />
        <p className="text-xs text-[var(--muted-foreground)]">
          © {new Date().getFullYear()} — <Link to="/contact" className="hover:text-[var(--foreground)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--foreground)] rounded-sm">heyy.zi0n</Link>
        </p>
      </footer>
    </div>
  );
}
