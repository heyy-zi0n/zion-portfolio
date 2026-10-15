import { createSupabaseServerClient } from "../lib/supabase.server";
import { PROJECTS as fallbackProjects, EXPERIENCES as fallbackExperiences, SOCIAL_LINKS as fallbackSocialLinks, HAS_CV } from "../data/static-fallback";
import type { Project, Experience, SiteSettings } from "../types/database";
import { isSocialPlatform, type SocialLink } from "../lib/social-links";

export async function getPublishedProjects(request: Request): Promise<Project[]> {
  const { supabase } = createSupabaseServerClient(request);
  
  if (!supabase) {
    // Supabase not configured, use static fallback
    return fallbackProjects.map((p, index) => ({
      id: p.slug, // Use slug as ID for fallback
      slug: p.slug,
      title: p.title,
      fullTitle: p.title,
      description: p.description,
      problem: p.caseStudy?.problem || null,
      outcome: p.caseStudy?.outcome || null,
      technologies: p.techUsed || [],
      decisions: p.caseStudy?.decisions || [],
      systemFlow: [],
      imagePath: p.img || null,
      repositoryUrl: p.repo || null,
      liveUrl: p.url || null,
      status: "published",
      sortOrder: index + 1,
      publishedAt: new Date().toISOString(),
    })) as Project[];
  }

  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("status", "published")
    .order("sort_order", { ascending: true });

  if (error || !data) {
    console.error("Error fetching projects from Supabase:", error);
    return []; // Return empty or throw, depending on error handling strategy
  }

  // Map database snake_case to camelCase
  return data.map(mapDbProjectToDomain);
}

export async function getProjectBySlug(request: Request, slug: string): Promise<Project | null> {
  const { supabase } = createSupabaseServerClient(request);
  
  if (!supabase) {
    const project = fallbackProjects.find(p => p.slug === slug);
    if (!project) return null;
    return {
      id: project.slug,
      slug: project.slug,
      title: project.title,
      fullTitle: project.title,
      description: project.description,
      problem: project.caseStudy?.problem || null,
      outcome: project.caseStudy?.outcome || null,
      technologies: project.techUsed || [],
      decisions: project.caseStudy?.decisions || [],
      systemFlow: [],
      imagePath: project.img || null,
      repositoryUrl: project.repo || null,
      liveUrl: project.url || null,
      status: "published",
      sortOrder: 1,
      publishedAt: new Date().toISOString(),
    } as Project;
  }

  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (error || !data) return null;

  return mapDbProjectToDomain(data);
}

export async function getPublishedExperiences(request: Request): Promise<Experience[]> {
  const { supabase } = createSupabaseServerClient(request);
  
  if (!supabase) {
    // Map static fallback structure to new DB schema
    return fallbackExperiences.map((e, index) => ({
      id: e.id.toString(),
      organization: e.company,
      organizationUrl: e.url || null,
      role: e.roles[0]?.title || "",
      startDate: null,
      endDate: null,
      isCurrent: false,
      highlights: e.roles[0]?.highlights || [],
      status: "published",
      sortOrder: index + 1
    }));
  }

  const { data, error } = await supabase
    .from("experiences")
    .select("*")
    .eq("status", "published")
    .order("sort_order", { ascending: true });

  if (error || !data) {
    console.error("Error fetching experiences from Supabase:", error);
    return [];
  }

  return data.map(mapDbExperienceToDomain);
}

export async function getSiteSettings(request: Request): Promise<SiteSettings> {
  const { supabase } = createSupabaseServerClient(request);
  
  if (!supabase) {
    return {
      id: "fallback",
      cvPath: HAS_CV ? "/zion-faith-omosanya-cv.pdf" : null
    };
  }

  const { data, error } = await supabase
    .from("site_settings")
    .select("*")
    .single();

  if (error || !data) {
    return { id: "error", cvPath: null };
  }

  return {
    id: data.id,
    cvPath: data.cv_path,
    updatedAt: data.updated_at
  };
}

function getFallbackSocialLinks(): SocialLink[] {
  return fallbackSocialLinks.map((link, index) => ({
    id: String(link.id),
    platform: isSocialPlatform(link.name) ? link.name : "other",
    label: link.name,
    url: link.url,
    sortOrder: index + 1,
    isVisible: true,
  }));
}

/**
 * Visible links in admin-configured order. The static fallback is used only when Supabase is
 * unconfigured or the request fails; a successful empty result is returned as an empty list.
 */
export async function getVisibleSocialLinks(request: Request): Promise<SocialLink[]> {
  const { supabase } = createSupabaseServerClient(request);

  if (!supabase) return getFallbackSocialLinks();

  const { data, error } = await supabase
    .from("social_links")
    .select("*")
    .eq("is_visible", true)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (error || !data) {
    console.error("Error fetching social links from Supabase:", error);
    return getFallbackSocialLinks();
  }

  return data.map(mapDbSocialLinkToDomain);
}

// Helpers
export function mapDbSocialLinkToDomain(row: any): SocialLink {
  return {
    id: row.id,
    platform: isSocialPlatform(row.platform) ? row.platform : "other",
    label: row.label,
    url: row.url,
    sortOrder: row.sort_order,
    isVisible: row.is_visible,
  };
}
function mapDbProjectToDomain(row: any): Project {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    fullTitle: row.full_title,
    description: row.description,
    problem: row.problem,
    outcome: row.outcome,
    technologies: row.technologies,
    decisions: row.decisions,
    systemFlow: row.system_flow,
    imagePath: row.image_path,
    repositoryUrl: row.repository_url,
    liveUrl: row.live_url,
    status: row.status,
    sortOrder: row.sort_order,
    publishedAt: row.published_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

function mapDbExperienceToDomain(row: any): Experience {
  return {
    id: row.id,
    organization: row.organization,
    organizationUrl: row.organization_url,
    role: row.role,
    startDate: row.start_date,
    endDate: row.end_date,
    isCurrent: row.is_current,
    highlights: row.highlights,
    status: row.status,
    sortOrder: row.sort_order,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}
