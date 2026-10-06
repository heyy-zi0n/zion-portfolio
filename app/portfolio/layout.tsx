import { Link, NavLink, Outlet } from "react-router";
import { ThemeToggle } from "../components/ThemeToggle";
import { CommandMenu } from "../components/CommandMenu";
import { MobileNav } from "../components/MobileNav";
import { cn } from "../lib/utils";

export default function PortfolioLayout() {
  return (
    <div className="min-h-screen flex flex-col items-center">
      <header className="fixed top-0 left-0 right-0 z-50 w-full bg-[var(--background)]/80 backdrop-blur-md">
        <div className="flex w-full items-center justify-between px-3 py-2">
          <Link to="/" className="text-sm font-medium tracking-tight hover:opacity-80 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--foreground)] rounded-sm">
            heyy.zi0n
          </Link>

          <div className="flex items-center gap-4 md:gap-6">
            <nav className="hidden md:flex items-center gap-3">
              {['about', 'career', 'projects', 'connect'].map((item) => {
                const path = `/${item === 'career' ? 'experience' : item === 'connect' ? 'contact' : item}`;
                return (
                  <NavLink
                    key={item}
                    to={path}
                    className={({ isActive }) => cn(
                      "text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--foreground)] rounded-sm",
                      isActive ? "text-[var(--foreground)] font-medium" : "text-[var(--foreground)] opacity-70 hover:opacity-100"
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

      <main className="flex-1 w-full px-4 md:px-6 flex flex-col items-center pt-20 pb-20">
        <div className="w-full max-w-[20rem] sm:max-w-[24rem] md:max-w-[31.25rem] my-auto">
          <Outlet />
        </div>
      </main>

      <footer className="fixed bottom-0 left-0 right-0 z-40 w-full flex justify-center py-2 px-3 pointer-events-none">
        <div className="absolute bottom-0 left-0 right-0 h-24 -z-10 bg-gradient-to-t from-[var(--background)] to-transparent pointer-events-none" />
        <p className="text-xs text-[var(--foreground)] opacity-70 pointer-events-auto">
          © {new Date().getFullYear()} — <Link to="/contact" className="hover:opacity-100 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--foreground)] rounded-sm">heyy.zi0n</Link>
        </p>
      </footer>
    </div>
  );
}
