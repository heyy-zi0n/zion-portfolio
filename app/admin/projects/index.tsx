import { Link, Form } from "react-router";
import { requireAdmin } from "../../services/auth.server";
import type { Route } from "./+types/index";
import { generateMeta } from "../../lib/meta";
import { ArrowUp, ArrowDown, Edit2, Eye, Archive, Trash2 } from "lucide-react";

export function meta() {
  return generateMeta("Projects", "Manage Projects");
}

export async function loader({ request }: Route.LoaderArgs) {
  const { supabase } = await requireAdmin(request);
  const { data } = await supabase
    .from("projects")
    .select("id, title, status, sort_order, slug")
    .order("sort_order", { ascending: true });

  return { projects: data || [] };
}

export async function action({ request }: Route.ActionArgs) {
  const { supabase } = await requireAdmin(request);
  const formData = await request.formData();
  const intent = formData.get("intent");
  const projectId = formData.get("projectId") as string;

  if (intent === "delete") {
    await supabase.from("projects").delete().eq("id", projectId);
  } else if (intent === "archive") {
    await supabase.from("projects").update({ status: "archived" }).eq("id", projectId);
  } else if (intent === "move_up" || intent === "move_down") {
    const currentOrder = parseInt(formData.get("currentOrder") as string);
    const { data: projects } = await supabase
      .from("projects")
      .select("id, sort_order")
      .order("sort_order", { ascending: true });

    if (projects) {
      const currentIndex = projects.findIndex(p => p.id === projectId);
      const swapIndex = intent === "move_up" ? currentIndex - 1 : currentIndex + 1;

      if (swapIndex >= 0 && swapIndex < projects.length) {
        const swapProject = projects[swapIndex];
        
        // Swap orders
        await Promise.all([
          supabase.from("projects").update({ sort_order: swapProject.sort_order }).eq("id", projectId),
          supabase.from("projects").update({ sort_order: currentOrder }).eq("id", swapProject.id)
        ]);
      }
    }
  }

  return { success: true };
}

export default function ProjectsIndex({ loaderData }: Route.ComponentProps) {
  const { projects } = loaderData;

  return (
    <div className="flex flex-col gap-10 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-medium tracking-tight">Projects</h1>
          <p className="text-[var(--muted-foreground)] mt-2">Manage your portfolio case studies.</p>
        </div>
        <Link
          to="/admin/projects/new"
          className="inline-flex items-center justify-center px-4 py-2 bg-[var(--foreground)] text-[var(--background)] rounded-md text-sm font-medium hover:opacity-90 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--foreground)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]"
        >
          Add project
        </Link>
      </div>

      <div className="flex flex-col border border-[var(--border)] rounded-lg overflow-hidden bg-[var(--background)]">
        {projects.length === 0 ? (
          <div className="p-8 text-center text-[var(--muted-foreground)]">
            No projects found. Create one to get started.
          </div>
        ) : (
          projects.map((project, index) => (
            <div 
              key={project.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border-b border-[var(--border)] last:border-0 hover:bg-[var(--muted)]/20 transition-colors gap-4"
            >
              <div className="flex items-center gap-4 min-w-0">
                <div className="text-[var(--muted-foreground)] font-medium text-sm w-6">
                  {String(index + 1).padStart(2, '0')}
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="font-medium truncate">{project.title}</span>
                  <span className="text-xs text-[var(--muted-foreground)] capitalize mt-0.5">
                    {project.status}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 sm:gap-1 self-start sm:self-auto">
                <Form method="post" className="flex items-center">
                  <input type="hidden" name="projectId" value={project.id} />
                  <input type="hidden" name="currentOrder" value={project.sort_order} />
                  
                  <button 
                    type="submit" 
                    name="intent" 
                    value="move_up"
                    disabled={index === 0}
                    className="p-2 text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--muted)] rounded disabled:opacity-30 disabled:hover:bg-transparent"
                    title="Move Up"
                  >
                    <ArrowUp size={16} />
                  </button>
                  <button 
                    type="submit" 
                    name="intent" 
                    value="move_down"
                    disabled={index === projects.length - 1}
                    className="p-2 text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--muted)] rounded disabled:opacity-30 disabled:hover:bg-transparent"
                    title="Move Down"
                  >
                    <ArrowDown size={16} />
                  </button>
                </Form>
                
                <div className="w-px h-6 bg-[var(--border)] mx-1" />

                <Link 
                  to={`/admin/projects/${project.id}/edit`}
                  className="p-2 text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--muted)] rounded"
                  title="Edit"
                >
                  <Edit2 size={16} />
                </Link>
                
                {project.status === "draft" && (
                  <Link 
                    to={`/admin/projects/${project.id}/preview`}
                    className="p-2 text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--muted)] rounded"
                    title="Preview Draft"
                  >
                    <Eye size={16} />
                  </Link>
                )}
                
                <Form method="post" className="flex items-center" onSubmit={(e) => {
                  if (!confirm("Archive this project? It will be hidden from the public portfolio.")) e.preventDefault();
                }}>
                  <input type="hidden" name="projectId" value={project.id} />
                  <button 
                    type="submit" 
                    name="intent" 
                    value="archive"
                    disabled={project.status === "archived"}
                    className="p-2 text-[var(--muted-foreground)] hover:text-orange-500 hover:bg-[var(--muted)] rounded disabled:opacity-30"
                    title="Archive"
                  >
                    <Archive size={16} />
                  </button>
                </Form>

                <Form method="post" className="flex items-center" onSubmit={(e) => {
                  if (!confirm("Permanently delete this project? This cannot be undone.")) e.preventDefault();
                }}>
                  <input type="hidden" name="projectId" value={project.id} />
                  <button 
                    type="submit" 
                    name="intent" 
                    value="delete"
                    className="p-2 text-[var(--muted-foreground)] hover:text-red-500 hover:bg-[var(--muted)] rounded"
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </Form>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
