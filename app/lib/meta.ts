import type { MetaDescriptor } from "react-router";

export const CANONICAL_ORIGIN = "https://heyyzi0n.de5.net";

export interface MetaOptions {
  path?: string;
  type?: "website" | "profile" | "article";
  image?: string;
  noindex?: boolean;
  schema?: Record<string, unknown> | Array<Record<string, unknown>>;
}

/**
 * Generates unified, standards-compliant SEO and social sharing meta descriptors
 * for React Router v7. Consistently uses https://heyyzi0n.de5.net as canonical origin.
 */
export function generateMeta(
  title: string,
  description: string,
  optionsOrUrl: string | MetaOptions = {}
): MetaDescriptor[] {
  const options: MetaOptions =
    typeof optionsOrUrl === "string"
      ? {
          path: optionsOrUrl.startsWith("http")
            ? new URL(optionsOrUrl).pathname
            : optionsOrUrl,
        }
      : optionsOrUrl;

  const rawPath = options.path ?? "";
  const normalizedPath =
    rawPath === "" || rawPath === "/"
      ? ""
      : rawPath.startsWith("/")
      ? rawPath
      : `/${rawPath}`;

  const canonicalUrl = `${CANONICAL_ORIGIN}${normalizedPath || "/"}`;

  const meta: MetaDescriptor[] = [
    { title },
    { name: "description", content: description },
    { tagName: "link", rel: "canonical", href: canonicalUrl },
    { property: "og:site_name", content: "Zion-faith Pelumi Omosanya" },
    { property: "og:locale", content: "en_US" },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:url", content: canonicalUrl },
    { property: "og:type", content: options.type ?? "website" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
  ];

  if (options.image) {
    const imageUrl = options.image.startsWith("http")
      ? options.image
      : `${CANONICAL_ORIGIN}${
          options.image.startsWith("/") ? options.image : `/${options.image}`
        }`;
    meta.push(
      { property: "og:image", content: imageUrl },
      { name: "twitter:image", content: imageUrl }
    );
  }

  if (options.noindex) {
    meta.push({ name: "robots", content: "noindex,nofollow" });
  }

  // Google Search Console meta tag verification support via environment variable
  const gscVerification =
    typeof process !== "undefined" && process.env?.GOOGLE_SITE_VERIFICATION;
  if (gscVerification && !options.noindex && normalizedPath === "") {
    meta.push({
      name: "google-site-verification",
      content: gscVerification,
    });
  }

  if (options.schema) {
    meta.push({
      "script:ld+json": options.schema as any,
    });
  }

  return meta;
}
