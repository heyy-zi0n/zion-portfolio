import { Form, useNavigation } from "react-router";
import { useEffect, useState } from "react";
import { requireAdmin } from "../services/auth.server";
import { mapDbSocialLinkToDomain } from "../services/portfolio.server";
import type { Route } from "./+types/connect";
import { generateMeta } from "../lib/meta";
import { ArrowUp, ArrowDown, Edit2, Trash2, Eye, EyeOff, Plus } from "lucide-react";
import {
  SOCIAL_PLATFORMS,
  MAX_LABEL_LENGTH,
  MAX_URL_LENGTH,
  getPlatform,
  validateSocialLink,
  type SocialLink,
  type SocialLinkErrors,
} from "../lib/social-links";

export function meta() {
  return generateMeta("Connect", "Manage social and contact links");
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const UNIQUE_VIOLATION = "23505";

type ActionResult =
  | { ok: true; message: string; saved?: boolean }
  | { ok: false; message: string; fieldErrors?: SocialLinkErrors };

export async function loader({ request }: Route.LoaderArgs) {
  const { supabase } = await requireAdmin(request);
  const { data, error } = await supabase
    .from("social_links")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  return {
    links: (data || []).map(mapDbSocialLinkToDomain),
    loadError: error ? error.message : null,
  };
}

export async function action({ request }: Route.ActionArgs): Promise<ActionResult> {
  // Every mutation re-verifies admin status server-side (RLS enforces it again in the database).
  const { supabase } = await requireAdmin(request);
  const formData = await request.formData();
  const intent = String(formData.get("intent") ?? "");
  const id = String(formData.get("id") ?? "");

  if (intent !== "save" && !UUID_RE.test(id)) {
    return { ok: false, message: "Invalid link identifier." };
  }

  if (intent === "save") {
    const result = validateSocialLink({
      platform: String(formData.get("platform") ?? ""),
      label: String(formData.get("label") ?? ""),
      url: String(formData.get("url") ?? ""),
    });
    if (!result.ok) {
      return { ok: false, message: "Please fix the highlighted fields.", fieldErrors: result.errors };
    }

    if (id) {
      if (!UUID_RE.test(id)) return { ok: false, message: "Invalid link identifier." };
      const { data, error } = await supabase.from("social_links").update(result.value).eq("id", id).select("id");
      if (error) return { ok: false, message: dbMessage(error) };
      if (!data?.length) return { ok: false, message: "Link not found or you do not have permission to edit it." };
      return { ok: true, saved: true, message: "Link updated." };
    }

    const { data: last } = await supabase
      .from("social_links")
      .select("sort_order")
      .order("sort_order", { ascending: false })
      .limit(1);
    const sortOrder = (last?.[0]?.sort_order ?? 0) + 1;

    const { error } = await supabase.from("social_links").insert({ ...result.value, sort_order: sortOrder });
    if (error) return { ok: false, message: dbMessage(error) };
    return { ok: true, saved: true, message: "Link added." };
  }

  if (intent === "delete") {
    const { data, error } = await supabase.from("social_links").delete().eq("id", id).select("id");
    if (error) return { ok: false, message: dbMessage(error) };
    if (!data?.length) return { ok: false, message: "Link not found or you do not have permission to delete it." };
    return { ok: true, message: "Link deleted." };
  }

  if (intent === "toggle_visibility") {
    const makeVisible = formData.get("visible") === "true";
    const { data, error } = await supabase.from("social_links").update({ is_visible: makeVisible }).eq("id", id).select("id");
    if (error) return { ok: false, message: dbMessage(error) };
    if (!data?.length) return { ok: false, message: "Link not found or you do not have permission to change it." };
    return { ok: true, message: makeVisible ? "Link is now visible." : "Link is now hidden." };
  }

  if (intent === "move_up" || intent === "move_down") {
    const { data: rows, error } = await supabase
      .from("social_links")
      .select("id, sort_order")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true });
    if (error || !rows) return { ok: false, message: error ? dbMessage(error) : "Could not load links." };

    const from = rows.findIndex((r) => r.id === id);
    const to = intent === "move_up" ? from - 1 : from + 1;
    if (from === -1 || to < 0 || to >= rows.length) return { ok: false, message: "That link cannot be moved further." };

    // Rewrite a contiguous 1..n order so ties or gaps in sort_order can never block a move.
    const reordered = [...rows];
    [reordered[from], reordered[to]] = [reordered[to], reordered[from]];
    const changed = reordered
      .map((row, index) => ({ id: row.id, sort_order: index + 1, previous: row.sort_order }))
      .filter((row) => row.sort_order !== row.previous);

    const results = await Promise.all(
      changed.map((row) => supabase.from("social_links").update({ sort_order: row.sort_order }).eq("id", row.id).select("id"))
    );
    const failed = results.find((r) => r.error || !r.data?.length);
    if (failed) return { ok: false, message: failed.error ? dbMessage(failed.error) : "Could not reorder links." };
    return { ok: true, message: "Order updated." };
  }

  return { ok: false, message: "Unknown action." };
}

function dbMessage(error: { code?: string; message: string }): string {
  if (error.code === UNIQUE_VIOLATION) return "A link with this URL already exists.";
  return `Database error: ${error.message}`;
}

const inputClass =
  "w-full px-3 py-2 bg-[var(--background)] border border-[var(--border)] rounded-md text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--foreground)]";
const iconButtonClass =
  "p-2 text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--muted)] rounded disabled:opacity-30 disabled:hover:bg-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--foreground)]";

export default function ConnectAdmin({ loaderData, actionData }: Route.ComponentProps) {
  const { links, loadError } = loaderData;
  const navigation = useNavigation();
  const isBusy = navigation.state !== "idle";
  const isSubmitting = navigation.state === "submitting";

  // null = closed, "new" = add form, otherwise the link being edited
  const [editing, setEditing] = useState<SocialLink | "new" | null>(null);
  const [clientErrors, setClientErrors] = useState<SocialLinkErrors>({});

  // Close the form after a successful save; keep it open (with values) on failure.
  useEffect(() => {
    if (actionData?.ok && actionData.saved) setEditing(null);
  }, [actionData]);

  const fieldErrors: SocialLinkErrors = {
    ...(actionData && !actionData.ok ? actionData.fieldErrors : {}),
    ...clientErrors,
  };

  const openForm = (target: SocialLink | "new") => {
    setClientErrors({});
    setEditing(target);
  };

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    const fd = new FormData(e.currentTarget);
    const result = validateSocialLink({
      platform: String(fd.get("platform") ?? ""),
      label: String(fd.get("label") ?? ""),
      url: String(fd.get("url") ?? ""),
    });
    if (!result.ok) {
      e.preventDefault();
      setClientErrors(result.errors);
    } else {
      setClientErrors({});
    }
  };

  const editingLink = editing && editing !== "new" ? editing : null;

  return (
    <div className="flex flex-col gap-10 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-medium tracking-tight">Connect</h1>
          <p className="text-[var(--muted-foreground)] mt-2">Manage the social and contact links on your public Connect page.</p>
        </div>
        <button
          type="button"
          onClick={() => openForm("new")}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-[var(--foreground)] text-[var(--background)] rounded-md text-sm font-medium hover:opacity-90 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--foreground)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]"
        >
          <Plus size={16} />
          Add link
        </button>
      </div>

      {actionData && (
        <p
          role={actionData.ok ? "status" : "alert"}
          className={`text-sm ${actionData.ok ? "text-green-500" : "text-red-500"}`}
        >
          {actionData.message}
        </p>
      )}
      {loadError && (
        <p role="alert" className="text-sm text-red-500">
          Could not load links: {loadError}. Make sure migration 0002_social_links.sql has been applied.
        </p>
      )}

      {editing && (
        <Form
          method="post"
          onSubmit={handleSave}
          noValidate
          key={editingLink?.id ?? "new"}
          className="flex flex-col gap-5 p-6 rounded-lg border border-[var(--border)] bg-[var(--muted)]/20"
        >
          <h2 className="text-lg font-medium">{editingLink ? "Edit link" : "Add link"}</h2>
          <input type="hidden" name="intent" value="save" />
          {editingLink && <input type="hidden" name="id" value={editingLink.id} />}

          <div className="flex flex-col gap-1.5">
            <label htmlFor="link-platform" className="text-sm font-medium">Platform</label>
            <select
              id="link-platform"
              name="platform"
              defaultValue={editingLink?.platform ?? "github"}
              aria-invalid={!!fieldErrors.platform}
              className={inputClass}
            >
              {SOCIAL_PLATFORMS.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
            {fieldErrors.platform && <p className="text-xs text-red-500">{fieldErrors.platform}</p>}
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="link-label" className="text-sm font-medium">Display label</label>
            <input
              id="link-label"
              name="label"
              type="text"
              maxLength={MAX_LABEL_LENGTH}
              defaultValue={editingLink?.label ?? ""}
              aria-invalid={!!fieldErrors.label}
              placeholder="e.g. github"
              className={inputClass}
            />
            {fieldErrors.label && <p className="text-xs text-red-500">{fieldErrors.label}</p>}
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="link-url" className="text-sm font-medium">URL</label>
            <input
              id="link-url"
              name="url"
              type="text"
              inputMode="url"
              maxLength={MAX_URL_LENGTH}
              defaultValue={editingLink?.url ?? ""}
              aria-invalid={!!fieldErrors.url}
              placeholder="https://… or mailto:you@example.com"
              className={inputClass}
            />
            {fieldErrors.url && <p className="text-xs text-red-500">{fieldErrors.url}</p>}
          </div>

          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-[var(--foreground)] text-[var(--background)] rounded-md text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--foreground)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]"
            >
              {isSubmitting ? "Saving..." : "Save link"}
            </button>
            <button
              type="button"
              onClick={() => setEditing(null)}
              className="px-4 py-2 border border-[var(--border)] rounded-md text-sm font-medium hover:bg-[var(--muted)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--foreground)]"
            >
              Cancel
            </button>
          </div>
        </Form>
      )}

      <div className="flex flex-col border border-[var(--border)] rounded-lg overflow-hidden bg-[var(--background)]">
        {links.length === 0 ? (
          <div className="p-8 text-center text-[var(--muted-foreground)]">
            No links yet. Add one, or run the seed to import your existing links.
          </div>
        ) : (
          links.map((link, index) => {
            const platform = getPlatform(link.platform);
            const PlatformIcon = platform.icon;
            return (
              <div
                key={link.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border-b border-[var(--border)] last:border-0 hover:bg-[var(--muted)]/20 transition-colors gap-4"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className="text-[var(--muted-foreground)] font-medium text-sm w-6 shrink-0">
                    {String(index + 1).padStart(2, "0")}
                  </div>
                  <PlatformIcon size={18} className="text-[var(--muted-foreground)] shrink-0" aria-hidden="true" />
                  <div className="flex flex-col min-w-0">
                    <span className="font-medium truncate">
                      {link.label} <span className="text-[var(--muted-foreground)] font-normal text-sm">· {platform.name}</span>
                    </span>
                    <span className="text-xs text-[var(--muted-foreground)] mt-0.5 truncate">
                      {link.isVisible ? "Visible" : "Hidden"} · {link.url}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 sm:gap-1 self-start sm:self-auto shrink-0">
                  <Form method="post" className="flex items-center">
                    <input type="hidden" name="id" value={link.id} />
                    <button type="submit" name="intent" value="move_up" disabled={index === 0 || isBusy} className={iconButtonClass} title="Move up" aria-label={`Move ${link.label} up`}>
                      <ArrowUp size={16} />
                    </button>
                    <button type="submit" name="intent" value="move_down" disabled={index === links.length - 1 || isBusy} className={iconButtonClass} title="Move down" aria-label={`Move ${link.label} down`}>
                      <ArrowDown size={16} />
                    </button>
                  </Form>

                  <div className="w-px h-6 bg-[var(--border)] mx-1" />

                  <Form method="post" className="flex items-center">
                    <input type="hidden" name="id" value={link.id} />
                    <input type="hidden" name="intent" value="toggle_visibility" />
                    <input type="hidden" name="visible" value={String(!link.isVisible)} />
                    <button
                      type="submit"
                      disabled={isBusy}
                      className={iconButtonClass}
                      title={link.isVisible ? "Hide from public page" : "Show on public page"}
                      aria-label={link.isVisible ? `Hide ${link.label}` : `Show ${link.label}`}
                    >
                      {link.isVisible ? <Eye size={16} /> : <EyeOff size={16} />}
                    </button>
                  </Form>

                  <button type="button" onClick={() => openForm(link)} className={iconButtonClass} title="Edit" aria-label={`Edit ${link.label}`}>
                    <Edit2 size={16} />
                  </button>

                  <Form
                    method="post"
                    className="flex items-center"
                    onSubmit={(e) => {
                      if (!confirm(`Permanently delete the "${link.label}" link?`)) e.preventDefault();
                    }}
                  >
                    <input type="hidden" name="id" value={link.id} />
                    <button
                      type="submit"
                      name="intent"
                      value="delete"
                      disabled={isBusy}
                      className="p-2 text-[var(--muted-foreground)] hover:text-red-500 hover:bg-[var(--muted)] rounded disabled:opacity-30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
                      title="Delete"
                      aria-label={`Delete ${link.label}`}
                    >
                      <Trash2 size={16} />
                    </button>
                  </Form>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
