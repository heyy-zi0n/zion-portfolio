import { Form, Link, useActionData, useNavigation, useSubmit } from "react-router";
import { requireAdmin } from "../../services/auth.server";
import type { Route } from "./+types/editor";
import { generateMeta } from "../../lib/meta";
import { ArrowLeft, Plus, X } from "lucide-react";
import { useState, useEffect } from "react";
import type { ContentStatus } from "../../types/database";

export function meta({ params }: Route.MetaArgs) {
  return generateMeta(params.id ? "Edit Career" : "New Career", "CMS Career Editor");
}

export async function loader({ request, params }: Route.LoaderArgs) {
  const { supabase } = await requireAdmin(request);
  
  let experience = null;
  if (params.id) {
    const { data } = await supabase.from("experiences").select("*").eq("id", params.id).single();
    experience = data;
  }

  return { experience };
}

export async function action({ request, params }: Route.ActionArgs) {
  const { supabase } = await requireAdmin(request);
  const formData = await request.formData();
  
  const organization = formData.get("organization")?.toString().trim();
  const role = formData.get("role")?.toString().trim();
  const organization_url = formData.get("organization_url")?.toString().trim() || null;
  const start_date = formData.get("start_date")?.toString() || null;
  const end_date = formData.get("end_date")?.toString() || null;
  const is_current = formData.get("is_current") === "on";
  const status = formData.get("status") as ContentStatus;
  
  const highlights = JSON.parse(formData.get("highlights")?.toString() || "[]");
  
  if (!organization || !role) {
    return { error: "Organization and role are required." };
  }

  const validateUrl = (url: string | null) => {
    if (!url) return true;
    try {
      const u = new URL(url);
      return u.protocol === "http:" || u.protocol === "https:";
    } catch {
      return false;
    }
  };

  if (!validateUrl(organization_url)) {
    return { error: "URL must start with http: or https:" };
  }

  const expData = {
    organization,
    role,
    organization_url,
    start_date,
    end_date,
    is_current,
    status,
    highlights,
  };

  if (params.id) {
    const { error } = await supabase
      .from("experiences")
      .update(expData)
      .eq("id", params.id);

    if (error) return { error: error.message };
  } else {
    // Insert new
    const { data: maxOrder } = await supabase.from("experiences").select("sort_order").order("sort_order", { ascending: false }).limit(1).single();
    const nextOrder = maxOrder ? maxOrder.sort_order + 1 : 1;

    const { error } = await supabase.from("experiences").insert({
      ...expData,
      sort_order: nextOrder
    });

    if (error) return { error: error.message };
  }

  return { success: true, redirectUrl: "/admin/experience" };
}

export default function ExperienceEditor({ loaderData, actionData }: Route.ComponentProps) {
  const { experience } = loaderData;
  const navigation = useNavigation();
  const submit = useSubmit();
  
  const isSubmitting = navigation.state === "submitting";

  const [highlights, setHighlights] = useState<string[]>(experience?.highlights || []);
  const [newHighlight, setNewHighlight] = useState("");
  const [isCurrent, setIsCurrent] = useState<boolean>(experience?.is_current || false);

  useEffect(() => {
    if (actionData?.success && actionData.redirectUrl) {
      window.location.href = actionData.redirectUrl;
    }
  }, [actionData]);

  const addHighlight = () => {
    const h = newHighlight.trim();
    if (h) {
      setHighlights([...highlights, h]);
      setNewHighlight("");
    }
  };

  const removeHighlight = (index: number) => {
    setHighlights(highlights.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    formData.append("highlights", JSON.stringify(highlights));
    submit(formData, { method: "post" });
  };

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-500 max-w-4xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link 
            to="/admin/experience" 
            className="p-2 -ml-2 rounded-md hover:bg-[var(--muted)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--foreground)]"
            aria-label="Back to career"
          >
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-2xl font-medium tracking-tight">
            {experience ? "Edit Role" : "New Role"}
          </h1>
        </div>
      </div>

      <Form onSubmit={handleSubmit} className="flex flex-col gap-10">
        {actionData?.error && (
          <div className="bg-red-500/10 text-red-500 text-sm px-4 py-3 rounded-md border border-red-500/20">
            {actionData.error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          
          <div className="flex flex-col gap-6 md:col-span-2">
            
            <section className="flex flex-col gap-4 p-6 rounded-lg border border-[var(--border)] bg-[var(--background)]">
              <h2 className="text-lg font-medium">Basic Info</h2>
              
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium">Role *</label>
                <input 
                  type="text" 
                  name="role" 
                  defaultValue={experience?.role} 
                  required
                  className="input-base" 
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium">Organization / Company *</label>
                <input 
                  type="text" 
                  name="organization" 
                  defaultValue={experience?.organization} 
                  required
                  className="input-base" 
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium">Organization URL</label>
                <input 
                  type="url" 
                  name="organization_url" 
                  defaultValue={experience?.organization_url || ""} 
                  className="input-base" 
                  placeholder="https://..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium">Start Date</label>
                  <input 
                    type="date" 
                    name="start_date" 
                    defaultValue={experience?.start_date ? experience.start_date.split('T')[0] : ""} 
                    className="input-base" 
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium">End Date</label>
                  <input 
                    type="date" 
                    name="end_date" 
                    defaultValue={experience?.end_date ? experience.end_date.split('T')[0] : ""} 
                    disabled={isCurrent}
                    className="input-base disabled:opacity-50" 
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 mt-2">
                <input 
                  type="checkbox" 
                  id="is_current" 
                  name="is_current" 
                  checked={isCurrent}
                  onChange={(e) => setIsCurrent(e.target.checked)}
                  className="rounded border-[var(--border)] text-[var(--foreground)] focus:ring-[var(--foreground)]"
                />
                <label htmlFor="is_current" className="text-sm font-medium">I currently work here</label>
              </div>
            </section>

            <section className="flex flex-col gap-4 p-6 rounded-lg border border-[var(--border)] bg-[var(--background)]">
              <h2 className="text-lg font-medium">Highlights</h2>
              <p className="text-sm text-[var(--muted-foreground)]">Key responsibilities and achievements.</p>
              
              <div className="flex flex-col gap-3">
                {highlights.map((highlight, index) => (
                  <div key={index} className="flex gap-2">
                    <div className="text-[var(--muted-foreground)] text-sm pt-2 w-6">
                      •
                    </div>
                    <div className="flex-1 text-sm bg-[var(--muted)]/50 border border-[var(--border)] rounded-md px-3 py-2 leading-relaxed">
                      {highlight}
                    </div>
                    <button 
                      type="button" 
                      onClick={() => removeHighlight(index)}
                      className="p-2 h-fit text-[var(--muted-foreground)] hover:text-red-500 rounded"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex flex-col gap-2 mt-2">
                <textarea 
                  value={newHighlight} 
                  onChange={(e) => setNewHighlight(e.target.value)}
                  placeholder="e.g. Led the development of..."
                  className="input-base"
                  rows={2}
                />
                <button 
                  type="button" 
                  onClick={addHighlight}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-[var(--muted)] text-[var(--foreground)] rounded-md text-sm font-medium hover:bg-[var(--muted)]/80 transition-colors"
                >
                  <Plus size={16} /> Add Highlight
                </button>
              </div>
            </section>
          </div>

          <div className="flex flex-col gap-6 md:sticky md:top-6">
            
            <section className="flex flex-col gap-4 p-6 rounded-lg border border-[var(--border)] bg-[var(--background)]">
              <h2 className="text-lg font-medium">Publishing</h2>
              
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium">Status</label>
                <select 
                  name="status" 
                  defaultValue={experience?.status || "draft"}
                  className="input-base"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[var(--foreground)] text-[var(--background)] rounded-md py-2.5 text-sm font-medium hover:opacity-90 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--foreground)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)] disabled:opacity-50 mt-2"
              >
                {isSubmitting ? "Saving..." : "Save Role"}
              </button>
            </section>
          </div>
        </div>
      </Form>
    </div>
  );
}
