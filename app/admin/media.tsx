import { Form, useActionData, useNavigation, useSubmit } from "react-router";
import { requireAdmin } from "../services/auth.server";
import type { Route } from "./+types/media";
import { generateMeta } from "../lib/meta";
import { Trash2, Upload, File as FileIcon, ExternalLink } from "lucide-react";
import { useRef, useState } from "react";
import { format } from "date-fns";

export function meta() {
  return generateMeta("Media", "CMS Media Library");
}

export async function loader({ request }: Route.LoaderArgs) {
  const { supabase } = await requireAdmin(request);
  
  const { data, error } = await supabase.storage.from("portfolio-media").list("", {
    limit: 100,
    sortBy: { column: 'created_at', order: 'desc' }
  });

  // Supabase lists directories as files with empty metadata sometimes, filter them.
  const files = data ? data.filter(f => f.id) : [];

  return { files, error: error?.message };
}

export async function action({ request }: Route.ActionArgs) {
  const { supabase } = await requireAdmin(request);
  const formData = await request.formData();
  const intent = formData.get("intent");

  if (intent === "delete") {
    const path = formData.get("path") as string;
    await supabase.storage.from("portfolio-media").remove([path]);
  } else if (intent === "upload") {
    const file = formData.get("file") as File | null;
    if (file && file.size > 0) {
      const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
      await supabase.storage.from("portfolio-media").upload(fileName, file);
    }
  }

  return { success: true };
}

export default function MediaLibrary({ loaderData }: Route.ComponentProps) {
  const { files, error } = loaderData;
  const navigation = useNavigation();
  const submit = useSubmit();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const isUploading = navigation.formData?.get("intent") === "upload";

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const formData = new FormData();
      formData.append("intent", "upload");
      formData.append("file", e.target.files[0]);
      submit(formData, { method: "post", encType: "multipart/form-data" });
    }
  };

  const getPublicUrl = (path: string) => {
    // Determine the environment's Supabase URL
    // Since we are client side, we can't easily get process.env.
    // Instead we can just construct a relative URL if we want, or proxy it.
    // Actually, we can't reliably get the public URL purely client-side without the URL base.
    // Let's just use the filename for display.
    return path;
  };

  return (
    <div className="flex flex-col gap-10 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-medium tracking-tight">Media Library</h1>
          <p className="text-[var(--muted-foreground)] mt-2">Manage files and images.</p>
        </div>
        
        <input 
          type="file" 
          className="hidden" 
          ref={fileInputRef}
          onChange={handleUpload}
        />
        
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-[var(--foreground)] text-[var(--background)] rounded-md text-sm font-medium hover:opacity-90 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--foreground)] disabled:opacity-50"
        >
          <Upload size={16} />
          {isUploading ? "Uploading..." : "Upload File"}
        </button>
      </div>

      {error && (
        <div className="bg-red-500/10 text-red-500 text-sm px-4 py-3 rounded-md border border-red-500/20">
          Error loading media: {error}
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {files.length === 0 ? (
          <div className="col-span-full p-8 text-center border border-[var(--border)] rounded-lg text-[var(--muted-foreground)]">
            No media files found.
          </div>
        ) : (
          files.map((file) => (
            <div key={file.id} className="group flex flex-col border border-[var(--border)] rounded-md overflow-hidden bg-[var(--background)]">
              <div className="aspect-square bg-[var(--muted)]/50 relative flex items-center justify-center">
                {file.metadata?.mimetype?.startsWith("image/") ? (
                  <span className="text-[var(--muted-foreground)] text-xs font-medium">Image</span>
                  // In a real app we'd fetch the public URL and render the image
                ) : (
                  <FileIcon size={32} className="text-[var(--muted-foreground)]" />
                )}
                
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                  <Form method="post" onSubmit={(e) => {
                    if (!confirm("Delete this file permanently?")) e.preventDefault();
                  }}>
                    <input type="hidden" name="path" value={file.name} />
                    <button 
                      type="submit" 
                      name="intent" 
                      value="delete"
                      className="p-2 text-white/70 hover:text-red-500 rounded-full hover:bg-white/10"
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </Form>
                </div>
              </div>
              <div className="p-3 border-t border-[var(--border)] flex flex-col gap-1">
                <span className="text-xs font-medium truncate" title={file.name}>
                  {file.name}
                </span>
                <span className="text-[10px] text-[var(--muted-foreground)]">
                  {file.created_at ? format(new Date(file.created_at), "MMM d, yyyy") : "Unknown date"}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
