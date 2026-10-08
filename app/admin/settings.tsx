import { Form, useNavigation, useSubmit } from "react-router";
import { requireAdmin } from "../services/auth.server";
import { createSupabaseServerClient } from "../lib/supabase.server";
import type { Route } from "./+types/settings";
import { generateMeta } from "../lib/meta";
import { FileUp, FileText } from "lucide-react";
import { useRef, useState } from "react";

export function meta() {
  return generateMeta("Settings", "CMS Settings");
}

export async function loader({ request }: Route.LoaderArgs) {
  const { supabase } = await requireAdmin(request);
  const { data } = await supabase.from("site_settings").select("*").single();
  return { settings: data };
}

export async function action({ request }: Route.ActionArgs) {
  const { supabase } = await requireAdmin(request);
  const formData = await request.formData();
  
  const cvFile = formData.get("cv") as File | null;
  if (!cvFile || cvFile.size === 0) {
    return { error: "No file provided" };
  }

  if (cvFile.type !== "application/pdf") {
    return { error: "Only PDF files are allowed" };
  }

  if (cvFile.size > 10 * 1024 * 1024) {
    return { error: "File exceeds 10MB limit" };
  }

  // Upload to storage
  const fileName = `cv-${Date.now()}.pdf`;
  const { error: uploadError } = await supabase.storage
    .from("portfolio-media")
    .upload(`cv/${fileName}`, cvFile);

  if (uploadError) {
    return { error: "Failed to upload file to storage" };
  }

  // Update site_settings
  const { data: currentSettings } = await supabase.from("site_settings").select("*").single();
  
  const publicUrl = supabase.storage.from("portfolio-media").getPublicUrl(`cv/${fileName}`).data.publicUrl;

  let updateError;
  if (currentSettings) {
    const { error } = await supabase.from("site_settings").update({ cv_path: publicUrl }).eq("id", currentSettings.id);
    updateError = error;
  } else {
    const { error } = await supabase.from("site_settings").insert({ cv_path: publicUrl });
    updateError = error;
  }

  if (updateError) {
    return { error: "Failed to save settings to database" };
  }

  return { success: true };
}

export default function Settings({ loaderData, actionData }: Route.ComponentProps) {
  const { settings } = loaderData;
  const navigation = useNavigation();
  const submit = useSubmit();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const isSubmitting = navigation.state === "submitting";

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedFile) {
      const formData = new FormData();
      formData.append("cv", selectedFile);
      submit(formData, { method: "post", encType: "multipart/form-data" });
    }
  };

  return (
    <div className="flex flex-col gap-10 animate-in fade-in duration-500 max-w-2xl">
      <div>
        <h1 className="text-2xl font-medium tracking-tight">Settings</h1>
        <p className="text-[var(--muted-foreground)] mt-2">Manage global portfolio settings and documents.</p>
      </div>

      <section className="flex flex-col gap-6 p-6 rounded-lg border border-[var(--border)] bg-[var(--muted)]/20">
        <div>
          <h2 className="text-lg font-medium">Resume / CV</h2>
          <p className="text-sm text-[var(--muted-foreground)] mt-1">
            Upload your current curriculum vitae. It must be a PDF file under 10MB.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-4 p-4 border border-[var(--border)] rounded-md bg-[var(--background)]">
            <FileText size={24} className="text-[var(--muted-foreground)] shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">
                {settings?.cv_path ? "Current CV Uploaded" : "No CV Uploaded"}
              </p>
              <p className="text-xs text-[var(--muted-foreground)] truncate mt-0.5">
                {settings?.cv_path ? new URL(settings.cv_path).pathname.split('/').pop() : "Upload a PDF to make it available for download."}
              </p>
            </div>
            {settings?.cv_path && (
              <a 
                href={settings.cv_path} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-xs font-medium px-3 py-1.5 rounded bg-[var(--muted)] hover:bg-[var(--foreground)] hover:text-[var(--background)] transition-colors"
              >
                View
              </a>
            )}
          </div>

          <Form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <input 
              type="file" 
              name="cv" 
              accept="application/pdf" 
              className="hidden" 
              ref={fileInputRef}
              onChange={handleFileChange}
            />
            
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleUploadClick}
                className="flex items-center gap-2 px-4 py-2 border border-[var(--border)] rounded-md text-sm font-medium hover:bg-[var(--muted)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--foreground)]"
              >
                <FileUp size={16} />
                {selectedFile ? "Change File" : "Select PDF"}
              </button>
              
              {selectedFile && (
                <span className="text-sm text-[var(--muted-foreground)] truncate max-w-[200px]">
                  {selectedFile.name}
                </span>
              )}
            </div>

            {selectedFile && (
              <button
                type="submit"
                disabled={isSubmitting}
                className="self-start mt-2 px-6 py-2 bg-[var(--foreground)] text-[var(--background)] rounded-md text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {isSubmitting ? "Uploading..." : "Upload CV"}
              </button>
            )}

            {actionData?.error && (
              <p className="text-red-500 text-sm mt-2">{actionData.error}</p>
            )}
            {actionData?.success && (
              <p className="text-green-500 text-sm mt-2">CV successfully updated!</p>
            )}
          </Form>
        </div>
      </section>
    </div>
  );
}
