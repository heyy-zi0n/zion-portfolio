import { Link, Form } from "react-router";
import { requireAdmin } from "../../services/auth.server";
import type { Route } from "./+types/index";
import { generateMeta } from "../../lib/meta";
import { ArrowUp, ArrowDown, Edit2, Trash2 } from "lucide-react";
import { format } from "date-fns";

export function meta() {
  return generateMeta("Career", "Manage Career Entries");
}

export async function loader({ request }: Route.LoaderArgs) {
  const { supabase } = await requireAdmin(request);
  const { data } = await supabase
    .from("experiences")
    .select("id, organization, role, start_date, is_current, status, sort_order")
    .order("sort_order", { ascending: true });

  return { experiences: data || [] };
}

export async function action({ request }: Route.ActionArgs) {
  const { supabase } = await requireAdmin(request);
  const formData = await request.formData();
  const intent = formData.get("intent");
  const experienceId = formData.get("experienceId") as string;

  if (intent === "delete") {
    await supabase.from("experiences").delete().eq("id", experienceId);
  } else if (intent === "move_up" || intent === "move_down") {
    const currentOrder = parseInt(formData.get("currentOrder") as string);
    const { data: experiences } = await supabase
      .from("experiences")
      .select("id, sort_order")
      .order("sort_order", { ascending: true });

    if (experiences) {
      const currentIndex = experiences.findIndex(e => e.id === experienceId);
      const swapIndex = intent === "move_up" ? currentIndex - 1 : currentIndex + 1;

      if (swapIndex >= 0 && swapIndex < experiences.length) {
        const swapExp = experiences[swapIndex];
        
        await Promise.all([
          supabase.from("experiences").update({ sort_order: swapExp.sort_order }).eq("id", experienceId),
          supabase.from("experiences").update({ sort_order: currentOrder }).eq("id", swapExp.id)
        ]);
      }
    }
  }

  return { success: true };
}

export default function ExperienceIndex({ loaderData }: Route.ComponentProps) {
  const { experiences } = loaderData;

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    return format(new Date(dateString), "MMM yyyy");
  };

  return (
    <div className="flex flex-col gap-10 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-medium tracking-tight">Career</h1>
          <p className="text-[var(--muted-foreground)] mt-2">Manage your work history.</p>
        </div>
        <Link
          to="/admin/experience/new"
          className="inline-flex items-center justify-center px-4 py-2 bg-[var(--foreground)] text-[var(--background)] rounded-md text-sm font-medium hover:opacity-90 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--foreground)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]"
        >
          Add role
        </Link>
      </div>

      <div className="flex flex-col border border-[var(--border)] rounded-lg overflow-hidden bg-[var(--background)]">
        {experiences.length === 0 ? (
          <div className="p-8 text-center text-[var(--muted-foreground)]">
            No career entries found. Create one to get started.
          </div>
        ) : (
          experiences.map((exp, index) => (
            <div 
              key={exp.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border-b border-[var(--border)] last:border-0 hover:bg-[var(--muted)]/20 transition-colors gap-4"
            >
              <div className="flex items-center gap-4 min-w-0">
                <div className="text-[var(--muted-foreground)] font-medium text-sm w-6">
                  {String(index + 1).padStart(2, '0')}
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="font-medium truncate">{exp.role} at {exp.organization}</span>
                  <span className="text-xs text-[var(--muted-foreground)] capitalize mt-0.5">
                    {exp.status} · {formatDate(exp.start_date)} {exp.is_current ? "— Present" : ""}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 sm:gap-1 self-start sm:self-auto">
                <Form method="post" className="flex items-center">
                  <input type="hidden" name="experienceId" value={exp.id} />
                  <input type="hidden" name="currentOrder" value={exp.sort_order} />
                  
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
                    disabled={index === experiences.length - 1}
                    className="p-2 text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--muted)] rounded disabled:opacity-30 disabled:hover:bg-transparent"
                    title="Move Down"
                  >
                    <ArrowDown size={16} />
                  </button>
                </Form>
                
                <div className="w-px h-6 bg-[var(--border)] mx-1" />

                <Link 
                  to={`/admin/experience/${exp.id}/edit`}
                  className="p-2 text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--muted)] rounded"
                  title="Edit"
                >
                  <Edit2 size={16} />
                </Link>

                <Form method="post" className="flex items-center" onSubmit={(e) => {
                  if (!confirm("Permanently delete this career entry?")) e.preventDefault();
                }}>
                  <input type="hidden" name="experienceId" value={exp.id} />
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
