import { Form, Link, NavLink, Outlet, useNavigation, redirect } from "react-router";
import { requireAdmin } from "../services/auth.server";
import { createSupabaseServerClient } from "../lib/supabase.server";
import type { Route } from "./+types/layout";
import { generateMeta } from "../lib/meta";
import { LogOut, LayoutDashboard, FolderKanban, BriefcaseBusiness, Image as ImageIcon, Settings, ExternalLink, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "../lib/utils";

export function meta() {
  return [
    ...generateMeta("CMS Admin", "Manage portfolio content"),
    { name: "robots", content: "noindex,nofollow" }
  ];
}

export async function loader({ request }: Route.LoaderArgs) {
  await requireAdmin(request);
  return null;
}

export async function action({ request }: Route.ActionArgs) {
  const { supabase, headers } = createSupabaseServerClient(request);
  if (supabase) {
    await supabase.auth.signOut();
  }
  return redirect("/admin/login", { headers });
}

export default function AdminLayout() {
  const navigation = useNavigation();
  const isLoading = navigation.state !== "idle";
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile menu on navigate
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [navigation.location?.pathname]);

  const navItems = [
    { label: "Overview", href: "/admin", icon: LayoutDashboard },
    { label: "Projects", href: "/admin/projects", icon: FolderKanban },
    { label: "Career", href: "/admin/experience", icon: BriefcaseBusiness },
    { label: "Media", href: "/admin/media", icon: ImageIcon },
    { label: "Settings", href: "/admin/settings", icon: Settings },
  ];

  return (
    <div className="min-h-[100dvh] bg-[var(--background)] flex flex-col md:flex-row text-[var(--foreground)] selection:bg-[var(--foreground)] selection:text-[var(--background)]">
      
      {/* Mobile Header */}
      <header className="md:hidden flex items-center justify-between p-4 border-b border-[var(--border)] sticky top-0 bg-[var(--background)]/80 backdrop-blur-md z-50">
        <div className="font-medium tracking-tight">heyy.zion / admin</div>
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-1 -mr-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--foreground)] rounded"
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </header>

      {/* Sidebar Navigation */}
      <aside className={cn(
        "md:w-64 md:border-r md:border-[var(--border)] flex flex-col fixed md:sticky top-0 h-[100dvh] bg-[var(--background)] z-40 transition-transform duration-300 ease-in-out md:translate-x-0",
        mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-6 hidden md:block">
          <div className="font-medium tracking-tight text-lg">heyy.zion / admin</div>
        </div>
        
        <nav className="flex-1 px-4 py-6 md:py-0 flex flex-col gap-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              end={item.href === "/admin"}
              className={({ isActive }) => cn(
                "flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--foreground)]",
                isActive 
                  ? "bg-[var(--foreground)] text-[var(--background)]" 
                  : "text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
              )}
            >
              <item.icon size={16} strokeWidth={2} />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-[var(--border)] flex flex-col gap-2">
          <a 
            href="/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center justify-between px-3 py-2 rounded-md transition-colors text-sm font-medium text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--foreground)]"
          >
            <span className="flex items-center gap-3">
              <ExternalLink size={16} />
              View portfolio
            </span>
          </a>
          <Form method="post" className="w-full">
            <button 
              type="submit"
              className="w-full flex items-center justify-between px-3 py-2 rounded-md transition-colors text-sm font-medium text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-red-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
            >
              <span className="flex items-center gap-3">
                <LogOut size={16} />
                Sign out
              </span>
            </button>
          </Form>
        </div>
      </aside>

      {/* Main Content */}
      <main className={cn(
        "flex-1 flex flex-col transition-opacity duration-200",
        isLoading ? "opacity-50 pointer-events-none" : "opacity-100"
      )}>
        <div className="w-full max-w-5xl mx-auto p-4 md:p-8 lg:p-12">
          <Outlet />
        </div>
      </main>
      
      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 md:hidden animate-in fade-in"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </div>
  );
}
