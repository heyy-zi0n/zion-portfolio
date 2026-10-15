import type { IconType } from "react-icons";
import { FaGithub, FaLinkedinIn, FaInstagram, FaTiktok, FaXTwitter, FaYoutube, FaFacebook, FaWhatsapp } from "react-icons/fa6";
import { SiFiverr } from "react-icons/si";
import { Mail, Globe, Link as LinkIcon } from "lucide-react";

/** Fixed allow-list of platforms. Stored as a plain identifier; the icon is resolved here only. */
export const SOCIAL_PLATFORMS = [
  { id: "github", name: "GitHub", icon: FaGithub },
  { id: "linkedin", name: "LinkedIn", icon: FaLinkedinIn },
  { id: "instagram", name: "Instagram", icon: FaInstagram },
  { id: "tiktok", name: "TikTok", icon: FaTiktok },
  { id: "x", name: "X", icon: FaXTwitter },
  { id: "youtube", name: "YouTube", icon: FaYoutube },
  { id: "facebook", name: "Facebook", icon: FaFacebook },
  { id: "whatsapp", name: "WhatsApp", icon: FaWhatsapp },
  { id: "fiverr", name: "Fiverr", icon: SiFiverr },
  { id: "email", name: "Email", icon: Mail },
  { id: "website", name: "Website", icon: Globe },
  { id: "other", name: "Other", icon: LinkIcon },
] as const satisfies readonly { id: string; name: string; icon: IconType | typeof Mail }[];

export type SocialPlatform = (typeof SOCIAL_PLATFORMS)[number]["id"];

export type SocialLink = {
  id: string;
  platform: SocialPlatform;
  label: string;
  url: string;
  sortOrder: number;
  isVisible: boolean;
};

export function isSocialPlatform(value: unknown): value is SocialPlatform {
  return SOCIAL_PLATFORMS.some((p) => p.id === value);
}

export function getPlatform(id: string) {
  return SOCIAL_PLATFORMS.find((p) => p.id === id) ?? SOCIAL_PLATFORMS[SOCIAL_PLATFORMS.length - 1];
}

export const MAX_LABEL_LENGTH = 80;
export const MAX_URL_LENGTH = 2048;

export type SocialLinkInput = { platform: string; label: string; url: string };
export type SocialLinkErrors = Partial<Record<keyof SocialLinkInput, string>>;

/**
 * Validates and normalizes form input. Shared by the client form and the server action
 * (the server result is the authoritative one). Only https: and mailto: are accepted.
 */
export function validateSocialLink(input: SocialLinkInput):
  | { ok: true; value: { platform: SocialPlatform; label: string; url: string } }
  | { ok: false; errors: SocialLinkErrors } {
  const errors: SocialLinkErrors = {};
  const label = input.label.trim();
  let url = input.url.trim();

  if (!isSocialPlatform(input.platform)) errors.platform = "Choose a platform.";

  if (!label) errors.label = "Label is required.";
  else if (label.length > MAX_LABEL_LENGTH) errors.label = `Label must be ${MAX_LABEL_LENGTH} characters or fewer.`;

  if (!url) {
    errors.url = "URL is required.";
  } else if (url.length > MAX_URL_LENGTH) {
    errors.url = "URL is too long.";
  } else {
    // Convenience: a bare address for the Email platform becomes a mailto: link.
    if (input.platform === "email" && !/^[a-z][a-z0-9+.-]*:/i.test(url)) url = `mailto:${url}`;

    let parsed: URL | null = null;
    try {
      parsed = new URL(url);
    } catch {
      errors.url = "Enter a valid URL (e.g. https://example.com).";
    }
    if (parsed) {
      if (parsed.protocol === "mailto:") {
        if (!parsed.pathname) errors.url = "Enter an email address after mailto:.";
      } else if (parsed.protocol !== "https:") {
        errors.url = "Only https: and mailto: links are allowed.";
      }
      if (!errors.url && input.platform === "email" && parsed.protocol !== "mailto:") {
        errors.url = "Email links must use a mailto: address.";
      }
      if (!errors.url && input.platform !== "email" && parsed.protocol === "mailto:" && input.platform !== "other") {
        errors.url = "mailto: links can only be used for the Email platform or Other.";
      }
    }
  }

  if (Object.keys(errors).length) return { ok: false, errors };
  return { ok: true, value: { platform: input.platform as SocialPlatform, label, url } };
}

/** Public-page helpers: derive the secondary text and link target from the stored URL. */
export function getLinkDetail(url: string): string {
  try {
    const parsed = new URL(url);
    if (parsed.protocol === "mailto:") return decodeURIComponent(parsed.pathname);
    const path = parsed.pathname === "/" ? "" : parsed.pathname.replace(/\/$/, "");
    return `${parsed.hostname.replace(/^www\./, "")}${path}`;
  } catch {
    return "";
  }
}

export function isExternalUrl(url: string): boolean {
  return url.startsWith("https://");
}

/** Platforms that are genuine public profile pages (excludes email, WhatsApp chat links and "other"). */
const PROFILE_PLATFORMS: readonly SocialPlatform[] = ["github", "linkedin", "instagram", "tiktok", "x", "youtube", "facebook", "fiverr", "website"];

/** Profile URLs for schema.org sameAs: https only, tracking query strings and fragments removed, deduplicated. */
export function getProfileUrls(links: readonly SocialLink[]): string[] {
  const urls = new Set<string>();
  for (const link of links) {
    if (!PROFILE_PLATFORMS.includes(link.platform)) continue;
    try {
      const parsed = new URL(link.url);
      if (parsed.protocol !== "https:") continue;
      parsed.search = "";
      parsed.hash = "";
      urls.add(parsed.toString());
    } catch {
      // Ignore malformed URLs
    }
  }
  return [...urls];
}
