import { Link } from "react-router";
import { createSupabaseServerClient } from "../lib/supabase.server";
import type { Route } from "./+types/dashboard";
import { generateMeta } from "../lib/meta";
import { requireAdmin } from "../services/auth.server";
import { formatDistanceToNow } from "date-fns";

export function meta() {
  return generateMeta("Admin Overview", "CMS Dashboard");
}

export async function loader({ request }: Route.LoaderArgs) {
  const { supabase } = await requireAdmin(request);
  if (!supabase) throw new Error("Supabase is missing");

  // Fetch counts
  const [
    { count: publishedProjectsCount },
    { count: draftProjectsCount },
    { count: archivedProjectsCount },
    { count: careerEntriesCount },
    { data: recentChanges }
  ] = await Promise.all([
    supabase.from("projects").select("*", { count: "exact", head: true }).eq("status", "published"),
    supabase.from("projects").select("*", { count: "exact", head: true }).eq("status", "draft"),
    supabase.from("projects").select("*", { count: "exact", head: true }).eq("status", "archived"),
    supabase.from("experiences").select("*", { count: "exact", head: true }),
    supabase.from("projects")
      .select("id, title, updated_at")
      .order("updated_at", { ascending: false })
      .limit(5)
  ]);

  // Combine with recent career changes as well, or just keep it simple with projects for now.
  
  return {
    stats: {
      publishedProjects: publishedProjectsCount || 0,
      draftProjects: draftProjectsCount || 0,
      archivedProjects: archivedProjectsCount || 0,
      careerEntries: careerEntriesCount || 0,
    },
    recentChanges: recentChanges || []
  };
}

export default function AdminDashboard({ loaderData }: Route.ComponentProps) {
  const { stats, recentChanges } = loaderData;

  const statCards = [
    { label: "Published Projects", value: stats.publishedProjects },
    { label: "Career Entries", value: stats.careerEntries },
    { label: "Draft Projects", value: stats.draftProjects },
    { label: "Archived Projects", value: stats.archivedProjects },
  ];

  return (
    <div className="flex flex-col gap-10 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl md:text-3xl font-medium tracking-tight">Good morning, Zion.</h1>
        <p className="text-[var(--muted-foreground)] mt-2">Here is what's happening with your portfolio today.</p>
      </div>

      <section>
        <h2 className="text-sm font-medium tracking-wider uppercase text-[var(--muted-foreground)] mb-4">Content</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {statCards.map((stat, i) => (
            <div key={i} className="flex flex-col gap-1 p-4 rounded-lg border border-[var(--border)] bg-[var(--muted)]/20">
              <span className="text-3xl font-medium">{stat.value}</span>
              <span className="text-sm text-[var(--muted-foreground)]">{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-sm font-medium tracking-wider uppercase text-[var(--muted-foreground)] mb-4">Recent Changes</h2>
        {recentChanges.length === 0 ? (
          <p className="text-sm text-[var(--muted-foreground)]">No recent changes.</p>
        ) : (
          <div className="flex flex-col border-t border-[var(--border)]">
            {recentChanges.map((change) => (
              <div key={change.id} className="flex flex-col sm:flex-row sm:items-center justify-between py-4 border-b border-[var(--border)] gap-2">
                <span className="font-medium">{change.title}</span>
                <span className="text-sm text-[var(--muted-foreground)]">
                  Updated {formatDistanceToNow(new Date(change.updated_at), { addSuffix: true })}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
