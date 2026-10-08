import { Link, NavLink, Outlet, useLocation } from "react-router";
import { ThemeToggle } from "../components/ThemeToggle";
import { CommandMenu } from "../components/CommandMenu";
import { MobileNav } from "../components/MobileNav";
import { cn } from "../lib/utils";
import { getPublishedProjects, getSiteSettings } from "../services/portfolio.server";
import type { Route } from "./+types/layout";

export async function loader({ request }: Route.LoaderArgs) {
  const [projects, settings] = await Promise.all([
    getPublishedProjects(request),
    getSiteSettings(request)
  ]);
  return { projects, cvPath: settings?.cvPath };
}

export default function PortfolioLayout({ loaderData }: Route.ComponentProps) {
  const location = useLocation();
  const isHome = location.pathname === "/";

  return (
    <div className={cn(
      "flex flex-col items-center w-full",
      isHome ? "h-[100dvh] min-h-[100dvh] overflow-hidden" : "min-h-[100dvh]"
    )}>
      <header className="fixed top-0 left-0 right-0 z-50 w-full bg-[var(--background)]/80 backdrop-blur-md">
        <div className="flex w-full items-center justify-between px-3 h-[44px] md:h-auto md:py-2">
          <Link to="/" reloadDocument className="text-sm font-normal md:nav-link md:font-medium tracking-tight text-[var(--foreground)] focus-visible:outline-none relative z-50">
            heyy.zion
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
                      "nav-link text-sm focus-visible:outline-none",
                      isActive ? "text-[var(--foreground)] font-medium" : "text-[var(--foreground)] opacity-70 hover:opacity-100"
                    )}
                  >
                    {item}
                  </NavLink>
                );
              })}
            </nav>

            <div className="flex items-center gap-6 md:gap-2 has-[#mobile-menu.open]:[&>.cmd-wrapper]:hidden">
              <div className="cmd-wrapper">
                <CommandMenu />
              </div>
              <div className="relative z-50">
                <ThemeToggle />
              </div>
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
          © {new Date().getFullYear()} — <Link to="/contact" className="hover:opacity-100 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--foreground)] rounded-sm">heyy.zion</Link>
        </p>
      </footer>
    </div>
  );
}
