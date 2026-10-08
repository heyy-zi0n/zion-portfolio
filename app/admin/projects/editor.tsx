import { Form, Link, useActionData, useNavigation, useSubmit } from "react-router";
import { requireAdmin } from "../../services/auth.server";
import { createSupabaseServerClient } from "../../lib/supabase.server";
import type { Route } from "./+types/editor";
import { generateMeta } from "../../lib/meta";
import { ArrowLeft, Plus, X, Upload } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import type { ContentStatus, ProjectDecision, SystemFlowStep } from "../../types/database";

export function meta({ params }: Route.MetaArgs) {
  return generateMeta(params.id ? "Edit Project" : "New Project", "CMS Project Editor");
}

export async function loader({ request, params }: Route.LoaderArgs) {
  const { supabase } = await requireAdmin(request);
  
  let project = null;
  if (params.id) {
    const { data } = await supabase.from("projects").select("*").eq("id", params.id).single();
    project = data;
  }

  return { project };
}

export async function action({ request, params }: Route.ActionArgs) {
  const { supabase } = await requireAdmin(request);
  const formData = await request.formData();
  
  const title = formData.get("title")?.toString().trim();
  const full_title = formData.get("full_title")?.toString().trim() || null;
  const slug = formData.get("slug")?.toString().trim().toLowerCase();
  const description = formData.get("description")?.toString().trim();
  const problem = formData.get("problem")?.toString().trim() || null;
  const outcome = formData.get("outcome")?.toString().trim() || null;
  const repository_url = formData.get("repository_url")?.toString().trim() || null;
  const live_url = formData.get("live_url")?.toString().trim() || null;
  const status = formData.get("status") as ContentStatus;
  
  const technologies = JSON.parse(formData.get("technologies")?.toString() || "[]");
  const decisions = JSON.parse(formData.get("decisions")?.toString() || "[]");
  const system_flow = JSON.parse(formData.get("system_flow")?.toString() || "[]");
  
  if (!title || !slug || !description) {
    return { error: "Title, slug, and description are required." };
  }

  // Slug validation
  if (!/^[a-z0-9-]+$/.test(slug)) {
    return { error: "Slug must contain only lowercase letters, numbers, and hyphens." };
  }

  // URL validation
  const validateUrl = (url: string | null) => {
    if (!url) return true;
    try {
      const u = new URL(url);
      return u.protocol === "http:" || u.protocol === "https:";
    } catch {
      return false;
    }
  };

  if (!validateUrl(repository_url) || !validateUrl(live_url)) {
    return { error: "URLs must start with http: or https:" };
  }

  let image_path = formData.get("existing_image_path")?.toString() || null;

  // Handle Image Upload
  const imageFile = formData.get("image") as File | null;
  if (imageFile && imageFile.size > 0) {
    if (imageFile.size > 5 * 1024 * 1024) {
      return { error: "Image exceeds 5MB limit" };
    }
    const ext = imageFile.name.split('.').pop();
    const fileName = `${slug}-${Date.now()}.${ext}`;
    
    const { error: uploadError } = await supabase.storage
      .from("portfolio-media")
      .upload(`projects/${fileName}`, imageFile);

    if (uploadError) {
      return { error: "Failed to upload image." };
    }
    
    image_path = supabase.storage.from("portfolio-media").getPublicUrl(`projects/${fileName}`).data.publicUrl;
  }

  const projectData = {
    title,
    full_title,
    slug,
    description,
    problem,
    outcome,
    repository_url,
    live_url,
    status,
    technologies,
    decisions,
    system_flow,
    image_path,
  };

  if (params.id) {
    // Check if we are publishing for the first time
    const { data: existing } = await supabase.from("projects").select("status, published_at").eq("id", params.id).single();
    const isFirstPublish = status === "published" && existing?.status !== "published" && !existing?.published_at;
    
    const { error } = await supabase
      .from("projects")
      .update({
        ...projectData,
        ...(isFirstPublish ? { published_at: new Date().toISOString() } : {})
      })
      .eq("id", params.id);

    if (error) return { error: error.message };
  } else {
    // Insert new
    // Get max sort_order
    const { data: maxOrder } = await supabase.from("projects").select("sort_order").order("sort_order", { ascending: false }).limit(1).single();
    const nextOrder = maxOrder ? maxOrder.sort_order + 1 : 1;

    const { error } = await supabase.from("projects").insert({
      ...projectData,
      sort_order: nextOrder,
      ...(status === "published" ? { published_at: new Date().toISOString() } : {})
    });

    if (error) return { error: error.message };
  }

  // Use a signal string to tell the client to redirect
  return { success: true, redirectUrl: "/admin/projects" };
}

export default function ProjectEditor({ loaderData, actionData }: Route.ComponentProps) {
  const { project } = loaderData;
  const navigation = useNavigation();
  const submit = useSubmit();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const isSubmitting = navigation.state === "submitting";

  // Form State
  const [technologies, setTechnologies] = useState<string[]>(project?.technologies || []);
  const [newTech, setNewTech] = useState("");

  const [decisions, setDecisions] = useState<ProjectDecision[]>(project?.decisions || []);
  const [systemFlow, setSystemFlow] = useState<SystemFlowStep[]>(project?.system_flow || []);
  const [imageFile, setImageFile] = useState<File | null>(null);

  // Auto-redirect on success
  useEffect(() => {
    if (actionData?.success && actionData.redirectUrl) {
      window.location.href = actionData.redirectUrl;
    }
  }, [actionData]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const addTech = () => {
    const t = newTech.trim();
    if (t && !technologies.includes(t)) {
      setTechnologies([...technologies, t]);
      setNewTech("");
    }
  };

  const addDecision = () => {
    setDecisions([...decisions, { id: Date.now(), title: "", detail: "" }]);
  };

  const updateDecision = (id: number, field: "title" | "detail", value: string) => {
    setDecisions(decisions.map(d => d.id === id ? { ...d, [field]: value } : d));
  };

  const removeDecision = (id: number) => {
    setDecisions(decisions.filter(d => d.id !== id));
  };

  const addFlowStep = () => {
    setSystemFlow([...systemFlow, { id: String(Date.now()), label: "" }]);
  };

  const updateFlowStep = (index: number, label: string) => {
    const newFlow = [...systemFlow];
    newFlow[index].label = label;
    setSystemFlow(newFlow);
  };

  const removeFlowStep = (index: number) => {
    setSystemFlow(systemFlow.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    formData.append("technologies", JSON.stringify(technologies));
    formData.append("decisions", JSON.stringify(decisions));
    formData.append("system_flow", JSON.stringify(systemFlow));
    if (imageFile) {
      formData.append("image", imageFile);
    }
    submit(formData, { method: "post", encType: "multipart/form-data" });
  };

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-500 max-w-4xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link 
            to="/admin/projects" 
            className="p-2 -ml-2 rounded-md hover:bg-[var(--muted)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--foreground)]"
            aria-label="Back to projects"
          >
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-2xl font-medium tracking-tight">
            {project ? "Edit Project" : "New Project"}
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
          
          {/* Main Column */}
          <div className="flex flex-col gap-6 md:col-span-2">
            
            {/* Basics */}
            <section className="flex flex-col gap-4 p-6 rounded-lg border border-[var(--border)] bg-[var(--background)]">
              <h2 className="text-lg font-medium">Basic Info</h2>
              
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium">Title *</label>
                <input 
                  type="text" 
                  name="title" 
                  defaultValue={project?.title} 
                  required
                  className="input-base" 
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium">Full Title</label>
                <textarea 
                  name="full_title" 
                  defaultValue={project?.full_title || ""} 
                  rows={2}
                  className="input-base" 
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium">Slug *</label>
                <input 
                  type="text" 
                  name="slug" 
                  defaultValue={project?.slug} 
                  required
                  pattern="^[a-z0-9-]+$"
                  title="Lowercase letters, numbers, and hyphens only"
                  className="input-base" 
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium">Description *</label>
                <textarea 
                  name="description" 
                  defaultValue={project?.description} 
                  required
                  rows={4}
                  className="input-base" 
                />
              </div>
            </section>

            {/* Content blocks */}
            <section className="flex flex-col gap-4 p-6 rounded-lg border border-[var(--border)] bg-[var(--background)]">
              <h2 className="text-lg font-medium">Case Study Content</h2>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium">Problem</label>
                <textarea 
                  name="problem" 
                  defaultValue={project?.problem || ""} 
                  rows={4}
                  className="input-base" 
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium">Outcome</label>
                <textarea 
                  name="outcome" 
                  defaultValue={project?.outcome || ""} 
                  rows={4}
                  className="input-base" 
                />
              </div>
            </section>

            {/* Decisions */}
            <section className="flex flex-col gap-4 p-6 rounded-lg border border-[var(--border)] bg-[var(--background)]">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium">Engineering Decisions</h2>
              </div>
              
              <div className="flex flex-col gap-6">
                {decisions.map((d, index) => (
                  <div key={d.id} className="flex flex-col gap-3 p-4 border border-[var(--border)] rounded-md relative">
                    <div className="absolute -top-3 -left-3 w-6 h-6 bg-[var(--foreground)] text-[var(--background)] rounded-full flex items-center justify-center text-xs font-medium">
                      {index + 1}
                    </div>
                    <button 
                      type="button" 
                      onClick={() => removeDecision(d.id)}
                      className="absolute top-2 right-2 p-1 text-[var(--muted-foreground)] hover:text-red-500 rounded"
                    >
                      <X size={16} />
                    </button>
                    
                    <div className="flex flex-col gap-1.5 mt-2">
                      <label className="text-sm font-medium">Title</label>
                      <input 
                        type="text" 
                        value={d.title} 
                        onChange={(e) => updateDecision(d.id, "title", e.target.value)} 
                        className="input-base" 
                        required
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-medium">Detail</label>
                      <textarea 
                        value={d.detail} 
                        onChange={(e) => updateDecision(d.id, "detail", e.target.value)} 
                        rows={3}
                        className="input-base" 
                        required
                      />
                    </div>
                  </div>
                ))}
              </div>

              <button 
                type="button" 
                onClick={addDecision}
                className="mt-2 flex items-center gap-2 self-start text-sm font-medium text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
              >
                <Plus size={16} /> Add decision
              </button>
            </section>

            {/* System Flow */}
            <section className="flex flex-col gap-4 p-6 rounded-lg border border-[var(--border)] bg-[var(--background)]">
              <h2 className="text-lg font-medium">System Flow</h2>
              <p className="text-sm text-[var(--muted-foreground)]">Add a linear step-by-step workflow. Requires at least 2 steps to render publicly.</p>
              
              <div className="flex flex-col gap-3">
                {systemFlow.map((step, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-6 text-sm text-[var(--muted-foreground)] font-medium text-center">
                      {index + 1}
                    </div>
                    <input 
                      type="text" 
                      value={step.label}
                      onChange={(e) => updateFlowStep(index, e.target.value)}
                      placeholder="e.g. Lecturer"
                      className="input-base flex-1"
                      required
                    />
                    <button 
                      type="button" 
                      onClick={() => removeFlowStep(index)}
                      className="p-2 text-[var(--muted-foreground)] hover:text-red-500 rounded"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>

              <button 
                type="button" 
                onClick={addFlowStep}
                className="mt-2 flex items-center gap-2 self-start text-sm font-medium text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
              >
                <Plus size={16} /> Add step
              </button>
            </section>
          </div>

          {/* Sidebar Column */}
          <div className="flex flex-col gap-6 md:sticky md:top-6">
            
            {/* Status */}
            <section className="flex flex-col gap-4 p-6 rounded-lg border border-[var(--border)] bg-[var(--background)]">
              <h2 className="text-lg font-medium">Publishing</h2>
              
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium">Status</label>
                <select 
                  name="status" 
                  defaultValue={project?.status || "draft"}
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
                {isSubmitting ? "Saving..." : "Save Project"}
              </button>
            </section>

            {/* Media */}
            <section className="flex flex-col gap-4 p-6 rounded-lg border border-[var(--border)] bg-[var(--background)]">
              <h2 className="text-lg font-medium">Media</h2>
              
              <input type="hidden" name="existing_image_path" value={project?.image_path || ""} />
              
              {project?.image_path && !imageFile && (
                <div className="relative aspect-video rounded-md overflow-hidden bg-[var(--muted)] border border-[var(--border)]">
                  <img src={project.image_path} alt="Current" className="object-cover w-full h-full" />
                </div>
              )}
              
              {imageFile && (
                <div className="text-sm font-medium text-green-500">
                  New file selected: {imageFile.name}
                </div>
              )}

              <input 
                type="file" 
                accept="image/*" 
                className="hidden" 
                ref={fileInputRef}
                onChange={handleFileChange}
              />
              
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center justify-center gap-2 w-full px-4 py-2 border border-[var(--border)] rounded-md text-sm font-medium hover:bg-[var(--muted)] transition-colors"
              >
                <Upload size={16} />
                {project?.image_path || imageFile ? "Replace Image" : "Upload Image"}
              </button>
              <p className="text-xs text-[var(--muted-foreground)] text-center">JPEG, PNG, WebP up to 5MB</p>
            </section>

            {/* Links */}
            <section className="flex flex-col gap-4 p-6 rounded-lg border border-[var(--border)] bg-[var(--background)]">
              <h2 className="text-lg font-medium">Links</h2>
              
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium">Repository URL</label>
                <input 
                  type="url" 
                  name="repository_url" 
                  defaultValue={project?.repository_url || ""} 
                  placeholder="https://github.com/..."
                  className="input-base" 
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium">Live URL</label>
                <input 
                  type="url" 
                  name="live_url" 
                  defaultValue={project?.live_url || ""} 
                  placeholder="https://..."
                  className="input-base" 
                />
              </div>
            </section>

            {/* Technologies */}
            <section className="flex flex-col gap-4 p-6 rounded-lg border border-[var(--border)] bg-[var(--background)]">
              <h2 className="text-lg font-medium">Technologies</h2>
              
              <div className="flex flex-wrap gap-2">
                {technologies.map((tech) => (
                  <span key={tech} className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-[var(--muted)] text-sm font-medium">
                    {tech}
                    <button 
                      type="button" 
                      onClick={() => setTechnologies(technologies.filter(t => t !== tech))}
                      className="text-[var(--muted-foreground)] hover:text-red-500"
                    >
                      <X size={14} />
                    </button>
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-2 mt-2">
                <input 
                  type="text" 
                  value={newTech} 
                  onChange={(e) => setNewTech(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addTech();
                    }
                  }}
                  placeholder="e.g. React"
                  className="input-base flex-1"
                />
                <button 
                  type="button" 
                  onClick={addTech}
                  className="px-3 py-2 border border-[var(--border)] rounded-md text-sm font-medium hover:bg-[var(--muted)]"
                >
                  Add
                </button>
              </div>
            </section>
          </div>
        </div>
      </Form>
    </div>
  );
}
